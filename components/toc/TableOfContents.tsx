'use client';

import { useEffect, useId, useState } from 'react';

/**
 * 目次コンポーネント（要件定義書 5.3）
 *
 * - 対象ページ: /about, /services/*, /recruit/*
 * - デスクトップ: position: sticky で本文の横に固定
 * - モバイル: ページ上部に折りたたみ式
 * - 現在位置のハイライトは IntersectionObserver で行う
 * - クリック時は scrollIntoView({ behavior: 'instant' }) で即時ジャンプ。
 *   スクロールアニメーションは付けない（5.1 の発注者要望の中核）
 * - Tab / Enter で操作可能
 */

export type TocItem = {
  /** 見出し要素の id */
  id: string;
  label: string;
  /** 2 でインデントされた下位項目になる */
  level?: 1 | 2;
};

export function TableOfContents({
  items,
  title = '目次',
  className = '',
}: {
  items: TocItem[];
  title?: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0 || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // ヘッダー高さぶん上を除外して、画面上部にある見出しを現在位置とみなす
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  function jumpTo(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id);
    if (!target) return;

    // ブラウザ既定のジャンプを止め、アニメーションなしで移動させる
    event.preventDefault();
    target.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });

    // フォーカスも移し、キーボード利用者が続きを読めるようにする
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });

    history.replaceState(null, '', `#${id}`);
    setActiveId(id);
    setMobileOpen(false);
  }

  const list = (
    <ol className="nc-toc-list">
      {items.map((item) => (
        <li key={item.id} data-level={item.level ?? 1}>
          <a
            href={`#${item.id}`}
            onClick={(event) => jumpTo(event, item.id)}
            aria-current={activeId === item.id ? 'true' : undefined}
            className={activeId === item.id ? 'is-active' : undefined}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* モバイル: 折りたたみ */}
      <div className="nc-toc-mobile">
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls={panelId}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span>{title}</span>
          <svg width="11" height="7" viewBox="0 0 11 7" aria-hidden="true">
            <path
              d="M1 1l4.5 4.5L10 1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              className={mobileOpen ? 'is-open' : ''}
            />
          </svg>
        </button>
        <div id={panelId} hidden={!mobileOpen}>
          {list}
        </div>
      </div>

      {/* デスクトップ: sticky */}
      <nav className={`nc-toc ${className}`} aria-label={title}>
        <p className="nc-toc-title">{title}</p>
        {list}
      </nav>
    </>
  );
}
