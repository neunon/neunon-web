import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { selectionSteps, termsPendingNote } from '@/lib/recruit';

export const metadata: Metadata = {
  title: '選考フロー',
  description:
    '書類選考 → 面談 → ケース課題 → 最終面談 の4段階。ケース課題は正解を当てる試験ではなく、考え方と進め方を見るものです。',
  alternates: { canonical: '/recruit/flow' },
};

const faq = [
  {
    q: '実務経験がなくても応募できますか。',
    a: 'できます。応募者の大半が未経験からのスタートです。ケース課題も、知識ではなく考え方と進め方を見るものです。',
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
    a: 'エントリーから最終面談まで、おおむね2〜3週間です。ケース課題の期限はご相談に応じます。',
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
      <PageHero
        eyebrow="SELECTION"
        title="選考フロー"
        lead="4段階です。合否を決める場であると同時に、こちらが何をしている会社かを知ってもらう場でもあります。"
        crumbs={[{ label: '採用情報', href: '/recruit' }, { label: '選考フロー' }]}
      />

      <div className="section">
        <div className="wrap nc-doc-narrow">
          <ol className="nc-steps">
            {selectionSteps.map((step, index) => (
              <li className="nc-step rise" data-d={Math.min(index + 1, 4)} key={step.no}>
                <div className="nc-step-n">STEP {step.no}</div>
                <div className="nc-step-c">
                  <h2>{step.title}</h2>
                  <p>{step.body}</p>
                </div>
                <div className="nc-step-s">{step.span}</div>
              </li>
            ))}
          </ol>

          <p className="nc-rnote">
            所要期間は、エントリーから最終面談までおおむね2〜3週間です。学業の状況に応じて調整します。
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
        <div className="wrap rise">
          <h2>まずはエントリーから。</h2>
          <p>迷っている段階でも構いません。面談で状況を伺って、こちらから提案します。</p>
          <div className="nc-acts nc-cta-acts">
            <Link href="/entry" className="btn">
              エントリーする
            </Link>
            <Link href="/recruit/jobs" className="btn btn-ghost">
              募集職種を見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
