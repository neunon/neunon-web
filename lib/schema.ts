import type { NewsItem, Service } from './content';
import { site } from './site';

/**
 * 構造化データ（要件定義書 10.2）のビルダーをここに集約する。
 *
 * 種類ごとに出す場所が違うので、定義が散らばると
 * 「どのページに何が出ているか」が追えなくなる。組み立てはこのファイル、
 * 埋め込みは各ページ、という分担にしている。
 *
 * 出力先:
 *   Organization / WebSite … 全ページ（app/layout.tsx）
 *   BreadcrumbList         … PageHero を使うページ
 *   Service                … /services/[id]
 *   FAQPage                … FAQ を持つページ（/services/[id], /recruit/flow）
 *   NewsArticle            … /news/[slug]
 */

const abs = (path: string) => `${site.url}${path}`;

/** 事業者そのもの。sameAs で参照できるよう @id を振ってある */
export const organizationId = `${site.url}/#organization`;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: site.name,
    alternateName: site.nameEn,
    url: site.url,
    logo: abs('/brand-logo-transparent.png'),
    image: abs('/ogp.png'),
    foundingDate: '2026-01-27',
    description: site.description,
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 5 },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JP',
      addressRegion: '東京都',
      streetAddress: site.address.head,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+81-${site.tel.slice(1)}`,
      contactType: 'sales',
      areaServed: 'JP',
      availableLanguage: ['Japanese'],
    },
  };
}

/** サイト自体。検索エンジンがサイト名を正しく扱うための宣言 */
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: 'ja',
    publisher: { '@id': organizationId },
  };
}

export type Crumb = { label: string; href?: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  const items = [{ label: 'ホーム', href: '/' }, ...crumbs];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      // 最後の項目は現在地なので item を付けない
      ...(crumb.href && index < items.length - 1 ? { item: abs(crumb.href) } : {}),
    })),
  };
}

/**
 * 事業。
 *
 * 参考価格は **意図的に構造化データへ含めていない**。
 * 要件定義書 6.3.1 が「確定価格と誤解されないようにする」ことを求めており、
 * Offer の price として出すと確定額として扱われうるため。
 * メニュー名だけを hasOfferCatalog で示し、金額は本文の表に留める。
 */
export function serviceSchema(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${site.url}/services/${service.id}/#service`,
    name: service.title,
    serviceType: service.title,
    description: service.summary,
    url: abs(`/services/${service.id}`),
    provider: { '@id': organizationId },
    areaServed: { '@type': 'Country', name: 'JP' },
    audience: { '@type': 'BusinessAudience', audienceType: '法人' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.title}のメニュー`,
      itemListElement: service.menu.map((item) => ({
        '@type': 'OfferCatalog',
        name: item.name,
        ...(item.body ? { description: item.body } : {}),
      })),
    },
  };
}

export type FaqEntry = { q: string; a: string };

export function faqSchema(entries: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.q,
      acceptedAnswer: { '@type': 'Answer', text: entry.a },
    })),
  };
}

export function newsArticleSchema(item: NewsItem) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.excerpt,
    articleBody: item.body.join('\n\n'),
    datePublished: item.date,
    dateModified: item.date,
    inLanguage: 'ja',
    url: abs(`/news/${item.slug}`),
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(`/news/${item.slug}`) },
    image: abs('/ogp.png'),
    author: { '@id': organizationId },
    publisher: { '@id': organizationId },
  };
}

/** 複数のスキーマを1つの <script> にまとめて出すためのヘルパー */
export function jsonLd(...schemas: object[]) {
  return { __html: JSON.stringify(schemas.length === 1 ? schemas[0] : schemas) };
}
