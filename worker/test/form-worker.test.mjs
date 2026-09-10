import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAutoReply, buildNotificationText, corsHeaders, textToHtml } from '../src/index.mjs';

test('CORS allows the production site and local development only', () => {
  assert.equal(corsHeaders('https://neun-on.com', 'https://neun-on.com')['Access-Control-Allow-Origin'], 'https://neun-on.com');
  assert.equal(corsHeaders('http://127.0.0.1:3000', 'https://neun-on.com')['Access-Control-Allow-Origin'], 'http://127.0.0.1:3000');
  assert.equal(corsHeaders('https://attacker.example', 'https://neun-on.com'), null);
});

test('notification includes submitted values but escapes HTML', () => {
  const config = { notificationSubject: 'Contact', labels: { name: 'お名前', message: '内容' } };
  const text = buildNotificationText('contact', config, { name: '坂本', message: '<script>' }, new Request('https://api.example/contact', { headers: { Origin: 'https://neun-on.com' } }));
  assert.match(text, /坂本/);
  assert.match(text, /<script>/);
  assert.doesNotMatch(textToHtml(text), /<script>/);
});

test('auto reply differs for contact and entry', () => {
  assert.match(buildAutoReply('contact', '山田'), /お問い合わせを受け付けました/);
  assert.match(buildAutoReply('entry', '山田'), /エントリーを受け付けました/);
});
