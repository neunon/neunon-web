'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { IMG, pages } from './data';
import s from './lp.module.css';

/**
 * 納品レポートの閲覧部品。5ページをタブで切り替え、実寸に近い大きさで見せる。
 * 画面幅が足りない端末向けに、2400px の原寸を開いて読める「拡大」を用意している。
 * 各ページの「わかること」は HTML のテキストとしても出しており、画像だけに頼らない。
 */
export function ReportViewer() {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const page = pages[active];

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (zoom && !d.open) d.showModal();
    if (!zoom && d.open) d.close();
  }, [zoom]);

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (active + (e.key === 'ArrowRight' ? 1 : pages.length - 1)) % pages.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className={s.viewer}>
      <div className={s.viewerTabs} role="tablist" aria-label="サンプルレポートのページ" onKeyDown={onKey}>
        {pages.map((p, i) => (
          <button
            key={p.no}
            ref={(el) => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            id={`report-tab-${p.no}`}
            aria-selected={i === active}
            aria-controls="report-panel"
            tabIndex={i === active ? 0 : -1}
            className={s.viewerTab}
            onClick={() => setActive(i)}
          >
            <span className={s.viewerTabNo}>{String(p.no).padStart(2, '0')}</span>
            <span>{p.title}</span>
          </button>
        ))}
      </div>

      <div className={s.viewerBody} role="tabpanel" id="report-panel" aria-labelledby={`report-tab-${page.no}`}>
        <figure className={s.viewerStage}>
          <button type="button" className={s.viewerPage} onClick={() => setZoom(true)} aria-label={`${page.title}のページを拡大して読む`}>
            <img
              src={`${IMG}/page-${page.no}-1440.webp`}
              srcSet={`${IMG}/page-${page.no}-720.webp 720w, ${IMG}/page-${page.no}-1440.webp 1440w, ${IMG}/page-${page.no}-2400.webp 2400w`}
              sizes="(min-width: 1280px) 1150px, 100vw"
              width={1440}
              height={997}
              alt={page.alt}
              loading="lazy"
              decoding="async"
            />
          </button>
          <figcaption className={s.viewerCaption}>
            <span>{page.no} / {pages.length}</span>
            <button type="button" className={s.zoomButton} onClick={() => setZoom(true)}>
              拡大して読む
            </button>
          </figcaption>
        </figure>

        <div className={s.viewerNotes}>
          <div>
            <p className={s.viewerKicker}>{String(page.no).padStart(2, '0')}　{page.title}</p>
            <p className={s.viewerMessage}>{page.message}</p>
          </div>
          <div>
            <h3 className={s.viewerSub}>このページでわかること</h3>
            <ul className={s.viewerList}>
              {page.learn.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h3 className={s.viewerSub}>営業での使いどころ</h3>
            <p className={s.viewerUse}>{page.use}</p>
          </div>
          <div className={s.viewerNav}>
            <button type="button" onClick={() => setActive((active + pages.length - 1) % pages.length)} aria-label="前のページ">←</button>
            <button type="button" onClick={() => setActive((active + 1) % pages.length)} aria-label="次のページ">→</button>
          </div>
        </div>
      </div>

      <dialog
        ref={dialog}
        className={s.zoomDialog}
        aria-label={`${page.title}（原寸）`}
        onClose={() => setZoom(false)}
        onClick={(e) => { if (e.target === e.currentTarget) setZoom(false); }}
      >
        <div className={s.zoomBar}>
          <span>{String(page.no).padStart(2, '0')}　{page.title}</span>
          <button type="button" onClick={() => setZoom(false)}>閉じる</button>
        </div>
        <div className={s.zoomScroll}>
          {zoom ? (
            <img src={`${IMG}/page-${page.no}-2400.webp`} width={2400} height={1662} alt={page.alt} />
          ) : null}
        </div>
      </dialog>
    </div>
  );
}
