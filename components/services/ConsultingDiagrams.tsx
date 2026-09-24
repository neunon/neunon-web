import type { ConsultingFormatDiagram, ConsultingPriceChart } from '@/lib/content';

/**
 * 紹介資料の図をWebに置き換えた2点。
 * 出典: 「コンサルティング事業_紹介資料.pptx」スライド9（支援形態）とスライド15（価格構造比較）。
 *
 * どちらも装飾ではなく情報なので role="img" と <title>/<desc> を持たせ、
 * 同じ内容をテキストでも読めるようにしている。
 * 横スクロールはさせない。価格図は狭い画面でも読める寸法に収め、
 * 関係図は幅を必要とするため、狭い画面では下の一覧（経路つき）に委ねて隠す。
 */

const ACTOR_LAYOUT = {
  pro: { y: 30, h: 74 },
  student: { y: 168, h: 74 },
  partner: { y: 306, h: 84 },
} as const;

/** 4つの支援形態が、どの主体からクライアントへ伸びるか */
const ROUTE_LAYOUT: Record<string, { from: number; to: number; labelY: number }> = {
  '①': { from: 58, to: 92, labelY: 62 },
  '②': { from: 196, to: 168, labelY: 168 },
  '③': { from: 228, to: 244, labelY: 246 },
  '④': { from: 348, to: 322, labelY: 322 },
};

