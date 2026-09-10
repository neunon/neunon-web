'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { roleLabels, type PublicTalent, type TalentFacets } from '@/lib/talent';
import { areaCategories, skillCategories, type TalentCategory } from '@/lib/talentTaxonomy';

export function TalentPanel({ talents, facets }: { talents: PublicTalent[]; facets: TalentFacets }) {
  const [keyword, setKeyword] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const needle = keyword.trim().toLocaleLowerCase('ja');
    return talents.filter((talent) => {
      const haystack = [talent.displayName, talent.universityCategory, talent.appeal, talent.recordSummary, ...talent.skills, ...talent.serviceAreas].join(' ').toLocaleLowerCase('ja');
      return (!needle || haystack.includes(needle)) && skills.every((skill) => talent.skills.includes(skill)) && areas.every((area) => talent.serviceAreas.includes(area));
    });
  }, [areas, keyword, skills, talents]);

  const selectedTalents = talents.filter((talent) => selected.includes(talent.id));
  const hasFilter = keyword.trim() !== '' || skills.length > 0 || areas.length > 0;

  function toggle(value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) {
    setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  function toggleTalent(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <>
      <div className="nc-talent-search">
        <label htmlFor="talent-keyword">キーワードから探す</label>
        <div>
          <input id="talent-keyword" type="search" value={keyword} placeholder="例：Python、市場調査、財務モデル" onChange={(event) => setKeyword(event.target.value)} />
          <span aria-hidden="true">⌕</span>
        </div>
      </div>

      <div className="nc-talent-quick">
        <FilterRow label="よく使われるスキル">
          {facets.skills.slice(0, 8).map((value) => <Chip key={value} label={value} on={skills.includes(value)} onClick={() => toggle(value, setSkills)} />)}
        </FilterRow>
        <FilterRow label="主な対応領域">
          {facets.serviceAreas.slice(0, 8).map((value) => <Chip key={value} label={value} on={areas.includes(value)} onClick={() => toggle(value, setAreas)} />)}
        </FilterRow>
        <button type="button" className="nc-filter-more" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
          {showAll ? '詳細条件を閉じる' : 'すべての条件を見る'}<span aria-hidden="true">{showAll ? '−' : '+'}</span>
        </button>
      </div>

      {skills.length > 0 || areas.length > 0 ? (
        <div className="nc-active-filters" aria-label="選択中の条件">
          <span>選択中</span>
          <div>
            {skills.map((value) => <Chip key={`skill-${value}`} label={`${value} ×`} on onClick={() => toggle(value, setSkills)} />)}
            {areas.map((value) => <Chip key={`area-${value}`} label={`${value} ×`} on onClick={() => toggle(value, setAreas)} />)}
          </div>
        </div>
      ) : null}

      {showAll ? (
        <div className="nc-talent-advanced">
          <CategoryFilter title="スキル" categories={skillCategories} selected={skills} onToggle={(value) => toggle(value, setSkills)} />
          <CategoryFilter title="対応領域" categories={areaCategories} selected={areas} onToggle={(value) => toggle(value, setAreas)} />
        </div>
      ) : null}

      <div className="nc-result-bar">
        <p className="nc-result-count" aria-live="polite"><strong>{filtered.length}</strong> 名を表示</p>
        {hasFilter ? <button type="button" className="nc-reset" onClick={() => { setKeyword(''); setSkills([]); setAreas([]); }}>条件をクリア</button> : null}
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
                  <span className="nc-talent-index">{talent.id.replace('t-', '')}</span>
                  <span className={`nc-talent-role is-${talent.role}`}>{roleLabels[talent.role]}</span>
                </div>
                <h2 className="nc-talent-name"><Link href={`/talent/${talent.id}`}>{talent.displayName}</Link></h2>
                <p className="nc-talent-meta">{talent.universityCategory}　/　{talent.grade}年</p>
                <p className="nc-talent-appeal">{talent.appeal}</p>
                <TalentTags label="主なスキル" primary={talent.primarySkills} all={talent.skills} />
                <TalentTags label="主な対応領域" primary={talent.primaryAreas} all={talent.serviceAreas} />
                <div className="nc-talent-actions">
                  <Link href={`/talent/${talent.id}`} className="nc-more"><i aria-hidden="true" />詳しく見る</Link>
                  <button type="button" className="nc-talent-select" aria-pressed={isSelected} onClick={() => toggleTalent(talent.id)}>{isSelected ? '選択済み' : '相談候補に追加'}</button>
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
  const count = Math.max(0, all.length - primary.length);
  return <div className="nc-talent-tags"><span>{label}</span><div className="nc-tags">{primary.map((item) => <span className="nc-tag" key={item}>{item}</span>)}{count > 0 ? <span className="nc-tag nc-tag-more">+{count}</span> : null}</div></div>;
}

function CategoryFilter({ title, categories, selected, onToggle }: { title: string; categories: TalentCategory[]; selected: string[]; onToggle: (value: string) => void }) {
  return <section><h3>{title}</h3>{categories.map((category) => <details className="nc-filter-category" key={category.label}><summary>{category.label}<small>{category.items.length}</small></summary><div>{category.items.map((item) => <Chip key={item} label={item} on={selected.includes(item)} onClick={() => onToggle(item)} />)}</div></details>)}</section>;
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="nc-filter" role="group" aria-label={`${label}で絞り込む`}><span className="nc-filter-label">{label}</span><div className="nc-filter-set">{children}</div></div>;
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return <button type="button" className={`nc-fchip ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={onClick}>{label}</button>;
}

function createContactHref(talents: PublicTalent[]) {
  const params = new URLSearchParams({ topic: '人材について' });
  talents.forEach((talent) => params.append('talent', talent.displayName));
  return `/contact?${params.toString()}`;
}
