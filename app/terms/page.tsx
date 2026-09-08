import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'サイト利用規約',
  description: `${site.name}のウェブサイトのご利用にあたっての条件。`,
  alternates: { canonical: '/terms' },
};

/**
 * サイト利用規約（要件定義書 4. のサイトマップ）
 *
 * ★このページは実装側が作成した案です。公開前にリーガルチェックを受けること。
 * サービス提供条件ではなく、あくまで当ウェブサイトの利用条件のみを定めている。
 */
export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="TERMS OF USE"
        title="サイト利用規約"
        lead={`${site.name}（以下「当社」）が運営する本ウェブサイトのご利用にあたっては、以下の条件をご確認ください。`}
        crumbs={[{ label: 'サイト利用規約' }]}
      />

      <div className="section">
        <div className="wrap nc-doc-narrow">
          <p className="nc-pending is-lead">
            このページは公開前の案です。
            <br />
            <span>
              実装メモ: 記載内容は実装側で起草した。<b>公開前にリーガルチェックを受けること。</b>
              個別の業務委託契約の条件を定めるものではなく、本サイトの利用条件のみを扱っている。
            </span>
          </p>

          <section aria-labelledby="terms-scope">
            <h2 id="terms-scope" className="nc-sub-head">
              適用範囲
            </h2>
            <p>
              本規約は、本ウェブサイトの閲覧および当社が本サイト上で提供する各機能のご利用に適用されます。個別の業務のご依頼については、別途締結する契約が優先します。
            </p>
          </section>

          <section aria-labelledby="terms-ip">
            <h2 id="terms-ip" className="nc-sub-head">
              著作権・商標
            </h2>
            <p>
              本サイトに掲載している文章、図表、画像、ロゴその他の情報に関する権利は、当社または正当な権利者に帰属します。私的利用の範囲を超えて、当社の許諾なく複製、転載、改変、配布することはできません。
            </p>
          </section>

          <section aria-labelledby="terms-content">
            <h2 id="terms-content" className="nc-sub-head">
              掲載情報について
            </h2>
            <p>
              支援実績として掲載している内容は、守秘義務に配慮し、企業名および案件の具体的な数値を伏せたうえで記載しています。
            </p>
            <p>
              事業ページに掲載している参考価格は、対象企業数、調査範囲、納期によって変動します。確定した金額ではありません。正確なお見積りは個別にご提示します。
            </p>
            <p>
              掲載内容は正確を期していますが、その完全性、有用性を保証するものではありません。内容は予告なく変更または削除することがあります。
            </p>
          </section>

          <section aria-labelledby="terms-prohibited">
            <h2 id="terms-prohibited" className="nc-sub-head">
              禁止事項
            </h2>
            <ul className="nc-checklist">
              <li>本サイトの運営を妨げる行為</li>
              <li>当社または第三者の権利、利益、名誉を損なう行為</li>
              <li>フォームへの虚偽の情報の送信、および営業目的の一斉送信</li>
              <li>本サイトに掲載された情報の無断転載</li>
              <li>その他、法令または公序良俗に反する行為</li>
            </ul>
          </section>

          <section aria-labelledby="terms-disclaimer">
            <h2 id="terms-disclaimer" className="nc-sub-head">
              免責
            </h2>
            <p>
              本サイトのご利用、またはご利用いただけなかったことによって生じた損害について、当社は責任を負いかねます。本サイトからリンクする外部サイトの内容についても同様です。
            </p>
          </section>

          <section aria-labelledby="terms-privacy">
            <h2 id="terms-privacy" className="nc-sub-head">
              個人情報の取り扱い
            </h2>
            <p>
              フォームを通じて取得する個人情報の取り扱いは、
              <Link href="/privacy" className="nc-inline-link">
                プライバシーポリシー
              </Link>
              に定めるとおりです。
            </p>
          </section>

          <section aria-labelledby="terms-change">
            <h2 id="terms-change" className="nc-sub-head">
              規約の変更
            </h2>
            <p>
              本規約は、必要に応じて変更することがあります。変更後の規約は本ページに掲載した時点から適用されます。
            </p>
          </section>

          <section aria-labelledby="terms-contact">
            <h2 id="terms-contact" className="nc-sub-head">
              お問い合わせ
            </h2>
            <p>
              本規約に関するご質問は、
              <Link href="/contact" className="nc-inline-link">
                お問い合わせフォーム
              </Link>
              またはお電話（
              <a href={`tel:${site.tel.replace(/-/g, '')}`} className="nc-inline-link">
                {site.tel}
              </a>
              ）までご連絡ください。
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
