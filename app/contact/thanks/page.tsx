import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: '送信完了',
  description: 'お問い合わせを受け付けました。',
  alternates: { canonical: '/contact/thanks' },
  // 完了ページを検索結果に出す必要はない
  robots: { index: false, follow: false },
};

/** 送信完了ページ（要件定義書 6.8 共通要件） */
export default function ContactThanksPage() {
  return (
    <>
      <PageHero
        title="送信しました"
        lead="お問い合わせありがとうございます。内容を確認のうえ、当日〜翌営業日にメールでご連絡します。"
        crumbs={[{ label: 'お問い合わせ', href: '/contact' }, { label: '送信完了' }]}
      />

      <div className="section">
        <div className="wrap nc-doc-narrow">
          <h2 className="nc-sub-head">このあとの流れ</h2>
          <ol className="nc-history">
            <li>
              <span className="nc-history-date">当日〜翌営業日</span>
              <span>担当者からメールでご連絡します。</span>
            </li>
            <li>
              <span className="nc-history-date">その後</span>
              <span>30〜60分の打ち合わせで、判断したいことと調査範囲を整理します。</span>
            </li>
            <li>
              <span className="nc-history-date">2〜3営業日</span>
              <span>調査範囲に基づいてお見積りを提示します。</span>
            </li>
          </ol>

          <p className="nc-note">
            数日経っても返信が届かない場合は、迷惑メールフォルダをご確認のうえ、
            <a href={`tel:${site.tel.replace(/-/g, '')}`} className="nc-inline-link">
              {site.tel}
            </a>
            までご連絡ください。
          </p>

          <div className="nc-acts nc-form-acts">
            <Link href="/" className="btn">
              トップへ戻る
            </Link>
            <Link href="/works" className="btn btn-ghost">
              支援実績を見る
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
