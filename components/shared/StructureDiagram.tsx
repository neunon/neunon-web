'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './StructureDiagram.module.css';

const teams = [
  { title: 'リード学生', tags: ['管理', 'ディレクション', '育成'], kind: 'current' },
  { title: 'リード学生', tags: ['管理', 'ディレクション', '育成'], kind: 'current' },
  { title: '新リード学生', tags: ['管理', 'ディレクション', '育成'], kind: 'new' },
  { title: '新リード学生', tags: ['管理', 'ディレクション', '育成'], kind: 'future' },
] as const;
type Point = { x: number; y: number };
type Geometry = { width: number; height: number; root: Point; tops: Point[]; promotions: [Point, Point][]; newLead: Point };

function PersonIcon({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>;
}
function Avatar({ size, className = '', avatarRef }: { size: 'supervisor' | 'lead' | 'associate'; className?: string; avatarRef?: (node: HTMLSpanElement | null) => void }) {
  return <span ref={avatarRef} className={`${styles.avatar} ${styles[size]} ${className}`}><PersonIcon size={size === 'supervisor' ? 24 : size === 'lead' ? 20 : 16} /></span>;
}
function point(element: HTMLElement, container: DOMRect, x: number, y: number): Point {
  const rect = element.getBoundingClientRect();
  return { x: rect.left - container.left + rect.width * x, y: rect.top - container.top + rect.height * y };
}

/** Measured, responsive organization diagram for the home page. */
export function StructureDiagram({ headingLevel: _headingLevel = 3 }: { headingLevel?: 3 | 4 }) {
  void _headingLevel;
  const diagramRef = useRef<HTMLDivElement>(null);
  const supervisorRef = useRef<HTMLDivElement>(null);
  const teamRefs = useRef<(HTMLElement | null)[]>([]);
  const leadRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const associateRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [entered, setEntered] = useState(false);

  const measure = useCallback(() => {
    const diagram = diagramRef.current;
    const supervisor = supervisorRef.current;
    if (!diagram || !supervisor || teamRefs.current.some((team) => !team) || !associateRefs.current[1] || !associateRefs.current[2] || !leadRefs.current[2] || !leadRefs.current[3]) return;
    const bounds = diagram.getBoundingClientRect();
    setGeometry({
      width: bounds.width, height: bounds.height,
      root: point(supervisor, bounds, .5, 1),
      tops: teamRefs.current.map((team) => point(team!, bounds, .5, 0)),
      promotions: [
        [point(associateRefs.current[1]!, bounds, 1, .5), point(leadRefs.current[2]!, bounds, 0, .5)],
        [point(associateRefs.current[2]!, bounds, 1, .5), point(leadRefs.current[3]!, bounds, 0, .5)],
      ],
      newLead: point(leadRefs.current[2]!, bounds, .5, .5),
    });
  }, []);
  useLayoutEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;
    let frame = 0;
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    schedule();
    const observer = new ResizeObserver(schedule);
    observer.observe(diagram);
    teamRefs.current.forEach((team) => team && observer.observe(team));
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('resize', schedule); };
  }, [measure]);
  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEntered(true); observer.disconnect(); }
    }, { threshold: .15 });
    observer.observe(diagram);
    return () => observer.disconnect();
  }, []);
  const branch = (a: Point, b: Point) => `M ${a.x} ${a.y} C ${a.x} ${(a.y + b.y) / 2}, ${b.x} ${(a.y + b.y) / 2}, ${b.x} ${b.y}`;
  const promotion = (a: Point, b: Point) => `M ${a.x} ${a.y} C ${a.x + 90} ${a.y}, ${b.x - 84} ${b.y}, ${b.x} ${b.y}`;

  return <div ref={diagramRef} className={`${styles.diagram} ${entered ? styles.entered : ''}`} aria-label="コンサルタントが4つの学生チームを監修し、アソシエイト学生の昇格から新チームが生まれる組織図">
    <div className={styles.dots} aria-hidden="true" />
    <div ref={supervisorRef} className={`${styles.card} ${styles.supervisor}`}>
      <Avatar size="supervisor" />
      <div className={styles.supervisorBody}><strong>プロフェッショナルコンサルタント</strong><div className={styles.tags}>{['監修', '助言', '品質管理', '育成'].map((tag) => <span className={styles.tag} key={tag}>{tag}</span>)}</div></div>
    </div>
    <div className={styles.mobileStem} aria-hidden="true" />
    <div className={styles.teams}>
      {teams.map((team, index) => <section key={index} ref={(node) => { teamRefs.current[index] = node; }} className={`${styles.card} ${styles.team} ${team.kind === 'new' ? styles.newTeam : ''} ${team.kind === 'future' ? styles.futureTeam : ''}`} aria-label={`${team.title}${team.kind === 'new' ? '（昇格による新チーム）' : team.kind === 'future' ? '（次のチーム）' : ''}`}>
        {team.kind === 'new' && <span className={styles.promotionBadge}>昇格＆組成</span>}
        <div className={styles.teamHeading}><Avatar size="lead" className={team.kind === 'new' ? styles.promotedLead : team.kind === 'future' ? styles.emptyLead : ''} avatarRef={(node) => { leadRefs.current[index] = node; }} /><h3>{team.title}</h3></div>
        <div className={styles.tags}>{team.tags.map((tag) => <span className={`${styles.tag} ${team.kind === 'future' ? styles.emptyTag : ''}`} key={tag}>{tag}</span>)}</div>
        <div className={styles.divider} />
        <p className={styles.associateLabel}>アソシエイト学生</p>
        <div className={styles.associates} aria-label={team.kind === 'future' ? 'これから加わる学生' : '学生4名'}>
          {(team.kind === 'future' ? [0, 1, 2] : [0, 1, 2, 3]).map((person) => <Avatar key={person} size="associate" className={team.kind === 'future' ? styles.emptyAssociate : index === 1 && person === 3 ? styles.promotingAssociate : ''} avatarRef={person === 3 && (index === 1 || index === 2) ? (node) => { associateRefs.current[index] = node; } : undefined} />)}
        </div>
      </section>)}
    </div>
    {geometry && <svg className={styles.lines} viewBox={`0 0 ${geometry.width} ${geometry.height}`} preserveAspectRatio="none" aria-hidden="true">
      <circle cx={geometry.root.x} cy={geometry.root.y} r="3" fill="#a1a1aa" />
      {geometry.tops.map((target, index) => { const d = branch(geometry.root, target); return <g key={index}><path d={d} pathLength="1" className={styles.branch} style={{ animationDelay: `${.2 + index * .08}s`, stroke: index === 3 ? '#e4e4e7' : '#d4d4d8' }} /><path d={d} pathLength="1" className={`${styles.branchBeam} ${index === 3 ? styles.faintBeam : ''}`} style={{ animationDelay: `${1.4 + index * .4}s` }} /></g>; })}
      {geometry.promotions.map(([from, to], index) => { const d = promotion(from, to); return <g key={index} className={index === 1 ? styles.faintPromotion : undefined}><path d={d} pathLength="1" className={styles.promotionLine} style={{ animationDelay: `${1.4 + index * .3}s` }} /><path d={d} pathLength="1" className={styles.promotionBeam} style={{ animationDelay: `${2.4 + index * 1.2}s` }} /></g>; })}
      <circle cx={geometry.newLead.x} cy={geometry.newLead.y} r="24" className={styles.ripple} />
    </svg>}
  </div>;
}
