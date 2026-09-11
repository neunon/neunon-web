/**
 * トップページ セクション6: 導入の流れ（要件定義書 6.1）
 * 「問い合わせ〜納品までのステップ」
 *
 * デザイン案 v2 にはこのセクションが存在しないため、
 * 02 OUR STRUCTURE の階層図と同じ罫線ベースの型で新規に作成している。
 *
 * 【要確認】各ステップの所要日数は要件定義書に記載がないため暫定値。
 * 実際のリードタイムを発注者に確認すること。
 */

const steps = [
  {
    no: 'Step 01',
    title: 'お問い合わせ',
    body: '内容が固まっていない段階のご相談で構いません。「何を調べるべきか」から一緒に整理します。',
    span: '当日〜翌営業日に返信',
  },
  {
    no: 'Step 02',
    title: 'ヒアリング・論点整理',
    body: '判断したいことは何か、そのために何が分かればよいかを詰め、調査範囲と出力形式を決めます。',
    span: '30〜60分の打ち合わせ1回',
  },
  {
    no: 'Step 03',
    title: 'お見積り・ご契約',
    body: '対象企業数、調査範囲、納期に基づいてお見積りを提示します。範囲の調整もこの段階で行います。',
    span: '2〜3営業日',
  },
  {
    no: 'Step 04',
    title: 'プロジェクト遂行',
    body: '学生チームがプロジェクトを遂行し、経験のあるコンサルタントが設計と成果物の品質を監修します。',
    span: '案件規模により変動',
  },
  {
    no: 'Step 05',
    title: '納品・報告',
    body: '資料の納品に加え、要点と示唆をご説明します。継続的な観測が必要な場合は定期提供に移行できます。',
    span: '納品後のご質問にも対応',
  },
];

export function Process() {
  return (
    <section className="section section-alt" aria-labelledby="process-heading">
      <div className="wrap">
        <div className="shead">
          <h2 id="process-heading">お問い合わせから納品まで</h2>
          <p>スポット業務や小さなご相談からお受けします。まず何を調べるべきかが決まっていない段階でも構いません。</p>
        </div>

        <ol className="nc-steps">
          {steps.map((step, index) => (
            <li className="nc-step" key={step.no}>
              <div className="nc-step-n">{step.no}</div>
              <div className="nc-step-c">
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <span className="nc-step-meta">{step.span}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
