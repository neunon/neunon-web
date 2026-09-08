import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { getNews, getNewsItem } from '@/lib/content';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getNews().map((item) => ({ slug: item.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) return {};

  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: `/news/${item.slug}` },
    openGraph: { type: 'article', publishedTime: item.date },
  };
}

/** お知らせ詳細（要件定義書 4. のサイトマップ） */
export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) notFound();

  const others = getNews().filter((entry) => entry.slug !== item.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={`${item.date.replace(/-/g, '.')}　${item.category}`}
        title={item.title}
        crumbs={[{ label: 'お知らせ', href: '/news' }, { label: item.category }]}
      />

      <div className="section">
        <div className="wrap nc-doc-narrow">
          <article>
            {item.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>

          {others.length > 0 ? (
            <section aria-labelledby="other-news">
              <h2 id="other-news" className="nc-sub-head">
                ほかのお知らせ
              </h2>
              <ul className="nc-news">
                {others.map((entry) => (
                  <li key={entry.slug}>
                    <Link href={`/news/${entry.slug}`}>
                      <time dateTime={entry.date}>{entry.date.replace(/-/g, '.')}</time>
                      <span className="nc-news-cat">{entry.category}</span>
                      <span className="nc-news-title">{entry.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="nc-acts nc-form-acts">
            <Link href="/news" className="btn btn-ghost">
              お知らせ一覧へ
            </Link>
          </div>
        </div>
      </div>

      <ContactCta />
    </>
  );
}
