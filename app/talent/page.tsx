import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { TalentPanel } from '@/components/talent/TalentPanel';
import { getTalentFacets } from '@/lib/talent';
import { getPublicTalents } from '@/lib/talent.server';
import hubs from '@/content/pages/hubs.json';
import { EditorialSections } from '@/components/shared/EditorialSections';
import { getExtraSections } from '@/lib/extra-sections';

export const metadata: Metadata = pageMetadata('talent', '/talent/');

/**
 * 人材パネル（要件定義書 6.5 ★設計注意）
 *
 * フェーズ1は「どんな学生がいるか」を匿名で示すのが目的。
 * 実名と詳細経歴は出さず、大学名と学部・研究科は掲載許可済みの学生に限って公開する。
 * データ側の担保は lib/talent.ts を参照。
 */
export default async function TalentPage() {
  const talents = await getPublicTalents();
  const facets = getTalentFacets(talents);

  return (
    <>
      <PageHero
        title={hubs.talent.title}
        lead={hubs.talent.lead}
        crumbs={[{ label: '人材' }]}
      />

      <div className="section">
        <div className="wrap">
          <div className="nc-notice">
            <p>
              <b>公開している情報について</b>
            </p>
            <p>
              個人情報保護のため、実名・詳細な経歴は公開していません。表示名は自動採番された匿名の学生No、学校は大学名と学部・研究科まで、実績は件数のみを掲載しています。「サイト掲載可」が「可」の登録者だけを表示しています。
            </p>
            <p>
              気になるメンバーは複数選択できます。案件や体制により必ずしも指名をお約束するものではありませんが、お問い合わせ時のチーム検討に活用します。ご検討中の案件がある場合は
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

      <EditorialSections sections={getExtraSections('talent')} />
      <ContactCta
        title={hubs.talent.ctaTitle}
        body={hubs.talent.ctaBody}
        primary={{ label: hubs.talent.ctaPrimaryLabel, href: '/contact?topic=人材について' }}
        secondary={{ label: hubs.talent.ctaSecondaryLabel, href: '/services' }}
      />
    </>
  );
}
