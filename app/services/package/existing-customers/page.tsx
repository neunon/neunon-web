import type { Metadata } from 'next';
import { ExistingCustomersLp } from '@/components/existing-customers-lp/ExistingCustomersLp';
import { faq, plans, seo } from '@/components/existing-customers-lp/data';
import { createPageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

/** 正式公開URL。metadata・構造化データ・sitemap で統一する。 */
const PATH = '/services/package/existing-customers/';
const PAGE_URL = new URL(PATH, site.url).href;

export const metadata: Metadata = createPageMetadata(seo, PATH);

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: '既存顧客企業クローズアップ',
    serviceType: '既存顧客の企業分析・調査代行',
    description: seo.description,
    url: PAGE_URL,
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
      { '@type': 'ListItem', position: 3, name: '既存顧客企業クローズアップ', item: PAGE_URL },
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
