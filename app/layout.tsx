import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MotionLayer } from '@/components/layout/MotionLayer';
import { site } from '@/lib/site';
import { jsonLd, organizationNode } from '@/lib/schema';

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
  verification: { google: '-4wv0Oprcw44Vb4TvihqG88aNLnk_yDfHrz8gJsnwzE' },
};

/**
 * スマートフォンでも本文と操作要素の可読性を保つ。
 * PC版の情報順序と視覚表現は維持しつつ、CSSのモバイル用配置を有効にする。
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/*
          事業者の構造化データ（要件定義書 10.2）。全ページ共通。
          掲載する会社情報は 12.1 の発注者判断に従い、所在地・電話番号を含める。
        */}
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationNode())} />
      </head>
      <body>
        <a href="#main" className="sr-only-focusable">
          本文へスキップ
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MotionLayer />
      </body>
    </html>
  );
}
