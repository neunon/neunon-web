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
  const home = read('content/pages/home.json');
  keys(home, [
    'eyebrow', 'titleLine1', 'titleLine2', 'lead', 'businessSummary', 'companyCtaLabel', 'studentCtaLabel',
  ], 'home');
  const problem = home?.problem;
  keys(problem, ['title', 'intro', 'studentTitle', 'studentBody', 'businessTitle', 'businessBody'], 'home.problem');
  if (typeof problem?.visible !== 'boolean') fail('home.problem.visible', 'booleanが必要です');
  objects(problem?.opportunities, ['title'], 'home.problem.opportunities').forEach((item, i) =>
    stringList(item.body, `home.problem.opportunities[${i}].body`));

  const about = read('content/pages/about.json');
  keys(about, ['heroLead'], 'about');
  keys(about?.mission, ['title', 'body'], 'about.mission');
  keys(about?.people, ['title', 'introTitle'], 'about.people');
  for (const [where, value] of [['about.mission.visible', about?.mission?.visible], ['about.people.visible', about?.people?.visible], ['about.companyVisible', about?.companyVisible]]) {
    if (typeof value !== 'boolean') fail(where, 'booleanが必要です');
  }
  stringList(about?.people?.introParagraphs, 'about.people.introParagraphs');
  objects(about?.people?.points, ['title'], 'about.people.points').forEach((item, i) =>
    stringList(item.paragraphs, `about.people.points[${i}].paragraphs`));

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
        objects(c.formats?.items, ['no', 'title', 'role', 'body', 'from'], at + '.formats.items', 1)
          .forEach((item, i) => stringList(item.chain, at + '.formats.items[' + i + '].chain', 2));
        keys(c.formats?.diagram, ['client'], at + '.formats.diagram');
        objects(c.formats?.diagram?.actors, ['id', 'label'], at + '.formats.diagram.actors', 3);
        keys(c.cases, ['lead'], at + '.cases');
        objects(c.cases?.items, ['no', 'title', 'summary'], at + '.cases.items', 1)
          .forEach((item, i) => {
            for (const field of ['issue', 'approach', 'insight']) {
              stringList(item[field], at + '.cases.items[' + i + '].' + field);
            }
          });
        keys(c.record, ['heading', 'lead', 'industryLead', 'note'], at + '.record');
        objects(c.record?.stats, ['value', 'unit', 'label'], at + '.record.stats', 1);
        stringList(c.record?.industries, at + '.record.industries');
        objects(c.record?.examples, ['client'], at + '.record.examples', 1)
          .forEach((e, i) => stringList(e.items, at + '.record.examples[' + i + '].items'));
        keys(c.price, ['lead'], at + '.price');
        objects(c.price?.reasons, ['no', 'title', 'body'], at + '.price.reasons', 3);
        keys(c.price?.chart, ['caption', 'annotation', 'note'], at + '.price.chart');
        objects(c.price?.chart?.columns, ['label'], at + '.price.chart.columns', 2)
          .forEach((col, i) => {
            const segs = objects(col.segments, ['label', 'tone'], at + '.price.chart.columns[' + i + '].segments', 2);
            segs.forEach((seg, j) => {
              if (!Number.isFinite(seg.value) || seg.value <= 0) {
                fail(at + '.price.chart.columns[' + i + '].segments[' + j + '].value', '正の数値が必要です');
              }
            });
          });
      }
    }

    if (id === 'consulting') {
      // 専用ページでは「進め方」「想定期間・体制」を扱わない。残っていたら消し忘れ
      for (const field of ['steps', 'engagement']) {
        if (data[field] != null) fail(where + '.' + field, 'コンサルティングでは使いません。削除してください');
      }
    } else {
      objects(data.steps, ['no', 'title', 'body'], where + '.steps');
      objects(data.engagement, ['label', 'value'], where + '.engagement');
    }
    objects(data.pricing, ['label', 'price'], where + '.pricing', id === 'package' ? 6 : 0);
    objects(data.faq, ['q', 'a'], where + '.faq');
  }
  const workDir = path.join(root, 'content/works');
  const workSlugs = new Set();
  for (const file of fs.readdirSync(workDir).filter(f => f.endsWith('.json'))) {
    const where = 'content/works/' + file;
    const work = read(where);
    if (!object(work)) continue;
    keys(work, ['slug', 'industry', 'title', 'background', 'challenge', 'approach', 'insight'], where);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(work.slug || '')) fail(where, 'slugが不正です');
    if (workSlugs.has(work.slug)) fail(where, 'slugが重複しています');
    workSlugs.add(work.slug);
    if (!Number.isInteger(work.order) || work.order < 1) fail(where + '.order', '1以上の整数が必要です');
    if (!Array.isArray(work.services) || !work.services.length || work.services.some(s => !['consulting', 'package', 'ai'].includes(s))) fail(where + '.services', '関連事業を1つ以上選択してください');
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
    if (data.published != null && typeof data.published !== 'boolean') fail(where, 'publishedはbooleanです');
    if (data.placeholder === true) warnings.push(where + ': 仮原稿の印が残っています。従来どおり公開されるため原稿確認が必要です');
    description(data.excerpt, where);
  }
  const landingFiles = fs.readdirSync(path.join(root, 'content/landing')).filter(f => f.endsWith('.json'));
  const landingSlugs = new Set();
  const safeHref = value => typeof value === 'string' && /^\/(?!\/)[A-Za-z0-9/_#-]*$/.test(value);
  for (const file of landingFiles) {
    const where = 'content/landing/' + file;
    const page = read(where);
    if (!object(page)) continue;
    keys(page, ['slug', 'title', 'lead', 'seoTitle', 'seoDescription'], where);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.slug || '') || file !== `${page.slug}.json`) fail(where, 'slugとファイル名が一致するURL用IDが必要です');
    if (landingSlugs.has(page.slug)) fail(where, 'slugが重複しています');
    landingSlugs.add(page.slug);
    if (typeof page.published !== 'boolean') fail(where + '.published', 'booleanが必要です');
    if (page.updatedAt && !validDate(page.updatedAt)) fail(where + '.updatedAt', '有効なYYYY-MM-DDが必要です');
    description(page.seoDescription, where);
    if (!Array.isArray(page.sections)) { fail(where + '.sections', '配列が必要です'); continue; }
    if (page.published && !page.sections.some(s => s?.visible)) fail(where, '公開ページには表示するセクションが必要です');
    page.sections.forEach((section, i) => {
      const at = `${where}.sections[${i}]`;
      if (!object(section)) { fail(at, 'オブジェクトが必要です'); return; }
      if (!['text', 'cards', 'imageText', 'faq', 'cta', 'steps', 'stats'].includes(section.type)) fail(at + '.type', '未対応のセクション形式です');
      if (!['white', 'soft', 'dark'].includes(section.tone)) fail(at + '.tone', '未対応の背景です');
      if (typeof section.visible !== 'boolean') fail(at + '.visible', 'booleanが必要です');
      string(section.title, at + '.title');
      if (section.type === 'text' || section.type === 'imageText') stringList(section.paragraphs, at + '.paragraphs');
      if (section.type === 'cards') {
        objects(section.cards, ['title', 'body'], at + '.cards').forEach((card, j) => {
          if (typeof card.visible !== 'boolean') fail(`${at}.cards[${j}].visible`, 'booleanが必要です');
          if (card.href && !safeHref(card.href)) fail(`${at}.cards[${j}].href`, 'サイト内のパスのみ指定できます');
        });
      }
      if (section.type === 'imageText') {
        if (typeof section.image !== 'string' || !/^\/uploads\/[A-Za-z0-9/_-]+\.(?:png|jpe?g|webp|avif)$/i.test(section.image)) fail(at + '.image', '/uploads/ 配下の画像のみ指定できます');
        string(section.imageAlt, at + '.imageAlt');
        if (!['left', 'right'].includes(section.imageSide)) fail(at + '.imageSide', 'leftまたはrightが必要です');
      }
      if (section.type === 'faq') objects(section.questions, ['question', 'answer'], at + '.questions').forEach((question, j) => {
        if (typeof question.visible !== 'boolean') fail(`${at}.questions[${j}].visible`, 'booleanが必要です');
      });
      if (section.type === 'cta') {
        keys(section, ['body', 'label', 'href'], at);
        if (!safeHref(section.href)) fail(at + '.href', 'サイト内のパスのみ指定できます');
      }
      if (section.type === 'steps') objects(section.steps, ['title', 'body'], at + '.steps').forEach((step, j) => {
        if (typeof step.visible !== 'boolean') fail(`${at}.steps[${j}].visible`, 'booleanが必要です');
      });
      if (section.type === 'stats') objects(section.items, ['value', 'label'], at + '.items').forEach((item, j) => {
        if (typeof item.visible !== 'boolean') fail(`${at}.items[${j}].visible`, 'booleanが必要です');
      });
    });
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
