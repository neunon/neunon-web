import type { CSSProperties } from 'react';


const teams = [
  { lead: 'リード学生', action: '管理・ディレクション・育成', state: 'current' },
  { lead: 'リード学生', action: '管理・ディレクション・育成', state: 'current' },
  { lead: '新リード学生', action: 'チーム組成・管理', state: 'new' },
  { lead: '新リード学生', action: 'チーム組成・管理', state: 'future' },
] as const;

function PersonGlyph() {
  return (
    <span className="nc-org-glyph" aria-hidden="true">
      <i />
      <b />
    </span>
  );
}

function PersonAvatar({ featured = false }: { featured?: boolean }) {
  return (
    <span className={`nc-org-avatar${featured ? ' is-featured' : ''}`} aria-hidden="true">
      <PersonGlyph />
    </span>
  );
}

function AssociatePeople() {
  return (
    <div className="nc-org-associate-people" aria-hidden="true">
      <PersonGlyph />
      <PersonGlyph />
      <em />
      <PersonGlyph />
    </div>
  );
}

export function OrganizationDiagram() {
  return (
    <div className="nc-org" aria-label="アソシエイト学生がリード学生へ昇格して新しいチームを継続的に組成し、プロフェッショナルが全体を監修する組織体制">
      <div className="nc-org-scaler">
        <div className="nc-org-canvas">
          <div className="nc-org-supervisor">
            <PersonAvatar />
            <strong>プロフェッショナルコンサルタント</strong>
          </div>

          <div className="nc-org-oversight">監修・助言・品質管理・育成</div>

          {teams.map((team, index) => (
            <section
              className={`nc-org-team is-${team.state}`}
              key={`${team.lead}-${index}`}
              style={{ '--i': index } as CSSProperties}
            >
              <PersonAvatar featured={team.state === 'new' || team.state === 'future'} />
              <h3>{team.lead}</h3>
              <span className="nc-org-role">{team.action}</span>
              <svg className="nc-org-down" viewBox="0 0 12 104" preserveAspectRatio="none" aria-hidden="true">
                <path className="nc-org-down-line" d="M6 0V96" />
                <path className="nc-org-down-head" d="M0 96H12L6 104Z" />
              </svg>
              <AssociatePeople />
              <strong className="nc-org-associate-label">アソシエイト学生</strong>
            </section>
          ))}

          <svg className="nc-org-lines" viewBox="0 0 1320 764" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <marker id="nc-org-tree-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                <path d="M0 0 9 5 0 10Z" />
              </marker>
              <marker id="nc-org-promo-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto">
                <path d="M0 0 9 5 0 10Z" />
              </marker>
            </defs>
            <path className="nc-org-tree-path" d="M660 205V260M186 260H1134" />
            <path className="nc-org-tree-branch" d="M186 260V312" />
            <path className="nc-org-tree-branch" d="M502 260V312" />
            <path className="nc-org-tree-branch" d="M818 260V312" />
            <path className="nc-org-tree-branch" d="M1134 260V312" />
            <path className="nc-org-promo-path" d="M574 648H638Q660 648 660 626V406Q660 384 682 384H766" />
            <path className="nc-org-promo-path" d="M890 648H954Q976 648 976 626V406Q976 384 998 384H1082" />
          </svg>

          <span className="nc-org-promotion is-one" aria-hidden="true">昇格</span>
          <span className="nc-org-promotion is-two" aria-hidden="true">昇格</span>
          <span className="nc-org-continuation" aria-hidden="true">•••</span>
        </div>
      </div>
    </div>
  );
}
