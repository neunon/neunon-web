'use client';

import Link from 'next/link';
import { Check, Plus, Search, X } from 'lucide-react';
import { useMemo, useState, type CSSProperties, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { formatWeeklyAvailability, roleLabels, type PublicTalent, type TalentFacets } from '@/lib/talent';
import { areaCategories, skillCategories, type TalentCategory } from '@/lib/talentTaxonomy';

export function TalentPanel({ talents, facets }: { talents: PublicTalent[]; facets: TalentFacets }) {
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [movingChip, setMovingChip] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const terms = keyword.trim().toLocaleLowerCase('ja').split(/[\s\u3000]+/).filter(Boolean);
    return talents.filter((talent) => {
      const haystack = [talent.displayName, talent.universityCategory, talent.recordSummary, ...talent.skills, ...talent.serviceAreas].join(' ').toLocaleLowerCase('ja');
      return terms.every((term) => haystack.includes(term)) && skills.every((skill) => talent.skills.includes(skill)) && areas.every((area) => talent.serviceAreas.includes(area));
    });
  }, [areas, keyword, skills, talents]);

  const selectedTalents = talents.filter((talent) => selected.includes(talent.id));
  const hasFilter = keyword.trim() !== '' || skills.length > 0 || areas.length > 0;

  function toggleFilter(value: string, kind: 'skill' | 'area', event: MouseEvent<HTMLButtonElement>) {
    const setter = kind === 'skill' ? setSkills : setAreas;
    const update = () => setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      update();
      return;
    }

    const source = event.currentTarget;
    source.style.viewTransitionName = 'nc-moving-chip';
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setMovingChip(`${kind}:${value}`);
        update();
      });
    });
    void transition.finished.then(() => {
      source.style.viewTransitionName = '';
      setMovingChip(null);
    }, () => {
      source.style.viewTransitionName = '';
      setMovingChip(null);
    });
  }

  function toggleTalent(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <>
      <form className="nc-talent-search" role="search" onSubmit={(event) => { event.preventDefault(); setKeyword(searchInput.trim()); }}>
        <label htmlFor="talent-keyword">キーワードから探す</label>
        <div className="nc-talent-search-pill">
          <button type="submit" className="nc-search-submit" aria-label="検索する"><Search aria-hidden="true" size={19} strokeWidth={1.8} /></button>
          <input id="talent-keyword" type="text" value={searchInput} placeholder="大学名・スキルなどを複数語で検索" onChange={(event) => setSearchInput(event.target.value)} />
          {searchInput || keyword ? <button type="button" className="nc-search-clear" aria-label="検索語を消去" onClick={() => { setSearchInput(''); setKeyword(''); }}><X aria-hidden="true" size={17} strokeWidth={1.8} /></button> : null}
        </div>
      </form>

      <div className="nc-active-filters" aria-label="選択中の条件">
        <span>選択中の条件</span>
        <div>
          {skills.length === 0 && areas.length === 0 ? <p>スキル・対応領域を選択してください</p> : null}
          {skills.map((value) => <Chip key={`skill-${value}`} label={`${value} ×`} on transitionName={movingChip === `skill:${value}` ? 'nc-moving-chip' : undefined} onClick={(event) => toggleFilter(value, 'skill', event)} />)}
          {areas.map((value) => <Chip key={`area-${value}`} label={`${value} ×`} on transitionName={movingChip === `area:${value}` ? 'nc-moving-chip' : undefined} onClick={(event) => toggleFilter(value, 'area', event)} />)}
        </div>
      </div>

      <div className="nc-talent-quick">
        <FilterRow label="よく使われるスキル">
          {facets.skills.slice(0, 8).filter((value) => !skills.includes(value)).map((value) => <Chip key={value} label={value} on={false} transitionName={movingChip === `skill:${value}` ? 'nc-moving-chip' : undefined} onClick={(event) => toggleFilter(value, 'skill', event)} />)}
        </FilterRow>
        <FilterRow label="主な対応領域">
          {facets.serviceAreas.slice(0, 8).filter((value) => !areas.includes(value)).map((value) => <Chip key={value} label={value} on={false} transitionName={movingChip === `area:${value}` ? 'nc-moving-chip' : undefined} onClick={(event) => toggleFilter(value, 'area', event)} />)}
        </FilterRow>
        <button type="button" className="nc-filter-more" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
          {showAll ? '詳細条件を閉じる' : 'すべての条件を見る'}<span aria-hidden="true">{showAll ? '−' : '+'}</span>
        </button>
      </div>

      {showAll ? (
        <div className="nc-talent-advanced">
          <CategoryFilter title="スキル" categories={skillCategories} selected={skills} onToggle={(value, event) => toggleFilter(value, 'skill', event)} transitionNameFor={(value) => !facets.skills.slice(0, 8).includes(value) && movingChip === `skill:${value}` ? 'nc-moving-chip' : undefined} />
          <CategoryFilter title="対応領域" categories={areaCategories} selected={areas} onToggle={(value, event) => toggleFilter(value, 'area', event)} transitionNameFor={(value) => !facets.serviceAreas.slice(0, 8).includes(value) && movingChip === `area:${value}` ? 'nc-moving-chip' : undefined} />
        </div>
      ) : null}

      <div className="nc-result-bar">
        <p className="nc-result-count" aria-live="polite"><strong>{filtered.length}</strong> 名を表示</p>
        <p className="nc-selection-hint"><Plus aria-hidden="true" size={13} />カード右上の＋で相談候補に追加できます</p>
        {hasFilter ? <button type="button" className="nc-reset" onClick={() => { setSearchInput(''); setKeyword(''); setSkills([]); setAreas([]); }}>条件をクリア</button> : null}
      </div>

      {filtered.length === 0 ? (
        <p className="nc-empty">条件に合うメンバーがいません。条件を減らしてお試しください。</p>
      ) : (
        <ul className="nc-talentgrid">
          {filtered.map((talent) => {
            const isSelected = selected.includes(talent.id);
            return (
              <li className={`nc-talentcard ${isSelected ? 'is-selected' : ''}`} key={talent.id}>
                <div className="nc-talent-head">
                  <span className={`nc-talent-role is-${talent.role}`}>{roleLabels[talent.role]}</span>
                  <button type="button" className="nc-talent-select" aria-label={`${talent.displayName}を${isSelected ? '相談候補から外す' : '相談候補に追加'}`} aria-pressed={isSelected} onClick={() => toggleTalent(talent.id)}>{isSelected ? <Check aria-hidden="true" size={20} strokeWidth={2} /> : <Plus aria-hidden="true" size={20} strokeWidth={1.8} />}</button>
                </div>
                <h2 className="nc-talent-name"><Link href={`/talent/${talent.id}`}>{talent.displayName}</Link></h2>
                <p className="nc-talent-meta"><span>{talent.universityCategory}</span><span aria-hidden="true">/</span><span>{talent.grade}年</span></p>
                <div className="nc-talent-summary">
                  <div><span>想定稼働時間 / 週</span><strong>{formatWeeklyAvailability(talent.weeklyAvailability)}</strong></div>
                  <div><span>過去実績</span><strong>{talent.recordSummary || 'お問い合わせでご案内'}</strong></div>
                </div>
                <TalentTags label="主なスキル" primary={talent.primarySkills} all={talent.skills} />
                <TalentTags label="主な対応領域" primary={talent.primaryAreas} all={talent.serviceAreas} />
                <div className="nc-talent-actions">
                  <Link href={`/talent/${talent.id}`} className="nc-talent-details">詳しく見る <span aria-hidden="true">↗</span></Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {selectedTalents.length > 0 ? (
        <div className="nc-talent-selection" role="region" aria-label="選択したメンバー">
          <div><span>Selected</span><strong>{selectedTalents.map((talent) => talent.displayName).join(' / ')}</strong><small>{selectedTalents.length}名を相談候補に選択中</small></div>
          <Link href={createContactHref(selectedTalents)} className="btn">このメンバーについて相談する</Link>
          <button type="button" className="nc-reset" onClick={() => setSelected([])}>選択を解除</button>
        </div>
      ) : null}
    </>
  );
}

function TalentTags({ label, primary, all }: { label: string; primary: string[]; all: string[] }) {
  if (all.length === 0) return null;
  const count = Math.max(0, all.length - primary.length);
  return <div className="nc-talent-tags"><span>{label}</span><div className="nc-tags">{primary.map((item) => <span className="nc-tag" key={item}>{item}</span>)}{count > 0 ? <span className="nc-tag nc-tag-more">+{count}</span> : null}</div></div>;
}

function CategoryFilter({ title, categories, selected, onToggle, transitionNameFor }: { title: string; categories: TalentCategory[]; selected: string[]; onToggle: (value: string, event: MouseEvent<HTMLButtonElement>) => void; transitionNameFor: (value: string) => string | undefined }) {
  return <section><h3>{title}</h3>{categories.map((category) => <details className="nc-filter-category" key={category.label}><summary>{category.label}<small>{category.items.length}</small></summary><div>{category.items.filter((item) => !selected.includes(item)).map((item) => <Chip key={item} label={item} on={false} transitionName={transitionNameFor(item)} onClick={(event) => onToggle(item, event)} />)}</div></details>)}</section>;
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="nc-filter" role="group" aria-label={`${label}で絞り込む`}><span className="nc-filter-label">{label}</span><div className="nc-filter-set">{children}</div></div>;
}

function Chip({ label, on, onClick, transitionName }: { label: string; on: boolean; onClick: (event: MouseEvent<HTMLButtonElement>) => void; transitionName?: string }) {
  return <button type="button" className={`nc-fchip ${on ? 'is-on' : ''}`} aria-pressed={on} style={transitionName ? { viewTransitionName: transitionName } as CSSProperties : undefined} onClick={onClick}>{label}</button>;
}

function createContactHref(talents: PublicTalent[]) {
  const params = new URLSearchParams({ topic: '人材について' });
  talents.forEach((talent) => params.append('talent', talent.displayName));
  return `/contact?${params.toString()}`;
}
