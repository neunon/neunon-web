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
    tag: '累計業務支援件数',
    value: '約50',
    unit: '件',
    body: '1プロジェクトへの継続支援からスポット支援まで対応。営業データ分析、新規事業のPL・コスト試算、人事評価制度設計、収益性分析など。',
    confirmed: true,
  },
  {
    tag: '累計レポート作成件数',
    value: '数百',
    unit: '件',
    body: '企業・競合・市場分析等のレポートを低単価かつ大量に提供。新規営業対象企業のクローズアップ、M&A候補企業の個社分析など。',
    confirmed: false,
  },
  {
    tag: 'プロダクト開発・運用数',
    value: '5',
    unit: '件',
    body: '自社業務での実運用を起点に、外部提供を見据えて開発・高度化を推進。営業メール自動化、企業クローズアップ生成AIなど。',
    confirmed: false,
  },
];

const industries = ['人材', '製造', '物流', '小売', 'メディア', 'SNS', '建設・インフラ', 'AI', '教育'];

export function TrackRecord() {
  return (
    <aside className="nc-service-evidence" aria-labelledby="record-heading">
      <div className="nc-evidence-main">
        <div className="nc-evidence-head">
          <span>Proven delivery</span>
          <div>
            <h3 id="record-heading">積み重ねてきた<br />支援実績</h3>
            <p>提供形態を横断して蓄積してきた、Neunon Consultingの実績です。</p>
          </div>
        </div>
        <div className="nc-recs">
          {records.map((record) => (
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
      </div>

      <div className="nc-evidence-foot">
        <div className="nc-industry-panel">
          <div className="nc-industry-copy">
            <span>Industries</span>
            <h4>業界</h4>
            <p>業界固有の前提を捉えながら、幅広い領域の実務を支援しています。</p>
          </div>
          <div className="nc-inds" aria-label="支援業界">
            {industries.map((industry) => <span className="nc-ind" key={industry}>{industry}</span>)}
          </div>
        </div>

        <Link href="/works" className="nc-more">
          <i aria-hidden="true" />支援実績を見る
        </Link>
      </div>
    </aside>
  );
}
