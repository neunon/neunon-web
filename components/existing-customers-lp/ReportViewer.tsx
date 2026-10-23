'use client';

import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { FEATURED, IMG, reportPages } from './data';
import { PageDialog, pageLabel } from './PageDialog';
import { track } from './Tracker';
import s from './lp.module.css';

const featured = new Set<string>(FEATURED);

/**
 * 成果物の表示。代表ページを大きく出し、下のページ一覧（9枚）から切り替える。
 * 右（スマホは下）に、そのページで何がわかるかを HTML の文字で出す。押すと拡大。
 */
export function ReportViewer() {
  const [current, setCurrent] = useState(reportPages.findIndex((p) => p.slug === FEATURED[0]));
  const [zoom, setZoom] = useState<number | null>(null);
  const p = reportPages[current];

  function select(i: number) {
    setCurrent(i);
    track('sample_view', { page: reportPages[i].slug });
  }
  function open(i: number) {
    setZoom(i);
    track('sample_zoom', { page: reportPages[i].slug });
  }

  return (
    <div className={s.viewer}>
      <div className={s.viewerStage}>
        <div className={s.viewerPage}>
          <button type="button" className={s.viewerZoomBtn} onClick={() => open(current)} aria-label={`「${p.title}」のページを拡大する`}>
            <img
              key={p.slug}
              src={`${IMG}/${p.slug}-1440.webp`}
              srcSet={`${IMG}/${p.slug}-960.webp 960w, ${IMG}/${p.slug}-1440.webp 1440w, ${IMG}/${p.slug}-2000.webp 2000w`}
              sizes="(min-width: 1240px) 860px, (min-width: 900px) 64vw, 100vw"
              width={1440}
              height={997}
              alt={`サンプルレポート「${p.title}」のページ。${p.role}`}
              loading="lazy"
              decoding="async"
            />
            <span className={s.viewerZoomIcon} aria-hidden="true"><Maximize2 size={16} strokeWidth={2.2} /></span>
          </button>
        </div>
        <div className={s.viewerAbout} aria-live="polite">
          {featured.has(p.slug) && <p className={s.viewerBadge}>代表ページ</p>}
          <p className={s.viewerTitle}>{pageLabel(p)}</p>
          <p className={s.viewerRole}>{p.role}</p>
          <p className={s.viewerLearnHead}>このページでわかること</p>
          <ul className={s.viewerLearn}>
            {p.learn.map((l) => <li key={l}>{l}</li>)}
          </ul>
          <button type="button" className={s.viewerZoomLink} onClick={() => open(current)}>ページを拡大して読む</button>
        </div>
      </div>
      <ol className={s.strip} aria-label="サンプルレポートのページ一覧">
        {reportPages.map((x, i) => (
          <li key={x.slug}>
            <button
              type="button"
              className={s.stripBtn}
              aria-current={i === current ? 'true' : undefined}
              aria-label={`${pageLabel(x)}を表示する`}
              onClick={() => select(i)}
            >
              <img src={`${IMG}/${x.slug}-640.webp`} width={640} height={443} alt="" loading="lazy" decoding="async" />
              <span className={s.stripLabel}>
                <b>{x.no.padStart(2, '0')}</b>{x.tab}
                {featured.has(x.slug) && <i className={s.stripDot} aria-label="代表ページ" />}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <PageDialog pages={reportPages} index={zoom} onChange={setZoom} />
    </div>
  );
}
