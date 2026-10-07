import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { EditorialSections } from '@/components/shared/EditorialSections';
import { getLandingPage, getLandingPages } from '@/lib/landing';
import { createPageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const pages = getLandingPages().map((page) => ({ slug: page.slug }));
  // static export requires one generated param even before the first LP is published.
  return pages.length ? pages : [{ slug: '__cms-placeholder' }];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) return {};
  return createPageMetadata({ title: page.seoTitle, description: page.seoDescription }, `/lp/${slug}/`);
}

export default async function LandingDetail({ params }: Props) {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) notFound();
  return (
    <div className="nc-landing-page">
      <PageHero eyebrow={page.eyebrow} title={page.title} lead={page.lead} crumbs={[{ label: page.title }]} />
      <EditorialSections sections={page.sections} />
    </div>
  );
}
