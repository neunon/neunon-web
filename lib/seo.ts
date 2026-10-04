import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { site } from './site';
import { seoDefaults, homeDefaults } from './editorial-defaults';
import { absoluteUrl } from './schema';

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

/**
 * 検索結果での表示幅。全角1・半角0.5で数える。
 * Google の日本語の検索結果では、タイトルはおおむね全角30字前後で省略される。
 */
export function displayWidth(text: string): number {
  let width = 0;
  for (const char of text) {
    // 半角英数・記号と半角カナは0.5、それ以外（全角）は1
    width += /[\x20-\x7e｡-ﾟ]/.test(char) ? 0.5 : 1;
  }
  return width;
}

/** タイトル全体の目安幅。これを超える場合は社名を短縮形にする */
export const TITLE_TARGET_WIDTH = 30;

/**
 * 「ページ名｜株式会社Neunon Consulting」を組み立てる。
 * 正式社名を付けると30字を超えるページ（事業詳細・お知らせなど）は
 * 「｜Neunon Consulting」に短縮し、ページ名側の検索語が切れないようにする。
 * CMS 入力側ですでに社名を含めている場合は何も付けない。
 */
export function pageTitle(title: string): string {
  if (/Neunon Consulting/i.test(title)) return title;
  const full = `${title}｜${site.name}`;
  return displayWidth(full) <= TITLE_TARGET_WIDTH ? full : `${title}｜${site.shortName}`;
}

type PageMetadataOptions = {
  /** 検索結果に出さないページ。既定は index, follow（layout の設定） */
  robots?: Metadata['robots'];
  /** 自己参照以外を canonical にする場合（旧URLの統合など） */
  canonicalPath?: string;
  /** お知らせ記事は article、それ以外は website */
  article?: { publishedTime: string; section?: string };
};

/** URL・index設定は呼出元のコードで決める。CMSから入力させない。 */
export function createPageMetadata(copy: SeoCopy, pathname: string, options: PageMetadataOptions = {}): Metadata {
  const title = pageTitle(copy.title);
  const canonical = absoluteUrl(options.canonicalPath ?? pathname);
  const images = [{ url: '/ogp.png', width: 1200, height: 630, alt: site.name }];
  const shared = { locale: 'ja_JP', siteName: site.name, title, description: copy.description, url: canonical, images };
  return {
    title: { absolute: title },
    description: copy.description,
    alternates: { canonical },
    openGraph: options.article
      ? { ...shared, type: 'article', publishedTime: options.article.publishedTime, section: options.article.section }
      : { ...shared, type: 'website' },
    twitter: { card: 'summary_large_image', title, description: copy.description, images: ['/ogp.png'] },
    ...(options.robots ? { robots: options.robots } : {}),
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
