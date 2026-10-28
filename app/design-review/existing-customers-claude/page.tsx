import type { Metadata } from 'next';
import { ExistingCustomersLp } from '@/components/existing-customers-lp/ExistingCustomersLp';
import { faq, plans, seo } from '@/components/existing-customers-lp/data';
import { createPageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

/**
 * 既存顧客企業クローズアップ LP の確認用ルート（Claude Code 制作案）。
 * 承認前のため検索エンジンに載せない（noindex, nofollow／sitemap にも入れない）。
 * 承認後は /services/package/existing-customers/ に同じ部品を置き、ここは削除する。
 */
const PATH = '/design-review/existing-customers-claude/';
/** 公開時の正式URL。構造化データはこちらを前提に書いておく */
const FINAL_URL = new URL('/services/package/existing-customers/', site.url).href;

const base = createPageMetadata({ title: `【確認用】${seo.title}`, description: `【確認用】${seo.description}` }, PATH);

export const metadata: Metadata = {
  ...base,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: '既存顧客企業クローズアップ',
    serviceType: '既存顧客の企業分析・調査代行',
    description: seo.description,
    url: FINAL_URL,
    image: new URL('/images/existing-customers/matching-1440.webp', site.url).href,
    areaServed: 'JP',
    provider: { '@type': 'Organization', name: site.name, url: site.url },
    offers: plans.map((p) => ({
      '@type': 'Offer',
      name: `${p.name}（${p.volume}）`,
      price: p.price.replace(',', ''),
      priceCurrency: 'JPY',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: p.price.replace(',', ''),
        priceCurrency: 'JPY',
        unitText: '1社',
        valueAddedTaxIncluded: false,
      },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: new URL('/', site.url).href },
      { '@type': 'ListItem', position: 2, name: 'パッケージ型支援', item: new URL('/services/package/', site.url).href },
      { '@type': 'ListItem', position: 3, name: '既存顧客企業クローズアップ', item: FINAL_URL },
    ],
  },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ExistingCustomersLp />
    </>
  );
}
