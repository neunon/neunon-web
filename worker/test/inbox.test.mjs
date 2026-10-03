import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.mjs';

const origin = 'https://neun-on.com';
const api = 'https://api.example';

function memoryEnv() {
  const rows = new Map();
  const objects = new Map();
  return {
    ALLOWED_ORIGINS: origin, RESEND_API_KEY: 'test', FROM_EMAIL: 'site@example.com', INBOX_ALLOWED_USERS: 'owner',
    NOTIFICATION_EMAIL: 'owner@example.com',
    SUBMISSIONS: { prepare(sql) {
      return { bind(...params) {
        return {
          async first() { return rows.get(params[0]) || null; },
          async run() {
            if (sql.startsWith('INSERT')) rows.set(params[0], {
              id: params[0], form_type: params[1], created_at: params[2], status: 'pending',
              values_json: params[3], attachment_key: params[4], attachment_name: params[5],
              attachment_type: params[6], attachment_size: params[7],
            });
            if (sql.startsWith('UPDATE')) rows.get(params[0]).status = sql.includes("status='sent'") ? 'sent' : 'failed';
          },
          async all() { return { results: [...rows.values()] }; },
        };
      } };
    } },
    ATTACHMENTS: { async put(key, value) { objects.set(key, value); }, async get(key) {
      return objects.has(key) ? { body: objects.get(key) } : null;
    } },
  };
}

test('inbox rejects unauthenticated reads, including attachments', async () => {
  const env = memoryEnv();
  for (const path of ['/submissions', `/submissions/${crypto.randomUUID()}/attachment`]) {
    const response = await worker.fetch(new Request(api + path, { headers: { Origin: origin } }), env);
    assert.equal(response.status, 401);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
  }
});

test('contact is archived after email delivery and editor can read it', async () => {
  const env = memoryEnv();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (String(url).startsWith('https://api.resend.com/')) return new Response('{}', { status: 200 });
    if (String(url) === 'https://api.github.com/user') return Response.json({ login: 'owner' });
    if (String(url).startsWith('https://api.github.com/')) return Response.json({ permissions: { push: true } });
    throw new Error('unexpected request');
  };
  try {
    const form = new FormData();
    for (const [key, value] of Object.entries({ company:'Example', name:'山田', email:'yamada@example.com',
      topic:'相談', message:'本文', privacyConsent:'accepted', submissionId:crypto.randomUUID() })) form.set(key, value);
    const sent = await worker.fetch(new Request(api + '/contact', { method:'POST', headers:{ Origin:origin }, body:form }), env);
    assert.equal(sent.status, 200);
    const list = await worker.fetch(new Request(api + '/submissions', { headers:{ Origin:origin, Authorization:'Bearer example-token' } }), env);
    assert.equal(list.status, 200);
    const body = await list.json();
    assert.equal(body.items[0].name, '山田');
    assert.equal(body.items[0].status, 'sent');
    const detail = await worker.fetch(new Request(api + `/submissions/${body.items[0].id}`, { headers:{ Origin:origin, Authorization:'Bearer example-token' } }), env);
    assert.equal((await detail.json()).values.message, '本文');
  } finally { globalThis.fetch = originalFetch; }
});

test('a token from an unlisted editor cannot read submissions', async () => {
  const env = memoryEnv();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => String(url).endsWith('/user')
    ? Response.json({ login: 'another-editor' }) : Response.json({ permissions: { push: true } });
  try {
    const response = await worker.fetch(new Request(api + '/submissions', {
      headers: { Origin: origin, Authorization: 'Bearer valid-token' },
    }), env);
    assert.equal(response.status, 401);
  } finally { globalThis.fetch = originalFetch; }
});

test('student attachment is private and available to an authorized inbox user', async () => {
  const env = memoryEnv();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (String(url).startsWith('https://api.resend.com/')) return new Response('{}');
    if (String(url).endsWith('/user')) return Response.json({ login: 'owner' });
    return Response.json({ permissions: { push: true } });
  };
  try {
    const form = new FormData();
    for (const [key, value] of Object.entries({ name:'学生', email:'student@example.com', school:'大学',
      experience:'経験', motivation:'志望動機', privacyConsent:'accepted', submissionId:crypto.randomUUID() })) form.set(key, value);
    form.set('portfolioFile', new File(['sample'], 'portfolio.pdf', { type:'application/pdf' }));
    const sent = await worker.fetch(new Request(api + '/entry', { method:'POST', headers:{ Origin:origin }, body:form }), env);
    assert.equal(sent.status, 200);
    const list = await worker.fetch(new Request(api + '/submissions', { headers:{ Origin:origin, Authorization:'Bearer valid-token' } }), env);
    const id = (await list.json()).items[0].id;
    const denied = await worker.fetch(new Request(api + `/submissions/${id}/attachment`, { headers:{ Origin:origin } }), env);
    assert.equal(denied.status, 401);
    const allowed = await worker.fetch(new Request(api + `/submissions/${id}/attachment`, {
      headers:{ Origin:origin, Authorization:'Bearer valid-token' },
    }), env);
    assert.equal(allowed.status, 200);
    assert.equal(await allowed.text(), 'sample');
    assert.match(allowed.headers.get('Content-Disposition'), /attachment;/);
  } finally { globalThis.fetch = originalFetch; }
});
