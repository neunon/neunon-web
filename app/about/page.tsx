import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { TableOfContents, type TocItem } from '@/components/toc/TableOfContents';
import { CompanyTable } from '@/components/about/CompanyTable';
import { getAboutContent } from '@/lib/page-content';
import { EditorialSections } from '@/components/shared/EditorialSections';
import { getExtraSections } from '@/lib/extra-sections';

export const metadata: Metadata = pageMetadata('about', '/about/');

export default function AboutPage() {
  const content = getAboutContent();
  const toc: TocItem[] = [
    ...(content.mission.visible ? [{ id: 'mission', label: 'ミッション' }] : []),
    ...(content.people.visible ? [{ id: 'develop-people', label: '人材育成に対する考え' }] : []),
    ...(content.companyVisible ? [{ id: 'company', label: '会社情報' }] : []),
  ];
  return (
    <>
      <PageHero
        title="企業情報"
        lead={content.heroLead}
        crumbs={[{ label: '企業情報' }]}
      />

      <div className="section nc-about-page">
        <div className="wrap nc-doc">
          {toc.length > 0 ? <TableOfContents items={toc} title="Contents" /> : null}

          <div className="nc-doc-body">
            {content.mission.visible ? <section id="mission" className="nc-about-mission" aria-labelledby="mission-title">
              <span className="nc-about-kicker">01 — Mission</span>
              <h2 id="mission-title">{content.mission.title}</h2>
              <blockquote>{content.mission.body}</blockquote>
            </section> : null}

            {content.people.visible ? <section id="develop-people" className="nc-about-people" aria-labelledby="develop-people-title">
              <span className="nc-about-kicker">02 — Our View on People Development</span>
              <h2 id="develop-people-title" className="nc-about-linebreak">{content.people.title}</h2>
              <div className="nc-about-people-intro">
                <h3>{content.people.introTitle}</h3>
                {content.people.introParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>

              <div className="nc-about-people-points">
                {content.people.points.map((point, index) => <article key={`${index}-${point.title}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{point.title}</h3>{point.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>
                </article>)}
              </div>
            </section> : null}

            {content.companyVisible ? <section id="company" className="nc-about-company" aria-labelledby="company-title">
              <span className="nc-about-kicker">03 — Company</span>
              <h2 id="company-title">会社情報</h2>
              <CompanyTable />
            </section> : null}
          </div>
        </div>
      </div>

      <EditorialSections sections={getExtraSections('about')} />
      <ContactCta secondary={{ label: '事業内容を見る', href: '/services' }} />
    </>
  );
}
