'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { IMG, plans, reportPages, type PlanKey } from './data';
import s from './lp.module.css';

/**
 * サンプルレポートの全ページ。プランを選ぶと、そのプランに含まれるページだけが濃く残る。
 * ページを押すと大きく開き、前後のページへ送れる。
 */
const tabs: ('all' | PlanKey)[] = ['all', 'Light', 'Standard', 'Advanced'];
const tabLabel = (t: 'all' | PlanKey) => (t === 'all' ? 'すべてのページ' : t);
const volume = Object.fromEntries(plans.map((p) => [p.name, p.volume])) as Record<PlanKey, string>;

export function ReportGallery() {
  const [plan, setPlan] = useState<'all' | PlanKey>('all');
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  function onTabKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const i = tabs.indexOf(plan);
    setPlan(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]);
  }

  function onDialogKey(e: KeyboardEvent<HTMLDialogElement>) {
    if (open === null) return;
    if (e.key === 'ArrowRight') setOpen((open + 1) % reportPages.length);
    if (e.key === 'ArrowLeft') setOpen((open + reportPages.length - 1) % reportPages.length);
  }

  const count = plan === 'all' ? reportPages.length : reportPages.filter((p) => p.plans.includes(plan)).length;
  const current = open === null ? null : reportPages[open];

  return (
    <div>
      <div className={s.galleryBar}>
        <div className={s.galleryTabs} role="tablist" aria-label="プランで絞り込む" onKeyDown={onTabKey}>
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={plan === t}
              tabIndex={plan === t ? 0 : -1}
              className={s.galleryTab}
              onClick={() => setPlan(t)}
            >
              {tabLabel(t)}
            </button>
          ))}
        </div>
        <p className={s.galleryCount} aria-live="polite">
          {plan === 'all' ? `表紙＋${count}ページ（Advancedのサンプル）` : `${plan}：${volume[plan]}（下の濃いページ）`}
        </p>
      </div>

      <ol className={s.gallery}>
        {reportPages.map((p, i) => {
          const on = plan === 'all' || p.plans.includes(plan);
          return (
            <li key={p.img} className={on ? undefined : s.galleryOff}>
              <button type="button" className={s.galleryThumb} onClick={() => setOpen(i)} aria-label={`「${p.title}」のページを拡大する`}>
                <img
                  src={`${IMG}/${p.img}-640.webp`}
                  srcSet={`${IMG}/${p.img}-640.webp 640w, ${IMG}/${p.img}-960.webp 960w`}
                  sizes="(min-width: 1200px) 370px, (min-width: 768px) 45vw, 90vw"
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
                  <p className={s.galleryPlans}>
                    {(['Light', 'Standard', 'Advanced'] as PlanKey[]).map((k) => (
                      <span key={k} data-on={p.plans.includes(k) ? 'true' : undefined}>{k}</span>
                    ))}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
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
