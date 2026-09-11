/**
 * トップページ セクション2: 課題提起（要件定義書 6.1）
 * 「外注するほどでもない」「社内では手が回らない」業務がある、という
 * 顧客の状況を言語化する。
 */

const opportunities = [
  {
    key: '01',
    icon: 'time',
    title: '未活用の時間',
    body: ['大学生の持て余した多くの時間'],
  },
  {
    key: '02',
    icon: 'ability',
    title: '高い能力',
    body: ['学習力・思考力・主体性', '責任感・好奇心'],
  },
  {
    key: '03',
    icon: 'execution',
    title: '新たな実行力',
    body: ['柔軟で迅速な人的リソース'],
  },
  {
    key: '04',
    icon: 'connection',
    title: '将来人材との接点',
    body: ['次世代人材との関係構築'],
  },
] as const;

function OpportunityIcon({ type }: { type: (typeof opportunities)[number]['icon'] }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.55, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  return (
    <svg className="nc-prob-icon" viewBox="0 0 48 48" aria-hidden="true">
      {type === 'time' ? <><circle cx="24" cy="25" r="14" {...common} /><path d="M24 16v9l6 4M19 8h10M24 8v3" {...common} /><circle cx="24" cy="25" r="1.75" className="nc-prob-icon-fill" /></> : null}
      {type === 'ability' ? <><path d="m24 9 13 9-13 21-13-21 13-9Z" {...common} /><path d="m11 18 13 6 13-6M24 24v15" {...common} /><path d="m18 14 6 10 6-10" {...common} /></> : null}
      {type === 'execution' ? <><path d="M9 37h9v-8h9v-8h9V10" {...common} /><path d="m31 15 5-5 5 5" {...common} /><path d="M9 41h32" className="nc-prob-icon-muted" {...common} /></> : null}
      {type === 'connection' ? <><path d="m15 16 9 8 10-10M15 32l9-8 10 10" {...common} /><circle cx="13" cy="14" r="4" {...common} /><circle cx="13" cy="34" r="4" {...common} /><circle cx="36" cy="12" r="4" {...common} /><circle cx="36" cy="36" r="4" {...common} /><circle cx="24" cy="24" r="2" className="nc-prob-icon-fill" /></> : null}
    </svg>
  );
}

export function Problem() {
  return (
    <section className="section" aria-labelledby="problem-heading">
      <div className="wrap">
        <div className="shead">
          <h2 id="problem-heading">まだ活かされていない、次世代の力。</h2>
          <p>
            大学生活には、企業の実務にまだ接続されていない時間が大量に存在しています。
            その中には、高い学習力・思考力・責任感を持ち、適切な育成と品質管理のもとで、実際の企業実務を担える学生も少なくありません。
            私たちは、その力を企業の現場につなぎます。学生にとっては、実務を通じて成長する機会に。
            企業にとっては、新たな実行力と、将来を担う人材との接点に。
          </p>
        </div>
        <div className="nc-probs nc-potential-grid">
          {opportunities.map((problem) => (
            <div className="nc-prob" key={problem.key}>
              <div className="nc-prob-top"><span className="nc-prob-k">{problem.key}</span><OpportunityIcon type={problem.icon} /></div>
              <h3>{problem.title}</h3>
              <p>{problem.body.map((line) => <span key={line}>{line}</span>)}</p>
            </div>
          ))}
        </div>
        <div className="nc-growth-map" aria-label="4つの力から生まれる価値">
          <div className="nc-growth-arrow" aria-hidden="true">
            <svg viewBox="0 0 96 58">
              <defs>
                <linearGradient id="matte-arrow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#3a3e42" />
                  <stop offset="1" stopColor="#222629" />
                </linearGradient>
              </defs>
              <path d="M7 8h82L48 52 7 8Z" fill="url(#matte-arrow)" />
            </svg>
          </div>
          <div className="nc-growth-outcomes">
            <article className="nc-outcome nc-outcome-student">
              <div className="nc-outcome-visual" aria-hidden="true" />
              <div className="nc-outcome-copy">
                <h3>学生の成長</h3>
                <p>実務経験を通じて、<span className="nc-outcome-nowrap">考え、発想し、判断する力を育てる</span></p>
              </div>
            </article>
            <article className="nc-outcome nc-outcome-business">
              <div className="nc-outcome-visual" aria-hidden="true" />
              <div className="nc-outcome-copy">
                <h3>企業の成長</h3>
                <p>新たな実行力によって、<span className="nc-outcome-nowrap">課題解決と成果創出を進める</span></p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
