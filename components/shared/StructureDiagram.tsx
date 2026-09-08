/**
 * 学生ネットワークの階層構造の図解。
 *
 * 要件定義書 6.1 で「本サイトの核心」とされている図。
 * トップページの提供価値セクションと、会社概要の組織体制セクション（6.2）で
 * 同じものを再掲するため共有コンポーネントにしている。
 *
 * 「リード学生1名につき最大5名程度のアソシエイト学生を管理」は
 * 事業拡大構想.docx に明記された初期設計値。
 */

const layers = [
  {
    role: 'SUPERVISION',
    title: 'プロフェッショナルコンサルタント',
    body: '成果物の監修、論点への助言、品質管理、そして学生の育成。',
    chips: ['監修', '助言', '品質管理', '育成'],
  },
  {
    role: 'DIRECTION',
    title: 'リード学生',
    body: '案件のディレクション、チーム編成、進捗管理、企業との窓口。アソシエイト学生を最大5名程度まで管理する。',
    chips: ['管理', 'ディレクション', '育成'],
  },
  {
    role: 'EXECUTION',
    title: 'アソシエイト学生',
    body: '調査、データ分析、資料作成の実務を遂行。リード学生の指導下で経験を積む。',
    chips: ['調査', '分析', '資料作成'],
    promote: '昇格 → リード学生',
  },
];

export function StructureDiagram({ headingLevel = 3 }: { headingLevel?: 3 | 4 }) {
  const Heading = headingLevel === 4 ? 'h4' : 'h3';

  return (
    <div className="nc-struct">
      {layers.map((layer, index) => (
        <div className="nc-layer layer" key={layer.role}>
          <div className="nc-layer-b">{layer.role}</div>
          <div className="nc-layer-c">
            <Heading>{layer.title}</Heading>
            <p>{layer.body}</p>
            <div className="nc-chips">
              {layer.chips.map((chip) => (
                <span className="nc-chip" key={chip}>
                  {chip}
                </span>
              ))}
              {layer.promote ? <span className="nc-chip is-on">{layer.promote}</span> : null}
            </div>
          </div>
        </div>
      ))}
      <p className="nc-loopnote">
        アソシエイト学生がリード学生へ昇格し、新しいチームを組成する。
        この循環によって、対応できる案件量が拡大していきます。
      </p>
    </div>
  );
}
