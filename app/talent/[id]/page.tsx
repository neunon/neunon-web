import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { roleLabels } from '@/lib/talent';
import { getPublicTalent, getPublicTalents } from '@/lib/talent.server';

type Props = { params: Promise<{ id: string }> };

/**
 * 掲載同意済みの登録者だけがページを持つ。
 * 同意していない登録者は getPublicTalents() の時点で除外されるため、
 * URL 自体が生成されない（dynamicParams = false で 404）。
 */
export function generateStaticParams() {
  return getPublicTalents().map((talent) => ({ id: talent.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const talent = getPublicTalent(id);
  if (!talent) return {};

  return {
    title: `${talent.displayName}｜人材パネル`,
    description: `${roleLabels[talent.role]}。${talent.universityCategory}。対応可能業務: ${talent.availableWork.join('、')}。`,
    alternates: { canonical: `/talent/${talent.id}` },
    // 個人単位のページを検索結果に出す必要はない（要件定義書 12.1）
    robots: { index: false, follow: true },
  };
}

/**
 * 学生個別ページ（要件定義書 6.5・公開範囲は 12.1 に従う）。
 * フェーズ1では公開項目のみ。実名・大学名・詳細経歴・成果物は出さない。
 */
export default async function TalentDetailPage({ params }: Props) {
  const { id } = await params;
  const talent = getPublicTalent(id);
  if (!talent) notFound();

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: '区分', value: roleLabels[talent.role] },
    { label: '学校区分', value: talent.universityCategory },
    { label: '学年', value: `${talent.grade}年` },
    {
      label: 'スキル',
      value: (
        <span className="nc-tags">
          {talent.skills.map((skill) => (
            <span className="nc-tag" key={skill}>
              {skill}
            </span>
          ))}
        </span>
      ),
    },
    { label: '対応可能業務', value: talent.availableWork.join('、') },
    { label: '過去実績', value: talent.recordSummary },
    { label: '稼働可能時間', value: talent.availability },
    { label: '稼働状況', value: talent.availabilityStatus },
  ];

  return (
    <>
      <PageHero
        eyebrow={roleLabels[talent.role]}
        title={talent.displayName}
        crumbs={[{ label: '人材', href: '/talent' }, { label: talent.displayName }]}
      />

      <div className="section">
        <div className="wrap nc-doc-narrow">
          <dl className="nc-deflist">
            {rows.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          {talent.certifications.length > 0 ? (
            <section aria-labelledby="talent-certs">
              <h2 id="talent-certs" className="nc-sub-head">
                認定
              </h2>
              <span className="nc-tags">
                {talent.certifications.map((cert) => (
                  <span className="nc-tag is-cert" key={cert}>
                    {cert}
                  </span>
                ))}
              </span>
            </section>
          ) : null}

          <p className="nc-note">
            個人情報保護のため、実名・大学名・詳細な経歴・成果物は公開していません。実績は件数と種別のみを匿名化して掲載しています。
          </p>

          <p className="nc-optout">
            ご本人で掲載の停止をご希望の場合は、
            <Link href="/contact" className="nc-inline-link">
              お問い合わせフォーム
            </Link>
            からご連絡ください。
          </p>
        </div>
      </div>

      <ContactCta
        title="この分野のメンバーに相談する"
        body="ご相談内容に応じて、必要なスキルと稼働に合わせてチームを編成します。個別のメンバーのご指名は承っていません。"
        secondary={{ label: '人材パネルへ戻る', href: '/talent' }}
      />
    </>
  );
}
