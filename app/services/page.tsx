import type { Metadata } from 'next';
import { ContactCta } from '@/components/shared/ContactCta';
import { Services } from '@/components/home/Services';
import { Structure } from '@/components/home/Structure';

export const metadata: Metadata = {
  title: '事業内容',
  description:
    'コンサルティング、パッケージ型支援、AIプロダクトの3つの提供形態。案件単位の個別支援から、定型化して低単価で継続提供するパッケージ、その工程自体を自動化するAIまで。',
  alternates: { canonical: '/services' },
};

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
