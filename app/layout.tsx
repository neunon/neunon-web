import type { Metadata } from 'next';
import { Noto_Serif_JP } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/layout/ScrollReveal';
import { site } from '@/lib/site';

/**
 * ロゴのセリフ体（要件定義書 9.1「細めのセリフ体」）。
 *
 * Google Fonts を <link> で読むと、サードパーティへのリクエストが
 * レンダリングをブロックする。next/font はビルド時にフォントを取得して
 * 自己ホストするため、その往復がなくなる。
 * 閲覧者のブラウザから Google へリクエストが飛ばなくなる利点もある。
 *
 * 用途はロゴの "Neunon / CONSULTING" だけなので latin サブセットで足りる。
 * 本文は --font-sans のシステムフォントで賄う（デザイン案 v2 の指定）。
 */
const notoSerifJp = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-serif-loaded',
});

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
  logo: `${site.url}/neunon-logo.png`,
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
    <html lang="ja" className={notoSerifJp.variable}>
      <head>
        <script
          type="application/ld+json"
          // 静的な自社情報のみを埋め込む
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        {/*
          スクロール演出は ScrollReveal（JS）が .in を付けることで発火する。
          JavaScript が動かない環境では .rise 等が opacity: 0 のままになり
          本文が読めなくなるため、その場合だけ演出前の指定を打ち消す。
        */}
        <noscript>
          <style>{`.rise,.nc-cell{opacity:1!important;transform:none!important}
.nc-layer::before,.nc-step::before{transform:scaleY(1)!important}`}</style>
        </noscript>
        <a href="#main" className="sr-only-focusable">
          本文へスキップ
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  );
}
