'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { IMG, pages } from './data';
import s from './lp.module.css';

/**
 * レポートの切り抜きを押すと、そのページ全体を原寸（幅2400px）で開く。
 * 狭い画面では切り抜きの文字が小さくなるため、読める大きさへの逃げ道として置く。
 * 中身（children）はボタン内に入るので、ブロック要素ではなく span・img で組むこと。
 */
export function PageZoom({ page, children }: { page: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const meta = pages[page - 1];

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <button type="button" className={s.zoomTrigger} onClick={() => setOpen(true)} aria-label={`${page}ページ目「${meta.title}」を原寸で開く`}>
        {children}
        <span className={s.tapHint} aria-hidden="true">拡大</span>
      </button>
      <dialog
        ref={dialog}
        className={s.zoomDialog}
        aria-label={`${meta.title}（原寸）`}
        onClose={() => setOpen(false)}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      >
        <div className={s.zoomBar}>
          <span>{String(page).padStart(2, '0')}　{meta.title}</span>
          <button type="button" onClick={() => setOpen(false)}>閉じる</button>
        </div>
        <div className={s.zoomScroll}>
          {open ? <img src={`${IMG}/page-${page}-2400.webp`} width={2400} height={1662} alt={meta.alt} /> : null}
        </div>
      </dialog>
    </>
  );
}
