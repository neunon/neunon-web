'use client';

import { useState, type KeyboardEvent } from 'react';
import { IMG, lenses, products } from './data';
import s from './lp.module.css';

/**
 * 同じ顧客（ミオリ食品）でも、依頼元の商材によって分析で厚く見る商品と、
 * 導かれる提案仮説が変わることを示す切替。
 * 商品図は全視点で共通に並べ、該当する商品だけを強調する。
 */
export function LensSwitcher() {
  const [active, setActive] = useState(0);
  const lens = lenses[active];
  const focus = new Set<string>(lens.products);

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    setActive((active + (e.key === 'ArrowRight' ? 1 : lenses.length - 1)) % lenses.length);
  }

  return (
    <div className={s.lens}>
      <div className={s.lensTabs} role="tablist" aria-label="依頼元の商材" onKeyDown={onKey}>
        {lenses.map((l, i) => (
          <button
            key={l.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls="lens-panel"
            tabIndex={i === active ? 0 : -1}
            className={s.lensTab}
            onClick={() => setActive(i)}
          >
            <span className={s.lensTabTag}>{l.tag}</span>
            <span className={s.lensTabName}>{l.seller}が依頼したら</span>
          </button>
        ))}
      </div>

      <div className={s.lensPanel} role="tabpanel" id="lens-panel">
        <ul className={s.shelf} aria-label="ミオリ食品（架空）の主な商品">
          {products.map((p) => {
            const on = focus.has(p.id);
            return (
              <li key={p.id} className={on ? s.shelfOn : s.shelfOff} style={{ flexGrow: p.w }}>
                <img src={`${IMG}/product-${p.id}.webp`} width={p.w} height={420} alt={p.label} loading="lazy" decoding="async" />
                <span>{p.label}</span>
              </li>
            );
          })}
        </ul>

        <dl className={s.lensResult}>
          <div>
            <dt>厚く見る点</dt>
            <dd>{lens.looks}</dd>
          </div>
          <div>
            <dt>レポートの重心</dt>
            <dd>{lens.page}</dd>
          </div>
          <div className={s.lensHypo}>
            <dt>導かれる提案仮説</dt>
            <dd>{lens.hypothesis}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
