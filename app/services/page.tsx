import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { ContactCta } from '@/components/shared/ContactCta';
import { PageHero } from '@/components/shared/PageHero';
import { Services } from '@/components/home/Services';
import { Structure } from '@/components/home/Structure';
import hubs from '@/content/pages/hubs.json';
import { EditorialSections } from '@/components/shared/EditorialSections';
import { getExtraSections } from '@/lib/extra-sections';

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
        title={hubs.services.title}
        lead={hubs.services.lead}
        crumbs={[{ label: '事業内容' }]}
      />
      <Services />
      <Structure />
      <EditorialSections sections={getExtraSections('services')} />

      <ContactCta secondary={{ label: hubs.services.ctaLabel, href: '/works' }} />
    </>
  );
}
