'use client';

import { useEffect } from 'react';

/**
 * .rise / .flow / .layer に IntersectionObserver で .in を付ける。
 * デザイン案 v2 の挙動をそのまま移植したもの。
 *
 * ※要件定義書 9.2 は「スクロールのたびに要素がフェードインしてくる演出」を
 *   禁止しており、デザイン案 v2 と矛盾している。発注者確認事項。
 *   NEXT_PUBLIC_SCROLL_REVEAL=off を設定すると即時表示に切り替わる。
 */
export function ScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('.rise, .flow, .layer');
    const showAll = () => targets.forEach((el) => el.classList.add('in'));

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const disabled = process.env.NEXT_PUBLIC_SCROLL_REVEAL === 'off';

    if (reduce || disabled || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    targets.forEach((el) => observer.observe(el));

    // ヒーローはスクロール前に見える領域なので即時に出す
    document.querySelectorAll('.nc-hero .rise').forEach((el) => el.classList.add('in'));

    return () => observer.disconnect();
  }, []);

  return null;
}
