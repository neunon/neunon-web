/**
 * サンプルレポートの書き出し画像と商品画像から、LP用の画像を作る。
 *
 * 前段（Windows + PowerPoint が必要）:
 *   1. py design/existing-customers-sample/build_report.py        … PPTX を生成（表紙＋9ページ）
 *   2. powershell -File design/existing-customers-sample/export.ps1 -in <pptxの絶対パス> -out design/existing-customers-sample/renders -width 2400 -pdf
 *      … PowerPoint で各スライドを幅2400pxのPNGに書き出す（page-01.png = 表紙 … page-10.png）
 *      （PowerPoint 本体の描画をそのまま使う。LibreOffice だと字詰めが変わる。
 *        export.ps1 は開いている他のプレゼンテーションを閉じない。Quit を足さないこと）
 * 本スクリプト:
 *   node design/existing-customers-sample/prepare_assets.mjs [書き出したPNGのフォルダ（既定: renders）]
 * 出力: public/images/existing-customers/（中身はこのスクリプトが作るものだけ。毎回作り直す）
 *   <slug>-{640,960,1440,2000}.webp … レポートの各ページ
 *   brand-{a,b,c,d}.webp             … ブランドごとの商品画像（packshots/ を同じ縮尺で横に並べたもの）
 */
import { createRequire } from 'node:module';
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const src = process.argv[2] ?? join(here, 'renders');
const out = join(root, 'public', 'images', 'existing-customers');
mkdirSync(out, { recursive: true });
for (const f of readdirSync(out)) rmSync(join(out, f));

/** slug と書き出しのページ番号（components/existing-customers-lp/data.ts の reportPages と同じ並び） */
const pages = {
  cover: 1, company: 2, org: 3, channels: 4, products: 5, brand: 6, trend: 7, matching: 8, proposal: 9, actions: 10,
};
for (const [name, n] of Object.entries(pages)) {
  const file = join(src, `page-${String(n).padStart(2, '0')}.png`);
  for (const w of [640, 960, 1440, 2000]) {
    await sharp(file).resize({ width: w }).webp({ quality: w === 640 ? 82 : 86 }).toFile(join(out, `${name}-${w}.webp`));
  }
}

/** ブランドごとの商品画像。全ブランド同じ縮尺（いちばん背の高い商品が H px）で、底を揃えて並べる */
const brands = {
  a: ['minamo-lotion', 'minamo-milk', 'minamo-serum', 'minamo-cream'],
  b: ['classica-lotion', 'classica-serum', 'classica-cream'],
  c: ['refre-shampoo', 'refre-treatment', 'refre-refill'],
  d: ['harenohi-tube', 'harenohi-spray', 'harenohi-stick'],
};
const H = 560;
const GAP = 28;
const PAD = 48;
const meta = {};
for (const names of Object.values(brands)) {
  for (const n of names) meta[n] ??= await sharp(join(here, 'packshots', `${n}.png`)).metadata();
}
const tallest = Math.max(...Object.values(meta).map((m) => m.height));
const W = 960;
// いちばん横に長いブランドが幅に収まる縮尺を、全ブランドに共通で使う
const widest = Math.max(...Object.values(brands).map((ns) => ns.reduce((a, n) => a + meta[n].width, 0)));
const k = Math.min(H / tallest, (W - PAD * 2 - GAP * 3) / widest);
for (const [key, names] of Object.entries(brands)) {
  const items = await Promise.all(names.map(async (n) => {
    const w = Math.round(meta[n].width * k);
    const h = Math.round(meta[n].height * k);
    return { input: await sharp(join(here, 'packshots', `${n}.png`)).resize(w, h).toBuffer(), w, h };
  }));
  const scale = 1;
  const placed = await Promise.all(items.map(async (it) => ({
    ...it,
    input: scale < 1 ? await sharp(it.input).resize(Math.round(it.w * scale)).toBuffer() : it.input,
    w: Math.round(it.w * scale),
    h: Math.round(it.h * scale),
  })));
  const rowW = placed.reduce((a, b) => a + b.w, 0) + Math.round(GAP * scale) * (placed.length - 1);
  const canvasH = H + PAD * 2;
  let x = Math.round((W - rowW) / 2);
  const layers = placed.map((it) => {
    const layer = { input: it.input, left: x, top: canvasH - PAD - it.h };
    x += it.w + Math.round(GAP * scale);
    return layer;
  });
  await sharp({ create: { width: W, height: canvasH, channels: 3, background: '#f3f4f5' } })
    .composite(layers).webp({ quality: 86 }).toFile(join(out, `brand-${key}.webp`));
}
console.log('assets ->', out);
