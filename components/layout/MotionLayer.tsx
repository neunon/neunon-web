'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const revealSelectors = [
  '#main > .section .shead',
  '#main > .nc-cta .wrap',
  '.nc-prob',
  '.nc-growth-arrow',
  '.nc-growth-outcomes > article',
  '.nc-svc',
  '.nc-evidence-head',
  '.nc-rec',
  '.nc-evidence-foot',
  '.nc-step',
  '.nc-stu-copy',
  '.nc-gakuchika',
  '.nc-news > li',
  '.nc-workcard',
  '.nc-talentcard',
  '.nc-rcard',
  '.nc-rcases > li',
  '.nc-jobcard',
  '.nc-case-main > section',
  '.nc-doc-body > section',
  '.nc-formside',
  '.nc-formmain',
].join(',');

/**
 * 静的な本文は Server Component のまま保ち、表示演出だけを担う薄いレイヤー。
 * JavaScript が無効でも本文は常に読める。動きを抑えるOS設定にも従う。
 */
export function MotionLayer() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) return;

    root.classList.add('nc-motion-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelectors));
    elements.forEach((element, index) => {
      element.classList.add('nc-reveal');
      element.style.setProperty('--nc-reveal-delay', `${Math.min(index % 4, 3) * 55}ms`);

      const box = element.getBoundingClientRect();
      if (box.top < window.innerHeight * 0.88) {
        element.classList.add('is-revealed');
      } else {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
      root.classList.remove('nc-motion-ready');
    };
  }, [pathname]);

  return null;
}
