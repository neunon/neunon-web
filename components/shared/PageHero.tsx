import Link from 'next/link';
import { breadcrumbNode, jsonLd, type Crumb } from '@/lib/schema';

export type { Crumb };

/**
 * 下層ページ共通のページ見出し。
 * トップのヒーローより控えめな余白にし、パンくずで階層を示す。
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs = [],
  schemaCrumbs,
}: {
  /** 業種や区分など、情報を持つ場合だけ渡す。装飾目的の英字ラベルは置かない */
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  /**
   * 構造化データ（BreadcrumbList）だけ画面と違う並びにしたい場合に渡す。
   * 例: お知らせ詳細は画面ではカテゴリを出すが、構造化データの現在地は記事名にする。
   */
  schemaCrumbs?: Crumb[];
}) {
  return (
    <div className="nc-phero">
      <div className="wrap">
        {crumbs.length > 0 ? (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={jsonLd(breadcrumbNode(schemaCrumbs ?? crumbs))}
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
