import test from 'node:test';
import assert from 'node:assert/strict';
import { validDate, validateContent } from '../audit-content.mjs';
import { createCmsConfig } from '../cms-config.mjs';
import fs from 'node:fs';

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
  assert.deepEqual(config.collections.map(c => c.name), ['seo', 'pages', 'services', 'news']);
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
  const serialized = JSON.stringify(config);
  for (const path of ['content/talent', 'content/jobs', 'privacy', 'terms', 'GITHUB_CLIENT_SECRET']) {
    assert.ok(!serialized.includes(path));
  }
});
