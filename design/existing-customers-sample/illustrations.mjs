/**
 * 架空サンプル「ミオリ食品株式会社」の商品パッケージ図版を生成する。
 *
 * 実在企業の商品写真は権利上使えないため、架空ブランドの包装を新規に描いている。
 * 実際の納品物（商品ラインナップのページ）では公開画像を引用するが、
 * サンプルではこの図版がその役を担う。
 *
 * 実行: node design/existing-customers-sample/illustrations.mjs
 * 出力: design/existing-customers-sample/illustrations/*.svg と *.png（2倍解像度）
 */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, 'illustrations');
mkdirSync(outDir, { recursive: true });

const JP = "'Yu Gothic','YuGothic','Meiryo','BIZ UDPGothic',sans-serif";
const W = 420;
const H = 520;

/** 床に落ちる柔らかい影。全図版で共通にして並べたときの統一感を出す */
const floorShadow = (cx, y, rx) => `
  <ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="14" fill="url(#shadow)"/>`;

const defs = (extra = '') => `
  <defs>
    <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#1b2230" stop-opacity=".28"/>
      <stop offset="1" stop-color="#1b2230" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sheen" x1="0" x2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".46" stop-color="#fff" stop-opacity=".0"/>
      <stop offset=".5" stop-color="#fff" stop-opacity=".22"/>
      <stop offset=".56" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    ${extra}
  </defs>`;

/** ブランドの丸い社名マーク */
const brandMark = (x, y, r, fg = '#fff', bg = '#c8102e') => `
  <g transform="translate(${x} ${y})">
    <circle r="${r}" fill="${bg}"/>
    <text y="${r * 0.34}" text-anchor="middle" font-family="${JP}" font-weight="700" font-size="${r * 0.86}" fill="${fg}">ミオリ</text>
  </g>`;

/** 餃子1個（羽根つき）。上から見た三日月形とひだ */
const gyoza = (x, y, s = 1, rot = 0) => `
  <g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M-34 6 C-30 -22 30 -22 34 6 C20 16 -20 16 -34 6Z" fill="#f2dfb8" stroke="#d9bd86" stroke-width="1.6"/>
    <path d="M-34 6 C-20 13 20 13 34 6 C24 18 -24 18 -34 6Z" fill="#c98b3c"/>
    ${[-18, -8, 2, 12, 22].map((dx) => `<path d="M${dx - 6} -11 q4 7 0 16" fill="none" stroke="#d9bd86" stroke-width="1.6"/>`).join('')}
  </g>`;

