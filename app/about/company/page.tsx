import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { CompanyTable } from '@/components/about/CompanyTable';
import { History } from '@/components/about/History';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: '会社情報',
  description: `${site.name} の登記情報と沿革。社名、設立、代表者、所在地、事業内容、従業員数。`,
  alternates: { canonical: '/about/company' },
};

/** 会社情報（登記情報・沿革）— 要件定義書 4. のサイトマップ */
export default function CompanyPage() {
  return (
    <>
      <PageHero
        title="会社情報"
        crumbs={[{ label: '会社概要', href: '/about' }, { label: '会社情報' }]}
      />

      <div className="section">
        <div className="wrap nc-doc-narrow">
          <section aria-labelledby="company-profile">
            <h2 id="company-profile" className="nc-sub-head">
              会社概要
            </h2>
            <CompanyTable />
            <p className="nc-note">
              お問い合わせはフォームからお願いしています。お電話でのご相談も承っていますが、内容の整理のためフォームを推奨しています。
            </p>
          </section>

          <section aria-labelledby="company-history">
            <h2 id="company-history" className="nc-sub-head">
              沿革
            </h2>
            <History />
          </section>
        </div>
      </div>

      <ContactCta secondary={{ label: '会社概要へ戻る', href: '/about' }} />
    </>
  );
}
