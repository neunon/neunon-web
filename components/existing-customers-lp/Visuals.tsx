import type { ReactNode } from 'react';
import s from './lp.module.css';

/**
 * LP の図。実際のレポートの紙面ではなく「何をどう見るか」のイメージを伝えるためのもので、
 * 具体的な数値や文章は入れない（文字は見出し程度）。
 * 白地にサイトのゲンチアンブルーの階調でデータを描き、赤は「示唆」の1点だけに使う。
 * 個別の図は viewBox 640×460。ヒーローでは同じ図を縮小して並べる。
 */

const C = {
  panel: '#ffffff',
  edge: '#dde1e5',
  grid: '#eef0f2',
  label: '#60656c',
  d1: '#dbe8f0',
  d2: '#a9c8db',
  d3: '#4f88a6',
  d4: '#125b84',
  hi: '#0b3558',
  sig: '#d9433a',
  sigWash: 'rgba(217,67,58,.07)',
};

type Box = { x?: number; y?: number; width?: number; height?: number; bare?: boolean };

/** 図の共通の枠。bare のときは見出しを省く（縮小して使うとき） */
function Frame({ x, y, width, height, bare, title, children }: Box & { title: string; children: ReactNode }) {
  return (
    <svg x={x} y={y} width={width} height={height} viewBox="0 0 640 460" aria-hidden="true">
      <rect x="1" y="1" width="638" height="458" rx="16" fill={C.panel} stroke={C.edge} strokeWidth="2" />
      {!bare && title && (
        <text x="32" y="48" fill={C.label} fontSize="17" fontWeight="700" letterSpacing="1.5">{title}</text>
      )}
      {children}
    </svg>
  );
}

