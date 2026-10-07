import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { WorksGrid } from '@/components/works/WorksGrid';
import { anonymousWorks } from '@/lib/anonymous-works';
import hubs from '@/content/pages/hubs.json';
import { EditorialSections } from '@/components/shared/EditorialSections';
import { getExtraSections } from '@/lib/extra-sections';

export const metadata: Metadata = pageMetadata('works', '/works/');

/**
 * 支援実績の一覧（要件定義書 6.4）。
 * 12.1 のとおり、企業名・具体的な数値は一切使わず、業種と分析アプローチのみ。
 */
export default function WorksPage() {
  return (
    <>
      <PageHero
        title={hubs.works.title}
        lead={hubs.works.lead}
        crumbs={[{ label: '支援実績' }]}
      />

      <section className="section nc-works-stage" aria-label="実績一覧">
        <WorksGrid works={anonymousWorks} />
      </section>

      <EditorialSections sections={getExtraSections('works')} />
      <ContactCta secondary={{ label: hubs.works.ctaLabel, href: '/services' }} />
    </>
  );
}
