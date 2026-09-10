'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Work } from '@/lib/content';

/**
 * 実績一覧のカードグリッド（要件定義書 6.4）。
 * 「一覧はカードグリッド。業種でフィルタできること」に対応する。
 * フィルタ切替はユーザー操作への応答なのでモーションを付けてよい（9.3）。
 */
export function WorksGrid({ works, industries }: { works: Work[]; industries: string[] }) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active ? works.filter((work) => work.industry === active) : works),
    [works, active],
  );

  return (
    <>
      <div className="nc-filter" role="group" aria-label="業種で絞り込む">
        <span className="nc-filter-label">業種</span>
        <div className="nc-filter-set">
          <button
            type="button"
            className={`nc-fchip ${active === null ? 'is-on' : ''}`}
            aria-pressed={active === null}
            onClick={() => setActive(null)}
          >
            すべて
            <em>{works.length}</em>
          </button>
          {industries.map((industry) => {
            const count = works.filter((work) => work.industry === industry).length;
            return (
              <button
                type="button"
                key={industry}
                className={`nc-fchip ${active === industry ? 'is-on' : ''}`}
                aria-pressed={active === industry}
                onClick={() => setActive(active === industry ? null : industry)}
              >
                {industry}
                <em>{count}</em>
              </button>
            );
          })}
        </div>
      </div>

      <p className="nc-result-count" aria-live="polite">
        {filtered.length}件を表示
      </p>

      <div className="nc-workgrid">
        {filtered.map((work, index) => (
          <article className="nc-workcard" key={work.slug}>
            <div className="nc-workcard-meta">
              <span className="nc-work-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="nc-work-ind">{work.industry}</span>
            </div>
            <h2>
              <Link href={`/works/${work.slug}`}>{work.title}</Link>
            </h2>
            <p className="nc-work-ch">課題: {work.challenge}</p>
            <p className="nc-work-approach"><b>Approach</b>{work.approach}</p>
            <span className="nc-more" aria-hidden="true">
              <i />
              詳しく見る
            </span>
          </article>
        ))}
      </div>
    </>
  );
}
