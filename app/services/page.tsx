import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { ContactCta } from '@/components/shared/ContactCta';
import { Services } from '@/components/home/Services';
import { Structure } from '@/components/home/Structure';

export const metadata: Metadata = pageMetadata('services', '/services/');

/**
 * 事業一覧（3事業のハブ・要件定義書 4. のサイトマップ）
 *
 * 要件定義書 15.: 事業を固定でハードコードせず content/services/ から生成する。
 */
export default function ServicesPage() {
  return (
    <>
      <h1 className="sr-only-text">事業内容</h1>
      <Services />
      <Structure />

      <ContactCta secondary={{ label: '支援実績を見る', href: '/works' }} />
    </>
  );
}
