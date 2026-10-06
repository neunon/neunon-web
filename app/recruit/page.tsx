import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { SelectionTimeline } from '@/components/recruit/SelectionTimeline';
import {
  conditions,
  gakuchika,
  idealCandidate,
  recruitHero,
  termsPendingNote,
} from '@/lib/recruit';

export const metadata: Metadata = pageMetadata('recruit', '/recruit/');

/**
 * 採用トップ（要件定義書 6.6）。
 *
 * 読者は学生なので、コーポレート側とトーンを変える。
 * コピーは社内ポスター案由来のものを確定扱いで使用（短文・断定・余白）。
 * 学歴要件はサイトに出さない（6.6 の「重要」）。
 *
 * セクション順は 6.6 の指定どおり:
 *   ヒーロー / できること / キャリアパス / 求める人物像 / 選考フロー / CTA
 */
export default function RecruitPage() {
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
            <Link href="/recruit/flow" className="btn btn-ghost">
              選考フローを見る
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

          <p className="nc-glabel">実務を通じて、こんな経験を積めます</p>
          <ul className="nc-gakuchika nc-rgakuchika">
            {gakuchika.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="nc-rcards nc-recruit-value-grid">
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
          </div>

          <p className="nc-recruit-terms-note"><strong>契約・報酬について</strong>{termsPendingNote}</p>

          <dl className="nc-deflist nc-rconditions">
            {conditions.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="nc-rvision">
            <span>挑戦できる領域は、決め切っていません</span>
            <p>
              私たちが目指すのは、コンサルティングだけをする学生組織ではありません。大学生のありあまる時間と、埋もれている意欲・能力を、企業支援に活かすことが出発点です。
              筋がよく、よく考えられた提案なら、新規サービスの立ち上げや営業、Webサイト制作など、既存の枠にない支援にも自ら挑戦できます。
            </p>
          </div>
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
              <span className="nc-path-n">Step 01</span>
              <h3>アソシエイト学生</h3>
              <p>調査・データ分析・資料作成の実務を担当。リード学生の指導のもとで進めます。</p>
              <span className="nc-tag">入口はここ</span>
            </li>
            <li>
              <span className="nc-path-n">Step 02</span>
              <h3>リード学生へ昇格</h3>
              <p>
                案件実務を担いながら、ディレクション、チーム編成、進捗管理、企業との窓口を担当します。
              </p>
              <span className="nc-tag">自分のチームを持つ</span>
            </li>
            <li>
              <span className="nc-path-n">Step 03</span>
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
            {idealCandidate.map((item) => (
              <div className="nc-rcard" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 選考フロー */}
      <section className="section section-alt" aria-labelledby="r-flow">
        <div className="wrap">
          <div className="shead">
            <h2 id="r-flow">選考フロー</h2>
            <p>選考からオンボーディング、稼働開始まで7つのステップで進めます。</p>
          </div>

          <SelectionTimeline />

          <Link href="/recruit/flow" className="nc-more">
            <i aria-hidden="true" />
            選考フローの詳細へ
          </Link>
        </div>
      </section>

      {/* エントリーCTA */}
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
            <Link href="/recruit/flow" className="btn btn-ghost">
              選考フローを見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
