import type { ConsultingFormatDiagram, ConsultingPriceChart } from '@/lib/content';

/**
 * 紹介資料の図をそのままWebに置き換えた2点。
 * 出典: 「コンサルティング事業_紹介資料.pptx」スライド9（支援形態）とスライド15（価格構造比較）。
 *
 * どちらも装飾ではなく情報なので、SVG には role="img" と <title>/<desc> を置き、
 * 直後に同じ内容をテキストでも置いている（スクリーンリーダーと印刷向け）。
 * 狭い画面では図が潰れて読めなくなるため、横スクロールできる枠に入れる。
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
    <figure className="nc-consulting-figure">
      <div className="nc-consulting-figure-scroll">
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

          {/* クライアント */}
          <g className="nc-dg-client">
            <rect x={clientX} y={30} width={clientW} height={360} rx="2" />
            <text x={clientX + clientW / 2} y={200} textAnchor="middle" className="nc-dg-client-label">
              {diagram.client}
            </text>
            {diagram.clientNote ? (
              <text x={clientX + clientW / 2} y={224} textAnchor="middle" className="nc-dg-note">
                {diagram.clientNote}
              </text>
            ) : null}
          </g>

          {/* 自社・パートナー */}
          {diagram.actors.map((actor) => {
            const box = ACTOR_LAYOUT[actor.id];
            const lines = actor.label.split('\n');
            const startY = box.y + box.h / 2 - ((lines.length - 1) * 9) - (actor.note ? 6 : 0);
            return (
              <g key={actor.id} className={`nc-dg-actor is-${actor.id}`}>
                <rect x={actorX} y={box.y} width={actorW} height={box.h} rx="2" />
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
            <path d={`M${actorX + 60},${ACTOR_LAYOUT.pro.y + ACTOR_LAYOUT.pro.h} L${actorX + 60},${ACTOR_LAYOUT.student.y}`} markerEnd="url(#fmt-arrow)" />
            <text x={actorX + 72} y={ACTOR_LAYOUT.pro.y + ACTOR_LAYOUT.pro.h + 40} className="nc-dg-route-label">
              品質管理・監修
            </text>
          </g>

          {/* 各支援形態 → クライアント */}
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
      </div>
      <figcaption>
        案件特性に応じて、①〜④のいずれかで体制を組みます。プロフェッショナルが実務を担う形から、
        学生が直接支援する形、外部パートナーと連携する形まで。
      </figcaption>
    </figure>
  );
}

export function PriceChart({ chart }: { chart: ConsultingPriceChart }) {
  // 図の骨格（viewBox 座標）
  const baseline = 290;
  const top = 70;
  const barW = 84;
  const barX = [258, 438];
  const height = baseline - top;

  const totals = chart.columns.map((col) => col.segments.reduce((sum, seg) => sum + seg.value, 0));
  const max = Math.max(...totals);
  const scale = height / max;

  // 積み上げは上から順に置く。各セグメントの位置を先に確定させる
  const columns = chart.columns.map((col, ci) => {
    const total = totals[ci];
    let y = baseline - total * scale;
    const barTop = y;
    const segments = col.segments.map((seg) => {
      const h = seg.value * scale;
      const box = { ...seg, y, h, mid: y + h / 2 };
      y += h;
      return box;
    });

    /**
     * 薄いセグメントは中心に注記を置くと文字同士が重なる（当社の「学生」と「プロ」）。
     * 上から順に最小間隔を確保して逃がし、リーダー線を折って本来の位置へつなぐ。
     */
    const minGap = 18;
    const labelY: number[] = [];
    segments.forEach((seg, i) => {
      const wanted = seg.mid;
      labelY.push(i === 0 ? wanted : Math.max(wanted, labelY[i - 1] + minGap));
    });

    return {
      label: col.label,
      x: barX[ci],
      barTop,
      segments: segments.map((seg, i) => ({ ...seg, labelY: labelY[i] })),
    };
  });

  return (
    <figure className="nc-consulting-figure">
      <div className="nc-consulting-figure-scroll">
        <svg viewBox="0 0 720 340" role="img" aria-labelledby="prc-t prc-d" className="nc-consulting-svg nc-consulting-chart">
          <title id="prc-t">{chart.caption}</title>
          <desc id="prc-d">
            {chart.columns
              .map((col, ci) => `${col.label}の価格を100とすると${Math.round((totals[ci] / max) * 100)}。内訳は${col.segments.map((s) => s.label).join('、')}。`)
              .join('')}
          </desc>

          <defs>
            <marker id="prc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
          </defs>

          {/* 基準線 */}
          <line x1="150" y1={baseline} x2="600" y2={baseline} className="nc-dg-axis" />

          {/* 業界水準の高さを当社側まで引いて差を見せる */}
          <line x1={columns[0].x} y1={columns[0].barTop} x2="600" y2={columns[0].barTop} className="nc-dg-guide" />
          <line x1={columns[1].x} y1={columns[1].barTop} x2="600" y2={columns[1].barTop} className="nc-dg-guide" />
          <g className="nc-dg-gap">
            <line x1="592" y1={columns[0].barTop} x2="592" y2={columns[1].barTop} markerStart="url(#prc-arrow)" markerEnd="url(#prc-arrow)" />
          </g>

          {columns.map((col, ci) => (
            <g key={col.label}>
              {col.segments.map((seg) => (
                <rect
                  key={seg.label}
                  x={col.x}
                  y={seg.y}
                  width={barW}
                  height={seg.h}
                  className={`nc-dg-seg is-${seg.tone}`}
                />
              ))}
              <text x={col.x + barW / 2} y={baseline + 24} textAnchor="middle" className="nc-dg-cat">
                {col.label}
              </text>

              {/* 内訳の名前。左の棒は左側、右の棒は右側に出す */}
              {col.segments.map((seg) => {
                const isLeft = ci === 0;
                const edgeX = isLeft ? col.x : col.x + barW;
                const bendX = isLeft ? col.x - 8 : col.x + barW + 8;
                const endX = isLeft ? col.x - 16 : col.x + barW + 16;
                const textX = isLeft ? col.x - 22 : col.x + barW + 22;
                return (
                  <g key={`${seg.label}-label`}>
                    <path
                      d={`M${edgeX},${seg.mid} L${bendX},${seg.mid} L${endX},${seg.labelY} `}
                      className="nc-dg-leader"
                    />
                    <text
                      x={textX}
                      y={seg.labelY + 4}
                      textAnchor={isLeft ? 'end' : 'start'}
                      className="nc-dg-seg-label"
                    >
                      {seg.label}
                    </text>
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>

      <p className="nc-consulting-gap-note">{chart.annotation}</p>

      <figcaption>{chart.note}</figcaption>
    </figure>
  );
}