/** ピロー包装（冷凍食品の袋）。上下にシール部の鋸歯を付ける */
function pillowBag({ body, band, title, sub, weight, window }) {
  const x = 70, y = 60, w = 280, h = 380;
  const teeth = (yy) => Array.from({ length: 20 }, (_, i) => {
    const xx = x + i * (w / 20);
    return `L${xx + w / 40} ${yy + 6} L${xx + w / 20} ${yy}`;
  }).join(' ');
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${defs()}
    ${floorShadow(210, 462, 150)}
    <path d="M${x} ${y + 6} ${teeth(y)} L${x + w} ${y + h - 6} ${teeth(y + h - 6).replace(/L/g, 'L')} Z" fill="${body}"/>
    <rect x="${x}" y="${y + 6}" width="${w}" height="${h - 12}" fill="${body}"/>
    <rect x="${x}" y="${y + 18}" width="${w}" height="18" fill="#000" opacity=".08"/>
    <rect x="${x}" y="${y + h - 36}" width="${w}" height="18" fill="#000" opacity=".08"/>
    ${brandMark(x + 44, y + 74, 24)}
    <text x="${x + 80}" y="${y + 66}" font-family="${JP}" font-size="14" font-weight="700" fill="${band}">ミオリ食品</text>
    <text x="${x + 80}" y="${y + 86}" font-family="${JP}" font-size="12" fill="#ffffffcc">冷凍食品</text>
    <text x="${x + 24}" y="${y + 138}" font-family="${JP}" font-size="38" font-weight="800" fill="#fff">${title}</text>
    <text x="${x + 26}" y="${y + 166}" font-family="${JP}" font-size="15" font-weight="700" fill="${band}">${sub}</text>
    <rect x="${x + 22}" y="${y + 186}" width="${w - 44}" height="128" rx="64" fill="#fff" opacity=".96"/>
    <g>${window}</g>
    <rect x="${x + 22}" y="${y + 326}" width="92" height="24" rx="4" fill="${band}"/>
    <text x="${x + 68}" y="${y + 343}" text-anchor="middle" font-family="${JP}" font-size="13" font-weight="700" fill="${body}">${weight}</text>
    <text x="${x + w - 22}" y="${y + 343}" text-anchor="end" font-family="${JP}" font-size="11" fill="#ffffffb3">−18℃以下で保存</text>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#sheen)"/>
  </svg>`;
}

/** 平たいトレー＋フィルム（チルド惣菜） */
function chilledTray({ title, sub, fill, contents }) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${defs()}
    ${floorShadow(210, 432, 172)}
    <path d="M40 220 L380 220 L358 420 L62 420 Z" fill="#20262f"/>
    <path d="M40 220 L380 220 L373 240 L47 240 Z" fill="#343c48"/>
    <g>${contents}</g>
    <path d="M40 220 L380 220 L358 420 L62 420 Z" fill="#ffffff" opacity=".10"/>
    <rect x="40" y="214" width="340" height="12" rx="3" fill="#ffffff" opacity=".55"/>
    <g transform="rotate(-4 210 252)">
      <rect x="92" y="196" width="236" height="104" rx="6" fill="${fill}"/>
      ${brandMark(126, 230, 19)}
      <text x="154" y="224" font-family="${JP}" font-size="12" font-weight="700" fill="#fff">ミオリのチルド</text>
      <text x="154" y="252" font-family="${JP}" font-size="25" font-weight="800" fill="#fff">${title}</text>
      <text x="108" y="284" font-family="${JP}" font-size="12" fill="#ffffffd9">${sub}</text>
      <text x="316" y="284" text-anchor="end" font-family="${JP}" font-size="11" fill="#ffffffcc">要冷蔵10℃以下</text>
    </g>
  </svg>`;
}

/** カップ容器（ポテトサラダ等） */
function cup({ title, sub, fill }) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${defs('<linearGradient id="cupg" x1="0" x2="1"><stop offset="0" stop-color="#e9edf2"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe4ea"/></linearGradient>')}
    ${floorShadow(210, 440, 130)}
    <path d="M92 170 L328 170 L300 430 L120 430 Z" fill="url(#cupg)" stroke="#cfd6de" stroke-width="2"/>
    <ellipse cx="210" cy="170" rx="122" ry="22" fill="#f5f7f9" stroke="#cfd6de" stroke-width="2"/>
    <ellipse cx="210" cy="166" rx="122" ry="22" fill="${fill}"/>
    <rect x="112" y="236" width="196" height="132" rx="8" fill="${fill}"/>
    ${brandMark(148, 274, 20)}
    <text x="176" y="268" font-family="${JP}" font-size="12" font-weight="700" fill="#fff">ミオリのチルド</text>
    <text x="128" y="322" font-family="${JP}" font-size="27" font-weight="800" fill="#fff">${title}</text>
    <text x="128" y="350" font-family="${JP}" font-size="13" fill="#ffffffd9">${sub}</text>
    <rect x="92" y="170" width="236" height="260" fill="url(#sheen)"/>
  </svg>`;
}

/** ボトル（たれ・つゆ・ドレッシング） */
function bottle({ title, sub, liquid, cap, label, size, shape = 'tall' }) {
  const narrow = shape === 'small';
  const bw = narrow ? 120 : 150;
  const bx = 210 - bw / 2;
  const top = narrow ? 150 : 100;
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${defs(`<linearGradient id="liq" x1="0" x2="1"><stop offset="0" stop-color="${liquid}" stop-opacity=".9"/><stop offset=".55" stop-color="${liquid}"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>`)}
    ${floorShadow(210, 462, bw * 0.75)}
    <rect x="${210 - 26}" y="${top - 56}" width="52" height="50" rx="6" fill="${cap}"/>
    <rect x="${210 - 26}" y="${top - 56}" width="52" height="10" rx="4" fill="#000" opacity=".15"/>
    <path d="M${210 - 22} ${top - 8} L${210 + 22} ${top - 8} C${210 + 22} ${top + 30} ${bx + bw} ${top + 40} ${bx + bw} ${top + 90}
             L${bx + bw} 440 Q${bx + bw} 452 ${bx + bw - 12} 452 L${bx + 12} 452 Q${bx} 452 ${bx} 440 L${bx} ${top + 90}
             C${bx} ${top + 40} ${210 - 22} ${top + 30} ${210 - 22} ${top - 8} Z" fill="url(#liq)"/>
    <rect x="${bx - 2}" y="${narrow ? 270 : 230}" width="${bw + 4}" height="${narrow ? 150 : 176}" fill="${label}"/>
    ${brandMark(210, narrow ? 302 : 266, narrow ? 17 : 20)}
    <text x="210" y="${narrow ? 352 : 322}" text-anchor="middle" font-family="${JP}" font-size="${narrow ? 22 : (title.length > 6 ? 17 : 26)}" font-weight="800" fill="#1c2430">${title}</text>
    <text x="210" y="${narrow ? 376 : 348}" text-anchor="middle" font-family="${JP}" font-size="12" fill="#3c4654">${sub}</text>
    <text x="210" y="${narrow ? 404 : 386}" text-anchor="middle" font-family="${JP}" font-size="12" font-weight="700" fill="#1c2430">${size}</text>
    <rect x="${bx}" y="${top}" width="${bw}" height="${452 - top}" fill="url(#sheen)"/>
  </svg>`;
}

