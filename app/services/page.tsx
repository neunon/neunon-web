import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { ContactCta } from '@/components/shared/ContactCta';
import { PageHero } from '@/components/shared/PageHero';
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
      <PageHero
        title="事業内容"
        lead="経営課題に向き合うコンサルティングから、必要な範囲で頼める調査、実務に組み込むAIまで。目的と規模に合わせて支援の形を選べます。"
        crumbs={[{ label: '事業内容' }]}
      />
      <Services />
      <Structure />

      <ContactCta secondary={{ label: '支援実績を見る', href: '/works' }} />
    </>
  );
}
