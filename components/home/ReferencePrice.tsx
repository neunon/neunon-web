import Link from 'next/link';
import { getService } from '@/lib/content';

/** 組織体制によって品質と価格が両立する流れを、そのまま価格表へ接続する。 */
export function ReferencePrice() {
  const packageService = getService('package');
  const referencePricing = packageService?.pricing.slice(0, 6) ?? [];

  if (referencePricing.length === 0) return null;

  return (
    <div className="nc-structure-price-journey">
      <div className="nc-price-bridge">
        <span className="nc-price-arrow" aria-hidden="true" />
        <div className="nc-price-bridge-copy">
          <span>Structure to value</span>
          <p>
            <strong>高品質を維持しながら合理的な低価格を実現できる</strong>
          </p>
        </div>
      </div>

      <aside className="nc-reference-price" aria-labelledby="reference-price-heading">
        <div className="nc-reference-price-intro">
          <span>Reference price</span>
          <h3 id="reference-price-heading">参考価格</h3>
          <p>
            定型化した調査メニューは、1件・1案件からご依頼いただけます。
            必要な範囲だけを選び、まず小さく試すことも可能です。
          </p>
          <Link href="/contact" className="nc-reference-price-link">
            見積りを相談する
            <i aria-hidden="true" />
          </Link>
        </div>
        <dl className="nc-reference-price-list">
          {referencePricing.map((row, index) => (
            <div key={row.label}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <dt>{row.label}</dt>
              <dd>{row.price}</dd>
            </div>
          ))}
        </dl>
        <p className="nc-reference-price-note">{packageService?.pricingNote}</p>
      </aside>
    </div>
  );
}
