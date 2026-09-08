import Link from 'next/link';
import { site } from '@/lib/site';

export type Crumb = { label: string; href?: string };

/**
 * パンくずの構造化データ（要件定義書 10.2）。
 * 画面に出しているパンくずと同じ内容を BreadcrumbList として出力する。
 */
function breadcrumbJsonLd(crumbs: Crumb[]) {
  const items = [{ label: 'ホーム', href: '/' }, ...crumbs];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      // 最後の項目は現在地なので item を付けない
      ...(crumb.href && index < items.length - 1 ? { item: `${site.url}${crumb.href}` } : {}),
    })),
  };
}

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
              dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }}
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
