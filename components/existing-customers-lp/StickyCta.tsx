'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CONTACT_DOCS, CONTACT_ESTIMATE } from './data';
import s from './lp.module.css';

/**
 * スマホで画面下に出す相談ボタン。
 * ヒーローの相談ボタンより上と、最後の相談の帯から下（フッター）では隠す（同じボタンが二重に並ばないように）。
 */
export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const targets = ['lp-hero-cta', 'lp-final'].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!targets.length || !('IntersectionObserver' in window)) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      const heroAbove = targets[0].getBoundingClientRect().bottom < 0;
      const finalBelow = !targets[1] || targets[1].getBoundingClientRect().top > window.innerHeight;
      setShow(visible.size === 0 && heroAbove && finalBelow);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div className={s.sticky} data-show={show ? 'true' : undefined} aria-hidden={!show}>
      <Link href={CONTACT_DOCS} className={s.stickyGhost} data-track="cta_docs" data-track-at="sticky" tabIndex={show ? 0 : -1}>資料を請求</Link>
      <Link href={CONTACT_ESTIMATE} className={s.stickyPrimary} data-track="cta_estimate" data-track-at="sticky" tabIndex={show ? 0 : -1}>見積もりを相談する</Link>
    </div>
  );
}
