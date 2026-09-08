import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: '代表メッセージ',
  description: `${site.name} 代表取締役社長からのメッセージ。`,
  alternates: { canonical: '/about/message' },
  // 原稿が未確定のうちは検索結果に出さない
  robots: { index: false, follow: true },
};

/**
 * 代表メッセージ（要件定義書 4. のサイトマップ）。
 *
 * 【要確認】原稿は要件定義書 14. で未解決。
 * 実在の代表者名義の文章を実装側で創作することはできないため、
 * 準備中の状態で公開し、原稿受領後に差し替える。
 * それまでは検索エンジンに載らないよう noindex にしている。
 */
export default function MessagePage() {
  return (
    <>
      <PageHero
        title="代表メッセージ"
        crumbs={[{ label: '会社概要', href: '/about' }, { label: '代表メッセージ' }]}
      />

      <div className="section">
        <div className="wrap nc-doc-narrow">
          <p className="nc-pending is-lead">
            原稿を準備中です。公開までしばらくお待ちください。
            <br />
            <span>
              実装メモ: 要件定義書 14. の未解決事項。代表者名義の文章は創作せず、
              発注者から受領した原稿をこのページに反映してください。反映時に
              <code>metadata.robots</code> の noindex を外すこと。
            </span>
          </p>

          <h2 className="nc-sub-head">当社のミッション</h2>
          <blockquote className="nc-quote">{site.mission}</blockquote>
          <p className="nc-attr">{site.representative}</p>
        </div>
      </div>

      <ContactCta secondary={{ label: '会社概要へ戻る', href: '/about' }} />
    </>
  );
}
