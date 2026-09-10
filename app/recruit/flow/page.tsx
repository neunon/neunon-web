import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { selectionSteps, termsPendingNote } from '@/lib/recruit';
import { faqSchema, jsonLd } from '@/lib/schema';

export const metadata: Metadata = {
  title: '選考フロー',
  description:
    'エントリーから稼働開始までの7ステップ。募集要項の送付、書類選考、オンライン面接、選考結果の連絡、契約・初期手続き、オンボーディングを経て案件に参画します。オンラインを中心に進めます。',
  alternates: { canonical: '/recruit/flow' },
};

const faq = [
  {
    q: '実務経験がなくても応募できますか。',
    a: 'できます。応募者の大半が未経験からのスタートです。経験の多さより、責任感と学ぶ姿勢を重視しています。',
  },
  {
    q: '学部・学科は関係ありますか。',
    a: '関係ありません。スキルも成績も問いません。文系・理系どちらの方も在籍しています。',
  },
  {
    q: 'サークルやアルバイトと両立できますか。',
    a: 'できます。フルリモートで時間帯も自由です。稼働時間は相談のうえ決めます。試験期間などの調整も可能です。',
  },
  {
    q: '選考にはどのくらい時間がかかりますか。',
    a: '応募受付から選考結果のご連絡までは、おおむね1〜3週間です。その後、契約・初期手続きとオンボーディングを経て稼働開始となります。',
  },
  {
    q: '契約や報酬の条件はいつ分かりますか。',
    a: termsPendingNote,
  },
  {
    q: '途中で辞退できますか。',
    a: 'できます。合わないと思った時点で伝えていただいて構いません。こちらからお断りすることもあります。',
  },
];

/** 選考フロー（要件定義書 4. のサイトマップ / 6.6 の7番） */
export default function FlowPage() {
  return (
    <div className="nc-recruit">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(faq))} />

      <PageHero
        title="選考フロー"
        lead="募集要項の確認からオンボーディング、稼働開始まで。オンラインを中心に7つのステップで進めます。"
        crumbs={[{ label: '採用情報', href: '/recruit' }, { label: '選考フロー' }]}
      />

      <div className="section">
        <div className="wrap nc-doc-narrow">
          <ol className="nc-steps nc-selection-steps">
            {selectionSteps.map((step, index) => (
              <li className="nc-step" key={step.no}>
                <div className="nc-step-n">Step {step.no}</div>
                <div className="nc-step-c">
                  <h2>{step.title}</h2>
                  <p>{step.body}</p>
                </div>
                <div className="nc-step-s">{step.span}</div>
              </li>
            ))}
          </ol>

          <p className="nc-rnote">
            選考結果のご連絡まではおおむね1〜3週間です。契約手続きとオンボーディングの日程は、学業の状況に応じて調整します。
          </p>

          <section aria-labelledby="flow-faq">
            <h2 id="flow-faq" className="nc-sub-head">
              よくある質問
            </h2>
            <dl className="nc-faq">
              {faq.map((item) => (
                <div key={item.q}>
                  <dt>{item.q}</dt>
                  <dd>{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <div className="nc-cta nc-rcta">
        <div className="wrap">
          <h2>まずはエントリーから。</h2>
          <p>迷っている段階でも構いません。面接で状況を伺って、こちらから提案します。</p>
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
