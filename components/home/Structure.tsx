/**
 * トップページ セクション3: 提供価値（要件定義書 6.1）
 *
 * 「セクション3の図解が本サイトの核心」と明記されている箇所。
 * プロフェッショナル → リード学生 → アソシエイト学生 の階層と、
 * アソシエイト → リードへの昇格による循環を、装飾ではなく情報として図示する。
 * 「リード学生1名につき最大5名程度」は事業拡大構想.docx の初期設計値。
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

export function Structure() {
  return (
    <section className="section section-alt" aria-labelledby="structure-heading">
      <div className="wrap">
        <div className="shead rise">
          <span className="snum">02&nbsp;&nbsp;OUR STRUCTURE</span>
          <h2 id="structure-heading">実行は学生チーム、品質は経験者が担保する。</h2>
          <p>
            役割を分けることで、品質を落とさずにコストを下げています。この構造そのものが当社の提供価値です。
          </p>
        </div>

        <div className="nc-struct">
          {layers.map((layer, index) => (
            <div className="nc-layer rise layer" data-d={index} key={layer.role}>
              <div className="nc-layer-b">{layer.role}</div>
              <div className="nc-layer-c">
                <h3>{layer.title}</h3>
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
          <p className="nc-loopnote rise">
            アソシエイト学生がリード学生へ昇格し、新しいチームを組成する。
            この循環によって、対応できる案件量が拡大していきます。
          </p>
        </div>
      </div>
    </section>
  );
}
