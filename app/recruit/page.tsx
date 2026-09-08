import type { Metadata } from 'next';
import Link from 'next/link';
import { getJobs, getWorks } from '@/lib/content';
import {
  conditions,
  gakuchika,
  idealCandidate,
  recruitHero,
  recruitIndustries,
  selectionSteps,
  termsPendingNote,
} from '@/lib/recruit';

export const metadata: Metadata = {
  title: '採用情報',
  description:
    '学生のうちに、企業の実案件を。市場規模の推定、競合分析、収益性分析、提案資料の作成まで。経験のあるコンサルタントが監修するので、知識ゼロから始められます。フルリモート・時間帯自由・学部学科不問。',
  alternates: { canonical: '/recruit' },
};

/**
 * 採用トップ（要件定義書 6.6）。
 *
 * 読者は学生なので、コーポレート側とトーンを変える。
 * コピーは社内ポスター案由来のものを確定扱いで使用（短文・断定・余白）。
 * 学歴要件はサイトに出さない（6.6 の「重要」）。
 *
 * セクション順は 6.6 の指定どおり:
 *   1 ヒーロー / 2 ここで何ができるか / 3 実際の案件例 / 4 役割とキャリアパス
 *   5 求める人物像 / 6 メンバーインタビュー / 7 選考フロー / 8 募集職種 / 9 CTA
 */