function Skel({ x, y, w, h = 8, o = 1 }: { x: number; y: number; w: number; h?: number; o?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={`rgba(18,91,132,${(0.13 * o).toFixed(3)})`} />;
}

/* ---------------------------------------------------------------- 業績 */
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
      {[400, 330, 260, 190, 120].map((y) => <line key={y} x1="56" x2="600" y1={y} y2={y} stroke={C.grid} strokeWidth="2" />)}
      {perf.map((p, i) => {
        const x = xs[i];
        const last = i === perf.length - 1;
        let y = base;
        return (
          <g key={i} opacity={last ? 0.55 : 1}>
            {[C.d1, C.d2, C.d4].map((c, j) => {
              y -= p[j];
              return <rect key={j} x={x} y={y} width="50" height={p[j] - 3} rx="3" fill={c} />;
            })}
            {last && <rect x={x - 4} y={tops[i] - 4} width="58" height={base - tops[i] + 5} rx="5" fill="none" stroke={C.d3} strokeWidth="1.5" strokeDasharray="4 5" />}
            <Skel x={x + 9} y={418} w={32} h={7} o={0.8} />
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

/* ---------------------------------------------------- 顧客・販売チャネル */
function band(x1: number, a1: number, b1: number, x2: number, a2: number, b2: number) {
  const m = (x1 + x2) / 2;
  return `M${x1},${a1} C${m},${a1} ${m},${a2} ${x2},${a2} L${x2},${b2} C${m},${b2} ${m},${b1} ${x1},${b1} Z`;
}

const channels = [
  { h: 110, tone: C.d2, op: 0.55, trend: 'down' },
  { h: 64, tone: C.d3, op: 0.75, trend: 'up' },
  { h: 46, tone: C.d3, op: 0.75, trend: 'sig' },
  { h: 30, tone: C.d2, op: 0.55, trend: 'flat' },
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
        const arrow = { fill: 'none', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
        return (
          <g key={i}>
            <path d={band(78, a1, b1, 470, a2, b2)} fill={c.tone} opacity={c.op} />
            <rect x="470" y={a2} width="14" height={c.h} rx="3" fill={c.trend === 'down' ? C.d2 : C.d4} />
            <Skel x={500} y={mid - 4} w={c.h > 60 ? 54 : 40} />
            {c.trend === 'up' && <path d={`M574,${mid + 7} l10,-12 l10,12`} stroke={C.d4} {...arrow} />}
            {c.trend === 'sig' && <path d={`M574,${mid + 7} l10,-12 l10,12`} stroke={C.sig} {...arrow} />}
            {c.trend === 'down' && <path d={`M574,${mid - 6} l10,12 l10,-12`} stroke={C.d2} {...arrow} />}
            {c.trend === 'flat' && <line x1="574" x2="594" y1={mid} y2={mid} stroke={C.d2} strokeWidth="3" strokeLinecap="round" />}
          </g>
        );
      })}
    </Frame>
  );
}

/* ------------------------------------------------------- 商品・サービス */
const bubbles: [number, number, number, string][] = [
  [150, 330, 34, C.d1], [222, 286, 20, C.d2], [262, 364, 17, C.d1], [300, 214, 27, C.d2],
  [392, 318, 21, C.d2], [176, 184, 15, C.d1], [452, 360, 13, C.d1],
  [522, 128, 25, C.d3], [508, 214, 17, C.d2],
];

export function VisProducts(props: Box) {
  return (
    <Frame {...props} title="商品・サービス">
      <rect x="352" y="84" width="248" height="164" rx="10" fill={C.sigWash} stroke={C.sig} strokeOpacity=".6" strokeDasharray="5 6" />
      <line x1="80" x2="600" y1="402" y2="402" stroke={C.label} strokeOpacity=".5" strokeWidth="1.5" />
      <line x1="80" x2="80" y1="402" y2="80" stroke={C.label} strokeOpacity=".5" strokeWidth="1.5" />
      <path d="M594,396 l8,6 l-8,6" fill="none" stroke={C.label} strokeOpacity=".5" strokeWidth="1.5" />
      <path d="M74,88 l6,-8 l6,8" fill="none" stroke={C.label} strokeOpacity=".5" strokeWidth="1.5" />
      <line x1="340" x2="340" y1="84" y2="398" stroke={C.edge} strokeDasharray="3 6" />
      <line x1="84" x2="600" y1="248" y2="248" stroke={C.edge} strokeDasharray="3 6" />
      <text x="600" y="432" textAnchor="end" fill={C.label} fontSize="16" fontWeight="700">伸び</text>
      <text x="94" y="94" fill={C.label} fontSize="16" fontWeight="700">商材との接点</text>
      {bubbles.map(([cx, cy, r, f], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={f} />)}
      <circle cx="430" cy="170" r="40" fill={C.d4} />
      <circle cx="430" cy="170" r="52" fill="none" stroke={C.sig} strokeWidth="2.5" />
      <circle cx="430" cy="170" r="52" fill="none" stroke={C.sig} opacity=".45" className={s.pulse} />
    </Frame>
  );
}

/* ------------------------------------------------------- 変化のシグナル */
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
      <line x1="40" x2="604" y1={axis} y2={axis} stroke={C.label} strokeOpacity=".45" strokeWidth="2" />
      {events.map((e) => {
        const color = e.kind === 'sig' ? C.sig : e.kind === 'hi' ? C.d4 : C.d2;
        const cardY = e.up ? 120 : 330;
        const stemTo = e.up ? cardY + 52 : cardY;
        const cx = Math.min(Math.max(e.x - 46, 24), 616 - 92);
        return (
          <g key={e.x}>
            <line x1={e.x} x2={e.x} y1={axis} y2={stemTo} stroke={color} strokeWidth="1.5" />
            <rect
              x={cx} y={cardY} width="92" height="52" rx="8"
              fill={e.kind === 'sig' ? C.sigWash : '#fff'}
              stroke={color} strokeWidth={e.kind === 'sig' ? 2.5 : 1.5}
            />
            <Skel x={cx + 12} y={cardY + 15} w={58} o={e.kind === 'mute' ? 0.8 : 1.4} />
            <Skel x={cx + 12} y={cardY + 30} w={38} o={0.7} />
            <circle cx={e.x} cy={axis} r={e.kind === 'mute' ? 5 : 7} fill={color} />
            {e.kind === 'sig' && (
              <>
                <circle cx={e.x} cy={axis} r="18" fill="none" stroke={C.sig} opacity=".5" className={s.pulse} />
                <circle cx={e.x} cy={axis} r="30" fill="none" stroke={C.sig} opacity=".2" />
              </>
            )}
          </g>
        );
      })}
    </Frame>
  );
}

/* ------------------------------------------------- 提案のヒント（事実 → 言えること） */
export function VisInsight(props: Box) {
  return (
    <Frame {...props} title="提案のヒント">
      {[0, 1, 2].map((i) => {
        const y = 96 + i * 112;
        const first = i === 0;
        return (
          <g key={i} opacity={first ? 1 : 0.6}>
            <rect x="32" y={y} width="220" height="84" rx="10" fill="#f5f8fa" stroke={C.edge} strokeWidth="1.5" />
            <Skel x={52} y={y + 26} w={150} h={9} />
            <Skel x={52} y={y + 46} w={104} h={9} o={0.7} />
            <line x1="266" x2="340" y1={y + 42} y2={y + 42} stroke={first ? C.sig : C.d3} strokeWidth="2.5" />
            <path d={`M332,${y + 34} l9,8 l-9,8`} fill="none" stroke={first ? C.sig : C.d3} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="354" y={y} width="254" height="84" rx="10" fill={first ? C.sigWash : '#fff'} stroke={first ? C.sig : C.d3} strokeWidth="2" />
            <rect x="374" y={y + 24} width="190" height="12" rx="6" fill={first ? C.sig : C.d4} opacity={first ? 0.85 : 0.55} />
            <rect x="374" y={y + 46} width="132" height="12" rx="6" fill={first ? C.sig : C.d4} opacity={first ? 0.45 : 0.3} />
          </g>
        );
      })}
    </Frame>
  );
}

/* ------------------------------------------------------------ ヒーロー */
/** 4つの分析が、提案のヒントにまとまる。上段の縮小図は「レポートでわかること」と同じもの */
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
    <svg viewBox="-12 -12 784 616" className={s.heroVis} role="img" aria-label="業績、顧客・販路、商品、変化のシグナルの4つの分析が、提案のヒントにまとまるイメージ">
      {cards.map(({ C: Vis, label }, i) => {
        const x = i * (w + gap);
        const cx = x + w / 2;
        return (
          <g key={label}>
            <path d={`M${cx},${h + 40} C${cx},${meet.y - 40} ${meet.x},${meet.y - 70} ${meet.x},${meet.y - 14}`} fill="none" stroke={C.d3} strokeOpacity=".7" strokeWidth="1.5" />
            <Vis x={x} y={0} width={w} height={h} bare />
            <text x={x + 2} y={h + 26} fill={C.label} fontSize="14" fontWeight="700" letterSpacing="1">
              <tspan fill={C.d3}>{`0${i + 1}`}</tspan>　{label}
            </text>
          </g>
        );
      })}
      <circle cx={meet.x} cy={meet.y} r="14" fill="#fff" stroke={C.hi} strokeWidth="2" />
      <circle cx={meet.x} cy={meet.y} r="5" fill={C.hi} />
      <line x1={meet.x} x2={meet.x} y1={meet.y + 14} y2="318" stroke={C.sig} strokeWidth="2" />
      <path d={`M${meet.x - 6},312 l6,8 l6,-8`} fill="none" stroke={C.sig} strokeWidth="2" />

      <rect x="60" y="328" width="640" height="252" rx="16" fill="#fff" stroke={C.sig} strokeWidth="2" />
      <text x="88" y="368" fill={C.sig} fontSize="15" fontWeight="700" letterSpacing="1.5">
        <tspan fill={C.d3}>05</tspan>　提案のヒント
      </text>
      {[0, 1, 2].map((i) => {
        const y = 390 + i * 62;
        const first = i === 0;
        return (
          <g key={i} opacity={first ? 1 : 0.6}>
            <rect x="88" y={y} width="250" height="46" rx="8" fill="#f5f8fa" stroke={C.edge} />
            <Skel x={104} y={y + 13} w={170} h={8} />
            <Skel x={104} y={y + 27} w={110} h={8} o={0.7} />
            <line x1="346" x2="392" y1={y + 23} y2={y + 23} stroke={first ? C.sig : C.d3} strokeWidth="2" />
            <path d={`M386,${y + 17} l7,6 l-7,6`} fill="none" stroke={first ? C.sig : C.d3} strokeWidth="2" />
            <rect x="402" y={y} width="270" height="46" rx="8" fill={first ? C.sigWash : '#fff'} stroke={first ? C.sig : C.d3} strokeWidth="1.5" />
            <rect x="418" y={y + 12} width="196" height="9" rx="4.5" fill={first ? C.sig : C.d4} opacity={first ? 0.85 : 0.5} />
            <rect x="418" y={y + 27} width="132" height="9" rx="4.5" fill={first ? C.sig : C.d4} opacity={first ? 0.45 : 0.28} />
          </g>
        );
      })}
    </svg>
  );
}
