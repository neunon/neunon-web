import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { handle } from '../src/index.mjs';

const env = { AUTH_ORIGIN: 'https://auth.example.com', GITHUB_CLIENT_ID: 'test-id', GITHUB_CLIENT_SECRET: 'test-secret' };
const auth = () => new Request(env.AUTH_ORIGIN + '/auth?provider=github&site_id=neun-on.com');
const start = async () => {
  const response = await handle(auth(), env);
  return { response, location: new URL(response.headers.get('Location')), cookie: response.headers.get('Set-Cookie').split(';')[0] };
};
test('requires configuration, allowed site, origin and method', async () => {
  assert.equal((await handle(auth(), {})).status, 503);
  assert.equal((await handle(new Request(env.AUTH_ORIGIN + '/auth?provider=github&site_id=evil.test'), env)).status, 400);
  assert.equal((await handle(new Request(auth(), { headers: { Origin: 'https://evil.test' } }), env)).status, 403);
  assert.equal((await handle(new Request(auth(), { method: 'POST' }), env)).status, 405);
});
test('authorization uses random state, secure cookie and PKCE', async () => {
  const a = await start(), b = await start();
  assert.equal(a.response.status, 302);
  assert.equal(a.location.origin, 'https://github.com');
  assert.equal(a.location.searchParams.get('redirect_uri'), env.AUTH_ORIGIN + '/callback');
  assert.equal(a.location.searchParams.get('code_challenge_method'), 'S256');
  assert.notEqual(a.location.searchParams.get('state'), b.location.searchParams.get('state'));
  assert.match(a.response.headers.get('Set-Cookie'), /HttpOnly; Secure; SameSite=Lax/);
  assert.equal(a.response.headers.get('Cache-Control'), 'no-store');
});
test('callback rejects absent, mismatched and expired state without exchange', async () => {
  const { cookie } = await start();
  const fetchForbidden = () => { throw new Error('must not call GitHub'); };
  assert.equal((await handle(new Request(env.AUTH_ORIGIN + '/callback?code=x&state=wrong', { headers: { Cookie: cookie } }), env, fetchForbidden)).status, 400);
  assert.equal((await handle(new Request(env.AUTH_ORIGIN + '/callback?code=x'), env, fetchForbidden)).status, 400);
  const session = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
  session.created -= 601000;
  const expired = '__Host-nc-cms-oauth=' + encodeURIComponent(JSON.stringify(session));
  assert.equal((await handle(new Request(env.AUTH_ORIGIN + '/callback?code=x&state=' + session.state, { headers: { Cookie: expired } }), env, fetchForbidden)).status, 400);
});
test('successful exchange: exact target, safe handshake, no token leakage to other windows', async () => {
  const { cookie, location } = await start();
  let calls = 0;
  const fakeFetch = async (url, options) => {
    calls++;
    if (calls === 1) {
      assert.equal(url, 'https://github.com/login/oauth/access_token');
      assert.equal(options.body.get('client_secret'), env.GITHUB_CLIENT_SECRET);
      assert.ok(options.body.get('code_verifier'));
      return Response.json({ access_token: 'test-token', token_type: 'bearer' });
    }
    assert.equal(url, 'https://api.github.com/repos/neunon/neunon-web');
    return Response.json({ permissions: { push: true } });
  };
  const response = await handle(new Request(env.AUTH_ORIGIN + '/callback?code=x&state=' + location.searchParams.get('state'), { headers: { Cookie: cookie } }), env, fakeFetch);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('Set-Cookie'), /Max-Age=0/);
  assert.match(response.headers.get('Content-Security-Policy'), /nonce-/);
  const body = await response.text();
  assert.ok(!body.includes(env.GITHUB_CLIENT_SECRET));
  const script = body.match(/<script nonce="[^"]+">([\s\S]*?)<\/script>/)[1];
  const sent = [];
  let listener;
  const opener = { postMessage: (...args) => sent.push(args) };
  const win = { opener, addEventListener: (_, fn) => { listener = fn; }, removeEventListener: () => {}, close: () => {} };
  vm.runInNewContext(script, { window: win });
  assert.deepEqual(sent[0], ['authorizing:github', 'https://neun-on.com']);
  listener({ origin: 'https://evil.test', source: opener, data: 'authorizing:github' });
  listener({ origin: 'https://neun-on.com', source: {}, data: 'authorizing:github' });
  assert.equal(sent.length, 1);
  listener({ origin: 'https://neun-on.com', source: opener, data: 'authorizing:github' });
  assert.equal(sent.length, 2);
  assert.equal(sent[1][1], 'https://neun-on.com');
  assert.match(sent[1][0], /authorization:github:success:/);
});
test('GitHub errors and read-only repository users never receive a token', async () => {
  for (const mode of ['failed', 'read-only']) {
    const { cookie, location } = await start();
    let calls = 0;
    const fakeFetch = async () => {
      calls++;
      if (mode === 'failed') return Response.json({ error: 'bad_verification_code' });
      return calls === 1 ? Response.json({ access_token: 'secret-test-token', token_type: 'bearer' }) : Response.json({ permissions: { push: false } });
    };
    const response = await handle(new Request(env.AUTH_ORIGIN + '/callback?code=x&state=' + location.searchParams.get('state'), { headers: { Cookie: cookie } }), env, fakeFetch);
    assert.ok(response.status >= 400);
    assert.ok(!(await response.text()).includes('secret-test-token'));
  }
});
