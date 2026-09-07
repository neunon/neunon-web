import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

/** robots.txt の自動生成（要件定義書 10.2） */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
