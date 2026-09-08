import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { WorksGrid } from '@/components/works/WorksGrid';
import { getWorkIndustries, getWorks } from '@/lib/content';

export const metadata: Metadata = {
  title: '支援実績',
  description:
    '人材・製造・物流・小売・メディア・インフラなど、これまでの支援実績。守秘義務のため企業名と具体的な数値は記載せず、業種と分析アプローチのみを公開しています。',
  alternates: { canonical: '/works' },
};

/**
 * 支援実績の一覧（要件定義書 6.4）。
 * 12.1 のとおり、企業名・具体的な数値は一切使わず、業種と分析アプローチのみ。
 */
export default function WorksPage() {
  const works = getWorks();
  const industries = getWorkIndustries();

  return (
    <>
      <PageHero
        title="支援実績"
        lead="守秘義務のため、企業名と案件の具体的な数値は記載していません。業種と、どう分析したかのみを公開しています。"
        crumbs={[{ label: '支援実績' }]}
      />

      <section className="section" aria-label="実績一覧">
        <div className="wrap">
          <WorksGrid works={works} industries={industries} />
        </div>
      </section>

      <ContactCta secondary={{ label: '事業内容を見る', href: '/services' }} />
    </>
  );
}
