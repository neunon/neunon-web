import Link from 'next/link';

/**
 * トップページ セクション: なぜこの価格でできるのか（要件定義書 6.3.1）
 *
 * 「この図解がサイト全体で最も重要な説得材料。トップページの提供価値セクションと
 *   合わせて、視覚的に完成度を高めること」との指示によりトップにも配置する。
 *
 * 掲載する参考価格は 6.3.1 の表のうちトップ用に集約したもの。
 * 表示ルール: 見出しは「料金」ではなく「参考価格」、下限値のみ「〜」付き、
 * 上限は出さない、原価・粗利・工数単価は掲載しない、直後に問い合わせCTA。
 */

const conventional = ['調査', '分析', '資料作成'];

const pricing = [
  { label: '営業先企業クローズアップ（1社）', price: '5万円〜' },
  { label: '競合企業クローズアップ（1社）', price: '5万円〜' },
  { label: '競合比較・競争環境マップ', price: '30万円〜' },
  { label: '競合新商品・最新戦略観測', price: '10万円〜 / 月' },
  { label: '競合定期レビュー', price: '30万円〜 / 四半期' },
  { label: '休眠・失注顧客再攻略クローズアップ', price: '20万円〜' },
];

export function WhyThisPrice() {
  return (
    <section className="section nc-why" aria-labelledby="price-heading">
      <div className="wrap">
        <div className="shead rise">
          <span className="snum">04&nbsp;&nbsp;WHY THIS PRICE</span>
          <h2 id="price-heading">なぜ、この価格で提供できるのか。</h2>
          <p>安いから品質を落としている、ということではありません。工程ごとに担い手を変えているだけです。</p>
        </div>

        <div className="nc-flowrow">
          <div className="nc-flowlabel">CONVENTIONAL&nbsp;／&nbsp;従来のコンサルティング案件</div>
          <div className="nc-flow flow">
            {conventional.map((cell) => (
              <div className="nc-cell" key={cell}>
                {cell}
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
          <div className="nc-flowlabel">NEUNON&nbsp;／&nbsp;当社の提供体制</div>
          <div className="nc-flow flow">
            {conventional.map((cell) => (
              <div className="nc-cell is-stu" key={cell}>
                {cell}
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

        <p className="nc-whynote rise">
          戦略コンサルティングでは、本来高い付加価値が発揮されるべき考察・示唆の工程に加え、調査・分析・資料作成といった工数集約的な業務も一体として提供されることが多く、
          <b>必ずしも高付加価値を必要としない工程にも相応のコストが発生しています。</b>
          当社では、一定のスキル水準が担保された学生がこれらの工程を担い、経験のあるコンサルタントが監修することで、低コストかつ十分な品質での提供を可能にしています。
        </p>

        <div className="nc-ptable rise">
          <h3 className="nc-ptable-head">参考価格</h3>
          <dl>
            {pricing.map((row) => (
              <div className="nc-prow" key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.price}</dd>
              </div>
            ))}
          </dl>
          <p className="nc-pnote">
            参考価格です。対象企業数、調査範囲、納期によって変動します。正確なお見積りはお問い合わせください。
          </p>
          <div className="nc-pacts">
            <Link href="/contact" className="btn btn-light">
              見積りを相談する
            </Link>
            <Link href="/services/package" className="nc-more is-light">
              <i aria-hidden="true" />
              パッケージ型支援の詳細
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