/** 業務用の大袋（クラフト調） */
function bulkBag({ title, sub, weight, accent }) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${defs('<linearGradient id="kraft" x1="0" x2="1"><stop offset="0" stop-color="#d9c8a6"/><stop offset=".5" stop-color="#e8dbc0"/><stop offset="1" stop-color="#cdb98f"/></linearGradient>')}
    ${floorShadow(210, 466, 170)}
    <path d="M58 70 L362 70 L374 452 L46 452 Z" fill="url(#kraft)"/>
    <rect x="58" y="70" width="304" height="26" fill="#000" opacity=".07"/>
    <rect x="80" y="128" width="260" height="56" fill="${accent}"/>
    <text x="96" y="165" font-family="${JP}" font-size="24" font-weight="800" fill="#fff">業務用</text>
    <text x="324" y="165" text-anchor="end" font-family="${JP}" font-size="14" font-weight="700" fill="#fff">ミオリ食品</text>
    <text x="84" y="238" font-family="${JP}" font-size="34" font-weight="800" fill="#2a2418">${title}</text>
    <text x="86" y="268" font-family="${JP}" font-size="15" fill="#4a4030">${sub}</text>
    <rect x="84" y="296" width="252" height="92" fill="#fff" opacity=".7"/>
    <text x="100" y="328" font-family="${JP}" font-size="13" fill="#2a2418">内容量</text>
    <text x="320" y="330" text-anchor="end" font-family="${JP}" font-size="26" font-weight="800" fill="#2a2418">${weight}</text>
    <text x="100" y="370" font-family="${JP}" font-size="12" fill="#4a4030">保存方法　−18℃以下</text>
  </svg>`;
}

const gyozaWindow = `
  ${gyoza(150, 312, 1.1, -8)}${gyoza(212, 306, 1.15, 0)}${gyoza(274, 312, 1.1, 8)}
  ${gyoza(180, 342, 1.0, -4)}${gyoza(244, 342, 1.0, 4)}`;

const friedRiceWindow = `
  <ellipse cx="210" cy="310" rx="104" ry="44" fill="#e8c15a"/>
  ${Array.from({ length: 70 }, (_, i) => {
    const a = (i * 137.5) % 360, r = 12 + ((i * 29) % 80);
    const cx = 210 + Math.cos((a * Math.PI) / 180) * r * 1.1, cy = 310 + Math.sin((a * Math.PI) / 180) * r * 0.42;
    const c = ['#f6e2a0', '#d84a2f', '#4f8f3a', '#f3d46b', '#c9842f'][i % 5];
    return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="5" ry="3" fill="${c}"/>`;
  }).join('')}`;

const udonWindow = `
  <ellipse cx="210" cy="312" rx="104" ry="44" fill="#efe6cf"/>
  ${[0, 1, 2, 3, 4, 5, 6].map((i) => {
    const y = 290 + i * 7;
    return `<path d="M${124 + (i % 2) * 6} ${y} C 160 ${y - 16}, 190 ${y + 18}, 222 ${y} S 280 ${y - 14}, ${296 - (i % 2) * 6} ${y + 2}" fill="none" stroke="#d8cba8" stroke-width="11" stroke-linecap="round"/>
            <path d="M${124 + (i % 2) * 6} ${y - 1} C 160 ${y - 17}, 190 ${y + 17}, 222 ${y - 1} S 280 ${y - 15}, ${296 - (i % 2) * 6} ${y + 1}" fill="none" stroke="#fbf7ec" stroke-width="7" stroke-linecap="round"/>`;
  }).join('')}
  <circle cx="262" cy="296" r="9" fill="#5b8f3a"/><circle cx="276" cy="304" r="7" fill="#6ea64a"/>
  <path d="M150 324 q20 -10 40 0" fill="none" stroke="#e7b7a6" stroke-width="7" stroke-linecap="round"/>`;

const trayGyoza = `
  ${[92, 152, 212, 272, 330].map((x, i) => gyoza(x, 334 + (i % 2) * 5, 0.95, i % 2 ? 6 : -6)).join('')}
  ${[122, 182, 242, 302].map((x, i) => gyoza(x, 384 + (i % 2) * 4, 0.95, i % 2 ? -5 : 5)).join('')}`;

const items = {
  'frozen-gyoza': pillowBag({ body: '#123a6b', band: '#f2c14e', title: '羽根つき一番', sub: '冷凍ギョーザ　油・水いらず', weight: '12個入', window: gyozaWindow }),
  'frozen-friedrice': pillowBag({ body: '#8f1d1d', band: '#f6d27a', title: '香ばし炒飯', sub: '冷凍チャーハン　レンジで5分', weight: '450g', window: friedRiceWindow }),
  'frozen-udon': pillowBag({ body: '#2f5d50', band: '#f0e6c8', title: '讃岐風うどん', sub: '冷凍めん　コシの強い太麺', weight: '5食入', window: udonWindow }),
  'chilled-gyoza': chilledTray({ title: '焼くだけ餃子', sub: '国産キャベツ使用', fill: '#2b7a6f', contents: trayGyoza }),
  'chilled-salad': cup({ title: 'ポテトサラダ', sub: '北海道産じゃがいも', fill: '#3b8f62' }),
  'sauce-gyoza': bottle({ title: '餃子のたれ', sub: 'ラー油付き', liquid: '#5b2a12', cap: '#c8102e', label: '#f7f2e8', size: '150ml', shape: 'small' }),
  'sauce-tsuyu': bottle({ title: 'そばつゆ', sub: 'ストレート　かつお・昆布', liquid: '#3a1d0c', cap: '#1d1d1d', label: '#efe7d6', size: '1L' }),
  'sauce-dressing': bottle({ title: '胡麻ドレッシング', sub: '焙煎ごま　まろやか', liquid: '#c9a66b', cap: '#6b4a24', label: '#fbf7ee', size: '380ml' }),
  'bulk-gyoza': bulkBag({ title: '冷凍ギョーザ', sub: '外食・中食向け　焼き調理用', weight: '50個入', accent: '#123a6b' }),
  'bulk-soup': bulkBag({ title: '中華スープの素', sub: '濃縮タイプ　業務用', weight: '1kg', accent: '#8f1d1d' }),
};

for (const [name, svg] of Object.entries(items)) {
  writeFileSync(join(outDir, `${name}.svg`), svg.trim());
  await sharp(Buffer.from(svg)).resize(W * 2, H * 2).png().toFile(join(outDir, `${name}.png`));
  console.log('wrote', name);
}

// 周囲の透明な余白を落とした版。資料・LPで並べるときに実寸どおり詰められるようにする
for (const name of Object.keys(items)) {
  const info = await sharp(join(outDir, `${name}.png`)).trim({ threshold: 1 }).toFile(join(outDir, `${name}-trim.png`));
  console.log('trim', name, `${info.width}x${info.height}`);
}
