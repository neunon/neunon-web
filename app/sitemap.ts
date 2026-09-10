import type { MetadataRoute } from 'next';
import { getNews, getServices, getWorks } from '@/lib/content';
import { site } from '@/lib/site';

/**
 * sitemap.xml の自動生成（要件定義書 10.2）。
 * 事業詳細・実績詳細は content/ から生成するので、追加すれば自動で載る。
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
  const lastModified = new Date();

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
      url: `${site.url}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...getServices().map((service) => ({
      url: `${site.url}/services/${service.id}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...getWorks().map((work) => ({
      url: `${site.url}/works/${work.slug}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...getNews().map((item) => ({
      url: `${site.url}/news/${item.slug}`,
      lastModified: new Date(item.date),
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    })),
  ];
}
