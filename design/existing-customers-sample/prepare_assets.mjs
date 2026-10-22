/**
 * サンプルレポートの書き出し画像から、LP用の画像を作る。
 *
 * 前段（Windows + PowerPoint が必要）:
 *   1. py design/existing-customers-sample/build_report.py        … PPTX を生成
 *   2. PowerPoint で各スライドを幅2400pxのPNGに書き出し、PDFも保存
 *      （書き出しは PowerPoint 本体の描画をそのまま使う。LibreOffice だと字詰めが変わる）
 * 本スクリプト:
 *   node design/existing-customers-sample/prepare_assets.mjs <書き出したPNGとPDFのフォルダ>
 * 出力: public/images/existing-customers/
 */
import { createRequire } from 'node:module';
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const src = process.argv[2];
if (!src) throw new Error('書き出しフォルダを指定してください');
const out = join(root, 'public', 'images', 'existing-customers');
mkdirSync(out, { recursive: true });

// スライドは 10.83in × 7.5in。2400px 書き出しで 1in ≒ 221.6px
const PX = 2400 / 10.83;
const box = (x, y, w, h) => ({ left: Math.round(x * PX), top: Math.round(y * PX), width: Math.round(w * PX), height: Math.round(h * PX) });

for (let i = 1; i <= 5; i++) {
  const file = join(src, `page-0${i}.png`);
  for (const w of [2400, 1440, 720]) {
    await sharp(file).resize({ width: w }).webp({ quality: w === 720 ? 80 : 86 }).toFile(join(out, `page-${i}-${w}.webp`));
  }
}

// 「読み解き」の各段で見せる注目箇所。レポートの実物から切り出す（作り直さない）
const crops = {
  'detail-sales': [1, box(0.25, 1.95, 4.95, 3.03)],     // 売上のセグメント推移
  'detail-events': [3, box(0.25, 1.45, 10.33, 2.4)],    // 出来事の時系列
  'detail-impact': [3, box(0.25, 4.0, 10.33, 2.85)],    // 物流への影響の表
  'detail-map': [4, box(0.25, 1.95, 7.32, 4.75)],        // 取引マップ
  'detail-proposal': [5, box(0.25, 1.42, 10.33, 1.55)], // 優先度・高の提案
  'detail-lineup': [2, box(0.25, 1.45, 10.33, 5.5)],    // 商品ラインナップ全体
  'detail-source': [3, box(0.25, 6.94, 10.33, 0.5)],    // 出所・注記・時点の欄
};
for (const [name, [page, area]] of Object.entries(crops)) {
  const file = join(src, `page-0${page}.png`);
  for (const w of [1600, 960]) {
    await sharp(file).extract(area).resize({ width: Math.min(w, area.width) }).webp({ quality: 88 }).toFile(join(out, `${name}-${w}.webp`));
  }
}

// 商品図（余白を落とした版）
const ill = join(here, 'illustrations');
for (const name of ['frozen-gyoza', 'frozen-friedrice', 'frozen-udon', 'chilled-gyoza', 'chilled-salad',
  'sauce-gyoza', 'sauce-tsuyu', 'sauce-dressing', 'bulk-gyoza', 'bulk-soup']) {
  await sharp(join(ill, `${name}-trim.png`)).resize({ height: 420 }).webp({ quality: 88 }).toFile(join(out, `product-${name}.webp`));
}

copyFileSync(join(src, 'existing-customers-sample.pdf'), join(out, 'existing-customers-sample.pdf'));
console.log('assets ->', out);
