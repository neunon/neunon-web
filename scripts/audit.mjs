/**
 * ビルド出力の静的検査（要件定義書 9.4「品質基準」/ 10.2「SEO」/ 12.1「機密」）
 *
 * out/ 配下の HTML を読んで、機械的に確認できる項目だけを検査する。
 * 実ブラウザでの表示・キーボード操作・パフォーマンスは別途ブラウザで確認する。
 *
 * 実行: npm run audit:html
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const OUT = 'out';

async function htmlFiles(dir) {
  const found = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) found.push(full);
  }
  return found;
}

/**
 * 出力ファイルのパスからルートを求める。
 * 静的書き出しでは 404 ページが out/404.html と out/404/index.html と
 * out/_not-found/index.html の3か所に出るので、前2つは同じルートとして扱う。
 */
function route(file) {
  const rel = path.relative(OUT, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'/index.html'.length);
  return '/' + rel.replace(/\.html$/, '');
}

/** 404 ページの出力先。title/description の重複チェックからは除く */
const isNotFound = (r) => r === '/404' || r === '/_not-found';

/**
 * 日本語の検索結果の表示幅は「文字数」ではなく「全角換算幅」で決まる。
 * 半角英数は全角の半分の幅しか使わないので、文字数で測ると
 * 英字を含むタイトルを過剰に長いと判定してしまう。
 *   例: 「Neunon Consulting」は17文字だが幅は 8.5
 */
function displayWidth(text) {
  let width = 0;
  for (const char of text) {
    const code = char.codePointAt(0);
    // 全角（CJK・かな・全角記号）は 1.0、それ以外は 0.5
    const isFullWidth =
      (code >= 0x1100 && code <= 0x115f) ||
      (code >= 0x2e80 && code <= 0xa4cf) ||
      (code >= 0xac00 && code <= 0xd7a3) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xfe30 && code <= 0xfe6f) ||
      (code >= 0xff00 && code <= 0xff60) ||
      (code >= 0xffe0 && code <= 0xffe6);
    width += isFullWidth ? 1 : 0.5;
  }
  return width;
}

/*
 * しきい値。表示枠の目安は title 30 / description 120 だが、
 * 目安を少し超えた程度でデプロイを止めるのは行き過ぎなので、
 * 明らかに破綻している場合だけ落とす。
 */
const TITLE_MAX_WIDTH = 36;
const DESC_MAX_WIDTH = 130;
const DESC_MIN_WIDTH = 60;

/** 機密・個人情報に関する禁止語（要件定義書 6.6 / 12.1） */
const FORBIDDEN = [
  { word: '偏差値', why: '学歴要件の非掲載（6.6）' },
  { word: '旧帝', why: '学歴要件の非掲載（6.6）' },
  { word: 'MARCH', why: '学歴要件の非掲載（6.6）' },
  { word: '早慶', why: '学歴要件の非掲載（6.6）' },
  { word: '難関大', why: '学歴要件の非掲載（6.6）' },
  { word: 'consentPublish', why: 'private データの非出力（8.1）' },
  { word: 'フェーズ2で使用', why: 'private データの非出力（8.1）' },
];

