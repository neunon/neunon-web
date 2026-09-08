import Link from 'next/link';

/**
 * トップページ セクション7: 学生の方へ（要件定義書 6.1）
 * 採用サイトへの導線ブロック。デザイン案 v2 の 06 CAREERS をそのまま踏襲。
 */

const gakuchika = [
  '実際の企業案件を担当して、成果を出した。',
  '自分で案件を獲得した。',
  '新しいサービスや事業を立ち上げた。',
];

export function Careers() {
  return (
    <section className="section" aria-labelledby="careers-heading">
      <div className="wrap nc-stu-sec">
        <div className="nc-stu-copy">
          <h2 id="careers-heading">
            時間だけは、ある。
            <br />
            <span className="nc-sub">使い道が、まだない。</span>
          </h2>
          <p>
            練習課題ではなく、企業がそのまま意思決定に使う成果物をつくります。
            経験のあるコンサルタントが監修するので、知識ゼロから始められます。
            フルリモート、時間帯は自由。学部・学科は問いません。
          </p>
          <div className="nc-acts nc-stu-acts">
            <Link href="/recruit" className="btn">
              採用情報を見る
            </Link>
            <Link href="/entry" className="btn btn-ghost">
              エントリー
            </Link>
          </div>
        </div>

        <div>
          <p className="nc-glabel">ガクチカ、こう言えるようになります</p>
          <ul className="nc-gakuchika">
            {gakuchika.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
