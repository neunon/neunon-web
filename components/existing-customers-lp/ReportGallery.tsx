'use client';

import { useState } from 'react';
import { IMG, reportPages } from './data';
import { PageDialog, pageLabel } from './PageDialog';
import s from './lp.module.css';

/**
 * サンプルレポートの全ページ（表紙＋9ページ）。ページを押すと大きく開き、前後のページへ送れる。
 */
export function ReportGallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      <ol className={s.gallery}>
        {reportPages.map((p, i) => (
          <li key={p.slug}>
            <button type="button" className={s.galleryThumb} onClick={() => setOpen(i)} aria-label={`「${p.title}」のページを拡大する`}>
              <img
                src={`${IMG}/${p.slug}-640.webp`}
                srcSet={`${IMG}/${p.slug}-640.webp 640w, ${IMG}/${p.slug}-960.webp 960w`}
                sizes="(min-width: 1200px) 280px, (min-width: 768px) 45vw, 46vw"
                width={640}
                height={443}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </button>
            <h3 className={s.galleryTitle}>{pageLabel(p)}</h3>
            <p className={s.galleryBody}>{p.role}</p>
          </li>
        ))}
      </ol>
      <PageDialog pages={reportPages} index={open} onChange={setOpen} />
    </div>
  );
}
