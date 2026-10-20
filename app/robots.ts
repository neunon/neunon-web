import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

/** robots.txt の自動生成（要件定義書 10.2） */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    // /docs/ は営業メールに載せる資料の置き場。巡回させない（配下の文字列はここに書かない）
    rules: { userAgent: '*', allow: '/', disallow: '/docs/' },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
