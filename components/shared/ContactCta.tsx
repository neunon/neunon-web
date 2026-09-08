import Link from 'next/link';

/**
 * 下層ページ末尾の問い合わせCTA。
 * 要件定義書 6.3 の8番「問い合わせCTA」と、6.3.1 の
 * 「価格表の直後に必ず問い合わせCTAを置く」に対応する。
 */
export function ContactCta({
  title = 'まずは1社分から、試せます。',
  body = '「外注するほどではない」「社内では手が回らない」規模の調査から承ります。内容が固まっていない段階でのご相談も歓迎です。',
  secondary,
}: {
  title?: string;
  body?: string;
  secondary?: { label: string; href: string };
}) {
  return (
    <div className="nc-cta">
      <div className="wrap rise">
        <h2>{title}</h2>
        <p>{body}</p>
        <div className="nc-acts nc-cta-acts">
          <Link href="/contact" className="btn">
            お問い合わせ
          </Link>
          {secondary ? (
            <Link href={secondary.href} className="btn btn-ghost">
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
