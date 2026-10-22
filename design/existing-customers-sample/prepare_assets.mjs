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
  'step-1': [1, box(4.8, 1.5, 5.72, 5.45)],   // 事業別の売上推移と伸び
  'step-2': [2, box(0.3, 1.5, 5.05, 5.45)],   // 販売チャネルの構成と主な販売先
  'step-3': [3, box(0.3, 1.5, 5.15, 5.3)],    // 商品ラインナップ（冷凍・チルド）
  'step-4': [5, box(0.3, 1.5, 3.36, 5.25)],   // 提案仮説1
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
