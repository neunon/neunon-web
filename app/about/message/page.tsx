import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';

export const metadata: Metadata = {
  title: '企業情報へのご案内',
  description: '会社に関する情報は企業情報ページをご覧ください。',
  alternates: { canonical: '/about/message/' },
  robots: { index: false, follow: true },
};

// 静的配信で旧URLへの外部リンクを失わせず、内容は企業情報に一本化する。
export default function FormerMessagePage() {
  return <>
    <PageHero title="企業情報へのご案内" crumbs={[{ label: '企業情報', href: '/about/' }, { label: 'ご案内' }]} />
    <div className="section"><div className="wrap nc-doc-narrow"><p>会社に関する情報は、<Link href="/about/" className="nc-inline-link">企業情報ページ</Link>をご覧ください。</p></div></div>
  </>;
}
