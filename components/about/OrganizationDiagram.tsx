const teams = [
  { label: 'Team 01', lead: 'リード学生', note: '実務・管理・育成・窓口', state: 'current' },
  { label: 'Team 02', lead: 'リード学生', note: '実務・管理・育成・窓口', state: 'current' },
  { label: 'New team', lead: '新リード学生', note: '実務・管理・育成・窓口', state: 'new' },
  { label: 'Next team', lead: '次のリード学生', note: '実務・管理・育成・窓口', state: 'future' },
] as const;

export function OrganizationDiagram() {
  return (
    <div className="nc-org" aria-label="アソシエイト学生がリード学生へ昇格し、新しいチームを継続的に組成することで対応できる案件量を拡大する組織体制">
      <div className="nc-org-canvas">
        <div className="nc-org-supervisor">
          <span>Professional consultant</span>
          <strong>プロフェッショナルコンサルタント</strong>
          <small>監修・助言・品質管理・育成</small>
        </div>

        <div className="nc-org-network" aria-hidden="true">
          <span>全チームを横断して監修</span>
        </div>

        <div className="nc-org-teams">
          {teams.map((team) => (
            <section className={`nc-org-team is-${team.state}`} key={team.label}>
              <span className="nc-org-team-label">{team.label}</span>
              <div className="nc-org-lead">
                <strong>{team.lead}</strong>
                <small>{team.note}</small>
              </div>
              <div className="nc-org-teamline" aria-hidden="true" />
              <div className="nc-org-associates">
                <div aria-hidden="true">
                  <i /><i /><i /><em>···</em><i />
                </div>
                <strong>アソシエイト学生</strong>
                <small>人数を固定せず、案件に応じて編成</small>
              </div>
            </section>
          ))}
          {['one', 'two'].map((stage) => (
            <div className={`nc-org-promotion is-${stage}`} aria-hidden="true" key={stage}>
              <span>昇格</span>
              <svg viewBox="0 0 96 150" role="presentation">
                <path d="M4 138h18c13 0 20-7 20-21V39c0-16 8-24 24-24h22" />
                <path d="m80 7 9 8-9 8" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
