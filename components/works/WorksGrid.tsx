import type { AnonymousWork } from '@/lib/anonymous-works';

/**
 * 匿名化した公開実績を2段で周回させる。
 * ホバーまたはフォーカス中は停止し、各パネルは業界とタイトルだけを表示する。
 */
export function WorksGrid({ works }: { works: AnonymousWork[] }) {
  const desktopColumns = Array.from({ length: 3 }, (_, columnIndex) =>
    works.filter((_, index) => index % 3 === columnIndex),
  );
  const mobileColumns = Array.from({ length: 2 }, (_, columnIndex) =>
    works.filter((_, index) => index % 2 === columnIndex),
  );

  const renderColumns = (columns: AnonymousWork[][], mode: 'desktop' | 'mobile') => (
    <div className={`nc-works-columns is-${mode}`}>
      {columns.map((column, columnIndex) => (
        <div className={`nc-works-column is-column-${columnIndex + 1}`} key={columnIndex}>
          <div className="nc-works-track">
            {[false, true].map((duplicate) => (
              <div className="nc-works-group" aria-hidden={duplicate || undefined} key={String(duplicate)}>
                {column.map((work, index) => (
                  <article className="nc-work-tile" tabIndex={duplicate ? -1 : 0} key={`${work.industry}-${work.title}-${index}`}>
                    <span>{work.industry}</span>
                    <h2>{work.title}</h2>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="nc-works-marquee" aria-label="匿名化した支援実績一覧">
      {renderColumns(desktopColumns, 'desktop')}
      {renderColumns(mobileColumns, 'mobile')}
      <p className="nc-works-disclaimer">守秘義務に配慮し、公開可能な範囲で業界と支援テーマのみを掲載しています。</p>
    </div>
  );
}
