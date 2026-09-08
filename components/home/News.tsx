import Link from 'next/link';
import { getLatestNews } from '@/lib/content';

/**
 * トップページ セクション8: お知らせ（要件定義書 6.1）最新3件。
 *
 * デザイン案 v2 にはこのセクションが存在しないため新規作成。
 * 【要確認】要件定義書 14. のとおり初期記事は未確定。
 * content/news/ に置いてあるのは placeholder: true のダミー3件で、
 * 発注者から原稿を受け取り次第 JSON を差し替える。
 */
export function News() {
  const news = getLatestNews(3);
  if (news.length === 0) return null;

  const hasPlaceholder = news.some((item) => item.placeholder);

  return (
    <section className="section section-alt" aria-labelledby="news-heading">
      <div className="wrap">
        <div className="nc-news-head shead">
          <div>
            <h2 id="news-heading">お知らせ</h2>
          </div>
          <Link href="/news" className="nc-more">
            <i aria-hidden="true" />
            一覧を見る
          </Link>
        </div>

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
    </section>
  );
}
