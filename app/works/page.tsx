import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { WorksGrid } from '@/components/works/WorksGrid';
import { anonymousWorks } from '@/lib/anonymous-works';

export const metadata: Metadata = {
  title: '支援実績',
  description:
    '守秘義務に配慮した匿名の支援実績。人材・製造・物流・小売・食品卸売・メディア・SNS・建設インフラ・AIなどの支援テーマを掲載しています。',
  alternates: { canonical: '/works' },
};

/**
 * 支援実績の一覧（要件定義書 6.4）。
 * 12.1 のとおり、企業名・具体的な数値は一切使わず、業種と分析アプローチのみ。
 */
export default function WorksPage() {
  return (
    <>
      <PageHero
        title="支援実績"
        lead="守秘義務に配慮し、顧客名・規模・成果は公開せず、業界と支援テーマのみを匿名で紹介しています。"
        crumbs={[{ label: '支援実績' }]}
      />

      <section className="section nc-works-stage" aria-label="実績一覧">
        <WorksGrid works={anonymousWorks} />
      </section>

      <ContactCta secondary={{ label: '事業内容を見る', href: '/services' }} />
    </>
  );
}
