'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Maximize2 } from 'lucide-react';
import { HERO_PAGE, IMG, reportPages } from './data';
import { PageDialog, pageLabel } from './PageDialog';
import s from './lp.module.css';

/** 表紙を除く9ページをタブで切り替える */
const pages = reportPages.filter((p) => p.no);

/**
 * ファーストビューのレポート表示。代表ページを大きく出し、タブで全ページを見られる。
 * 右（スマホは下）に、そのページで何がわかるかを HTML の文字で出す。
 */
export function ReportViewer() {
  const first = pages.findIndex((p) => p.slug === HERO_PAGE);
  const [current, setCurrent] = useState(first);
  const [zoom, setZoom] = useState<number | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const list = useRef<HTMLDivElement>(null);
  const p = pages[current];

  // 選んだタブが見えるよう、タブの列だけを横に送る（ページ全体はスクロールさせない）
  useEffect(() => {
    const box = list.current;
    const tab = tabs.current[current];
    if (!box || !tab || box.scrollWidth <= box.clientWidth) return;
    box.scrollTo({ left: tab.offsetLeft - (box.clientWidth - tab.offsetWidth) / 2 });
  }, [current]);

  function onTabKey(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (current + step + pages.length) % pages.length;
    setCurrent(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className={s.viewer}>
      <div ref={list} className={s.viewerTabs} role="tablist" aria-label="サンプルレポートのページ" onKeyDown={onTabKey}>
        {pages.map((x, i) => (
          <button
            key={x.slug}
            ref={(el) => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            id={`viewer-tab-${x.slug}`}
            aria-selected={i === current}
            aria-controls="viewer-panel"
            tabIndex={i === current ? 0 : -1}
            className={s.viewerTab}
            onClick={() => setCurrent(i)}
          >
            <small>{x.no.padStart(2, '0')}</small>{x.tab}
          </button>
        ))}
      </div>
      <div className={s.viewerStage} role="tabpanel" id="viewer-panel" aria-labelledby={`viewer-tab-${p.slug}`}>
        <div className={s.viewerPage}>
          <button type="button" className={s.viewerZoomBtn} onClick={() => setZoom(current)} aria-label={`「${p.title}」のページを拡大する`}>
            <img
              key={p.slug}
              src={`${IMG}/${p.slug}-1440.webp`}
              srcSet={`${IMG}/${p.slug}-960.webp 960w, ${IMG}/${p.slug}-1440.webp 1440w, ${IMG}/${p.slug}-2000.webp 2000w`}
              sizes="(min-width: 1240px) 860px, (min-width: 900px) 64vw, 100vw"
              width={1440}
              height={997}
              alt={`サンプルレポート「${p.title}」のページ。${p.role}`}
              fetchPriority={current === first ? 'high' : 'auto'}
            />
            <span className={s.viewerZoomIcon} aria-hidden="true"><Maximize2 size={16} strokeWidth={2.2} /></span>
          </button>
        </div>
        <div className={s.viewerAbout}>
          <p className={s.viewerTitle}>{pageLabel(p)}</p>
          <p className={s.viewerRole}>{p.role}</p>
          <p className={s.viewerLearnHead}>このページでわかること</p>
          <ul className={s.viewerLearn}>
            {p.learn.map((l) => <li key={l}>{l}</li>)}
          </ul>
          <button type="button" className={s.viewerZoomLink} onClick={() => setZoom(current)}>ページを拡大する</button>
          <p className={s.viewerNote}>架空企業による分析サンプルです。社名・数値・文章はダミーで、体裁と構成をご覧いただくためのものです。</p>
        </div>
      </div>
      <PageDialog pages={pages} index={zoom} onChange={setZoom} />
    </div>
  );
}
