import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}｜${site.keyMessage}`,
    template: `%s｜${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: site.name,
    title: `${site.name}｜${site.keyMessage}`,
    description: site.description,
    url: site.url,
    images: [{ url: '/ogp.png', width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name}｜${site.keyMessage}`,
    description: site.description,
    images: ['/ogp.png'],
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

/**
 * 構造化データ（要件定義書 10.2）。
 * 掲載する会社情報は 12.1 の発注者判断に従い、所在地・電話番号を含める。
 */
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  alternateName: site.nameEn,
  url: site.url,
  logo: `${site.url}/brand-logo-transparent.png`,
  foundingDate: '2026-01-27',
  description: site.description,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'JP',
    addressRegion: '東京都',
    streetAddress: site.address.head,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: `+81-${site.tel.slice(1).replace(/-/g, '-')}`,
    contactType: 'sales',
    areaServed: 'JP',
    availableLanguage: ['Japanese'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          // 静的な自社情報のみを埋め込む
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <a href="#main" className="sr-only-focusable">
          本文へスキップ
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
