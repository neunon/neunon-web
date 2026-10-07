import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { FormShell } from '@/components/forms/FormShell';
import { entryFields, formEndpoints } from '@/lib/forms';
import { selectionSteps } from '@/lib/recruit';
import forms from '@/content/pages/forms.json';
import { pageMetadata } from '@/lib/seo';
import { EditorialSections } from '@/components/shared/EditorialSections';
import { getExtraSections } from '@/lib/extra-sections';

export const metadata: Metadata = pageMetadata('entry', '/entry/');

/**
 * 学生向けエントリー（要件定義書 6.8）。
 * 採用サイトと同じトーンにするため nc-recruit を付けている。
 */
export default function EntryPage() {
  const copy = forms.entry;
  return (
    <div className="nc-recruit">
      <PageHero
        title={copy.heroTitle}
        lead={copy.heroLead}
        crumbs={[{ label: '採用情報', href: '/recruit' }, { label: 'エントリー' }]}
      />

      <div className="section nc-entry-page">
        <div className="wrap nc-formwrap">
          <div className="nc-formside">
            <span className="nc-contact-kicker">ENTRY</span>
            <h2>{copy.sideTitle}</h2>
            <p className="nc-contact-intro">{copy.sideIntro}</p>
            <h2 className="nc-side-head">{copy.flowTitle}</h2>
            <ol className="nc-sidesteps">
              {selectionSteps.map((step) => (
                <li key={step.no}>
                  <span className="nc-path-n">Step {step.no}</span>
                  <span className="nc-sidestep-t">{step.title}</span>
                  <span className="nc-sidestep-s">{step.span}</span>
                </li>
              ))}
            </ol>
            <p className="nc-rnote">
              {copy.eligibilityNote}
            </p>
            <Link href="/recruit/flow" className="nc-more">
              <i aria-hidden="true" />
              選考フローの詳細へ
            </Link>
            <div className="nc-notice">
              <p><b>{copy.companyNoteTitle}</b></p>
              <p>{copy.companyNote}</p>
              <Link href="/contact" className="btn nc-contact-entry">{copy.companyLinkLabel}</Link>
            </div>
          </div>

          <div className="nc-formmain">
            <div className="nc-contact-formhead">
              <h2>{copy.formTitle}</h2>
              <p>{copy.formIntro}</p>
            </div>
            <FormShell
              fields={entryFields}
              endpoint={formEndpoints.entry}
              thanksPath="/entry/thanks"
              subject="【サイト】学生からのエントリー"
              submitLabel={copy.submitLabel}
              envName="NEXT_PUBLIC_ENTRY_FORM_ENDPOINT"
            />
          </div>
        </div>
      </div>
      <EditorialSections sections={getExtraSections('entry')} />
    </div>
  );
}
