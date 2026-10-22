'use client';

import { useEffect, useRef, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { IMG, type ReportPage } from './data';
import s from './lp.module.css';

/** レポートのページ見出し（表紙は番号なし） */
export const pageLabel = (p: ReportPage) => (p.no ? `（${p.no}）${p.title}` : p.title);

/**
 * レポートのページを大きく開くダイアログ。pages が2枚以上なら前後に送れる。
 * スマホでは画像を画面より広く出し、横スクロールと指での拡大で読めるようにする。
 */
export function PageDialog({ pages, index, onChange }: { pages: ReportPage[]; index: number | null; onChange: (i: number | null) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const many = pages.length > 1;
  const go = (step: number) => index !== null && onChange((index + step + pages.length) % pages.length);

  function onKey(e: KeyboardEvent<HTMLDialogElement>) {
    if (!many) return;
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  }

  const current = index === null ? null : pages[index];

  return (
    <dialog
      ref={dialog}
      className={s.lightbox}
      aria-label={current ? `サンプルレポート「${current.title}」のページ` : 'ページの拡大表示'}
      onClose={() => onChange(null)}
      onKeyDown={onKey}
      onClick={(e) => { if (e.target === e.currentTarget) onChange(null); }}
    >
      {current && index !== null && (
        <div className={s.lightboxInner}>
          <div className={s.lightboxBar}>
            <p><b>{pageLabel(current)}</b><span>{current.role}</span></p>
            <button type="button" onClick={() => onChange(null)} aria-label="閉じる"><X size={22} aria-hidden="true" /></button>
          </div>
          <div className={s.lightboxScroll}>
            <img
              src={`${IMG}/${current.slug}-2000.webp`}
              srcSet={`${IMG}/${current.slug}-1440.webp 1440w, ${IMG}/${current.slug}-2000.webp 2000w`}
              sizes="(min-width: 1440px) 1360px, 96vw"
              width={2000}
              height={1385}
              alt={`サンプルレポート「${current.title}」のページ。${current.role}`}
            />
          </div>
          <p className={s.lightboxHint}>横にスクロールでき、指で広げると拡大できます。</p>
          {many && (
            <div className={s.lightboxNav}>
              <button type="button" onClick={() => go(-1)} aria-label="前のページ"><ChevronLeft size={20} aria-hidden="true" />前へ</button>
              <span>{index + 1} / {pages.length}</span>
              <button type="button" onClick={() => go(1)} aria-label="次のページ">次へ<ChevronRight size={20} aria-hidden="true" /></button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
