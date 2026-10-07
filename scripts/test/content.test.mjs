import test from 'node:test';
import assert from 'node:assert/strict';
import { validDate, validateContent } from '../audit-content.mjs';
import { createCmsConfig } from '../cms-config.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

test('dates must exist in the calendar, not only parse in JS', () => {
  assert.equal(validDate('2026-09-19'), true);
  for (const date of ['2026-02-30', '2026-13-01', '2026-2-01', 'bad', null, '']) assert.equal(validDate(date), false);
});
test('current editorial data matches schemas', () => assert.deepEqual(validateContent().errors, []));
test('CMS uses review workflow and exposes only approved collections', () => {
  const config = createCmsConfig('https://auth.example.com');
  assert.equal(config.publish_mode, 'editorial_workflow');
  assert.equal(config.backend.repo, 'neunon/neunon-web');
  assert.equal(config.backend.branch, 'main');
  assert.deepEqual(config.collections.map(c => c.name), ['seo', 'siteSettings', 'pages', 'aboutPage', 'recruitPage', 'formsPage', 'hubPages', 'services', 'extraSections', 'landing', 'news']);
  assert.ok(config.collections.find(c => c.name === 'pages').files[0].fields.some(f => f.name === 'bottomCta'));
  assert.ok(config.collections.find(c => c.name === 'recruitPage').files[0].fields.some(f => f.name === 'hero'));
  const landing = config.collections.find(c => c.name === 'landing');
  assert.equal(landing.create, true);
  assert.equal(landing.delete, true);
  assert.deepEqual(landing.fields.find(f => f.name === 'sections').types.map(t => t.name), ['text', 'cards', 'imageText', 'faq', 'cta']);
  const extra = config.collections.find(c => c.name === 'extraSections');
  assert.ok(extra.files[0].fields.some(f => f.name === 'home'));
  assert.ok(extra.files[0].fields.some(f => f.name === 'aiProducts'));
  for (const file of config.collections.find(c => c.name === 'services').files) {
    const source = JSON.parse(fs.readFileSync(file.file, 'utf8'));
    const declared = new Set(file.fields.map(f => f.name));
    for (const key of Object.keys(source)) assert.ok(declared.has(key), 'unrepresented service key: ' + key);
    for (const name of ['id', 'number', 'order', 'showPricing']) {
      const field = file.fields.find(f => f.name === name);
      assert.equal(field.widget, 'hidden');
      assert.equal(field.default, source[name]);
    }
    const menuKeys = new Set(file.fields.find(f => f.name === 'menu').fields.map(f => f.name));
    for (const item of source.menu) for (const key of Object.keys(item)) assert.ok(menuKeys.has(key), 'unrepresented menu key: ' + key);
  }
  const editablePaths = config.collections.flatMap(c => [c.folder, ...(c.files || []).map(f => f.file)]).filter(Boolean);
  for (const forbidden of ['content/talent', 'content/jobs', 'privacy', 'terms']) {
    assert.ok(!editablePaths.some(path => path.includes(forbidden)), 'protected path in CMS: ' + forbidden);
  }
  assert.ok(!JSON.stringify(config).includes('GITHUB_CLIENT_SECRET'));
});

test('new LP content supports drafts and rejects unsafe links', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'neunon-cms-test-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    const file = path.join(root, 'content/landing/example.json');
    const page = {
      slug: 'example', title: '掲載例', lead: '掲載例の説明', seoTitle: '掲載例',
      seoDescription: 'このページは新規LPのコンテンツ監査を確認するためのテストデータです。公開の可否と内部リンクを検証します。',
      published: false,
      sections: [{ type: 'cta', visible: true, tone: 'white', title: 'お問い合わせ', body: 'ご相談ください', label: '相談する', href: '/contact/' }],
    };
    fs.writeFileSync(file, JSON.stringify(page));
    assert.deepEqual(validateContent(root).errors, []);
    page.sections[0].href = 'https://outside.example/';
    fs.writeFileSync(file, JSON.stringify(page));
    assert.ok(validateContent(root).errors.some(error => error.includes('サイト内のパスのみ')));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('extra sections reject external links', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'neunon-extra-test-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    const file = path.join(root, 'content/pages/extra-sections.json');
    const content = JSON.parse(fs.readFileSync(file, 'utf8'));
    content.home.sections.push({ type: 'cta', visible: true, tone: 'white', title: '相談', body: 'ご相談ください', label: '相談する', href: 'https://outside.example' });
    fs.writeFileSync(file, JSON.stringify(content));
    assert.ok(validateContent(root).errors.some(error => error.includes('サイト内のパスのみ')));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
