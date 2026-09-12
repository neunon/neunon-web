import Link from 'next/link';

/**
 * トップページの提供形態に付随する支援業界一覧。
 *
 * 要件定義書 12.1 により、取引先の実名・案件の具体的数値は出さない。
 * 実績件数に続く独立した帯として、支援業界を横断表示する。
 */

const industries = ['人材', '製造', '物流', '小売', '食品・卸売', 'メディア', 'SNS', '建設・インフラ', 'AI', '教育'];

export function TrackRecord() {
  return (
    <aside className="nc-service-evidence" aria-labelledby="industry-heading">
      <div className="nc-evidence-foot">
        <div className="nc-industry-copy">
          <span>Industry</span>
          <h4 id="industry-heading">業界</h4>
          <p>業界固有の前提を捉えながら、幅広い領域の実務を支援しています。</p>
          <Link href="/works" className="nc-industry-link">
            支援実績を見る
            <i aria-hidden="true" />
          </Link>
        </div>

        <div className="nc-inds" aria-label="支援業界">
          {industries.map((industry) => <span className="nc-ind" key={industry}>{industry}</span>)}
        </div>
        <span className="nc-industry-word" aria-hidden="true">Industry</span>
      </div>
    </aside>
  );
}
