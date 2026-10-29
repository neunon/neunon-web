'use client';

import { useEffect } from 'react';

type DataLayerEvent = Record<string, string | number | boolean>;
declare global {
  interface Window { dataLayer?: DataLayerEvent[] }
}

/**
 * LP 内の操作を既存の dataLayer に記録し、国内で解析が有効な場合だけ
 * AnalyticsControl に固定形式のイベントを通知する。
 */
export function track(event: string, params: DataLayerEvent = {}) {
  window.dataLayer = window.dataLayer ?? [];
  const detail = { event, lp: 'existing_customers', ...params };
  window.dataLayer.push(detail);
  window.dispatchEvent(new CustomEvent('neunon:engagement', { detail }));
}

/**
 * LP 全体の計測。
 *   クリック: data-track="cta_estimate|cta_docs|cta_sample" と data-track-at="hero|band|price|final|sticky" を付けた要素
 *   表示:     data-track-view="report|price" を付けた節が少し（15%）見えたら1回だけ section_view
 */
export function Tracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
      if (el) track(el.dataset.track!, { at: el.dataset.trackAt ?? '' });
    }
    document.addEventListener('click', onClick);
    const seen = new Set<string>();
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
        for (const en of entries) {
          const name = (en.target as HTMLElement).dataset.trackView!;
          if (en.isIntersecting && !seen.has(name)) {
            seen.add(name);
            track('section_view', { section: name });
          }
        }
      }, { threshold: 0.15 })
      : null;
    document.querySelectorAll('[data-track-view]').forEach((el) => io?.observe(el));
    return () => {
      document.removeEventListener('click', onClick);
      io?.disconnect();
    };
  }, []);
  return null;
}
