'use client';

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';

export function IndustryGrid({ industries }: { industries: readonly string[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [pointing, setPointing] = useState(false);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: .15 });
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return;
    const grid = gridRef.current;
    if (!grid) return;
    const rect = grid.getBoundingClientRect();
    grid.style.setProperty('--industry-x', `${event.clientX - rect.left}px`);
    grid.style.setProperty('--industry-y', `${event.clientY - rect.top}px`);
    setPointing(true);
  }

  return <div ref={gridRef} className={`nc-inds nc-inds-motion ${visible ? 'is-visible' : ''} ${pointing ? 'is-pointing' : ''}`} aria-label="支援業界" onPointerMove={move} onPointerLeave={() => setPointing(false)}>
    {industries.map((industry, index) => <span className="nc-ind" key={industry} style={{ '--industry-index': index } as CSSProperties}>{industry}</span>)}
  </div>;
}
