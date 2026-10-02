/**
 * トップページ セクション2: 課題提起（要件定義書 6.1）
 * 「外注するほどでもない」「社内では手が回らない」業務がある、という
 * 顧客の状況を言語化する。
 */

import { getHomeProblem } from '@/lib/page-content';

export function Problem() {
  const content = getHomeProblem();
  if (!content.visible) return null;
  return (
    <section className="section nc-problem-section nc-home-wide" aria-labelledby="problem-heading">
      <div className="wrap">
        <div className="shead">
          <h2 id="problem-heading">{content.title}</h2>
          <p>{content.intro}</p>
        </div>
        <div className="nc-probs nc-potential-grid">
          {content.opportunities.map((problem, index) => (
            <div className="nc-prob" key={`${index}-${problem.title}`}>
              <div className="nc-prob-top"><span className="nc-prob-k">{String(index + 1).padStart(2, '0')}</span></div>
              <h3>{problem.title}</h3>
              <p>{problem.body.map((line) => <span key={line}>{line}</span>)}</p>
            </div>
          ))}
        </div>
        <div className="nc-growth-map" aria-label="4つの力から生まれる価値">
          <div className="nc-growth-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m5 9 7 7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="nc-growth-outcomes">
            <article className="nc-outcome nc-outcome-student">
              <div className="nc-outcome-visual" aria-hidden="true" />
              <div className="nc-outcome-copy">
                <h3>{content.studentTitle}</h3>
                <p>{content.studentBody}</p>
              </div>
            </article>
            <article className="nc-outcome nc-outcome-business">
              <div className="nc-outcome-visual" aria-hidden="true" />
              <div className="nc-outcome-copy">
                <h3>{content.businessTitle}</h3>
                <p>{content.businessBody}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
