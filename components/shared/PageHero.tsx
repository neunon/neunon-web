import { site } from '@/lib/site';

export type Crumb = { label: string; href?: string };

/**
 * パンくずの構造化データ（要件定義書 10.2）。
 * 画面上のパンくずは省き、階層情報だけを検索エンジンに伝える。
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

/** 専用ヒーローでも表示上のパンくずを増やさずに階層情報を保つ。 */
export function PageBreadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }}
    />
  );
}

/**
 * 下層ページ共通のページ見出し。
 * トップのヒーローより控えめな余白で階層ページの見出しを示す。
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
        <PageBreadcrumbs crumbs={crumbs} />
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