async function main() {
  const files = await htmlFiles(OUT);
  const issues = [];
  const titles = new Map();
  const descriptions = new Map();

  for (const file of files) {
    const html = await fs.readFile(file, 'utf-8');
    const r = route(file);
    const add = (msg) => issues.push({ route: r, msg });

    // --- lang ---
    if (!/<html[^>]*\blang="ja"/.test(html)) add('html に lang="ja" がない');

    // --- title / description / canonical ---
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    if (!title) add('<title> がない');
    else if (!isNotFound(r)) {
      if (titles.has(title)) add(`title が ${titles.get(title)} と重複: ${title}`);
      else titles.set(title, r);
    }

    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
    if (!desc) add('meta description がない');
    else if (!isNotFound(r)) {
      if (descriptions.has(desc)) add(`description が ${descriptions.get(desc)} と重複`);
      else descriptions.set(desc, r);
    }

    if (!isNotFound(r) && !/<link rel="canonical"/.test(html)) add('canonical がない');

    // --- 検索結果での表示幅（要件定義書 10.2） ---
    // noindex のページは検索結果に出ないので、幅を測る意味がない
    const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
    if (title && !isNotFound(r) && !noindex) {
      const w = displayWidth(title);
      if (w > TITLE_MAX_WIDTH) {
        add(`title が長すぎる（全角換算 ${w} / 目安30・上限${TITLE_MAX_WIDTH}）: ${title}`);
      }
    }
    if (desc && !isNotFound(r) && !noindex) {
      const w = displayWidth(desc);
      if (w > DESC_MAX_WIDTH) add(`description が長すぎる（全角換算 ${w} / 上限${DESC_MAX_WIDTH}）`);
      if (w < DESC_MIN_WIDTH) add(`description が短すぎる（全角換算 ${w} / 下限${DESC_MIN_WIDTH}）`);
    }

    // --- 見出し ---
    const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/g)].map((m) => Number(m[1]));
    const h1count = headings.filter((h) => h === 1).length;
    if (h1count === 0) add('h1 がない');
    if (h1count > 1) add(`h1 が ${h1count} 個ある`);
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] - headings[i - 1] > 1) {
        add(`見出しレベルが h${headings[i - 1]} から h${headings[i]} へ飛んでいる`);
        break;
      }
    }

    // --- ランドマーク ---
    if (!/<main\b/.test(html)) add('main 要素がない');

    // --- 画像の代替テキスト ---
    for (const m of html.matchAll(/<img\b[^>]*>/g)) {
      if (!/\balt=/.test(m[0])) add(`img に alt がない: ${m[0].slice(0, 60)}`);
    }

    // --- リンクのテキスト ---
    for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
      const attrs = m[1];
      const text = m[2].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
      if (text === '' && !/aria-label=|aria-hidden="true"/.test(attrs)) {
        add(`リンクにテキストも aria-label もない: ${m[0].slice(0, 70)}`);
      }
    }

    // --- ボタンのアクセシブルネーム ---
    for (const m of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
      const text = m[2].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
      if (text === '' && !/aria-label=/.test(m[1])) {
        add(`button に名前がない: ${m[0].slice(0, 70)}`);
      }
    }

    // --- フォーム項目のラベル ---
    const labelFor = new Set([...html.matchAll(/<label[^>]*\bfor="([^"]*)"/g)].map((m) => m[1]));
    for (const m of html.matchAll(/<(input|textarea|select)\b([^>]*)>/g)) {
      const attrs = m[2];
      if (/type="(hidden|submit|button)"/.test(attrs)) continue;
      const id = attrs.match(/\bid="([^"]*)"/)?.[1];
      const hasLabel = (id && labelFor.has(id)) || /aria-label=|aria-labelledby=/.test(attrs);
      if (!hasLabel) add(`${m[1]} にラベルがない: ${m[0].slice(0, 70)}`);
    }

    // --- スキップリンクが最初のフォーカス可能要素か（要件定義書 9.4） ---
    const body = html.slice(html.indexOf('<body'));
    const firstFocusable = body.match(/<(a|button|input|select|textarea)\b[^>]*>/);
    if (firstFocusable && !/sr-only-focusable/.test(firstFocusable[0])) {
      add(`最初のフォーカス可能要素がスキップリンクではない: ${firstFocusable[0].slice(0, 60)}`);
    }

    // --- 禁止語 ---
    for (const { word, why } of FORBIDDEN) {
      if (html.includes(word)) add(`禁止語「${word}」が含まれる — ${why}`);
    }

    // --- 構造化データが壊れていないか ---
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        JSON.parse(m[1]);
      } catch {
        add('構造化データ（JSON-LD）が JSON として不正');
      }
    }
  }

  // --- 結果 ---
  console.log(`検査対象: ${files.length} ページ`);
  console.log(`固有の title: ${titles.size} / 固有の description: ${descriptions.size}`);
  if (issues.length === 0) {
    console.log('\n指摘なし');
    return;
  }
  console.log(`\n指摘 ${issues.length} 件:`);
  const grouped = new Map();
  for (const { route: r, msg } of issues) {
    if (!grouped.has(msg)) grouped.set(msg, []);
    grouped.get(msg).push(r);
  }
  for (const [msg, routes] of [...grouped].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  [${routes.length}] ${msg}`);
    console.log(`      ${routes.slice(0, 4).join(', ')}${routes.length > 4 ? ' ほか' : ''}`);
  }
  process.exitCode = 1;
}

await main();
