import type { ReactNode } from 'react';
import s from './lp.module.css';

/**
 * 読み解きの5段とヒーローで使う図。
 * 実際のレポートの紙面ではなく「何をどう見るか」のイメージを伝えるためのもので、
 * 具体的な数値や文章は入れない（文字は見出し程度）。
 * 夜色の地に青灰の階調でデータを描き、赤は「示唆」の1点だけに使う。
 * どの図も viewBox 640×460。ヒーローでは同じ図を縮小して並べる。
 */

const C = {
  panel: '#161d2b',
  edge: '#26324a',
  grid: 'rgba(255,255,255,.07)',
  label: 'rgba(255,255,255,.62)',
  d1: '#273652',
  d2: '#3c5480',
  d3: '#6582b0',
  d4: '#a6badb',
  hi: '#eaf0f9',
  sig: '#ff5a45',
};

type Box = { x?: number; y?: number; width?: number; height?: number; bare?: boolean };

/** 図の共通の枠。bare のときは見出しを省く（ヒーローの縮小版） */
function Frame({ x, y, width, height, bare, title, children }: Box & { title: string; children: ReactNode }) {
  return (
    <svg x={x} y={y} width={width} height={height} viewBox="0 0 640 460" aria-hidden="true">
      <rect x="0.5" y="0.5" width="639" height="459" rx="14" fill={C.panel} stroke={C.edge} />
      {!bare && (
        <text x="32" y="48" fill={C.label} fontSize="17" fontWeight="700" letterSpacing="1.5">{title}</text>
      )}
      {children}
    </svg>
  );
}

