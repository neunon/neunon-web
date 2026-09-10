import Link from 'next/link';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';

export type Crumb = { label: string; href?: string };

export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs = [],
}: {
  /** 業種や区分など、情報を持つ場合だけ渡す。装飾目的の英字ラベルは置かない */
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
}) {
  return (
    <div className="nc-phero">
      <div className="wrap">
        {crumbs.length > 0 ? (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={jsonLd(breadcrumbSchema(crumbs))}
            />
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
          </>
        ) : null}
        {eyebrow ? <span className="nc-eyebrow">{eyebrow}</span> : null}
        <h1 className="nc-ptitle">
          {title}
        </h1>
        {lead ? (
          <p className="nc-lead">
            {lead}
          </p>
        ) : null}
      </div>
    </div>
  );
}
