import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { FormShell } from '@/components/forms/FormShell';
import { entryFields, formEndpoints } from '@/lib/forms';
import { selectionSteps } from '@/lib/recruit';

export const metadata: Metadata = {
  title: 'エントリー',
  description:
    '学生向けのエントリーフォーム。学部・学科不問、実務未経験でも可。志望動機はきれいにまとめる必要はありません。',
  alternates: { canonical: '/entry' },
};

/**
 * 学生向けエントリー（要件定義書 6.8）。
 * 採用サイトと同じトーンにするため nc-recruit を付けている。
 */
export default function EntryPage() {
  return (
    <div className="nc-recruit">
      <PageHero
        title="エントリー"
        lead="志望動機はきれいにまとめなくて構いません。何をやりたいかが伝われば十分です。迷っている段階でのご応募も歓迎します。"
        crumbs={[{ label: '採用情報', href: '/recruit' }, { label: 'エントリー' }]}
      />

      <div className="section">
        <div className="wrap nc-formwrap">
          <div className="nc-formside">
            <div className="nc-notice">
              <p>
                <b>企業のご担当者様はこちら</b>
              </p>
              <p>
                お仕事のご相談は
                <Link href="/contact" className="nc-inline-link">
                  お問い合わせフォーム
                </Link>
                からお願いします。
              </p>
              <Link href="/contact" className="btn nc-contact-entry">
                企業のお問い合わせへ
              </Link>
            </div>

            <h2 className="nc-side-head">送信後の流れ</h2>
            <ol className="nc-sidesteps">
              {selectionSteps.map((step) => (
                <li key={step.no}>
                  <span className="nc-path-n">Step {step.no}</span>
                  <span className="nc-sidestep-t">{step.title}</span>
                  <span className="nc-sidestep-s">{step.span}</span>
                </li>
              ))}
            </ol>
            <p className="nc-rnote">
              学部・学科は問いません。スキルも成績も問いません。実務未経験でも構いません。
            </p>
            <Link href="/recruit/flow" className="nc-more">
              <i aria-hidden="true" />
              選考フローの詳細へ
            </Link>
          </div>

          <div className="nc-formmain">
            <FormShell
              fields={entryFields}
              endpoint={formEndpoints.entry}
              thanksPath="/entry/thanks"
              subject="【サイト】学生からのエントリー"
              submitLabel="この内容でエントリーする"
              envName="NEXT_PUBLIC_ENTRY_FORM_ENDPOINT"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
