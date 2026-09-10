import type { MetadataRoute } from 'next';
import { getNews, getServices, getWorks } from '@/lib/content';
import { site } from '@/lib/site';

/**
 * sitemap.xml の自動生成（要件定義書 10.2）。
 * 事業詳細・実績詳細は content/ から生成するので、追加すれば自動で載る。
 * ページを追加したら staticRoutes にも追記すること。
 *
 * 意図的に含めないもの:
 * - /about/message   原稿が未確定で noindex にしている
 * - /talent/[id]     個人単位のページ。noindex にしている（要件定義書 12.1）
 * - /recruit/voice   内容が未確定で noindex にしている
 * - /contact/thanks, /entry/thanks  送信完了ページ。noindex にしている
 *
 * ------------------------------------------------------------------
 * lastModified について
 * ------------------------------------------------------------------
 * ビルド時刻を全ページに入れてはいけない。
 * 中身が変わっていないページまで「更新した」と申告することになり、
 * 検索エンジンは lastmod を信用しなくなる。
 *
 * そのため、更新日を実際に持っているものだけに入れる。
 *   お知らせ … 記事の日付
 *   求人票   … 掲載日（datePosted）
 * それ以外は lastModified を出さない。省略は仕様上まったく問題なく、
 * 不正確な日付を出すよりよい。
 *
 * 将来 content の JSON に updatedAt を持たせれば、ここで拾って出せる。
 * ------------------------------------------------------------------
 */
export const dynamic = 'force-static';

type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency'];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: { path: string; priority: number; changeFrequency: ChangeFrequency }[] = [
    { path: '/', priority: 1, changeFrequency: 'monthly' },
    { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/works', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/talent', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/recruit', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/recruit/flow', priority: 0.6, changeFrequency: 'yearly' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/about/company', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/news', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.9, changeFrequency: 'yearly' },
    { path: '/entry', priority: 0.8, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  ];

  const news = getNews();

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      // お知らせ一覧だけは、最新記事の日付が実際の更新日になる
      ...(route.path === '/news' && news[0] ? { lastModified: new Date(news[0].date) } : {}),
    })),
    ...getServices().map((service) => ({
      url: `${site.url}/services/${service.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...getWorks().map((work) => ({
      url: `${site.url}/works/${work.slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...news.map((item) => ({
      url: `${site.url}/news/${item.slug}`,
      lastModified: new Date(item.date),
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    })),
  ];
}