function Skel({ x, y, w, h = 8, o = 1 }: { x: number; y: number; w: number; h?: number; o?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={`rgba(255,255,255,${(0.14 * o).toFixed(3)})`} />;
}

/* ---------------------------------------------------------------- 01 業績 */
const perf = [
  [70, 60, 40],
  [72, 62, 58],
  [73, 61, 78],
  [74, 63, 100],
  [75, 64, 126],
  [76, 64, 156],
];

export function VisPerformance(props: Box) {
  const base = 400;
  const tops = perf.map((p) => base - p[0] - p[1] - p[2]);
  const xs = perf.map((_, i) => 92 + i * 88);
  return (
    <Frame {...props} title="業績・事業構成">
      {[400, 330, 260, 190, 120].map((y) => <line key={y} x1="56" x2="600" y1={y} y2={y} stroke={C.grid} />)}
      <g transform="translate(470 34)">
        {[C.d1, C.d2, C.d4].map((c, i) => (
          <g key={c} transform={`translate(${i * 46} 0)`}>
            <rect width="10" height="10" rx="2" fill={c} />
            <Skel x={16} y={1} w={22} />
          </g>
        ))}
      </g>
      {perf.map((p, i) => {
        const x = xs[i];
        const last = i === perf.length - 1;
        let y = base;
        return (
          <g key={i} opacity={last ? 0.62 : 1}>
            {[C.d1, C.d2, C.d4].map((c, j) => {
              y -= p[j];
              return <rect key={j} x={x} y={y} width="50" height={p[j] - 2} rx="2" fill={c} />;
            })}
            {last && <rect x={x - 3} y={tops[i] - 3} width="56" height={base - tops[i] + 4} rx="4" fill="none" stroke={C.d4} strokeDasharray="4 5" />}
            <Skel x={x + 9} y={416} w={32} h={7} o={0.8} />
          </g>
        );
      })}
      <polyline
        points={tops.map((t, i) => `${xs[i] + 25},${t - 22}`).join(' ')}
        fill="none" stroke={C.sig} strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round"
      />
      <circle cx={xs[5] + 25} cy={tops[5] - 22} r="6" fill={C.sig} />
      <circle cx={xs[5] + 25} cy={tops[5] - 22} r="14" fill="none" stroke={C.sig} opacity=".45" className={s.pulse} />
    </Frame>
  );
}

/* ------------------------------------------------------ 02 顧客・販売チャネル */
function band(x1: number, a1: number, b1: number, x2: number, a2: number, b2: number) {
  const m = (x1 + x2) / 2;
  return `M${x1},${a1} C${m},${a1} ${m},${a2} ${x2},${a2} L${x2},${b2} C${m},${b2} ${m},${b1} ${x1},${b1} Z`;
}

const channels = [
  { h: 110, tone: C.d2, op: 0.5, trend: 'down' },
  { h: 64, tone: C.d4, op: 0.8, trend: 'up' },
  { h: 46, tone: C.d4, op: 0.8, trend: 'sig' },
  { h: 30, tone: C.d3, op: 0.5, trend: 'flat' },
] as const;

export function VisChannels(props: Box) {
  const srcTop = 120;
  let s0 = srcTop;
  let t0 = 96;
  return (
    <Frame {...props} title="顧客・販売チャネル">
      <rect x="44" y={srcTop - 6} width="34" height="262" rx="6" fill={C.hi} />
      {channels.map((c, i) => {
        const a1 = s0, b1 = s0 + c.h;
        const a2 = t0, b2 = t0 + c.h;
        s0 = b1;
        t0 = b2 + 18;
        const mid = (a2 + b2) / 2;
        return (
          <g key={i}>
            <path d={band(78, a1, b1, 470, a2, b2)} fill={c.tone} opacity={c.op} />
            <rect x="470" y={a2} width="14" height={c.h} rx="3" fill={c.trend === 'down' ? C.d3 : C.hi} />
            <Skel x={500} y={mid - 4} w={c.h > 60 ? 54 : 40} />
            {c.trend === 'up' && <path d={`M574,${mid + 7} l10,-12 l10,12`} fill="none" stroke={C.hi} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
            {c.trend === 'sig' && <path d={`M574,${mid + 7} l10,-12 l10,12`} fill="none" stroke={C.sig} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
            {c.trend === 'down' && <path d={`M574,${mid - 6} l10,12 l10,-12`} fill="none" stroke={C.d3} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
            {c.trend === 'flat' && <line x1="574" x2="594" y1={mid} y2={mid} stroke={C.d3} strokeWidth="2.5" strokeLinecap="round" />}
          </g>
        );
      })}
    </Frame>
  );
}

/* ----------------------------------------------------- 03 商品・サービス */
const bubbles: [number, number, number, string][] = [
  [150, 330, 34, C.d1], [222, 286, 20, C.d2], [262, 364, 17, C.d1], [300, 214, 27, C.d2],
  [392, 318, 21, C.d2], [176, 184, 15, C.d1], [452, 360, 13, C.d1],
  [522, 128, 25, C.d4], [508, 214, 17, C.d3],
];

export function VisProducts(props: Box) {
  return (
    <Frame {...props} title="商品・サービス">
      <rect x="352" y="84" width="248" height="164" rx="8" fill="rgba(255,90,69,.06)" stroke={C.sig} strokeOpacity=".55" strokeDasharray="5 6" />
      <line x1="80" x2="600" y1="402" y2="402" stroke={C.label} strokeOpacity=".5" />
      <line x1="80" x2="80" y1="402" y2="80" stroke={C.label} strokeOpacity=".5" />
      <path d="M594,396 l8,6 l-8,6" fill="none" stroke={C.label} strokeOpacity=".5" />
      <path d="M74,88 l6,-8 l6,8" fill="none" stroke={C.label} strokeOpacity=".5" />
      <line x1="340" x2="340" y1="84" y2="398" stroke={C.grid} strokeDasharray="3 6" />
      <line x1="84" x2="600" y1="248" y2="248" stroke={C.grid} strokeDasharray="3 6" />
      <text x="600" y="430" textAnchor="end" fill={C.label} fontSize="15" fontWeight="700">伸び</text>
      <text x="92" y="94" fill={C.label} fontSize="15" fontWeight="700">商材との接点</text>
      {bubbles.map(([cx, cy, r, f], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={f} opacity=".95" />)}
      <circle cx="430" cy="170" r="40" fill={C.d4} />
      <circle cx="430" cy="170" r="52" fill="none" stroke={C.sig} strokeWidth="2.5" />
      <circle cx="430" cy="170" r="52" fill="none" stroke={C.sig} opacity=".45" className={s.pulse} />
    </Frame>
  );
}

/* --------------------------------------------------------- 04 変化のシグナル */
const events = [
  { x: 92, up: true, kind: 'mute' },
  { x: 172, up: false, kind: 'mute' },
  { x: 252, up: true, kind: 'hi' },
  { x: 332, up: false, kind: 'mute' },
  { x: 412, up: true, kind: 'sig' },
  { x: 492, up: false, kind: 'hi' },
  { x: 560, up: true, kind: 'mute' },
] as const;

export function VisSignals(props: Box) {
  const axis = 258;
  return (
    <Frame {...props} title="変化のシグナル">
      <line x1="40" x2="604" y1={axis} y2={axis} stroke={C.label} strokeOpacity=".45" strokeWidth="1.5" />
      {[132, 292, 452].map((x) => <line key={x} x1={x} x2={x} y1={axis - 6} y2={axis + 6} stroke={C.label} strokeOpacity=".45" />)}
      {events.map((e) => {
        const color = e.kind === 'sig' ? C.sig : e.kind === 'hi' ? C.hi : C.d3;
        const cardY = e.up ? 120 : 330;
        const stemTo = e.up ? cardY + 52 : cardY;
        const cx = Math.min(Math.max(e.x - 46, 24), 616 - 92);
        return (
          <g key={e.x}>
            <line x1={e.x} x2={e.x} y1={axis} y2={stemTo} stroke={color} strokeOpacity={e.kind === 'mute' ? 0.5 : 0.9} />
            <rect
              x={cx} y={cardY} width="92" height="52" rx="7"
              fill={e.kind === 'sig' ? 'rgba(255,90,69,.12)' : 'rgba(255,255,255,.04)'}
              stroke={color} strokeOpacity={e.kind === 'mute' ? 0.45 : 1} strokeWidth={e.kind === 'sig' ? 2 : 1}
            />
            <Skel x={cx + 12} y={cardY + 15} w={58} o={e.kind === 'mute' ? 0.7 : 1.2} />
            <Skel x={cx + 12} y={cardY + 30} w={38} o={0.7} />
            <circle cx={e.x} cy={axis} r={e.kind === 'mute' ? 5 : 7} fill={color} />
            {e.kind === 'sig' && (
              <>
                <circle cx={e.x} cy={axis} r="18" fill="none" stroke={C.sig} opacity=".5" className={s.pulse} />
                <circle cx={e.x} cy={axis} r="30" fill="none" stroke={C.sig} opacity=".22" />
              </>
            )}
          </g>
        );
      })}
    </Frame>
  );
}

/* ------------------------------------------------------------ 05 提案仮説 */
function MiniIcon({ kind }: { kind: number }) {
  if (kind === 0) return <g>{[10, 16, 24].map((h, i) => <rect key={i} x={i * 9} y={28 - h} width="6" height={h} rx="1" fill={C.d4} />)}</g>;
  if (kind === 1) return <g fill="none" stroke={C.d4} strokeWidth="2.5" strokeLinecap="round"><path d="M0,14 C12,14 12,4 26,4" /><path d="M0,14 C12,14 12,14 26,14" /><path d="M0,14 C12,14 12,24 26,24" /></g>;
  if (kind === 2) return <g fill={C.d4}><circle cx="5" cy="21" r="4" /><circle cx="14" cy="13" r="5" /><circle cx="22" cy="6" r="6" /></g>;
  return <g><line x1="0" x2="26" y1="14" y2="14" stroke={C.d4} strokeWidth="2" /><circle cx="5" cy="14" r="3" fill={C.d4} /><circle cx="14" cy="14" r="3" fill={C.d4} /><circle cx="22" cy="14" r="4.5" fill={C.sig} /></g>;
}

export function VisHypothesis(props: Box) {
  const ys = [92, 178, 264, 350];
  const node = { x: 330, y: 248 };
  return (
    <Frame {...props} title="">
      <text x="32" y="48" fill={C.label} fontSize="17" fontWeight="700" letterSpacing="1.5">根拠</text>
      <text x="306" y="48" fill={C.label} fontSize="17" fontWeight="700" letterSpacing="1.5">読み</text>
      <text x="410" y="48" fill={C.sig} fontSize="17" fontWeight="700" letterSpacing="1.5">提案</text>
      {ys.map((y, i) => (
        <g key={y}>
          <path d={`M206,${y + 28} C270,${y + 28} 270,${node.y} ${node.x - 22},${node.y}`} fill="none" stroke={C.d3} strokeOpacity=".7" strokeWidth="1.5" />
          <rect x="32" y={y} width="174" height="56" rx="8" fill="rgba(255,255,255,.04)" stroke={C.edge} />
          <g transform={`translate(48 ${y + 14})`}><MiniIcon kind={i} /></g>
          <Skel x={90} y={y + 18} w={92} />
          <Skel x={90} y={y + 32} w={60} o={0.7} />
        </g>
      ))}
      <circle cx={node.x} cy={node.y} r="22" fill={C.panel} stroke={C.hi} strokeWidth="2" />
      <circle cx={node.x} cy={node.y} r="7" fill={C.hi} />
      <line x1={node.x + 22} x2="408" y1={node.y} y2={node.y} stroke={C.sig} strokeWidth="2" />
      <path d={`M400,${node.y - 6} l8,6 l-8,6`} fill="none" stroke={C.sig} strokeWidth="2" />
      <rect x="410" y="92" width="198" height="314" rx="10" fill="rgba(255,90,69,.07)" stroke={C.sig} strokeWidth="2" />
      {[0, 1, 2].map((i) => {
        const y = 118 + i * 94;
        return (
          <g key={i} opacity={i === 0 ? 1 : 0.75}>
            <rect x="428" y={y} width="40" height="16" rx="8" fill={i === 0 ? C.sig : 'none'} stroke={i === 0 ? 'none' : C.label} strokeOpacity=".5" />
            <rect x="474" y={y} width="40" height="16" rx="8" fill="none" stroke={C.label} strokeOpacity=".5" />
            <Skel x={428} y={y + 30} w={150} h={9} o={i === 0 ? 1.6 : 1} />
            <Skel x={428} y={y + 47} w={112} h={9} o={i === 0 ? 1.2 : 0.8} />
            {i < 2 && <line x1="428" x2="590" y1={y + 78} y2={y + 78} stroke={C.edge} />}
          </g>
        );
      })}
    </Frame>
  );
}

/* ------------------------------------------------------------ ヒーロー */
/** 4つの分析が、1つの提案仮説に収束する。上段の縮小図は読み解きの01〜04と同じもの */
export function VisHero() {
  const cards = [
    { C: VisPerformance, label: '業績' },
    { C: VisChannels, label: '顧客・販路' },
    { C: VisProducts, label: '商品' },
    { C: VisSignals, label: '変化' },
  ];
  const w = 172;
  const h = 124;
  const gap = 24;
  const meet = { x: 380, y: 262 };
  return (
    <svg viewBox="0 0 760 600" className={s.heroVis} role="img" aria-label="業績、顧客・販路、商品、変化のシグナルの4つの分析が、1つの提案仮説にまとまるイメージ">
      {cards.map(({ C: Vis, label }, i) => {
        const x = i * (w + gap);
        const cx = x + w / 2;
        return (
          <g key={label}>
            <path d={`M${cx},${h + 40} C${cx},${meet.y - 40} ${meet.x},${meet.y - 70} ${meet.x},${meet.y - 14}`} fill="none" stroke={C.d3} strokeOpacity=".75" strokeWidth="1.5" />
            <Vis x={x} y={0} width={w} height={h} bare />
            <text x={x + 2} y={h + 26} fill={C.label} fontSize="14" fontWeight="700" letterSpacing="1">
              <tspan fill={C.d4}>{`0${i + 1}`}</tspan>　{label}
            </text>
          </g>
        );
      })}
      <circle cx={meet.x} cy={meet.y} r="14" fill="#0d121b" stroke={C.hi} strokeWidth="2" />
      <circle cx={meet.x} cy={meet.y} r="5" fill={C.hi} />
      <line x1={meet.x} x2={meet.x} y1={meet.y + 14} y2="318" stroke={C.sig} strokeWidth="2" />
      <path d={`M${meet.x - 6},312 l6,8 l6,-8`} fill="none" stroke={C.sig} strokeWidth="2" />

      <rect x="100.5" y="328.5" width="559" height="250" rx="14" fill={C.panel} stroke={C.sig} strokeWidth="2" />
      <text x="128" y="368" fill={C.sig} fontSize="15" fontWeight="700" letterSpacing="1.5">
        <tspan fill={C.d4}>05</tspan>　提案仮説
      </text>
      {[0, 1, 2].map((i) => {
        const y = 392 + i * 60;
        return (
          <g key={i} opacity={i === 0 ? 1 : 0.7}>
            <text x="128" y={y + 22} fill={i === 0 ? C.sig : C.d4} fontSize="22" fontWeight="700" fontFamily="Helvetica Neue, Arial, sans-serif">{i + 1}</text>
            <Skel x={160} y={y + 8} w={i === 0 ? 300 : 260} h={10} o={i === 0 ? 1.8 : 1} />
            <Skel x={160} y={y + 28} w={i === 0 ? 210 : 180} h={8} o={0.8} />
            <rect x="540" y={y + 8} width="44" height="18" rx="9" fill={i === 0 ? C.sig : 'none'} stroke={i === 0 ? 'none' : C.label} strokeOpacity=".5" />
            <rect x="590" y={y + 8} width="44" height="18" rx="9" fill="none" stroke={C.label} strokeOpacity=".5" />
            {i < 2 && <line x1="128" x2="632" y1={y + 48} y2={y + 48} stroke={C.edge} />}
          </g>
        );
      })}
    </svg>
  );
}
