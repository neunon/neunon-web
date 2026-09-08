/**
 * ブランド画像の生成（要件定義書 10.2「OGP画像」/ 10.3「表示速度 LCP 2.5秒以内」）
 *
 * 入力は発注者から受領した neunon-logo.png（1448x1086, 743KB）1枚のみ。
 * これを元に、以下をすべてビルド前に生成して成果物としてコミットする。
 *   public/neunon-logo.png  最適化したロゴ（構造化データと OGP のフォールバック用）
 *   public/ogp.png          OGP画像 1200x630
 *   app/icon.png            ファビコン（Next の metadata file convention）
 *   app/apple-icon.png      ホーム画面用アイコン 180x180
 *
 * 文字はレンダリングせず、受領したロゴの切り出しと合成だけで作る。
 * 実行環境のフォントに依存させないため。
 *
 * 実行: npm run images
 */
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs/promises';

const SRC = 'neunon-logo.png';

/** ブランドトークン（app/globals.css と揃える） */
const WHITE = '#ffffff';
const NAVY = '#26385c';

/**
 * 元画像の地はわずかに灰色がかっている（四隅で 253〜255）。
 * 純白のキャンバスに載せると縁が四角く見えてしまうため、
 * 明るい側だけを 255 に寄せて地を純白にそろえる。
 * 傾き 255/248 なので、黒側の階調はほぼ変わらない。
 */
const WHITEN = [255 / 248, 0];

/** 元画像を解析して、文字部分の外接矩形と先頭グリフの範囲を求める */
async function analyze(file) {
  const { data, info } = await sharp(file).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const TH = 128;

  const cols = new Array(W).fill(0);
  const rows = new Array(H).fill(0);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[y * W + x] < TH) {
        cols[x] += 1;
        rows[y] += 1;
      }
    }
  }

  const firstCol = cols.findIndex((v) => v > 0);
  const lastCol = W - 1 - [...cols].reverse().findIndex((v) => v > 0);
  const firstRow = rows.findIndex((v) => v > 0);
  const lastRow = H - 1 - [...rows].reverse().findIndex((v) => v > 0);

  return {
    W,
    H,
    bbox: { left: firstCol, top: firstRow, width: lastCol - firstCol + 1, height: lastRow - firstRow + 1 },
  };
}

/**
 * ロゴを白背景のキャンバスに配置した画像を作る。
 * 元画像の地はわずかに灰色がかっているので、切り出したうえで白の上に置き直す。
 */
async function logoOnCanvas({ canvasW, canvasH, logoW, offsetY = 0, rule = null }) {
  const { bbox } = await analyze(SRC);

  const logo = await sharp(SRC)
    .extract(bbox)
    .linear(...WHITEN)
    .resize({ width: logoW, fit: 'inside', kernel: 'lanczos3' })
    .toBuffer({ resolveWithObject: true });

  const left = Math.round((canvasW - logo.info.width) / 2);
  const top = Math.round((canvasH - logo.info.height) / 2) + offsetY;

  const layers = [{ input: logo.data, left, top }];

  if (rule) {
    // 唯一の有彩色であるネイビーの罫線を1本だけ入れる
    const ruleSvg = Buffer.from(
      `<svg width="${rule.width}" height="${rule.height}" xmlns="http://www.w3.org/2000/svg">` +
        `<rect width="${rule.width}" height="${rule.height}" fill="${rule.color}"/></svg>`,
    );
    layers.push({ input: ruleSvg, left: rule.left, top: rule.top });
  }

  return sharp({
    create: { width: canvasW, height: canvasH, channels: 3, background: WHITE },
  })
    .composite(layers)
    .png({ compressionLevel: 9, palette: true });
}

async function main() {
  const { W, H, bbox } = await analyze(SRC);
  console.log(`元画像: ${W}x${H} / 文字領域: ${bbox.width}x${bbox.height} @ (${bbox.left},${bbox.top})`);

  // --- 1. 最適化したロゴ ---------------------------------------------------
  // 2色しかないのでパレット化すると劇的に小さくなる。余白も詰める。
  // 用途は構造化データの logo と OGP のフォールバックだけなので 800px で十分。
  const pad = 32;
  await sharp(SRC)
    .extract(bbox)
    .linear(...WHITEN)
    .resize({ width: 800 - pad * 2, fit: 'inside', kernel: 'lanczos3' })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: WHITE })
    .png({ compressionLevel: 9, palette: true, colours: 16 })
    .toFile('public/neunon-logo.png');

  // --- 2. OGP画像 1200x630 -------------------------------------------------
  // ロゴを中央やや上に置き、下にネイビーの罫線を1本。文字は載せない。
  const ogp = await logoOnCanvas({
    canvasW: 1200,
    canvasH: 630,
    logoW: 560,
    offsetY: -24,
    rule: { left: 500, top: 470, width: 200, height: 3, color: NAVY },
  });
  await ogp.toFile('public/ogp.png');

  // --- 3. ファビコン --------------------------------------------------------
  // 小さい寸法ではワードマークが読めないので、先頭グリフ「N」だけを使う。
  // 「N」の範囲は元画像の解析値から算出する。
  const nWidth = Math.round(bbox.height * 0.62); // セリフ体の N はほぼ正方形に近い
  const nBox = {
    left: bbox.left,
    top: bbox.top,
    width: nWidth,
    height: Math.round(bbox.height * 0.67), // Consulting の行を含めない
  };
  console.log('ファビコン用の N:', nBox);

  // sharp は resize を extend より先に適用するので、
  // 余白込みの正方形をいったんバッファに作ってから目的の寸法へ縮小する。
  async function squareIcon(size) {
    const inner = Math.round(size * 0.62); // 周囲に余白を残す
    const glyph = await sharp(SRC)
      .extract(nBox)
      .linear(...WHITEN)
      .resize({ width: inner, height: inner, fit: 'inside', kernel: 'lanczos3' })
      .toBuffer({ resolveWithObject: true });

    return sharp({ create: { width: size, height: size, channels: 3, background: WHITE } })
      .composite([
        {
          input: glyph.data,
          left: Math.round((size - glyph.info.width) / 2),
          top: Math.round((size - glyph.info.height) / 2),
        },
      ])
      .png({ compressionLevel: 9, palette: true, colours: 16 });
  }

  await (await squareIcon(512)).toFile('app/icon.png');
  await (await squareIcon(180)).toFile('app/apple-icon.png');

  // --- 結果 -----------------------------------------------------------------
  const files = ['public/neunon-logo.png', 'public/ogp.png', 'app/icon.png', 'app/apple-icon.png'];
  const before = (await fs.stat(SRC)).size;
  console.log(`\n元 ${SRC}: ${(before / 1024).toFixed(0)} KB（ブランド資産として残す）`);
  for (const file of files) {
    const { size } = await fs.stat(file);
    const meta = await sharp(file).metadata();
    console.log(`  ${path.basename(file).padEnd(20)} ${meta.width}x${meta.height}  ${(size / 1024).toFixed(1)} KB`);
  }
}

await main();