export function FormatDiagram({
  diagram,
  items,
}: {
  diagram: ConsultingFormatDiagram;
  items: { no: string; title: string; role: string; from: string }[];
}) {
  const actorX = 24;
  const actorW = 236;
  const clientX = 636;
  const clientW = 180;

  return (
    <figure className="nc-consulting-figure is-flow">
      <svg viewBox="0 0 840 420" role="img" aria-labelledby="fmt-t fmt-d" className="nc-consulting-svg">
        <title id="fmt-t">支援形態の関係図</title>
        <desc id="fmt-d">
          プロフェッショナル、学生、パートナーの3者からクライアントへ、4通りの支援経路がある関係図。
        </desc>

        <defs>
          <marker id="fmt-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>

        <g className="nc-dg-client">
          <rect x={clientX} y={30} width={clientW} height={360} />
          <text x={clientX + clientW / 2} y={200} textAnchor="middle" className="nc-dg-client-label">
            {diagram.client}
          </text>
          {diagram.clientNote ? (
            <text x={clientX + clientW / 2} y={224} textAnchor="middle" className="nc-dg-note">
              {diagram.clientNote}
            </text>
          ) : null}
        </g>

        {diagram.actors.map((actor) => {
          const box = ACTOR_LAYOUT[actor.id];
          const lines = actor.label.split('\n');
          const startY = box.y + box.h / 2 - (lines.length - 1) * 9 - (actor.note ? 6 : 0);
          return (
            <g key={actor.id} className={`nc-dg-actor is-${actor.id}`}>
              <rect x={actorX} y={box.y} width={actorW} height={box.h} />
              {lines.map((line, i) => (
                <text key={line} x={actorX + actorW / 2} y={startY + i * 19} textAnchor="middle" className="nc-dg-actor-label">
                  {line}
                </text>
              ))}
              {actor.note ? (
                <text x={actorX + actorW / 2} y={startY + lines.length * 19 + 2} textAnchor="middle" className="nc-dg-note">
                  {actor.note}
                </text>
              ) : null}
            </g>
          );
        })}

        {/* プロ → 学生（品質管理） */}
        <g className="nc-dg-link is-supervise">
          <path
            d={`M${actorX + 60},${ACTOR_LAYOUT.pro.y + ACTOR_LAYOUT.pro.h} L${actorX + 60},${ACTOR_LAYOUT.student.y}`}
            markerEnd="url(#fmt-arrow)"
          />
          <text x={actorX + 72} y={ACTOR_LAYOUT.pro.y + ACTOR_LAYOUT.pro.h + 40} className="nc-dg-route-label">
            品質管理・監修
          </text>
        </g>

        {items.map((item) => {
          const route = ROUTE_LAYOUT[item.no];
          if (!route) return null;
          const x1 = actorX + actorW;
          const mid = (x1 + clientX) / 2;
          return (
            <g key={item.no} className={`nc-dg-link is-${item.from}`}>
              <path
                d={`M${x1},${route.from} C${mid},${route.from} ${mid},${route.to} ${clientX},${route.to}`}
                markerEnd="url(#fmt-arrow)"
              />
              <text x={mid} y={route.labelY - 10} textAnchor="middle" className="nc-dg-route-label">
                {item.no} {item.title}
              </text>
              <text x={mid} y={route.labelY + 8} textAnchor="middle" className="nc-dg-note">
                {item.role}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

/**
 * 価格構造比較。スライドの積み上げ棒をそのまま持ってきている。
 * 内訳の名前は図の外（HTMLの一覧）に出す。図中にリーダー線で引き出すと
 * 幅が必要になり、狭い画面で横スクロールが要るため。
 */
export function PriceChart({ chart }: { chart: ConsultingPriceChart }) {
  const baseline = 280;
  const top = 60;
  const barW = 70;
  const barX = [60, 200];

  const totals = chart.columns.map((col) => col.segments.reduce((sum, seg) => sum + seg.value, 0));
  const max = Math.max(...totals);
  const scale = (baseline - top) / max;

  const columns = chart.columns.map((col, ci) => {
    let y = baseline - totals[ci] * scale;
    const barTop = y;
    const segments = col.segments.map((seg) => {
      const h = seg.value * scale;
      const box = { ...seg, y, h };
      y += h;
      return box;
    });
    return { label: col.label, x: barX[ci], barTop, segments };
  });

  const [industry, ours] = columns;
  const annotation = chart.annotation.split('\n');
  /**
   * 吹き出しの位置はスライドに合わせる。差の中央ではなく、
   * 両方の棒の右側・業界水準線のすぐ下（差の上寄り）に置く。
   */
  const calloutLine = 23;
  const calloutH = 20 + annotation.length * calloutLine;
  const calloutY = industry.barTop + 10;

  return (
    <figure className="nc-consulting-figure is-chart">
      <svg viewBox="0 0 420 330" role="img" aria-labelledby="prc-t prc-d" className="nc-consulting-svg">
        <title id="prc-t">{chart.caption}</title>
        <desc id="prc-d">
          {columns
            .map((col, ci) => `${col.label}を${Math.round((totals[ci] / max) * 100)}とすると、内訳は${col.segments.map((s) => `${s.label}が${Math.round((s.value / totals[ci]) * 100)}パーセント`).join('、')}。`)
            .join('')}
        </desc>

        <defs>
          <marker id="prc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>

        {/* 2本の水準線と、その差 */}
        <line x1={industry.x} y1={industry.barTop} x2="408" y2={industry.barTop} className="nc-dg-guide" />
        <line x1={ours.x} y1={ours.barTop} x2="408" y2={ours.barTop} className="nc-dg-guide" />
        <g className="nc-dg-gap">
          <line x1="286" y1={industry.barTop + 3} x2="286" y2={ours.barTop - 3} markerStart="url(#prc-arrow)" markerEnd="url(#prc-arrow)" />
        </g>

        <g className="nc-dg-callout">
          <rect x="298" y={calloutY} width="112" height={calloutH} />
          {annotation.map((line, i) => (
            <text key={line} x="354" y={calloutY + 26 + i * calloutLine} textAnchor="middle">
              {line}
            </text>
          ))}
        </g>

        {columns.map((col) => (
          <g key={col.label}>
            {col.segments.map((seg) => (
              <rect key={seg.label} x={col.x} y={seg.y} width={barW} height={seg.h} className={`nc-dg-seg is-${seg.tone}`} />
            ))}
            <text x={col.x + barW / 2} y={baseline + 26} textAnchor="middle" className="nc-dg-cat">
              {col.label}
            </text>
          </g>
        ))}

        <line x1="40" y1={baseline} x2="300" y2={baseline} className="nc-dg-axis" />
      </svg>

      <div className="nc-consulting-breakdown">
        {chart.columns.map((col) => (
          <div key={col.label}>
            <h4>{col.label}</h4>
            <ul>
              {col.segments.map((seg) => (
                <li key={seg.label}>
                  <i className={`is-${seg.tone}`} aria-hidden="true" />
                  {seg.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <figcaption>{chart.note}</figcaption>
    </figure>
  );
}
