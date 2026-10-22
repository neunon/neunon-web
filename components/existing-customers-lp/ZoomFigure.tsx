'use client';

import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { IMG, pageBySlug } from './data';
import { PageDialog, pageLabel } from './PageDialog';
import s from './lp.module.css';

/** レポートの1ページを本文の中に置き、押すと拡大する */
export function ZoomFigure({ slug, sizes }: { slug: string; sizes: string }) {
  const p = pageBySlug(slug);
  const [zoom, setZoom] = useState<number | null>(null);
  return (
    <figure className={s.zoomFig}>
      <button type="button" className={s.viewerZoomBtn} onClick={() => setZoom(0)} aria-label={`「${p.title}」のページを拡大する`}>
        <img
          src={`${IMG}/${p.slug}-960.webp`}
          srcSet={`${IMG}/${p.slug}-640.webp 640w, ${IMG}/${p.slug}-960.webp 960w, ${IMG}/${p.slug}-1440.webp 1440w`}
          sizes={sizes}
          width={960}
          height={665}
          alt={`サンプルレポート「${p.title}」のページ。${p.role}`}
          loading="lazy"
          decoding="async"
        />
        <span className={s.viewerZoomIcon} aria-hidden="true"><Maximize2 size={16} strokeWidth={2.2} /></span>
      </button>
      <figcaption>{pageLabel(p)}</figcaption>
      <PageDialog pages={[p]} index={zoom} onChange={setZoom} />
    </figure>
  );
}
