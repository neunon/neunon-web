import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { site } from '@/lib/site';
import { jsonLd, organizationSchema, webSiteSchema } from '@/lib/schema';

/* 日本語は Noto Sans JP。英数字は CSS 側で Neue Haas Grotesk を優先する。 */
const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-jp-loaded',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}｜${site.keyMessage}`,
    /*
     * 日本語の検索結果は全角30字前後で切られる。
     * 「｜株式会社Neunon Consulting」は22字あり、
     * ページ名に使える幅がほとんど残らなかったため短縮した。
     * これでも18字使うので、タイトルが長いページ（実績・お知らせ）は
     * title.absolute で接尾辞そのものを外している。
     */
    template: `%s｜${site.shortName}`,
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={notoSansJp.variable}>
      <head>
        {/* 全ページ共通。事業者とサイト自体の宣言 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(organizationSchema(), webSiteSchema())}
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
