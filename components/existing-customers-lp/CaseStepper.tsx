'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, Maximize2 } from 'lucide-react';
import { IMG, pageBySlug, steps } from './data';
import { PageDialog, pageLabel } from './PageDialog';
import { track } from './Tracker';
import s from './lp.module.css';

/**
 * 分析事例。01〜04 を横に並べたステップで切り替え、下にレポートの実物と説明を1枚ずつ出す。
 * 縦に4段並べると長くなるため、1つの筋（出来事 → 取引の空白 → 提案テーマ → 訪問先）として1画面に収める。
 */
export function CaseStepper() {
  const [cur, setCur] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const st = steps[cur];
  const p = pageBySlug(st.slug);

  function select(i: number) {
    setCur(i);
    track('case_step', { step: i + 1 });
  }

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (cur + d + steps.length) % steps.length;
    select(n);
    tabs.current[n]?.focus();
  }

  return (
    <div className={s.case}>
      <div className={s.caseTabs} role="tablist" aria-label="分析事例のステップ" onKeyDown={onKey}>
        {steps.map((x, i) => (
          <button
            key={x.slug}
            ref={(el) => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            id={`case-tab-${i}`}
            aria-selected={i === cur}
            aria-controls="case-panel"
            tabIndex={i === cur ? 0 : -1}
            className={s.caseTab}
            onClick={() => select(i)}
          >
            <span className={s.caseNo}>{String(i + 1).padStart(2, '0')}</span>
            <span className={s.caseValue}>{x.value}</span>
            <span className={s.caseSmall}>{x.title}</span>
          </button>
        ))}
      </div>
      <div className={s.casePanel} role="tabpanel" id="case-panel" aria-labelledby={`case-tab-${cur}`}>
        <div className={s.caseImg}>
          <button type="button" className={s.viewerZoomBtn} onClick={() => setZoom(0)} aria-label={`「${p.title}」のページを拡大する`}>
            <img
              key={p.slug}
              src={`${IMG}/${p.slug}-1440.webp`}
              srcSet={`${IMG}/${p.slug}-960.webp 960w, ${IMG}/${p.slug}-1440.webp 1440w`}
              sizes="(min-width: 1200px) 720px, (min-width: 900px) 60vw, 100vw"
              width={1440}
              height={997}
              alt={`サンプルレポート「${p.title}」のページ。${p.role}`}
              loading="lazy"
              decoding="async"
            />
            <span className={s.viewerZoomIcon} aria-hidden="true"><Maximize2 size={16} strokeWidth={2.2} /></span>
          </button>
          <p className={s.caseCap}>{pageLabel(p)}</p>
        </div>
        <div className={s.caseText}>
          <p className={s.caseStep}>STEP {cur + 1} / 4</p>
          <h3 className={s.caseTitle}>{st.value}</h3>
          <p className={s.caseBody}>{st.body}</p>
          <div className={s.trace}>
            <p className={s.traceLabel}>サンプルでは</p>
            <p>{st.trace}</p>
          </div>
          {cur < steps.length - 1 && (
            <button type="button" className={s.caseNext} onClick={() => select(cur + 1)}>
              次のステップ：{steps[cur + 1].value}<ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <PageDialog pages={[p]} index={zoom} onChange={setZoom} />
    </div>
  );
}
