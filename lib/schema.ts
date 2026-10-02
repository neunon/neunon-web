import { site } from './site';
import type { FaqItem, NewsItem, Service } from './content';

/**
 * 構造化データ（JSON-LD）の組み立て（要件定義書 10.2）。
 *
 * 各ノードに @id を付け、ページをまたいで同じ実体として参照させる。
 *   - 事業者（Organization）は全ページ共通の実体
 *   - 事業詳細の Service、お知らせの NewsArticle はそれを参照する
 * トップの WebSite（app/page.tsx）とパンくず（components/shared/PageHero.tsx）は
 * 既存の実装のまま。
 * 同じ @id を持つノードは、検索エンジン側で1つの実体として統合される。
 *
 * 画面に表示していない情報は入れない（Google の構造化データ ガイドライン）。
 * 価格は要件定義書 6.3.1 の方針により、構造化データには含めない。
 */

type Node = Record<string, unknown>;

/** サイト内パスを canonical と同じ末尾スラッシュ付きの絶対 URL にする */
export function absoluteUrl(pathname: string): string {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/?$/, '/');
  return new URL(normalized, site.url).href;
}

/** 画像などファイルの絶対 URL（末尾スラッシュを付けない） */
export function assetUrl(pathname: string): string {
  return new URL(pathname, site.url).href;
}

const home = absoluteUrl('/');
export const ORGANIZATION_ID = `${home}#organization`;

/**
 * 電話番号を国際表記にする（070-4360-2752 → +81-70-4360-2752）。
 * 先頭の 0 を国番号に置き換えるだけで、区切りはそのまま残す。
 */
function internationalTel(tel: string): string {
  return `+81-${tel.replace(/^0/, '')}`;
}

/** 事業者。全ページで出力する */
export function organizationNode(): Node {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: site.name,
    legalName: site.name,
    alternateName: [site.shortName, site.nameEn],
    url: home,
    // Google のロゴ要件（112px 四方以上・クロール可能）を満たす最適化済みのロゴ
    logo: {
      '@type': 'ImageObject',
      '@id': `${home}#logo`,
      url: assetUrl('/neunon-logo.png'),
      contentUrl: assetUrl('/neunon-logo.png'),
      width: 800,
      height: 385,
      caption: site.name,
    },
    image: { '@id': `${home}#logo` },
    description: site.description,
    slogan: site.keyMessage,
    foundingDate: site.foundingDate,
    numberOfEmployees: { '@type': 'QuantitativeValue', value: site.employeeCount },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JP',
      addressRegion: site.address.region,
      addressLocality: site.address.locality,
      streetAddress: site.address.street,
    },
    telephone: internationalTel(site.tel),
    email: site.email,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: internationalTel(site.tel),
      email: site.email,
      url: absoluteUrl('/contact/'),
      areaServed: 'JP',
      availableLanguage: 'Japanese',
    },
    knowsAbout: site.expertise,
  };
}

/**
 * 事業詳細ページに表示している「よくある質問」。
 * パッケージ型支援は価格の質問を参考価格ブロックで扱うため、画面の一覧から外している
 * （components/services/PackageServiceDetail.tsx）。FAQPage も画面と同じ質問だけを出す。
 * 画面と食い違うと scripts/audit.mjs が公開を止める。
 */
export function displayedFaq(service: Service): FaqItem[] {
  return service.id === 'package' ? service.faq.filter((item) => !item.q.includes('価格')) : service.faq;
}

/** 事業詳細ページの提供サービス。提供者は自社の Organization を参照する */
export function serviceNode(service: Service, faq: FaqItem[]): Node {
  const url = absoluteUrl(`/services/${service.id}/`);
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.title,
    alternateName: service.seoTitle?.trim() || undefined,
    serviceType: service.menu.map((item) => item.name),
    description: service.seoDescription?.trim() || service.summary,
    url,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: { '@type': 'Country', name: 'JP' },
    audience: { '@type': 'BusinessAudience', audienceType: '法人' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.title}のメニュー`,
      itemListElement: service.menu.map((item) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item.name,
          ...(item.body ? { description: item.body } : {}),
        },
      })),
    },
    ...(faq.length > 0 ? { subjectOf: { '@id': `${url}#faq` } } : {}),
  };
}

/**
 * よくある質問。画面に表示している質問だけを渡すこと。
 * Google は FAQ のリッチリザルトを政府・医療系サイトに限定したため
 * 検索結果の見た目は変わらないが、AI 検索や他の検索エンジンは
 * 質問と回答の対応を読み取りに使う。
 */
export function faqNode(faq: FaqItem[], pathname: string): Node {
  const url = absoluteUrl(pathname);
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    inLanguage: 'ja',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/** お知らせ記事 */
export function newsArticleNode(item: NewsItem): Node {
  const url = absoluteUrl(`/news/${item.slug}/`);
  return {
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    headline: item.title,
    description: item.excerpt,
    articleSection: item.category,
    datePublished: `${item.date}T00:00:00+09:00`,
    dateModified: `${item.date}T00:00:00+09:00`,
    url,
    mainEntityOfPage: url,
    inLanguage: 'ja',
    image: [assetUrl('/ogp.png')],
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
  };
}

/**
 * <script type="application/ld+json"> に渡す文字列。
 * 複数のノードを @graph にまとめる。
 * 本文由来の文字列が </script> を閉じないよう < をエスケープする（Next.js の JSON-LD ガイド）。
 */
export function jsonLd(...nodes: Node[]): { __html: string } {
  // 値が undefined の項目は JSON.stringify が省く
  return {
    __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c'),
  };
}
