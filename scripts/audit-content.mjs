import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const validDate = value => typeof value === 'string'
  && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(value))
  && new Date(value).toISOString().slice(0, 10) === value;

export function validateContent(root = process.cwd()) {
  const errors = [], warnings = [];
  const fail = (where, message) => errors.push(where + ': ' + message);
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const string = (value, where) => {
    if (typeof value !== 'string' || !value.trim()) fail(where, '空でない文字列が必要です');
  };
  const keys = (data, names, where) => {
    if (!object(data)) { fail(where, 'オブジェクトが必要です'); return; }
    for (const name of names) string(data[name], where + '.' + name);
  };
  const stringList = (value, where, min = 1) => {
    if (!Array.isArray(value) || value.length < min) { fail(where, '文字列の配列が必要です'); return; }
    value.forEach((v, i) => string(v, where + '[' + i + ']'));
  };
  const objects = (value, required, where, min = 1) => {
    if (!Array.isArray(value) || value.length < min) { fail(where, '項目の配列が必要です'); return []; }
    value.forEach((v, i) => keys(v, required, where + '[' + i + ']'));
    return value.filter(object);
  };
  const read = file => {
    try { return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')); }
    catch { fail(file, 'JSONの読込・解析に失敗'); return null; }
  };
  const description = (value, where) => {
    if (typeof value === 'string' && (value.length < 30 || value.length > 180)) {
      warnings.push(where + ': 説明文の長さを確認してください（' + value.length + '字）');
    }
  };
  const seo = read('content/site/seo.json');
  for (const key of ['home', 'services', 'works', 'talent', 'recruit', 'about', 'contact']) {
    keys(seo?.[key], ['title', 'description'], 'seo.' + key);
    description(seo?.[key]?.description, 'seo.' + key);
  }
  keys(read('content/pages/home.json'), [
    'eyebrow', 'titleLine1', 'titleLine2', 'lead', 'businessSummary', 'companyCtaLabel', 'studentCtaLabel',
  ], 'home');

  for (const [file, id, order] of [
    ['01-consulting', 'consulting', 1], ['02-package', 'package', 2], ['03-ai', 'ai', 3],
  ]) {
    const where = 'content/services/' + file + '.json';
    const data = read(where);
    if (!object(data)) continue;
    keys(data, ['title', 'summary', 'lead', 'pricingNote'], where);
    for (const field of ['seoTitle', 'seoDescription']) {
      if (data[field] != null && typeof data[field] !== 'string') fail(where + '.' + field, '文字列が必要');
    }
    description(data.seoDescription || data.summary, where);
    if (data.id !== id || data.order !== order || data.number !== String(order).padStart(2, '0') || data.showPricing !== (id === 'package')) {
      fail(where, 'コード管理のID・順序・価格公開設定が変更されています');
    }
    if (data.updatedAt != null && data.updatedAt !== '' && !validDate(data.updatedAt)) fail(where, 'updatedAtは有効なYYYY-MM-DDにしてください');
    stringList(data.highlights, where + '.highlights');
    stringList(data.useCases, where + '.useCases');
    const required = id === 'consulting' ? ['name', 'target', 'issue']
      : id === 'package' ? ['name', 'body', 'target', 'issue', 'effect'] : ['name', 'body'];
    const menu = objects(data.menu, required, where + '.menu');
    if (id === 'package') menu.forEach((item, i) => {
      stringList(item.effects, where + '.menu[' + i + '].effects', 2);
      if (item.effects?.length !== 2) fail(where, 'メニュー欄の効果は2行です');
    });
    // コンサルティングのみ、紹介資料に沿った拡張ブロックを持つ（ConsultingServiceDetail が描画）
    if (id === 'consulting') {
      const c = data.consulting;
      const at = where + '.consulting';
      if (!object(c)) {
        fail(at, 'コンサルティング詳細ブロックが必要です');
      } else {
        keys(c.vision, ['title'], at + '.vision');
        objects(c.vision?.values, ['no', 'en', 'body'], at + '.vision.values', 4);
        keys(c.principles, ['lead'], at + '.principles');
        objects(c.principles?.items, ['no', 'title', 'body'], at + '.principles.items', 4);
        keys(c.themes, ['lead'], at + '.themes');
        objects(c.themes?.items, ['no', 'title', 'question'], at + '.themes.items', 1)
          .forEach((t, i) => stringList(t.items, at + '.themes.items[' + i + '].items'));
        keys(c.formats, ['lead'], at + '.formats');
        objects(c.formats?.items, ['no', 'title', 'role', 'body'], at + '.formats.items', 1);
        keys(c.cases, ['lead'], at + '.cases');
        objects(c.cases?.items, ['no', 'title', 'summary'], at + '.cases.items', 1)
          .forEach((item, i) => {
            for (const field of ['issue', 'approach', 'insight']) {
              stringList(item[field], at + '.cases.items[' + i + '].' + field);
            }
          });
        keys(c.outputs, ['lead'], at + '.outputs');
        objects(c.outputs?.items, ['title', 'body'], at + '.outputs.items', 1);
        keys(c.record, ['lead', 'note'], at + '.record');
        objects(c.record?.stats, ['value', 'unit', 'label'], at + '.record.stats', 1);
        stringList(c.record?.industries, at + '.record.industries');
        objects(c.record?.examples, ['client'], at + '.record.examples', 1)
          .forEach((e, i) => stringList(e.items, at + '.record.examples[' + i + '].items'));
        keys(c.price, ['lead'], at + '.price');
        objects(c.price?.reasons, ['no', 'title', 'body'], at + '.price.reasons', 3);
      }
    }

    objects(data.steps, ['no', 'title', 'body'], where + '.steps');
    objects(data.engagement, ['label', 'value'], where + '.engagement');
    objects(data.pricing, ['label', 'price'], where + '.pricing', id === 'package' ? 6 : 0);
    objects(data.faq, ['q', 'a'], where + '.faq');
  }
  const slugs = new Set();
  let newsFiles = [];
  try { newsFiles = fs.readdirSync(path.join(root, 'content/news')).filter(f => f.endsWith('.json')); }
  catch { fail('content/news', 'ディレクトリがありません'); }
  for (const file of newsFiles) {
    const where = 'content/news/' + file;
    const data = read(where);
    if (!object(data)) continue;
    keys(data, ['slug', 'date', 'category', 'title', 'excerpt'], where);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug || '')) fail(where, 'slugが不正です');
    if (slugs.has(data.slug)) fail(where, 'slugが重複しています');
    slugs.add(data.slug);
    if (!validDate(data.date)) fail(where, '掲載日が不正です');
    stringList(data.body, where + '.body');
    if (data.placeholder != null && typeof data.placeholder !== 'boolean') fail(where, 'placeholderはbooleanです');
    if (data.placeholder === true) warnings.push(where + ': 仮原稿の印が残っています。従来どおり公開されるため原稿確認が必要です');
    description(data.excerpt, where);
  }
  return { errors, warnings };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateContent();
  for (const warning of result.warnings) console.warn('WARN ' + warning);
  for (const error of result.errors) console.error('ERROR ' + error);
  console.log('コンテンツ監査: ' + result.errors.length + ' errors / ' + result.warnings.length + ' warnings');
  if (result.errors.length) process.exitCode = 1;
}
