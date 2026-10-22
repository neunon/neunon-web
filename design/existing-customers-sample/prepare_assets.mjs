/**
 * サンプルレポートの書き出し画像から、LP用の画像を作る。
 *
 * 前段（Windows + PowerPoint が必要）:
 *   1. py design/existing-customers-sample/build_report.py        … PPTX を生成（表紙＋12ページ）
 *   2. powershell -File design/existing-customers-sample/export.ps1 -in <pptxの絶対パス> -out <フォルダ>
 *      … PowerPoint で各スライドを幅2400pxのPNGに書き出す（page-01.png = 表紙 … page-13.png）
 *      （PowerPoint 本体の描画をそのまま使う。LibreOffice だと字詰めが変わる。
 *        export.ps1 は開いている他のプレゼンテーションを閉じない。Quit を足さないこと）
 * 本スクリプト:
 *   node design/existing-customers-sample/prepare_assets.mjs <書き出したPNGのフォルダ>
 * 出力: public/images/existing-customers/
 *
 */
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
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

const pages = {
  cover: 1, summary: 2, company: 3, trend: 4, segments: 5, org: 6,
  channels: 7, products: 8, brands: 9, brand: 10, signals: 11, map: 12, proposal: 13,
};
for (const [name, n] of Object.entries(pages)) {
  const file = join(src, `page-${String(n).padStart(2, '0')}.png`);
  for (const w of [1440, 960, 640]) {
    await sharp(file).resize({ width: w }).webp({ quality: w === 640 ? 82 : 86 }).toFile(join(out, `${name}-${w}.webp`));
  }
}
console.log('assets ->', out);
