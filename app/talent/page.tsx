import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { TalentPanel } from '@/components/talent/TalentPanel';
import { getTalentFacets } from '@/lib/talent';
import { getPublicTalents } from '@/lib/talent.server';

export const metadata: Metadata = {
  title: '人材パネル',
  description:
    '案件を担当する登録学生の一覧。フェーズ1では個人が特定できない粒度で、区分・大学区分・スキル・対応可能業務・稼働状況のみを公開しています。',
  alternates: { canonical: '/talent' },
};

/**
 * 人材パネル（要件定義書 6.5 ★設計注意）
 *
 * フェーズ1は「どんな学生がいるか」を匿名で示すのが目的。
 * 実名・大学名・詳細経歴はフェーズ2（企業アカウントでのログイン後）まで出さない。
 * データ側の担保は lib/talent.ts を参照。
 */
export default function TalentPage() {
  const talents = getPublicTalents();
  const facets = getTalentFacets(talents);

  return (
    <>
      <PageHero
        eyebrow="TALENT"
        title="人材パネル"
        lead="案件を担当する登録学生の一覧です。ご相談内容に応じて、スキルと稼働状況からチームを編成します。"
        crumbs={[{ label: '人材' }]}
      />

      <div className="section">
        <div className="wrap">
          <div className="nc-notice">
            <p>
              <b>公開している情報について</b>
            </p>
            <p>
              個人情報保護のため、実名・大学名・詳細な経歴は公開していません。表示名はイニシャル、学校は区分のみ、実績は件数と種別のみを掲載しています。掲載はすべて本人の同意を得たうえで行っています。
            </p>
            <p>
              実名・詳細経歴を含む完全版は、企業アカウントでのご確認を前提とした機能として準備中です。ご検討中の案件がある場合は
              <Link href="/contact" className="nc-inline-link">
                お問い合わせ
              </Link>
              ください。
            </p>
          </div>

          <TalentPanel talents={talents} facets={facets} />

          <p className="nc-optout">
            登録者の方で掲載の停止をご希望の場合は、
            <Link href="/contact" className="nc-inline-link">
              お問い合わせフォーム
            </Link>
            からご連絡ください。確認のうえ速やかに掲載を取り下げます。
          </p>
        </div>
      </div>

      <ContactCta
        title="チーム編成のご相談"
        body="案件の内容をお伺いし、必要なスキルと稼働に合わせてチームを編成します。まだ内容が固まっていない段階でも構いません。"
        secondary={{ label: '事業内容を見る', href: '/services' }}
      />
    </>
  );
}
