'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { roleLabels, type PublicTalent, type TalentFacets, type TalentRole } from '@/lib/talent';

/**
 * 人材パネル（要件定義書 6.5 フェーズ1）。
 *
 * 受け取るのは PublicTalent のみ。private フィールドは lib/talent.server.ts で
 * 破棄されるため、このクライアントコンポーネントには到達しない
 * （＝静的出力にも含まれない）。
 *
 * フィルタ: 区分／スキルタグ／対応可能業務／稼働状況
 */

export function TalentPanel({
  talents,
  facets,
}: {
  talents: PublicTalent[];
  facets: TalentFacets;
}) {
  const [role, setRole] = useState<TalentRole | null>(null);
  const [skill, setSkill] = useState<string | null>(null);
  const [work, setWork] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      talents.filter(
        (talent) =>
          (role === null || talent.role === role) &&
          (skill === null || talent.skills.includes(skill)) &&
          (work === null || talent.availableWork.includes(work)) &&
          (status === null || talent.availabilityStatus === status),
      ),
    [talents, role, skill, work, status],
  );

  const hasFilter = role !== null || skill !== null || work !== null || status !== null;

  function reset() {
    setRole(null);
    setSkill(null);
    setWork(null);
    setStatus(null);
  }

  return (
    <>
      <div className="nc-filters">
        <FilterRow label="区分">
          {facets.roles.map((value) => (
            <Chip
              key={value}
              label={roleLabels[value]}
              on={role === value}
              onClick={() => setRole(role === value ? null : value)}
            />
          ))}
        </FilterRow>

        <FilterRow label="稼働状況">
          {facets.availabilityStatus.map((value) => (
            <Chip
              key={value}
              label={value}
              on={status === value}
              onClick={() => setStatus(status === value ? null : value)}
            />
          ))}
        </FilterRow>

        <FilterRow label="スキル">
          {facets.skills.map((value) => (
            <Chip
              key={value}
              label={value}
              on={skill === value}
              onClick={() => setSkill(skill === value ? null : value)}
            />
          ))}
        </FilterRow>

        <FilterRow label="対応可能業務">
          {facets.availableWork.map((value) => (
            <Chip
              key={value}
              label={value}
              on={work === value}
              onClick={() => setWork(work === value ? null : value)}
            />
          ))}
        </FilterRow>
      </div>

      <div className="nc-result-bar">
        <p className="nc-result-count" aria-live="polite">
          {filtered.length}名を表示
        </p>
        {hasFilter ? (
          <button type="button" className="nc-reset" onClick={reset}>
            条件をクリア
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="nc-empty">条件に合う登録者がいません。条件を減らしてお試しください。</p>
      ) : (
        <ul className="nc-talentgrid">
          {filtered.map((talent) => (
            <li className="nc-talentcard" key={talent.id}>
              <div className="nc-talent-head">
                <span className={`nc-talent-role is-${talent.role}`}>
                  {roleLabels[talent.role]}
                </span>
                <span className="nc-talent-status" data-status={talent.availabilityStatus}>
                  {talent.availabilityStatus}
                </span>
              </div>

              <h2 className="nc-talent-name">
                <Link href={`/talent/${talent.id}`}>{talent.displayName}</Link>
              </h2>
              <p className="nc-talent-meta">
                {talent.universityCategory}　/　{talent.grade}年
              </p>

              <dl className="nc-talent-facts">
                <div>
                  <dt>スキル</dt>
                  <dd>
                    <span className="nc-tags">
                      {talent.skills.map((item) => (
                        <span className="nc-tag" key={item}>
                          {item}
                        </span>
                      ))}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>対応可能業務</dt>
                  <dd>{talent.availableWork.join('、')}</dd>
                </div>
                <div>
                  <dt>過去実績</dt>
                  <dd>{talent.recordSummary}</dd>
                </div>
                <div>
                  <dt>稼働可能時間</dt>
                  <dd>{talent.availability}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="nc-filter" role="group" aria-label={`${label}で絞り込む`}>
      <span className="nc-filter-label">{label}</span>
      <div className="nc-filter-set">{children}</div>
    </div>
  );
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`nc-fchip ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={onClick}>
      {label}
    </button>
  );
}
