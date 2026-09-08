import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { getNews } from '@/lib/content';

export const metadata: Metadata = {
  title: 'お知らせ',
  description: '株式会社Neunon Consulting からのお知らせ。会社・サービス・採用に関する更新情報。',
  alternates: { canonical: '/news' },
};

/** お知らせ一覧（要件定義書 4. のサイトマップ / 7. の追加提案項目） */
export default function NewsPage() {
  const news = getNews();
  const hasPlaceholder = news.some((item) => item.placeholder);

  return (
    <>
      <PageHero
        title="お知らせ"
        crumbs={[{ label: 'お知らせ' }]}
      />

      <div className="section">
        <div className="wrap">
          <ul className="nc-news">
            {news.map((item, index) => (
              <li key={item.slug}>
                <Link href={`/news/${item.slug}`}>
                  <time dateTime={item.date}>{item.date.replace(/-/g, '.')}</time>
                  <span className="nc-news-cat">{item.category}</span>
                  <span className="nc-news-title">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>

          {hasPlaceholder && process.env.NODE_ENV !== 'production' ? (
            <p className="nc-news-warn">
              開発時のみ表示：お知らせはダミー記事です（要件定義書 14. 未解決事項）。
              発注者から原稿を受領後、content/news/ の JSON を差し替えてください。
            </p>
          ) : null}
        </div>
      </div>

      <ContactCta secondary={{ label: '会社概要を見る', href: '/about' }} />
    </>
  );
}
