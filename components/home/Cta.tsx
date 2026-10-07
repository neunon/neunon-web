import { InteractiveHoverLink } from '@/components/ui/interactive-hover-button';
import home from '@/content/pages/home.json';

/**
 * トップページ セクション9: CTA（要件定義書 6.1）
 * 問い合わせフォームへの最終導線。
 */
export function Cta() {
  return (
    <div className="nc-cta nc-home-wide">
      <div className="wrap">
        <h2>{home.bottomCta.title}</h2>
        <p>{home.bottomCta.body}</p>
        <div className="nc-acts nc-cta-acts">
          <InteractiveHoverLink href="/contact" text={home.bottomCta.primaryLabel} className="is-light" />
          <InteractiveHoverLink href="/works" text={home.bottomCta.secondaryLabel} className="is-outline-light" />
        </div>
      </div>
    </div>
  );
}
