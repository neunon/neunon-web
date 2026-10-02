import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { CompanyTable } from '@/components/about/CompanyTable';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: '会社情報',
  description: `${site.name} の会社情報。社名、設立、代表者、所在地、事業内容、従業員数。`,
  alternates: { canonical: '/about/company' },
};

/** 会社情報（登記情報） */
export default function CompanyPage() {
  return (
    <>
      <PageHero
        title="会社情報"
        crumbs={[{ label: '企業情報', href: '/about' }, { label: '会社情報' }]}
      />

      <div className="section nc-company-page">
        <div className="wrap">
          <section className="nc-company-profile" aria-labelledby="company-profile">
            <div className="nc-company-profile-intro">
              <span className="nc-company-profile-kicker">COMPANY PROFILE</span>
              <h2 id="company-profile">会社概要</h2>
              <p>株式会社Neunon Consultingの基本情報をご案内します。</p>
            </div>
            <div className="nc-company-profile-details">
              <CompanyTable />
              <p className="nc-note">お問い合わせはフォームからお願いしています。お電話でのご相談も承っていますが、内容の整理のためフォームを推奨しています。</p>
            </div>
          </section>
        </div>
      </div>

      <ContactCta secondary={{ label: '企業情報へ戻る', href: '/about' }} />
    </>
  );
}
