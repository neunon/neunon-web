import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { site } from './site';
import { seoDefaults, homeDefaults } from './editorial-defaults';

export type PageSeoKey = keyof typeof seoDefaults;
type SeoCopy = { title: string; description: string };

function readEditorial(file: string): Record<string, unknown> {
  try {
    const data: unknown = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', file), 'utf8'));
    if (data && typeof data === 'object' && !Array.isArray(data)) return data as Record<string, unknown>;
  } catch {
    // 本文の生成は継続。audit:content がデプロイ前に不正・欠落をエラーにする。
  }
  return {};
}

const textOr = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

export function getPageSeo(key: PageSeoKey): SeoCopy {
  const value = readEditorial('site/seo.json')[key];
  const data = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return {
    title: textOr(data.title, seoDefaults[key].title),
    description: textOr(data.description, seoDefaults[key].description),
  };
}

export function getHomeCopy(): typeof homeDefaults {
  const data = readEditorial('pages/home.json');
  return Object.fromEntries(
    Object.entries(homeDefaults).map(([key, fallback]) => [key, textOr(data[key], fallback)]),
  ) as typeof homeDefaults;
}

/** URL・index設定は呼出元のコードで決める。CMSから入力させない。 */
export function createPageMetadata(copy: SeoCopy, pathname: string): Metadata {
  const title = /Neunon Consulting/i.test(copy.title)
    ? copy.title
    : `${copy.title}｜${site.name}`;
  const canonical = new URL(pathname === '/' ? '/' : pathname.replace(/\/$/, '') + '/', site.url).href;
  return {
    title: { absolute: title },
    description: copy.description,
    alternates: { canonical },
    openGraph: {
      type: 'website', locale: 'ja_JP', siteName: site.name,
      title, description: copy.description, url: canonical,
      images: [{ url: '/ogp.png', width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: 'summary_large_image', title, description: copy.description, images: ['/ogp.png'] },
  };
}

export function pageMetadata(key: PageSeoKey, pathname: string): Metadata {
  return createPageMetadata(getPageSeo(key), pathname);
}

/** カレンダー上も有効な ISO 日付だけを sitemap に使用する。 */
export function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value);
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}
