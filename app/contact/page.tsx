import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { FormShell } from '@/components/forms/FormShell';
import { contactFields, formEndpoints } from '@/lib/forms';
import { site } from '@/lib/site';
import { Mail } from 'lucide-react';
import forms from '@/content/pages/forms.json';
import { EditorialSections } from '@/components/shared/EditorialSections';
import { getExtraSections } from '@/lib/extra-sections';

export const metadata: Metadata = pageMetadata('contact', '/contact/');

/**
 * 企業向け問い合わせ（要件定義書 6.8）。
 * 学生向けは /entry に分けている。
 */
export default function ContactPage() {
  const copy = forms.contact;
  return (
    <>
      <PageHero
        title={copy.heroTitle}
        lead={copy.heroLead}
        crumbs={[{ label: 'お問い合わせ' }]}
      />

      <div className="section nc-contact-page">
        <div className="wrap nc-formwrap">
          <div className="nc-formside">
            <span className="nc-contact-kicker">CONTACT</span>
            <h2>{copy.sideTitle}</h2>
            <p className="nc-contact-intro">{copy.sideIntro}</p>

            <dl className="nc-deflist nc-contactinfo">
              <div>
                <dt><Mail aria-hidden="true" size={19} strokeWidth={1.7} /><span>返信</span></dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="nc-inline-link">{site.email}</a>
                </dd>
              </div>
            </dl>
            <div className="nc-notice">
              <p><b>{copy.studentNoteTitle}</b></p>
              <p>{copy.studentNote}</p>
              <Link href="/entry" className="btn nc-contact-entry">{copy.studentLinkLabel}</Link>
            </div>
          </div>

          <div className="nc-formmain">
            <div className="nc-contact-formhead">
              <h2>{copy.formTitle}</h2>
              <p>{copy.formIntro}</p>
            </div>
            <FormShell
              fields={contactFields}
              endpoint={formEndpoints.contact}
              thanksPath="/contact/thanks"
              subject="【サイト】企業からのお問い合わせ"
              submitLabel={copy.submitLabel}
              envName="NEXT_PUBLIC_CONTACT_FORM_ENDPOINT"
            />
          </div>
        </div>
      </div>
      <EditorialSections sections={getExtraSections('contact')} />
    </>
  );
}