export default function RecruitPage() {
  const jobs = getJobs();
  const works = getWorks().slice(0, 4);

  return (
    <div className="nc-recruit">
      {/* 1 ヒーロー */}
      <div className="nc-rhero">
        <div className="wrap">
          <h1 className="rise" data-d="0">
            {recruitHero.lines[0]}
            <br />
            <span className="nc-thin">{recruitHero.lines[1]}</span>
          </h1>
          <p className="nc-rsub rise" data-d="1">
            {recruitHero.sub}
          </p>
          <p className="nc-rlead rise" data-d="2">
            {recruitHero.lead}
          </p>
          <div className="nc-acts rise" data-d="3">
            <Link href="/entry" className="btn">
              エントリーする
            </Link>
            <Link href="/recruit/jobs" className="btn btn-ghost">
              募集職種を見る
            </Link>
          </div>
        </div>
      </div>

      {/* 2 ここで何ができるか */}
      <section className="section" aria-labelledby="r-can">
        <div className="wrap">
          <div className="shead">
            <h2 id="r-can">ここで何ができるか</h2>
          </div>

          <p className="nc-glabel">ガクチカ、こう言えるようになります</p>
          <ul className="nc-gakuchika nc-rgakuchika">
            {gakuchika.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="nc-rcards">
            <div className="nc-rcard">
              <h3>実務経験</h3>
              <p>
                練習課題ではありません。企業がそのまま意思決定に使う成果物をつくります。市場規模の推定、競合分析、収益性分析、事業デューデリジェンス、提案資料の作成。
              </p>
            </div>
            <div className="nc-rcard">
              <h3>スキル</h3>
              <p>
                調べる、構造化する、示唆を出す、資料にする。この4つを、経験のあるコンサルタントの監修つきで繰り返します。知識ゼロから始められます。
              </p>
            </div>
            <div className="nc-rcard">
              <h3>報酬</h3>
              <p>{termsPendingNote}</p>
            </div>
          </div>

          <dl className="nc-deflist nc-rconditions">
            {conditions.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          <p className="nc-rnote">
            事業拡大の段階なので、希望と実力次第では、新規サービスの企画、営業戦略の設計と実行、新規顧客の開拓まで任せます。
          </p>
        </div>
      </section>

      {/* 3 実際の案件例 */}
      <section className="section section-alt" aria-labelledby="r-cases">
        <div className="wrap">
          <div className="shead">
            <h2 id="r-cases">実際に担当する案件</h2>
            <p>守秘義務のため企業名は出せません。何を調べて、何を出したかだけ載せています。</p>
          </div>

          <div className="nc-inds">
            {recruitIndustries.map((industry) => (
              <span className="nc-ind" key={industry}>
                {industry}
              </span>
            ))}
          </div>

          <ul className="nc-rcases">
            {works.map((work, index) => (
              <li key={work.slug}>
                <span className="nc-work-ind">{work.industry}</span>
                <h3>
                  <Link href={`/works/${work.slug}`}>{work.title}</Link>
                </h3>
                <p>{work.approach}</p>
              </li>
            ))}
          </ul>

          <Link href="/works" className="nc-more">
            <i aria-hidden="true" />
            支援実績をすべて見る
          </Link>
        </div>
      </section>

      {/* 4 役割とキャリアパス */}
      <section className="section" aria-labelledby="r-path">
        <div className="wrap">
          <div className="shead">
            <h2 id="r-path">アソシエイトから、リードへ。</h2>
            <p>
              入口はアソシエイト学生です。実務を重ねて、案件をまとめる側へ移ります。リードになると、自分のチームを持ちます。
            </p>
          </div>

          <ol className="nc-path">
            <li>
              <span className="nc-path-n">STEP 01</span>
              <h3>アソシエイト学生</h3>
              <p>調査・データ分析・資料作成の実務を担当。リード学生の指導のもとで進めます。</p>
              <span className="nc-tag">入口はここ</span>
            </li>
            <li>
              <span className="nc-path-n">STEP 02</span>
              <h3>リード学生へ昇格</h3>
              <p>
                案件のディレクション、チーム編成、進捗管理、企業との窓口。アソシエイトを最大5名程度まで管理します。
              </p>
              <span className="nc-tag">自分のチームを持つ</span>
            </li>
            <li>
              <span className="nc-path-n">STEP 03</span>
              <h3>新しいチームを組成</h3>
              <p>
                リードが増えると、対応できる案件が増えます。希望と実力次第では、新規サービスの企画や顧客開拓にも関われます。
              </p>
              <span className="nc-tag">事業をつくる側へ</span>
            </li>
          </ol>

          <p className="nc-rnote">
            どの段階でも、成果物は経験のあるコンサルタントが監修します。いきなり一人で抱えることはありません。
          </p>
        </div>
      </section>

      {/* 5 求める人物像 */}
      <section className="section section-alt" aria-labelledby="r-who">
        <div className="wrap">
          <div className="shead">
            <h2 id="r-who">見ているのは、4つだけ。</h2>
            <p>スキルも成績も問いません。学部・学科も関係ありません。</p>
          </div>

          <div className="nc-rcards nc-rcards-4">
            {idealCandidate.map((item, index) => (
              <div className="nc-rcard" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 メンバーインタビュー */}
      <section className="section" aria-labelledby="r-voice">
        <div className="wrap">
          <div className="shead">
            <h2 id="r-voice">メンバーインタビュー</h2>
          </div>
          <p className="nc-pending">
            準備中です。
            <br />
            <span>
              実装メモ: 要件定義書 14. の未解決事項（メンバーインタビューの実施可否）。
              12.1 により、社内メンバーの個人名は本人同意なしに掲載できない。
              取材と同意が取れ次第 <code>app/recruit/voice/page.tsx</code> に反映すること。
            </span>
          </p>
        </div>
      </section>

      {/* 7 選考フロー */}
      <section className="section section-alt" aria-labelledby="r-flow">
        <div className="wrap">
          <div className="shead">
            <h2 id="r-flow">選考フロー</h2>
            <p>4段階です。ケース課題は正解を当てる試験ではありません。</p>
          </div>

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

          <Link href="/recruit/flow" className="nc-more">
            <i aria-hidden="true" />
            選考フローの詳細へ
          </Link>
        </div>
      </section>

      {/* 8 募集職種一覧 */}
      <section className="section" aria-labelledby="r-jobs">
        <div className="wrap">
          <div className="shead">
            <h2 id="r-jobs">募集職種</h2>
          </div>

          <ul className="nc-joblist">
            {jobs.map((job, index) => (
              <li key={job.id}>
                <Link href={`/recruit/jobs/${job.id}`}>
                  <span className="nc-job-cat">{job.category}</span>
                  <span className="nc-job-title">{job.title}</span>
                  <span className="nc-job-lead">{job.lead}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/recruit/jobs" className="nc-more">
            <i aria-hidden="true" />
            求人票の一覧へ
          </Link>
        </div>
      </section>

      {/* 9 エントリーCTA */}
      <div className="nc-cta nc-rcta">
        <div className="wrap">
          <h2>迷っているなら、話を聞くところから。</h2>
          <p>
            志望動機はきれいにまとめなくて構いません。何をやりたいかが伝われば十分です。合わなければ断ってもらって大丈夫です。
          </p>
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
