import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageBreadcrumbs } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { getNews, getNewsItem } from '@/lib/content';
import { createPageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getNews().map((item) => ({ slug: item.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) return {};

  const metadata = createPageMetadata({ title: item.title, description: item.excerpt }, `/news/${item.slug}/`);
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, type: 'article', publishedTime: item.date },
  };
}

/** お知らせ詳細（要件定義書 4. のサイトマップ） */
export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) notFound();

  const others = getNews().filter((entry) => entry.slug !== item.slug).slice(0, 3);

  return (
    <div className="nc-news-detail-page">
      <PageBreadcrumbs crumbs={[{ label: 'お知らせ', href: '/news' }, { label: item.title }]} />
      <article className="wrap nc-news-detail">
        <header className="nc-news-detail-head">
          <div className="nc-news-detail-meta"><time dateTime={item.date}>{item.date.replace(/-/g, '.')}</time><span>{item.category}</span></div>
          <h1>{item.title}</h1>
          <p>{item.excerpt}</p>
        </header>
        <div className="nc-news-detail-layout">
          <aside className="nc-news-detail-aside"><span>お知らせ</span><Link href="/news/">一覧に戻る <span aria-hidden="true">←</span></Link></aside>
          <div className="nc-news-detail-body">{item.body.map((paragraph, index) => <p key={`${index}-${paragraph}`}>{paragraph}</p>)}</div>
        </div>
      </article>
      {others.length > 0 ? <section className="wrap nc-news-detail-related" aria-labelledby="other-news">
        <div className="nc-news-detail-related-head"><h2 id="other-news">ほかのお知らせ</h2><Link href="/news/">一覧を見る <span aria-hidden="true">→</span></Link></div>
        <ul>{others.map((entry) => <li key={entry.slug}><Link href={`/news/${entry.slug}/`}><time dateTime={entry.date}>{entry.date.replace(/-/g, '.')}</time><span>{entry.category}</span><strong>{entry.title}</strong><i aria-hidden="true">→</i></Link></li>)}</ul>
      </section> : null}
      <ContactCta />
    </div>
  );
}
