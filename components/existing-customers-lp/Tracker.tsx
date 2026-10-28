'use client';

import { useEffect } from 'react';

type DataLayerEvent = Record<string, string | number | boolean>;
declare global {
  interface Window { dataLayer?: DataLayerEvent[] }
}

/**
 * 計測イベントを dataLayer に積む（GTM を入れれば GA4 へ送れる。サイトにはまだ GTM・GA4 が入っていない）。
 * 個人情報は送らない。値はボタンの種類・置き場所・ページ名・プラン名だけ。
 */
export function track(event: string, params: DataLayerEvent = {}) {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, lp: 'existing_customers', ...params });
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
