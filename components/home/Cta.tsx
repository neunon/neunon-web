import { InteractiveHoverLink } from '@/components/ui/interactive-hover-button';

/**
 * トップページ セクション9: CTA（要件定義書 6.1）
 * 問い合わせフォームへの最終導線。
 */
export function Cta() {
  return (
    <div className="nc-cta nc-home-wide">
      <div className="wrap">
        <h2>まずは小さく、試せます。</h2>
        <p>
          「外注するほどではない」「社内では手が回らない」規模の調査から承ります。
          内容が固まっていない段階でのご相談も歓迎です。
        </p>
        <div className="nc-acts nc-cta-acts">
          <InteractiveHoverLink href="/contact" text="お問い合わせ" className="is-light" />
          <InteractiveHoverLink href="/works" text="支援実績を見る" className="is-outline-light" />
        </div>
      </div>
    </div>
  );
}
