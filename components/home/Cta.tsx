import Link from 'next/link';

/**
 * トップページ セクション9: CTA（要件定義書 6.1）
 * 問い合わせフォームへの最終導線。
 */
export function Cta() {
  return (
    <div className="nc-cta">
      <div className="wrap rise">
        <h2>まずは1社分から、試せます。</h2>
        <p>
          「外注するほどではない」「社内では手が回らない」規模の調査から承ります。
          内容が固まっていない段階でのご相談も歓迎です。
        </p>
        <div className="nc-acts nc-cta-acts">
          <Link href="/contact" className="btn">
            お問い合わせ
          </Link>
          <Link href="/works" className="btn btn-ghost">
            支援実績を見る
          </Link>
        </div>
      </div>
    </div>
  );
}
