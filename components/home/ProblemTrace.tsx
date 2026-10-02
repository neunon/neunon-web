'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { HomeProblem } from '@/lib/page-content';
import styles from './ProblemTrace.module.css';

const effects = [
  { student: '空き時間を、実務経験に変える', company: '必要なときに動ける人材を確保できる' },
  { student: '学んだ力を、実践で試し磨ける', company: '質の高いアウトプットを得られる' },
  { student: '任される経験で、主体性が育つ', company: '課題解決のスピードが上がる' },
  { student: '働く現場を知り、キャリアを描ける', company: '採用につながる関係を早くから築ける' },
];

type Point = { x: number; y: number };
type Geometry = { width: number; height: number; sources: Point[]; targets: Point[] };

export function ProblemTrace({ content }: { content: HomeProblem }) {
  const sectionRef = useRef<HTMLElement>(null);
  const sourceDotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const targetDotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const manualRef = useRef(false);
  const hoveredRef = useRef(false);
  const focusedRef = useRef(false);
  const tappedRef = useRef(false);
  const visibleRef = useRef(false);
  const desktopRef = useRef(false);
  const reducedRef = useRef(false);
  const [active, setActive] = useState<number | null>(0);
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  const syncManual = useCallback(() => {
    manualRef.current = hoveredRef.current || focusedRef.current || tappedRef.current;
    sectionRef.current?.classList.toggle(styles.manual, manualRef.current);
  }, []);

  const measure = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const bounds = section.getBoundingClientRect();
    const center = (node: HTMLSpanElement | null): Point | null => {
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return { x: rect.left + rect.width / 2 - bounds.left, y: rect.top + rect.height / 2 - bounds.top };
    };
    const sources = content.opportunities.map((_, index) => center(sourceDotsRef.current[index]));
    const targets = [center(targetDotsRef.current[0]), center(targetDotsRef.current[1])];
    if (sources.some((point) => !point) || targets.some((point) => !point)) return;
    setGeometry({
      width: bounds.width,
      height: bounds.height,
      sources: sources as Point[],
      targets: targets as Point[],
    });
  }, [content.opportunities]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    schedule();
    const observer = new ResizeObserver(schedule);
    observer.observe(section);
    sourceDotsRef.current.forEach((dot) => dot && observer.observe(dot));
    targetDotsRef.current.forEach((dot) => dot && observer.observe(dot));
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [measure]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const desktop = window.matchMedia('(min-width: 768px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMedia = () => {
      desktopRef.current = desktop.matches;
      reducedRef.current = reduced.matches;
    };
    syncMedia();
    desktop.addEventListener('change', syncMedia);
    reduced.addEventListener('change', syncMedia);
    const intersection = new IntersectionObserver((entries) => {
      visibleRef.current = entries[0]?.isIntersecting ?? false;
      if (visibleRef.current) section.classList.add(styles.entered);
    }, { threshold: 0.1 });
    intersection.observe(section);
    const timer = window.setInterval(() => {
      if (!visibleRef.current || !desktopRef.current || reducedRef.current || manualRef.current) return;
      setActive((current) => current === null ? 0 : (current + 1) % content.opportunities.length);
    }, 3600);
    return () => {
      window.clearInterval(timer);
      intersection.disconnect();
      desktop.removeEventListener('change', syncMedia);
      reduced.removeEventListener('change', syncMedia);
    };
  }, [content.opportunities.length]);

  const titleParts = content.title.split('、');
  const pathFor = (source: Point, target: Point) => {
    const midY = (source.y + target.y) / 2;
    return `M ${source.x} ${source.y} C ${source.x} ${midY}, ${target.x} ${midY}, ${target.x} ${target.y}`;
  };

  return (
    <section ref={sectionRef} className={`${styles.section} nc-home-wide`} aria-labelledby="problem-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>WHY STUDENTS</span>
            <h2 id="problem-heading" className={styles.heading}>
              {titleParts.length === 2 ? <>{titleParts[0]}、<br />{titleParts[1]}</> : content.title}
            </h2>
          </div>
          <p className={styles.intro}>{content.intro}</p>
        </header>

        <div className={styles.diagram}>
          <div className={styles.sources}>
            <span className={styles.traceHint} aria-hidden="true">4 ELEMENTS → 2 OUTCOMES</span>
            {content.opportunities.map((item, index) => (
              <button
                className={`${styles.source} ${active === index ? styles.activeSource : ''}`}
                type="button"
                key={`${index}-${item.title}`}
                onPointerEnter={(event) => {
                  if (event.pointerType !== 'mouse') return;
                  hoveredRef.current = true;
                  syncManual();
                  setActive(index);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType !== 'mouse') return;
                  hoveredRef.current = false;
                  syncManual();
                }}
                onPointerDown={(event) => {
                  if (event.pointerType !== 'touch') return;
                  tappedRef.current = true;
                  syncManual();
                  setActive(index);
                }}
                onFocus={() => {
                  focusedRef.current = true;
                  syncManual();
                  setActive(index);
                }}
                onBlur={() => {
                  focusedRef.current = false;
                  tappedRef.current = false;
                  syncManual();
                }}
                onClick={() => setActive(index)}
              >
                <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.sourceTitle}>{item.title}</span>
                <span className={styles.sourceBody}>{item.body.join('・')}</span>
                <span ref={(node) => { sourceDotsRef.current[index] = node; }} className={styles.sourceDot} aria-hidden="true" />
                <span className={styles.mobileEffects}>
                  <span><b>学生 —</b> {effects[index]?.student}</span>
                  <span><b>企業 —</b> {effects[index]?.company}</span>
                </span>
              </button>
            ))}
          </div>

          <div className={styles.lineSpace} aria-hidden="true" />

          <div className={styles.outcomes}>
            <article className={styles.outcome}>
              <span ref={(node) => { targetDotsRef.current[0] = node; }} className={`${styles.targetDot} ${active !== null ? styles.litDot : ''}`} aria-hidden="true" />
              <h3>{content.studentTitle}</h3>
              <p>{content.studentBody}</p>
              <div className={styles.effect} aria-live="polite" aria-atomic="true">
                <span className="sr-only-text">{active === null ? '' : effects[active]?.student}</span>
                {effects.map((item, index) => (
                  <span key={index} className={`${styles.effectItem} ${active === index ? styles.visibleEffect : ''}`} aria-hidden="true">
                    <span className={styles.effectNumber}>{String(index + 1).padStart(2, '0')}</span>{item.student}
                  </span>
                ))}
              </div>
            </article>
            <article className={styles.outcome}>
              <span ref={(node) => { targetDotsRef.current[1] = node; }} className={`${styles.targetDot} ${active !== null ? styles.litDot : ''}`} aria-hidden="true" />
              <h3>{content.businessTitle}</h3>
              <p>{content.businessBody}</p>
              <div className={styles.effect} aria-live="polite" aria-atomic="true">
                <span className="sr-only-text">{active === null ? '' : effects[active]?.company}</span>
                {effects.map((item, index) => (
                  <span key={index} className={`${styles.effectItem} ${active === index ? styles.visibleEffect : ''}`} aria-hidden="true">
                    <span className={styles.effectNumber}>{String(index + 1).padStart(2, '0')}</span>{item.company}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
      {geometry ? (
        <svg className={styles.lines} viewBox={`0 0 ${geometry.width} ${geometry.height}`} preserveAspectRatio="none" aria-hidden="true">
          {geometry.sources.flatMap((source, index) => geometry.targets.map((target, targetIndex) => {
            const d = pathFor(source, target);
            const selected = active === index;
            return (
              <g key={`${index}-${targetIndex}`}>
                <path d={d} pathLength="1" className={styles.baseLine} style={{ animationDelay: `${0.1 + (index * 2 + targetIndex) * 0.06}s` }} />
                <path d={d} pathLength="1" className={`${styles.traceLine} ${selected ? styles.activeTrace : ''}`} />
                <path d={d} pathLength="1" className={`${styles.particle} ${selected ? styles.activeParticle : ''}`} />
              </g>
            );
          }))}
          {geometry.targets.map((target, index) => (
            <circle key={index} cx={target.x} cy={target.y} r="3.5" className={`${styles.ripple} ${active !== null ? styles.activeRipple : ''}`} />
          ))}
        </svg>
      ) : null}
    </section>
  );
}
