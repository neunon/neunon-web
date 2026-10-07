'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Check } from 'lucide-react';
import { InteractiveHoverLink } from '@/components/ui/interactive-hover-button';
import { selectionSteps } from '@/lib/recruit';

const careerStages = [
  { number: '01', title: 'アソシエイト学生', body: '調査・データ分析・資料作成を担当。リード学生の指導のもとで、実務の基礎を身につけます。', tags: ['調査', 'データ分析', '資料作成'], associates: 0 },
  { number: '02', title: 'リード学生', body: '案件実務に加え、ディレクション、進捗管理、企業との窓口を担います。', tags: ['ディレクション', '進捗管理', '企業との窓口'], associates: 2 },
  { number: '03', title: '新しいチームへ', body: '自分のチームを組成し、新規サービスの企画や顧客開拓にも挑戦できます。', tags: ['チーム組成', 'サービス企画', '顧客開拓'], associates: 3 },
] as const;

function PersonIcon() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>;
}

function useEntered<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntered(true);
        observer.disconnect();
      }
    }, { threshold: .05 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return entered;
}

export function RecruitCareerPath() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const entered = useEntered(stageRef);
  const [geometry, setGeometry] = useState<{ width: number; height: number; paths: string[] } | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const root = stage.getBoundingClientRect();
      const paths = [0, 1].map((index) => {
        const from = cardRefs.current[index]?.getBoundingClientRect();
        const to = cardRefs.current[index + 1]?.getBoundingClientRect();
        if (!from || !to) return '';
        const x1 = from.right - root.left;
        const x2 = to.left - root.left;
        const y1 = from.top + 47 - root.top;
        const y2 = to.top + 47 - root.top;
        return `M ${x1} ${y1} C ${x1 + 36} ${y1}, ${x2 - 36} ${y2}, ${x2} ${y2}`;
      });
      setGeometry({ width: root.width, height: root.height, paths });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    cardRefs.current.forEach((card) => { if (card) observer.observe(card); });
    return () => observer.disconnect();
  }, []);

  return <div ref={stageRef} className={`nr-career ${entered ? 'is-entered' : ''}`}>
    {geometry ? <svg className="nr-career-lines" width={geometry.width} height={geometry.height} viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true">
      {geometry.paths.map((path, index) => <g key={index}>
        <path d={path} pathLength="1" className={`nr-career-line nr-career-line-${index}`} />
        <path d={path} pathLength="1" className={`nr-career-particle nr-career-particle-${index}`} />
      </g>)}
    </svg> : null}
    <ol className="nr-career-cards">
      {careerStages.map((stage, index) => <li key={stage.number} ref={(node) => { cardRefs.current[index] = node; }} className={`nr-career-card nr-career-card-${index}`} style={{ '--stage': index } as CSSProperties}>
        <div className="nr-career-card-inner">
          <div className="nr-career-top"><div className="nr-career-avatars">
            <span className="nr-career-avatar nr-career-avatar-lead"><PersonIcon /></span>
            {Array.from({ length: stage.associates }, (_, avatarIndex) => <span className="nr-career-avatar nr-career-avatar-small" key={avatarIndex}><PersonIcon /></span>)}
          </div><span className="nr-career-number">{stage.number}</span></div>
          <h3>{stage.title}</h3><p>{stage.body}</p>
          <div className="nr-career-tags">{stage.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
      </li>)}
    </ol>
  </div>;
}

export function RecruitSelectionRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const entered = useEntered(railRef);
  return <div ref={railRef} className={`nr-selection ${entered ? 'is-entered' : ''}`}>
    <div className="nr-selection-phase"><span>選考</span><span>参加準備</span></div>
    <ol className="nr-selection-steps">
      {selectionSteps.map((step, index) => <li key={step.no} style={{ '--step': index } as CSSProperties}>
        {index === 0 || index === 4 ? <span className="nr-selection-mobile-phase">{index === 0 ? '選考' : '参加準備'}</span> : null}
        <span className="nr-selection-dot">{step.no}</span>
        <h3>{step.title}</h3><p>{step.span}</p>
      </li>)}
    </ol>
    <div className="nr-selection-bottom">
      <div className="nr-selection-assurance">
        {['学部・学科は問いません', 'スキルも成績も問いません', '実務未経験でも構いません'].map((item) => <span key={item}><Check size={14} strokeWidth={2} aria-hidden="true" />{item}</span>)}
      </div>
      <InteractiveHoverLink href="/entry/" text="エントリーする" />
    </div>
  </div>;
}
