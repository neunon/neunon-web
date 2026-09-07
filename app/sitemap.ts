import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

/**
 * sitemap.xml の自動生成（要件定義書 10.2）。
 * 現時点で存在するルートのみを列挙している。
 * 実装フェーズ 4 以降でページを追加したら、ここにも追記すること。
 */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
