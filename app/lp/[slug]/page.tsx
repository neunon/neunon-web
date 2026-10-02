import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { getLandingPage, getLandingPages, type LandingSection } from '@/lib/landing';
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

function Section({ section }: { section: LandingSection }) {
  if (!section.visible) return null;
  const header = (
    <div className="nc-landing-section-head">
      {section.eyebrow ? <span>{section.eyebrow}</span> : null}
      <h2>{section.title}</h2>
    </div>
  );
  return (
    <section className={`nc-landing-section is-${section.tone}`}>
      <div className="wrap nc-landing-inner">
        {header}
        {section.type === 'text' ? (
          <div className="nc-landing-prose">{section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
        ) : null}
        {section.type === 'cards' ? (
          <>
            {section.lead ? <p className="nc-landing-lead">{section.lead}</p> : null}
            <div className="nc-landing-cards">{section.cards.filter((card) => card.visible).map((card, i) => (
              <article key={i}>
                <h3>{card.title}</h3><p>{card.body}</p>
                {card.href ? <Link href={card.href}>詳しく見る <span aria-hidden="true">↗</span></Link> : null}
              </article>
            ))}</div>
          </>
        ) : null}
        {section.type === 'imageText' ? (
          <div className={`nc-landing-image-text is-${section.imageSide}`}>
            <div className="nc-landing-prose">{section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
            {/* CMS画像は監査で同一サイトの /uploads/ に限定する。 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={section.image} alt={section.imageAlt} loading="lazy" />
          </div>
        ) : null}
        {section.type === 'faq' ? (
          <div className="nc-landing-faq">{section.questions.filter((item) => item.visible).map((item, i) => (
            <div key={i}><h3>{item.question}</h3><p>{item.answer}</p></div>
          ))}</div>
        ) : null}
        {section.type === 'cta' ? (
          <div className="nc-landing-cta"><p>{section.body}</p><Link href={section.href}>{section.label}<span aria-hidden="true"> ↗</span></Link></div>
        ) : null}
      </div>
    </section>
  );
}

export default async function LandingDetail({ params }: Props) {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) notFound();
  return (
    <div className="nc-landing-page">
      <PageHero eyebrow={page.eyebrow} title={page.title} lead={page.lead} crumbs={[{ label: page.title }]} />
      {page.sections.map((section, i) => <Section key={i} section={section} />)}
    </div>
  );
}
