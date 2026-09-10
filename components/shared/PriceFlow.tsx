/**
 * 「なぜこの価格でできるのか」の工程図。
 *
 * 要件定義書 6.3.1:「この図解がサイト全体で最も重要な説得材料」。
 * トップページと /services/package の両方に置くため共有コンポーネントにしている。
 * 文章の要旨は既存資料の論旨をそのまま使うよう指示されている箇所。
 */

const stages = ['調査', '分析', '資料作成'];

export function PriceFlow() {
  return (
    <>
      <div className="nc-flowrow">
        <div className="nc-flowlabel">Conventional&nbsp;／&nbsp;従来のコンサルティング案件</div>
        <div className="nc-flow flow">
          {stages.map((stage) => (
            <div className="nc-cell" key={stage}>
              {stage}
            </div>
          ))}
          <div className="nc-cell is-hi">考察・示唆</div>
        </div>
        <div className="nc-flowcap">
          <span>工数集約的で再現性が高い工程にも、同じ単価がかかっている</span>
          <span>高付加価値</span>
        </div>
      </div>

      <div className="nc-flowrow">
        <div className="nc-flowlabel">Neunon&nbsp;／&nbsp;当社の提供体制</div>
        <div className="nc-flow flow">
          {stages.map((stage) => (
            <div className="nc-cell is-stu" key={stage}>
              {stage}
              <small>学生チーム</small>
            </div>
          ))}
          <div className="nc-cell is-hi">
            考察・示唆<small>経験者が監修</small>
          </div>
        </div>
        <div className="nc-flowcap">
          <span>低コスト化した領域</span>
          <span>品質を担保する領域</span>
        </div>
      </div>

      <p className="nc-whynote">
        戦略コンサルティングでは、本来高い付加価値が発揮されるべき考察・示唆の工程に加え、調査・分析・資料作成といった工数集約的な業務も一体として提供されることが多く、
        <b>必ずしも高付加価値を必要としない工程にも相応のコストが発生しています。</b>
        当社では、一定のスキル水準が担保された学生がこれらの工程を担い、経験のあるコンサルタントが監修することで、低コストかつ十分な品質での提供を可能にしています。
      </p>
    </>
  );
}
