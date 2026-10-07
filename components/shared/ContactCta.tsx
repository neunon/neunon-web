import { InteractiveHoverLink } from '@/components/ui/interactive-hover-button';
import home from '@/content/pages/home.json';

/**
 * 下層ページ末尾の問い合わせCTA。
 * 要件定義書 6.3 の8番「問い合わせCTA」と、6.3.1 の
 * 「価格表の直後に必ず問い合わせCTAを置く」に対応する。
 */
export function ContactCta({
  title = home.bottomCta.title,
  body = home.bottomCta.body,
  primary,
  secondary,
}: {
  title?: string;
  body?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <div className="nc-cta">
      <div className="wrap">
        <h2>{title}</h2>
        <p>{body}</p>
        <div className="nc-acts nc-cta-acts">
          <InteractiveHoverLink href={primary?.href ?? '/contact'} text={primary?.label ?? home.bottomCta.primaryLabel} className="is-light" />
          {secondary ? (
            <InteractiveHoverLink href={secondary.href} text={secondary.label} className="is-outline-light" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
