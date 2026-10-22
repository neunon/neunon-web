'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { IMG, reportPages } from './data';
import s from './lp.module.css';

/**
 * サンプルレポートの全ページ。ページを押すと大きく開き、前後のページへ送れる。
 */
export function ReportGallery() {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  function onDialogKey(e: KeyboardEvent<HTMLDialogElement>) {
    if (open === null) return;
    if (e.key === 'ArrowRight') setOpen((open + 1) % reportPages.length);
    if (e.key === 'ArrowLeft') setOpen((open + reportPages.length - 1) % reportPages.length);
  }

  const current = open === null ? null : reportPages[open];

  return (
    <div>
      <ol className={s.gallery}>
        {reportPages.map((p, i) => (
          <li key={p.img}>
            <button type="button" className={s.galleryThumb} onClick={() => setOpen(i)} aria-label={`「${p.title}」のページを拡大する`}>
              <img
                src={`${IMG}/${p.img}-640.webp`}
                srcSet={`${IMG}/${p.img}-640.webp 640w, ${IMG}/${p.img}-960.webp 960w`}
                sizes="(min-width: 1200px) 280px, (min-width: 768px) 45vw, 90vw"
                width={640}
                height={443}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </button>
            <div className={s.galleryMeta}>
              <p className={s.galleryNo}>{String(i + 1).padStart(2, '0')}</p>
              <div>
                <h3 className={s.galleryTitle}>{p.title}</h3>
                <p className={s.galleryBody}>{p.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <dialog
        ref={dialog}
        className={s.lightbox}
        aria-label={current ? `「${current.title}」のページ` : 'ページの拡大表示'}
        onClose={() => setOpen(null)}
        onKeyDown={onDialogKey}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}
      >
        {current && open !== null && (
          <div className={s.lightboxInner}>
            <div className={s.lightboxBar}>
              <p><b>{String(open + 1).padStart(2, '0')}</b>{current.title}<span>{current.body}</span></p>
              <button type="button" onClick={() => setOpen(null)} aria-label="閉じる"><X size={22} aria-hidden="true" /></button>
            </div>
            <img
              src={`${IMG}/${current.img}-1440.webp`}
              width={1440}
              height={997}
              alt={`サンプルレポートの「${current.title}」のページ`}
            />
            <div className={s.lightboxNav}>
              <button type="button" onClick={() => setOpen((open + reportPages.length - 1) % reportPages.length)} aria-label="前のページ">
                <ChevronLeft size={22} aria-hidden="true" />前へ
              </button>
              <span>{open + 1} / {reportPages.length}</span>
              <button type="button" onClick={() => setOpen((open + 1) % reportPages.length)} aria-label="次のページ">
                次へ<ChevronRight size={22} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
