import type { CSSProperties } from 'react';
import type { AnonymousWork } from '@/lib/anonymous-works';

/** Three horizontal, independently rotating rings. The middle ring runs backwards. */
export function WorksGrid({ works }: { works: AnonymousWork[] }) {
  const rows = Array.from({ length: 3 }, (_, rowIndex) =>
    works.filter((_, index) => index % 3 === rowIndex),
  );
  const faceCount = Math.max(...rows.map((row) => row.length));

  return (
    <div className="nc-works-marquee nc-works-orbit" aria-label="匿名化した支援実績一覧">
      <div className="nc-works-rows">
        {rows.map((row, rowIndex) => (
          <div className={`nc-works-row is-row-${rowIndex + 1}`} key={rowIndex}>
            <div className="nc-works-ring">
              {Array.from({ length: faceCount }, (_, index) => {
                const work = row[index % row.length];
                const duplicate = index >= row.length;
                return (
                  <article
                    className="nc-work-orbit-card"
                    key={`${work.industry}-${work.title}-${index}`}
                    aria-hidden={duplicate || undefined}
                    style={{ '--nc-angle': `${(index * 360) / faceCount}deg` } as CSSProperties}
                  >
                    <div className="nc-work-orbit-face is-front">
                      <span>{work.industry}</span>
                      <h2>{work.title}</h2>
                    </div>
                    <div className="nc-work-orbit-face is-back" aria-hidden="true">
                      <span>{work.industry}</span>
                      <p>{work.title}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="nc-works-disclaimer">守秘義務に配慮し、公開可能な範囲で業界と支援テーマのみを掲載しています。</p>
    </div>
  );
}
