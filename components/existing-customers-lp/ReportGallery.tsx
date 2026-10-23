'use client';

import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { IMG, reportPages } from './data';
import { PageDialog } from './PageDialog';
import { track } from './Tracker';
import s from './lp.module.css';

/**
 * サンプルレポートの全9ページを最初から一覧で見せる（デスクトップ3列・スマホ1列）。
 * 押すと大きく開き、前後のページへ送れる。画像は 640/960/1440px の WebP を幅に合わせて読み分ける。
 */
export function ReportGallery() {
  const [open, setOpen] = useState<number | null>(null);

  function show(i: number) {
    setOpen(i);
    track('sample_zoom', { page: reportPages[i].slug });
  }

  return (
    <>
      <ol className={s.gallery}>
        {reportPages.map((p, i) => (
          <li key={p.slug}>
            <button type="button" className={s.galleryThumb} onClick={() => show(i)} aria-label={`（${p.no}）${p.title}のページを拡大する`}>
              <img
                src={`${IMG}/${p.slug}-960.webp`}
                srcSet={`${IMG}/${p.slug}-640.webp 640w, ${IMG}/${p.slug}-960.webp 960w, ${IMG}/${p.slug}-1440.webp 1440w`}
                sizes="(min-width: 1280px) 390px, (min-width: 768px) 46vw, 92vw"
                width={960}
                height={665}
                alt={`サンプルレポート「${p.title}」のページ。${p.role}`}
                loading="lazy"
                decoding="async"
              />
              <span className={s.galleryZoom} aria-hidden="true"><Maximize2 size={15} strokeWidth={2.2} /></span>
            </button>
            <div className={s.galleryMeta}>
              <span className={s.galleryNo}>{p.no.padStart(2, '0')}</span>
              <div>
                <h3 className={s.galleryTitle}>{p.title}</h3>
                <p className={s.galleryBody}>{p.role}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <PageDialog pages={reportPages} index={open} onChange={setOpen} />
    </>
  );
}
