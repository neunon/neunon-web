import Link from 'next/link';

export type Crumb = { label: string; href?: string };

/**
 * 下層ページ共通のページ見出し。
 * トップのヒーローより控えめな余白にし、パンくずで階層を示す。
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs = [],
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
}) {
  return (
    <div className="nc-phero">
      <div className="wrap">
        {crumbs.length > 0 ? (
          <nav className="nc-crumbs" aria-label="パンくずリスト">
            <ol>
              <li>
                <Link href="/">ホーム</Link>
              </li>
              {crumbs.map((crumb) => (
                <li key={crumb.label}>
                  {crumb.href ? (
                    <Link href={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span aria-current="page">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <span className="nc-eyebrow rise" data-d="0">
          {eyebrow}
        </span>
        <h1 className="nc-ptitle rise" data-d="1">
          {title}
        </h1>
        {lead ? (
          <p className="nc-lead rise" data-d="2">
            {lead}
          </p>
        ) : null}
      </div>
    </div>
  );
}
