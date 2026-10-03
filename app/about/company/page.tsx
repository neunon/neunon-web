import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { CompanyTable } from '@/components/about/CompanyTable';
import { site } from '@/lib/site';

export const metadata: Metadata = createPageMetadata(
  {
    title: '会社情報',
    description:
      `${site.name}の会社概要。${site.founded}設立、所在地は${site.address.head}。${site.representative}。経営コンサルティング・戦略コンサルティングを事業としています。電話番号・メールアドレスも掲載しています。`,
  },
  '/about/company/',
);

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
