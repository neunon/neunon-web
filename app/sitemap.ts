import type { MetadataRoute } from 'next';
import { getNews, getServices } from '@/lib/content';
import { site } from '@/lib/site';
import { isIsoDate } from '@/lib/seo';

/**
 * sitemap.xml の自動生成（要件定義書 10.2）。
 * 事業詳細・ニュースは content/ から生成する。旧実績詳細は noindex のため除外。
 * 実装フェーズ 6 以降でページを追加したら、ここにも追記すること。
 *
 * 意図的に含めないもの:
 * - /about/message   原稿が未確定で noindex にしている
 * - /talent/[id]     個人単位のページ。noindex にしている（要件定義書 12.1）
 * - /recruit/voice   内容が未確定で noindex にしている
 * - /contact/thanks, /entry/thanks  送信完了ページ。noindex にしている
 */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: { path: string; priority: number; changeFrequency: 'monthly' | 'yearly' }[] = [
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

  return [
    ...staticRoutes.map((route) => ({
      url: new URL(route.path === '/' ? '/' : route.path + '/', site.url).href,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...getServices().map((service) => ({
      url: new URL(`/services/${service.id}/`, site.url).href,
      ...(isIsoDate(service.updatedAt) ? { lastModified: service.updatedAt } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...getNews().map((item) => ({
      url: new URL(`/news/${item.slug}/`, site.url).href,
      ...(isIsoDate(item.date) ? { lastModified: item.date } : {}),
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    })),
  ];
}
