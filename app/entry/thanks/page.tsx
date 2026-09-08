import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { selectionSteps } from '@/lib/recruit';

export const metadata: Metadata = {
  title: 'エントリー完了',
  description: 'エントリーを受け付けました。',
  alternates: { canonical: '/entry/thanks' },
  robots: { index: false, follow: false },
};

/** エントリー完了ページ（要件定義書 6.8 共通要件） */
export default function EntryThanksPage() {
  return (
    <div className="nc-recruit">
      <PageHero
        title="受け付けました"
        lead="エントリーありがとうございます。1週間以内に選考結果をメールで返信します。"
        crumbs={[{ label: 'エントリー', href: '/entry' }, { label: '完了' }]}
      />

      <div className="section">
        <div className="wrap nc-doc-narrow">
          <h2 className="nc-sub-head">このあとの流れ</h2>
          <ol className="nc-steps">
            {selectionSteps.map((step, index) => (
              <li className="nc-step" key={step.no}>
                <div className="nc-step-n">STEP {step.no}</div>
                <div className="nc-step-c">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
                <div className="nc-step-s">{step.span}</div>
              </li>
            ))}
          </ol>

          <p className="nc-rnote">
            返信が届かない場合は、迷惑メールフォルダをご確認ください。それでも見当たらない場合は、
            お手数ですがもう一度エントリーしてください。
          </p>

          <div className="nc-acts nc-form-acts">
            <Link href="/recruit" className="btn">
              採用情報へ戻る
            </Link>
            <Link href="/works" className="btn btn-ghost">
              担当する案件を見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
