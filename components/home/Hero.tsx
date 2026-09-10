import Link from 'next/link';

/**
 * トップページ セクション1: ヒーロー（要件定義書 6.1）
 * キーメッセージ「企業の高度支援を、より安く・より速く・より広く届ける」＋
 * 企業向け／学生向けの2分岐CTA（要件定義書 3. の設計上の重要事項）
 */
export function Hero() {
  return (
    <div className="nc-hero">
      <div className="wrap">
        <span className="nc-eyebrow rise" data-d="0">
          Neunon Consulting
        </span>
        <h1 className="rise" data-d="1">
          企業の高度支援を、
          <br />
          より安く・より速く・<span className="nc-thin">より広く届ける。</span>
        </h1>
        <p className="nc-lead rise" data-d="2">
          調査・分析・資料作成といった工数集約的な工程を、経験あるコンサルタントの監修のもとで学生チームが担う。
          従来のコンサルティングでは見合わなかった規模の課題にも、実務水準の成果物を届けます。
        </p>
        <div className="nc-acts rise" data-d="3">
          <Link href="/services" className="btn">
            企業の方へ
          </Link>
          <Link href="/recruit" className="btn btn-ghost">
            学生の方へ
          </Link>
        </div>
        <div className="nc-hero-proof rise" data-d="3" aria-label="Neunon Consultingの特長">
          <div><span>01</span><strong>実務品質</strong><small>経験者が論点と成果物を監修</small></div>
          <div><span>02</span><strong>迅速対応</strong><small>学生チームによる機動的な実行</small></div>
          <div><span>03</span><strong>柔軟な体制</strong><small>課題に応じて最適なチームを編成</small></div>
        </div>
      </div>
    </div>
  );
}
