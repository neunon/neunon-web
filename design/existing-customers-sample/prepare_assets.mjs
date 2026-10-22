/**
 * サンプルレポートの書き出し画像から、LP用の画像を作る。
 *
 * 前段（Windows + PowerPoint が必要）:
 *   1. py design/existing-customers-sample/build_report.py        … PPTX を生成（表紙＋5ページ）
 *   2. PowerPoint で各スライドを幅2400pxのPNGに書き出す（page-01.png = 表紙 … page-06.png）
 *      （書き出しは PowerPoint 本体の描画をそのまま使う。LibreOffice だと字詰めが変わる）
 * 本スクリプト:
 *   node design/existing-customers-sample/prepare_assets.mjs <書き出したPNGのフォルダ>
 * 出力: public/images/existing-customers/
 *
 * LPで使うのは表紙と、業績〜変化のシグナルの4ページだけ。
 * 提案仮説のページ（page-06）は、LPの仮説の例をユーザーが書くため使わない。
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

const pages = { cover: 1, performance: 2, channels: 3, products: 4, signals: 5 };
for (const [name, n] of Object.entries(pages)) {
  const file = join(src, `page-0${n}.png`);
  for (const w of [1440, 960, 640]) {
    await sharp(file).resize({ width: w }).webp({ quality: w === 640 ? 82 : 86 }).toFile(join(out, `${name}-${w}.webp`));
  }
}
console.log('assets ->', out);
