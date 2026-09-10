import Link from 'next/link';

/**
 * トップページ セクション5: 実績サマリ（要件定義書 6.1）
 *
 * 要件定義書 12.1 により、取引先の実名・案件の具体的数値は出さない。
 * 業種表記と件数のみ。
 *
 * 【要確認】パッケージ型支援・AIプロダクトの累計件数は 14. で未解決。
 * デザイン案 v2 の「数百件 / 5件」を暫定値として置いている。
 */

const records = [
  {
    tag: 'Consulting',
    value: '約50',
    unit: '件',
    body: '1プロジェクトへの継続支援からスポット支援まで対応。営業データ分析、新規事業のPL・コスト試算、人事評価制度設計、収益性分析など。',
    confirmed: true,
  },
  {
    tag: 'Package',
    value: '数百',
    unit: '件',
    body: '企業・競合・市場分析等のレポートを低単価かつ大量に提供。新規営業対象企業のクローズアップ、M&A候補企業の個社分析など。',
    confirmed: false,
  },
  {
    tag: 'AI Products',
    value: '5',
    unit: '件',
    body: '自社業務での実運用を起点に、外部提供を見据えて開発・高度化を推進。営業メール自動化、企業クローズアップ生成AIなど。',
    confirmed: false,
  },
];

const industries = ['人材', '製造', '物流', '小売', 'メディア', 'インフラ', 'AI'];

export function TrackRecord() {
  return (
    <section className="section" aria-labelledby="record-heading">
      <div className="wrap">
        <div className="shead">
          <h2 id="record-heading">約2年間の累計</h2>
          <p>
            守秘義務のため企業名と具体的な数値は記載していません。業種と分析アプローチのみを公開しています。
          </p>
        </div>

        <div className="nc-recs">
          {records.map((record, index) => (
            <div className="nc-rec" key={record.tag}>
              <div className="nc-rec-t">{record.tag}</div>
              <p className="nc-rec-num">
                {record.value}
                <em>{record.unit}</em>
              </p>
              <p>{record.body}</p>
            </div>
          ))}
        </div>

        <div className="nc-inds">
          {industries.map((industry) => (
            <span className="nc-ind" key={industry}>
              {industry}
            </span>
          ))}
        </div>

        <div className="nc-recs-act">
          <Link href="/works" className="nc-more">
            <i aria-hidden="true" />
            支援実績を見る
          </Link>
        </div>
      </div>
    </section>
  );
}
