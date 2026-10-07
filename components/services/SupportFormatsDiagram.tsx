'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './SupportFormatsDiagram.module.css';

const modes = [
  { title: 'プロフェッショナル主導型', description: '弊社プロフェッショナルが主導し、学生コンサルタントが業務を支援します。', leader: 0, horizontal: 0, vertical: 0, direction: 'up', label: '業務支援', muted: [2] },
  { title: '学生主導・協働型', description: '学生コンサルタントが主導し、プロフェッショナルが品質を管理します。', leader: 1, horizontal: 1, vertical: 0, direction: 'down', label: '品質管理', muted: [2] },
  { title: '学生主導・直接支援型', description: '学生コンサルタントが、クライアントを直接支援します。', leader: 1, horizontal: 1, vertical: null, direction: '', label: '', muted: [0, 2] },
  { title: 'パートナー主導型', description: 'パートナーが主導し、学生コンサルタントが業務を支援します。', leader: 2, horizontal: 2, vertical: 1, direction: 'down', label: '業務支援', muted: [0] },
] as const;

type Point = { x: number; y: number };
type Line = { d: string; reverse: string; start: Point; end: Point };

function Icon({ kind }: { kind: 'person' | 'partner' | 'building' }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'person' ? <><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" /></> : null}
    {kind === 'partner' ? <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></> : null}
    {kind === 'building' ? <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" /></> : null}
  </svg>;
}

export function SupportFormatsDiagram() {
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const clientRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const measure = useCallback(() => {
    const diagram = diagramRef.current?.getBoundingClientRect();
    const client = clientRef.current?.getBoundingClientRect();
    const cards = cardRefs.current.map((card) => card?.getBoundingClientRect());
    if (!diagram || !client || cards.some((card) => !card)) return;
    const local = (x: number, y: number) => ({ x: x - diagram.left, y: y - diagram.top });
    const result: Line[] = [];
    cards.forEach((card, index) => {
      if (!card) return;
      const start = local(card.right, card.top + card.height / 2);
      const end = local(client.left, client.top + client.height * (index + 1) / 4);
      const middle = (start.x + end.x) / 2;
      result.push({ start, end, d: `M${start.x},${start.y} C${middle},${start.y} ${middle},${end.y} ${end.x},${end.y}`, reverse: `M${end.x},${end.y} C${middle},${end.y} ${middle},${start.y} ${start.x},${start.y}` });
    });
    for (const [upper, lower] of [[0, 1], [1, 2]]) {
      const topCard = cards[upper];
      const bottomCard = cards[lower];
      if (!topCard || !bottomCard) continue;
      const start = local(topCard.left + topCard.width / 2, topCard.bottom);
      const end = local(bottomCard.left + bottomCard.width / 2, bottomCard.top);
      result.push({ start, end, d: `M${start.x},${start.y} L${end.x},${end.y}`, reverse: `M${end.x},${end.y} L${start.x},${start.y}` });
    }
    setLines(result);
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setEntered(true);
    }, { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = diagramRef.current;
    if (!node) return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    cardRefs.current.forEach((card) => { if (card) observer.observe(card); });
    if (clientRef.current) observer.observe(clientRef.current);
    measure();
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    if (!visible || manual || reduced) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % modes.length), 4200);
    return () => window.clearInterval(timer);
  }, [visible, manual, reduced]);

  const select = (index: number) => { setActive(index); setManual(true); };
  const mode = modes[active];

  return <div ref={sectionRef} className={styles.root} style={{ '--accent': '#8a7cf0' } as React.CSSProperties}>
    <div className={styles.tabs} role="tablist" aria-label="支援形態を選択">
      {modes.map((item, index) => <button key={item.title} ref={(node) => { tabRefs.current[index] = node; }} id={`support-format-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls="support-format-panel" tabIndex={active === index ? 0 : -1} className={active === index ? styles.selected : ''} onClick={() => select(index)} onKeyDown={(event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'Home' && event.key !== 'End') return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? modes.length - 1 : (active + (event.key === 'ArrowRight' ? 1 : modes.length - 1)) % modes.length;
        select(next);
        tabRefs.current[next]?.focus();
      }}>{item.title}</button>)}
    </div>
    <div id="support-format-panel" role="tabpanel" aria-labelledby={`support-format-tab-${active}`} className={styles.panel}>
      <div className={styles.description} aria-live="polite">{modes.map((item, index) => <p key={item.title} className={index === active ? styles.current : ''} aria-hidden={index !== active}>{item.description}</p>)}</div>
      <div ref={diagramRef} className={styles.diagram}>
        <div className={styles.dots} aria-hidden="true" />
        <svg className={`${styles.connections} ${entered ? styles.entered : ''}`} aria-hidden="true" width="100%" height="100%">
          {lines.map((line, index) => {
            const isHorizontal = index < 3;
            const selected = isHorizontal ? index === mode.horizontal : mode.vertical !== null && index === 3 + mode.vertical;
            const flow = !isHorizontal && index === 3 && mode.direction === 'up' ? line.reverse : line.d;
            return <g key={index} className={selected ? styles.activeLine : ''}>
              <path className={styles.baseLine} d={line.d} pathLength="1" style={{ animationDelay: `${index < 3 ? .2 + index * .1 : .6 + (index - 3) * .1}s` }} />
              <path className={styles.traceLine} d={flow} pathLength="1" />
              <path className={styles.particle} d={flow} pathLength="1" />
              {isHorizontal ? <path className={`${styles.particle} ${styles.reverseParticle}`} d={line.reverse} pathLength="1" /> : null}
              {isHorizontal ? <><circle className={styles.originDot} cx={line.start.x} cy={line.start.y} r="3" /><circle className={styles.targetDot} cx={line.end.x} cy={line.end.y} r="3.5" /></> : null}
            </g>;
          })}
        </svg>
        <div className={styles.left}>
          {[
            { kicker: '弊社', title: 'プロフェッショナルコンサルタント', icon: 'person' as const },
            { kicker: '弊社', title: '学生コンサルタント', icon: 'person' as const },
            { kicker: '外部パートナー', title: 'パートナー', detail: '中小規模コンサルティングファーム・個人コンサルタント', icon: 'partner' as const },
          ].map((person, index) => <div key={person.title} ref={(node) => { cardRefs.current[index] = node; }} className={`${styles.card} ${mode.leader === index ? styles.leader : ''} ${(mode.muted as readonly number[]).includes(index) ? styles.muted : ''}`}>
            {index === 1 ? <div className={styles.avatars}>{[0, 1, 2].map((avatar) => <span key={avatar}><Icon kind="person" /></span>)}</div> : <span className={`${styles.avatar} ${index === 2 ? styles.partnerAvatar : ''}`}><Icon kind={person.icon} /></span>}
            <div className={styles.cardCopy}><span>{person.kicker}</span><strong>{person.title}</strong>{person.detail ? <small>{person.detail}</small> : null}</div>
            {mode.leader === index ? <span className={styles.badge}>主導</span> : null}
            {mode.horizontal === index ? <span className={styles.mobileRelation}>↔ クライアント</span> : null}
          </div>)}
          {mode.vertical !== null && lines[3 + mode.vertical] ? <span className={`${styles.relationLabel} ${mode.vertical === 1 ? styles.lowerRelation : ''}`}>{mode.label}</span> : null}
        </div>
        <div ref={clientRef} className={styles.client}><span className={styles.clientIcon}><Icon kind="building" /></span><strong>クライアント</strong><span>事業会社など</span></div>
      </div>
    </div>
  </div>;
}
