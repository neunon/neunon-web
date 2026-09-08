import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { gakuchika } from '@/lib/recruit';

export const metadata: Metadata = {
  title: 'メンバーインタビュー',
  description: '在籍メンバーへのインタビュー。準備中です。',
  alternates: { canonical: '/recruit/voice' },
  // 内容が入るまで検索結果に出さない
  robots: { index: false, follow: true },
};

/**
 * メンバーインタビュー（要件定義書 4. のサイトマップ / 6.6 の6番）
 *
 * 【要確認】要件定義書 14. の未解決事項（メンバーインタビューの実施可否）。
 * 加えて 12.1 により、社内メンバーの個人名は本人同意なしに掲載できない。
 * 実在のメンバーの発言を実装側で創作することはできないため、
 * 取材と同意が取れるまで準備中の表示にし、noindex にしている。
 */
export default function VoicePage() {
  return (
    <div className="nc-recruit">
      <PageHero
        title="メンバーインタビュー"
        crumbs={[{ label: '採用情報', href: '/recruit' }, { label: 'メンバーインタビュー' }]}
      />

      <div className="section">
        <div className="wrap nc-doc-narrow">
          <p className="nc-pending is-lead">
            準備中です。公開までしばらくお待ちください。
            <br />
            <span>
              実装メモ: 要件定義書 14.（メンバーインタビューの実施可否）が未解決。
              12.1 により社内メンバーの個人名は本人同意なしに掲載できないため、
              取材と掲載同意が取れてから反映すること。反映時に
              <code>metadata.robots</code> の noindex を外すこと。
            </span>
          </p>

          <h2 className="nc-sub-head">在籍メンバーが語る内容の一例</h2>
          <p>インタビューでは、実際に担当した案件と、そこで何ができるようになったかを聞く予定です。</p>
          <ul className="nc-gakuchika nc-rgakuchika">
            {gakuchika.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <p className="nc-rnote">
            それまでは、担当する案件の内容を
            <Link href="/works" className="nc-inline-link">
              支援実績
            </Link>
            で、働き方の条件を
            <Link href="/recruit/jobs" className="nc-inline-link">
              求人票
            </Link>
            でご確認ください。
          </p>
        </div>
      </div>

      <div className="nc-cta nc-rcta">
        <div className="wrap">
          <h2>話を聞いてみたい場合</h2>
          <p>面談で、実際に担当している案件と働き方をお伝えします。エントリー後に日程を調整します。</p>
          <div className="nc-acts nc-cta-acts">
            <Link href="/entry" className="btn">
              エントリーする
            </Link>
            <Link href="/recruit" className="btn btn-ghost">
              採用情報へ戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
