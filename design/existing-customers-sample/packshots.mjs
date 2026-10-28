/**
 * サンプル企業「サンプル化粧品株式会社」の商品画像（パックショット）を生成する。
 *
 * 実際の納品物では公開されている商品写真を引用するが、架空企業のサンプルでは使えないため、
 * 架空ブランドの容器を陰影つきで描いて商品画像の代わりにする。表記はすべて「BRAND A」「商品A-1」等のサンプル。
 *
 * 実行: node design/existing-customers-sample/packshots.mjs
 * 出力: design/existing-customers-sample/packshots/<name>.png（透過・余白なし・2倍解像度）
 */
import { createRequire } from 'node:module';
import { mkdirSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, 'packshots');
mkdirSync(outDir, { recursive: true });

const SANS = "'Segoe UI','Helvetica Neue',Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";
const JP = "'Yu Gothic','Meiryo',sans-serif";

/* ------------------------------------------------------------ 色 */
function hex(c) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function shade(c, p) {
  const [r, g, b] = hex(c);
  const f = (v) => Math.round(p >= 0 ? v + (255 - v) * p : v * (1 + p));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

/** 円筒の陰影（左右が暗く、左寄りに光） */
function cyl(id, c, { gloss = 0.35, dark = -0.22 } = {}) {
  return `<linearGradient id="${id}" x1="0" x2="1">
    <stop offset="0" stop-color="${shade(c, dark)}"/>
    <stop offset=".12" stop-color="${shade(c, dark / 3)}"/>
    <stop offset=".3" stop-color="${shade(c, gloss)}"/>
    <stop offset=".42" stop-color="${shade(c, gloss / 3)}"/>
    <stop offset=".78" stop-color="${c}"/>
    <stop offset="1" stop-color="${shade(c, dark * 1.2)}"/>
  </linearGradient>`;
}
const defsBase = `
  <radialGradient id="floor" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#20242c" stop-opacity=".32"/>
    <stop offset="1" stop-color="#20242c" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="shine" x1="0" x2="1">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".5" stop-color="#fff" stop-opacity=".55"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="base" x1="0" y1="0" x2="0" y2="1">
    <stop offset=".8" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity=".12"/>
  </linearGradient>`;

const floor = (cx, y, rx) => `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${Math.max(8, rx * 0.12)}" fill="url(#floor)"/>`;
const shine = (x, y, w, h, o = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2}" fill="url(#shine)" opacity="${o}"/>`;

/* ------------------------------------------------------------ 形 */
/** 肩の丸いボトル。neck は首の幅 */
function bottle({ cx, top, w, h, neck, neckH = 18, r = 22, fill, cap, capH = 52, capW, capFill }) {
  const x = cx - w / 2;
  const by = top + capH + neckH;
  const bh = h - capH - neckH;
  const cw = capW ?? neck + 10;
  return `
    <rect x="${cx - neck / 2}" y="${top + capH - 2}" width="${neck}" height="${neckH + 6}" fill="${capFill ? `url(#${capFill})` : '#ddd'}" opacity=".9"/>
    <path d="M${x} ${by + r} Q${x} ${by} ${x + r} ${by} L${x + w - r} ${by} Q${x + w} ${by} ${x + w} ${by + r} L${x + w} ${by + bh - 10} Q${x + w} ${by + bh} ${x + w - 10} ${by + bh} L${x + 10} ${by + bh} Q${x} ${by + bh} ${x} ${by + bh - 10}Z" fill="url(#${fill})"/>
    <path d="M${x} ${by + r} Q${x} ${by} ${x + r} ${by} L${x + w - r} ${by} Q${x + w} ${by} ${x + w} ${by + r} L${x + w} ${by + bh - 10} Q${x + w} ${by + bh} ${x + w - 10} ${by + bh} L${x + 10} ${by + bh} Q${x} ${by + bh} ${x} ${by + bh - 10}Z" fill="url(#base)"/>
    <rect x="${cx - cw / 2}" y="${top}" width="${cw}" height="${capH}" rx="6" fill="url(#${cap})"/>
    ${shine(x + w * 0.2, by + 14, w * 0.09, bh - 30, 0.7)}`;
}

/** ポンプヘッド（首・ステム・押し部・ノズル） */
function pump({ cx, base, w = 62, fill, nozzle = 46, h = 66 }) {
  return `
    <rect x="${cx - w / 2}" y="${base - 26}" width="${w}" height="28" rx="5" fill="url(#${fill})"/>
    <rect x="${cx - 7}" y="${base - h + 12}" width="14" height="${h - 36}" fill="url(#${fill})"/>
    <rect x="${cx - 26}" y="${base - h}" width="52" height="20" rx="6" fill="url(#${fill})"/>
    <path d="M${cx + 20} ${base - h + 4} h${nozzle} q8 0 8 6 v4 h-${nozzle + 8}Z" fill="url(#${fill})"/>`;
}

function label(lines, cx, y) {
  return lines.map(([t, size, font, color, weight = 400, ls = 0, dy = 0]) =>
    `<text x="${cx}" y="${y + dy}" text-anchor="middle" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${color}" letter-spacing="${ls}">${t}</text>`).join('');
}

/* ------------------------------------------------------------ 商品 */
const products = {};

// ミナモ（敏感肌スキンケア）：乳白の PET、ティールの文字
const MINAMO = '#2c7a83';
products['minamo-lotion'] = { w: 220, h: 520, svg: `
  <defs>${defsBase}${cyl('b', '#eef3f4', { gloss: 0.6, dark: -0.12 })}${cyl('c', '#f7f9f9', { gloss: 0.5, dark: -0.16 })}</defs>
  ${floor(110, 506, 70)}
  ${bottle({ cx: 110, top: 20, w: 124, h: 486, neck: 40, fill: 'b', cap: 'c', capW: 64, capH: 60, capFill: 'c' })}
  <path d="M70 250 q20 -10 40 0 t40 0" fill="none" stroke="${MINAMO}" stroke-width="2.4" opacity=".75"/>
  ${label([['BRAND A', 20, SANS, MINAMO, 600, 3], ['ブランドA', 12, JP, MINAMO, 600, 2, 26], ['商品A-1', 12, JP, '#4a5a5d', 400, 1, 58], ['SAMPLE', 10, SANS, '#6c7a7c', 400, 2, 78], ['200mL', 11, SANS, '#6c7a7c', 400, 1, 190]], 110, 300)}` };

products['minamo-milk'] = { w: 220, h: 470, svg: `
  <defs>${defsBase}${cyl('b', '#f1f5f5', { gloss: 0.6, dark: -0.12 })}${cyl('p', '#fafbfb', { gloss: 0.5, dark: -0.18 })}</defs>
  ${floor(110, 456, 70)}
  ${pump({ cx: 104, base: 118, fill: 'p' })}
  <path d="M48 140 Q48 118 70 118 L150 118 Q172 118 172 140 L172 446 Q172 456 162 456 L58 456 Q48 456 48 446Z" fill="url(#b)"/>
  ${shine(70, 136, 12, 300, 0.7)}
  <path d="M74 232 q18 -9 36 0 t36 0" fill="none" stroke="${MINAMO}" stroke-width="2.2" opacity=".75"/>
  ${label([['BRAND A', 18, SANS, MINAMO, 600, 3], ['ブランドA', 11, JP, MINAMO, 600, 2, 24], ['商品A-2', 12, JP, '#4a5a5d', 400, 1, 54], ['150mL', 10, SANS, '#6c7a7c', 400, 1, 160]], 110, 278)}` };

products['minamo-serum'] = { w: 160, h: 430, svg: `
  <defs>${defsBase}${cyl('b', '#e9eff0', { gloss: 0.6, dark: -0.15 })}${cyl('c', '#c9d2d4', { gloss: 0.6, dark: -0.25 })}</defs>
  ${floor(80, 416, 48)}
  <rect x="44" y="20" width="72" height="120" rx="8" fill="url(#c)"/>
  <rect x="40" y="138" width="80" height="278" rx="10" fill="url(#b)"/>
  <rect x="40" y="138" width="80" height="278" rx="10" fill="url(#base)"/>
  ${shine(52, 150, 8, 250, 0.7)}
  <rect x="40" y="398" width="80" height="18" rx="4" fill="${shade('#c9d2d4', -0.1)}"/>
  ${label([['BRAND A', 12, SANS, MINAMO, 600, 2], ['SAMPLE', 9, SANS, MINAMO, 400, 3, 20], ['商品A-3', 10, JP, '#4a5a5d', 400, 0, 46], ['30mL', 9, SANS, '#6c7a7c', 400, 1, 120]], 80, 230)}` };

products['minamo-cream'] = { w: 300, h: 230, svg: `
  <defs>${defsBase}${cyl('b', '#f2f5f5', { gloss: 0.6, dark: -0.14 })}${cyl('c', MINAMO, { gloss: 0.35, dark: -0.3 })}</defs>
  ${floor(150, 214, 110)}
  <rect x="40" y="26" width="220" height="74" rx="10" fill="url(#c)"/>
  <ellipse cx="150" cy="28" rx="108" ry="6" fill="${shade(MINAMO, 0.25)}" opacity=".6"/>
  <rect x="46" y="98" width="208" height="116" rx="14" fill="url(#b)"/>
  <rect x="46" y="98" width="208" height="116" rx="14" fill="url(#base)"/>
  ${shine(64, 108, 14, 96, 0.6)}
  ${label([['BRAND A', 18, SANS, MINAMO, 600, 4], ['商品A-4', 11, JP, '#4a5a5d', 400, 1, 24]], 150, 158)}` };

// クラシカ（高価格スキンケア）：すりガラスと金
const GOLD = '#b08d4a';
products['classica-lotion'] = { w: 220, h: 500, svg: `
  <defs>${defsBase}${cyl('b', '#e3ddd3', { gloss: 0.55, dark: -0.2 })}${cyl('c', GOLD, { gloss: 0.55, dark: -0.35 })}</defs>
  ${floor(110, 486, 76)}
  <rect x="62" y="20" width="96" height="92" rx="4" fill="url(#c)"/>
  <rect x="80" y="110" width="60" height="16" fill="url(#c)"/>
  <path d="M34 160 Q34 126 70 126 L150 126 Q186 126 186 160 L186 476 Q186 486 176 486 L44 486 Q34 486 34 476Z" fill="url(#b)"/>
  ${shine(52, 140, 14, 330, 0.55)}
  <rect x="60" y="250" width="100" height="1.2" fill="${GOLD}"/>
  ${label([['BRAND B', 19, SERIF, '#3a3226', 400, 4], ['SAMPLE', 10, SERIF, '#3a3226', 400, 4, 24], ['商品B-1', 10, JP, '#5b5246', 400, 1, 70]], 110, 300)}
  <rect x="60" y="340" width="100" height="1.2" fill="${GOLD}"/>` };

products['classica-serum'] = { w: 150, h: 430, svg: `
  <defs>${defsBase}${cyl('b', '#ddd5c9', { gloss: 0.55, dark: -0.22 })}${cyl('c', GOLD, { gloss: 0.55, dark: -0.35 })}${cyl('k', '#3a3226', { gloss: 0.3, dark: -0.35 })}</defs>
  ${floor(75, 416, 52)}
  <rect x="57" y="20" width="36" height="74" rx="17" fill="url(#k)"/>
  <rect x="47" y="90" width="56" height="66" rx="4" fill="url(#c)"/>
  <path d="M30 192 Q30 156 66 156 L84 156 Q120 156 120 192 L120 406 Q120 416 110 416 L40 416 Q30 416 30 406Z" fill="url(#b)"/>
  ${shine(42, 172, 9, 226, 0.55)}
  <rect x="45" y="246" width="60" height="1" fill="${GOLD}"/>
  ${label([['BRAND B', 12, SERIF, '#3a3226', 400, 3], ['SAMPLE', 8, SERIF, '#3a3226', 400, 3, 17], ['商品B-3', 9, JP, '#5b5246', 400, 1, 42]], 75, 286)}
  <rect x="45" y="346" width="60" height="1" fill="${GOLD}"/>` };

products['classica-cream'] = { w: 300, h: 240, svg: `
  <defs>${defsBase}${cyl('b', '#e7e2da', { gloss: 0.6, dark: -0.22 })}${cyl('c', GOLD, { gloss: 0.55, dark: -0.35 })}</defs>
  ${floor(150, 224, 112)}
  <rect x="44" y="24" width="212" height="70" rx="6" fill="url(#c)"/>
  <rect x="38" y="92" width="224" height="132" rx="20" fill="url(#b)"/>
  <rect x="38" y="92" width="224" height="132" rx="20" fill="url(#base)"/>
  ${shine(56, 104, 14, 108, 0.55)}
  ${label([['BRAND B', 18, SERIF, '#3a3226', 400, 5], ['商品B-2', 10, JP, '#5b5246', 400, 1, 24]], 150, 160)}` };

// ハレノヒ（UV）：白に空色と黄
const SKY = '#2f8fd0';
const SUN = '#f2b33d';
products['harenohi-tube'] = { w: 190, h: 470, svg: `
  <defs>${defsBase}${cyl('b', '#fbfbfa', { gloss: 0.5, dark: -0.14 })}${cyl('c', SKY, { gloss: 0.4, dark: -0.3 })}</defs>
  ${floor(95, 456, 60)}
  <rect x="40" y="20" width="110" height="18" rx="2" fill="${shade('#fbfbfa', -0.08)}"/>
  ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<rect x="${44 + i * 10.5}" y="22" width="2" height="14" fill="${shade('#fbfbfa', -0.18)}"/>`).join('')}
  <path d="M40 38 L150 38 L136 372 L54 372Z" fill="url(#b)"/>
  ${shine(62, 60, 10, 290, 0.6)}
  <circle cx="95" cy="150" r="22" fill="${SUN}"/>
  <rect x="58" y="146" width="74" height="4" fill="#fff" opacity=".0"/>
  ${label([['BRAND D', 17, SANS, SKY, 700, 3], ['SAMPLE', 9, SANS, SKY, 600, 3, 18], ['商品D-1', 10, JP, '#3b4a57', 600, 1, 46]], 95, 222)}
  <rect x="52" y="372" width="86" height="84" rx="10" fill="url(#c)"/>` };

products['harenohi-spray'] = { w: 170, h: 480, svg: `
  <defs>${defsBase}${cyl('b', '#f6f8fa', { gloss: 0.5, dark: -0.2 })}${cyl('c', SKY, { gloss: 0.45, dark: -0.32 })}${cyl('m', '#c4cad0', { gloss: 0.6, dark: -0.3 })}</defs>
  ${floor(85, 466, 56)}
  <path d="M38 132 Q38 82 85 78 Q132 82 132 132Z" fill="url(#c)" opacity=".92"/>
  <rect x="34" y="128" width="102" height="16" rx="3" fill="url(#m)"/>
  <rect x="32" y="142" width="106" height="316" rx="8" fill="url(#b)"/>
  <rect x="32" y="142" width="106" height="316" rx="8" fill="url(#base)"/>
  <rect x="32" y="446" width="106" height="12" rx="4" fill="url(#m)"/>
  ${shine(48, 156, 12, 280, 0.6)}
  <rect x="32" y="196" width="106" height="64" fill="${SKY}"/>
  ${label([['BRAND D', 16, SANS, '#fff', 700, 3], ['SAMPLE', 9, SANS, '#fff', 600, 3, 20], ['商品D-2', 10, JP, '#3b4a57', 600, 1, 72]], 85, 226)}
  <circle cx="85" cy="340" r="16" fill="${SUN}"/>` };

products['harenohi-stick'] = { w: 150, h: 330, svg: `
  <defs>${defsBase}${cyl('b', '#fbfbfa', { gloss: 0.5, dark: -0.16 })}${cyl('c', SKY, { gloss: 0.45, dark: -0.32 })}</defs>
  ${floor(75, 316, 46)}
  <rect x="34" y="20" width="82" height="110" rx="14" fill="url(#c)"/>
  <rect x="32" y="126" width="86" height="190" rx="12" fill="url(#b)"/>
  <rect x="32" y="126" width="86" height="190" rx="12" fill="url(#base)"/>
  ${shine(44, 136, 9, 166, 0.6)}
  <circle cx="75" cy="172" r="12" fill="${SUN}"/>
  ${label([['BRAND D', 12, SANS, SKY, 700, 2], ['SAMPLE', 8, SANS, SKY, 600, 2, 16], ['商品D-3', 9, JP, '#3b4a57', 600, 1, 40]], 75, 214)}` };

// ルフレ（ヘアケア）：深緑とベージュ、詰め替え
const REFRE = '#2f5a46';
const REFRE2 = '#c9b894';
products['refre-shampoo'] = { w: 230, h: 560, svg: `
  <defs>${defsBase}${cyl('b', REFRE, { gloss: 0.32, dark: -0.32 })}${cyl('p', '#20262b', { gloss: 0.35, dark: -0.3 })}</defs>
  ${floor(115, 546, 80)}
  ${pump({ cx: 108, base: 128, fill: 'p', w: 66, h: 74, nozzle: 56 })}
  <path d="M42 160 Q42 128 74 128 L156 128 Q188 128 188 160 L188 534 Q188 546 176 546 L54 546 Q42 546 42 534Z" fill="url(#b)"/>
  ${shine(62, 146, 14, 370, 0.35)}
  ${label([['BRAND C', 21, SERIF, '#f1ece0', 400, 4], ['SAMPLE', 9, SANS, '#e3dccb', 600, 3, 26], ['商品C-1', 11, JP, '#e3dccb', 400, 1, 60], ['480mL', 10, SANS, '#cfc7b4', 400, 1, 210]], 115, 300)}` };

products['refre-treatment'] = { w: 230, h: 560, svg: `
  <defs>${defsBase}${cyl('b', REFRE2, { gloss: 0.4, dark: -0.28 })}${cyl('p', '#20262b', { gloss: 0.35, dark: -0.3 })}</defs>
  ${floor(115, 546, 80)}
  ${pump({ cx: 108, base: 128, fill: 'p', w: 66, h: 74, nozzle: 56 })}
  <path d="M42 160 Q42 128 74 128 L156 128 Q188 128 188 160 L188 534 Q188 546 176 546 L54 546 Q42 546 42 534Z" fill="url(#b)"/>
  ${shine(62, 146, 14, 370, 0.45)}
  ${label([['BRAND C', 21, SERIF, REFRE, 400, 4], ['SAMPLE', 9, SANS, REFRE, 600, 3, 26], ['商品C-2', 11, JP, REFRE, 400, 1, 60], ['480g', 10, SANS, REFRE, 400, 1, 210]], 115, 300)}` };

products['refre-refill'] = { w: 260, h: 470, svg: `
  <defs>${defsBase}
    <linearGradient id="pouch" x1="0" x2="1"><stop offset="0" stop-color="${shade(REFRE, -0.25)}"/><stop offset=".3" stop-color="${shade(REFRE, 0.18)}"/><stop offset=".55" stop-color="${REFRE}"/><stop offset="1" stop-color="${shade(REFRE, -0.3)}"/></linearGradient>
    ${cyl('s', '#e8e4da', { gloss: 0.5, dark: -0.25 })}</defs>
  ${floor(130, 456, 96)}
  <path d="M40 64 L196 64 L222 96 L222 420 Q222 450 196 452 L64 452 Q38 450 38 420 Z" fill="url(#pouch)"/>
  <path d="M38 420 Q130 400 222 420 L222 434 Q130 414 38 434Z" fill="#000" opacity=".12"/>
  <rect x="166" y="30" width="40" height="40" rx="6" fill="url(#s)"/>
  <rect x="160" y="64" width="52" height="14" rx="3" fill="url(#s)"/>
  ${shine(64, 100, 18, 300, 0.25)}
  ${label([['BRAND C', 22, SERIF, '#f1ece0', 400, 4], ['REFILL', 10, SANS, '#e3dccb', 600, 4, 24], ['商品C-3', 11, JP, '#e3dccb', 400, 1, 64]], 130, 230)}` };

// ボディ・その他：泡ハンドソープ
const FOAM = '#7fb59a';
products['body-foam'] = { w: 210, h: 440, svg: `
  <defs>${defsBase}${cyl('b', '#eef5f1', { gloss: 0.55, dark: -0.14 })}${cyl('p', '#fdfdfd', { gloss: 0.5, dark: -0.2 })}</defs>
  ${floor(105, 426, 70)}
  <rect x="58" y="60" width="96" height="50" rx="14" fill="url(#p)"/>
  <path d="M120 66 h58 q8 0 8 8 v6 h-66Z" fill="url(#p)"/>
  <rect x="62" y="108" width="88" height="22" rx="4" fill="url(#p)"/>
  <path d="M46 156 Q46 130 72 130 L140 130 Q166 130 166 156 L166 416 Q166 426 156 426 L56 426 Q46 426 46 416Z" fill="url(#b)"/>
  ${shine(62, 146, 12, 250, 0.6)}
  ${label([['BRAND E', 13, SANS, shade(FOAM, -0.35), 700, 3], ['商品E-1', 12, JP, '#3f5a4c', 600, 1, 26], ['SAMPLE', 10, SANS, '#5c7266', 400, 2, 48]], 106, 260)}
  <circle cx="106" cy="352" r="14" fill="${FOAM}" opacity=".8"/>` };

for (const [name, { w, h, svg }] of Object.entries(products)) {
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${svg}</svg>`;
  await sharp(Buffer.from(doc)).resize(w * 2, h * 2).png().toFile(join(outDir, `${name}-raw.png`));
  const info = await sharp(join(outDir, `${name}-raw.png`)).trim({ threshold: 1 }).toFile(join(outDir, `${name}.png`));
  unlinkSync(join(outDir, `${name}-raw.png`));
  console.log(name, `${info.width}x${info.height}`);
}
