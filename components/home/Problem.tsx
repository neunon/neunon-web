/**
 * トップページ セクション2: 課題提起（要件定義書 6.1）
 * 「外注するほどでもない」「社内では手が回らない」業務がある、という
 * 顧客の状況を言語化する。
 */

const problems = [
  {
    key: 'SEARCH',
    title: '情報が分散している',
    body: 'HP、IR、ニュース、商品情報、SNS、採用情報。媒体をまたぎ、企業ごとに開示の粒度も違うため、集めるだけで工数がかかります。',
  },
  {
    key: 'STRUCTURE',
    title: '横断的にまとめる必要がある',
    body: '業界・市場、業績、商品、顧客、組織、戦略。それぞれを並べ直して初めて、企業の全体像が立ち上がります。',
  },
  {
    key: 'INTERPRET',
    title: '事実から示唆を出す必要がある',
    body: '集めた事実は、そのままでは判断材料になりません。特徴・競争力・成長性・課題として評価する工程が要ります。',
  },
];

export function Problem() {
  return (
    <section className="section" aria-labelledby="problem-heading">
      <div className="wrap">
        <div className="shead rise">
          <span className="snum">01&nbsp;&nbsp;THE PROBLEM</span>
          <h2 id="problem-heading">調べる時間が、判断する時間を圧迫している。</h2>
          <p>
            企業を理解するための公開情報は十分に存在します。問題は、それを扱う工数のほうにあります。
            「外注するほどではない」「社内では手が回らない」——
            そう判断されたまま止まっている調査が、どの会社にもあります。
          </p>
        </div>
        <div className="nc-probs">
          {problems.map((problem, index) => (
            <div className="nc-prob rise" data-d={index + 1} key={problem.key}>
              <span className="nc-prob-k">{problem.key}</span>
              <h3>{problem.title}</h3>
              <p>{problem.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
