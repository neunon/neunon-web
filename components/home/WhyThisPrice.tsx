import Link from 'next/link';
import { PriceFlow } from '@/components/shared/PriceFlow';
import { getService } from '@/lib/content';

/**
 * トップページ セクション: なぜこの価格でできるのか（要件定義書 6.3.1）
 *
 * 「この図解がサイト全体で最も重要な説得材料。トップページの提供価値セクションと
 *   合わせて、視覚的に完成度を高めること」との指示によりトップにも配置する。
 *
 * 表示ルール（6.3.1）: 見出しは「料金」ではなく「参考価格」、下限値のみ「〜」付き、
 * 上限は出さない、原価・粗利・工数単価は掲載しない、価格表の直後に問い合わせCTA。
 * 価格は content/services/02-package.json を唯一の出典とし、ここでは重複させない。
 */
export function WhyThisPrice() {
  const packageService = getService('package');
  // トップページには代表的な6件だけ出し、全9件は /services/package で見せる
  const pricing = packageService?.pricing.slice(0, 6) ?? [];

  return (
    <section className="section nc-why" aria-labelledby="price-heading">
      <div className="wrap">
        <div className="shead rise">
          <span className="snum">04&nbsp;&nbsp;WHY THIS PRICE</span>
          <h2 id="price-heading">なぜ、この価格で提供できるのか。</h2>
          <p>安いから品質を落としている、ということではありません。工程ごとに担い手を変えているだけです。</p>
        </div>

        <PriceFlow />

        {pricing.length > 0 ? (
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
            <p className="nc-pnote">{packageService?.pricingNote}</p>
            <div className="nc-pacts">
              <Link href="/contact" className="btn btn-light">
                見積りを相談する
              </Link>
              <Link href="/services/package" className="nc-more is-light">
                <i aria-hidden="true" />
                参考価格の全件とメニュー詳細
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
