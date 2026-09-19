/**
 * Decap's documented /auth -> /callback and postMessage protocol:
 * https://decapcms.org/docs/backends-overview/#using-github-with-an-oauth-proxy
 * Reference: https://github.com/sterlingwes/decap-proxy
 * Security additions: state cookie, PKCE, exact origin/source handshake, repo access check.
 * Independent of worker/ (forms). Never log requests, codes, secrets, or tokens.
 */
const CMS_ORIGIN = 'https://neun-on.com';
const REPOSITORY = 'neunon/neunon-web';
const COOKIE = '__Host-nc-cms-oauth';
const LIFETIME = 600;
const encoder = new TextEncoder();
const base64url = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const random = () => base64url(crypto.getRandomValues(new Uint8Array(32)));
const headers = () => ({
  'Cache-Control': 'no-store',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex, nofollow',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
});
const cookie = (value, age) => COOKIE + '=' + value + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=' + age;
const fail = (message, status = 400) => new Response(message, {
  status, headers: { ...headers(), 'Set-Cookie': cookie('', 0), 'Content-Type': 'text/plain; charset=utf-8' },
});
function sessionFrom(request) {
  const value = request.headers.get('Cookie')?.split(';').map(v => v.trim()).find(v => v.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1);
  if (!value || value.length > 1024) return null;
  try { return JSON.parse(decodeURIComponent(value)); } catch { return null; }
}
function callbackHtml(token) {
  const nonce = random();
  // Encode the whole protocol message, not a token interpolated into executable source.
  const message = JSON.stringify('authorization:github:success:' + JSON.stringify({ token, provider: 'github' })).replace(/</g, '\\u003c');
  const html = '<!doctype html><html lang="ja"><meta charset="utf-8"><title>CMS認証</title><body><p>認証を確認しています。この画面は自動で閉じます。</p><script nonce="' + nonce + '">' +
    'const destination=' + JSON.stringify(CMS_ORIGIN) + ';' +
    'const parentWindow=window.opener;' +
    'function receive(event){' +
    'if(event.origin!==destination||event.source!==parentWindow||event.data!=="authorizing:github")return;' +
    'window.removeEventListener("message",receive);' +
    'parentWindow.postMessage(' + message + ',destination);' +
    'window.close();}' +
    'if(parentWindow){window.addEventListener("message",receive);parentWindow.postMessage("authorizing:github",destination);}' +
    '</script></body></html>';
  return new Response(html, {
    headers: {
      ...headers(),
      'Set-Cookie': cookie('', 0),
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': "default-src 'none'; script-src 'nonce-" + nonce + "'; frame-ancestors 'none'; base-uri 'none'",
    },
  });
}

export async function handle(request, env, requestGitHub = fetch) {
  const url = new URL(request.url);
  if (request.method !== 'GET') return fail('Method not allowed', 405);
  if (!['/auth', '/callback'].includes(url.pathname)) return fail('Not found', 404);
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET || !env.AUTH_ORIGIN) {
    return fail('CMS authentication is not configured.', 503);
  }
  if (url.origin !== env.AUTH_ORIGIN || url.protocol !== 'https:') return fail('Invalid origin', 403);
  const origin = request.headers.get('Origin');
  if (origin && origin !== CMS_ORIGIN && origin !== env.AUTH_ORIGIN) return fail('Invalid origin', 403);
  if (url.pathname === '/auth') {
    if (url.searchParams.get('provider') !== 'github' || url.searchParams.get('site_id') !== new URL(CMS_ORIGIN).hostname) {
      return fail('Invalid provider or site', 400);
    }
    const state = random();
    const verifier = random();
    const challenge = base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(verifier))));
    const session = encodeURIComponent(JSON.stringify({ state, verifier, created: Date.now() }));
    const authorize = new URL('https://github.com/login/oauth/authorize');
    authorize.search = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: env.AUTH_ORIGIN + '/callback',
      scope: env.GITHUB_REPO_PRIVATE === 'false' ? 'public_repo' : 'repo',
      state, code_challenge: challenge, code_challenge_method: 'S256',
      allow_signup: 'false',
    }).toString();
    return new Response(null, {
      status: 302, headers: { ...headers(), Location: authorize.href, 'Set-Cookie': cookie(session, LIFETIME) },
    });
  }

  const session = sessionFrom(request);
  const age = Date.now() - session?.created;
  if (!session || !/^[A-Za-z0-9_-]{43}$/.test(session.state || '')
    || !/^[A-Za-z0-9_-]{43}$/.test(session.verifier || '')
    || !Number.isFinite(age) || age < 0 || age > LIFETIME * 1000
    || session.state !== url.searchParams.get('state')) return fail('Invalid or expired OAuth state');
  if (url.searchParams.has('error')) return fail('GitHub authorization was not completed');
  const code = url.searchParams.get('code');
  if (!code || code.length > 512) return fail('Missing authorization code');
  try {
    const response = await requestGitHub('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET,
        redirect_uri: env.AUTH_ORIGIN + '/callback', code, code_verifier: session.verifier,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return fail('GitHub token exchange failed', 502);
    const result = await response.json();
    if (result.error || typeof result.access_token !== 'string' || !result.access_token || result.token_type?.toLowerCase() !== 'bearer') {
      return fail('GitHub token exchange failed', 502);
    }
    // The GitHub backend needs push permission. Do not return credentials to non-editors.
    const repo = await requestGitHub('https://api.github.com/repos/' + REPOSITORY, {
      headers: {
        Authorization: 'Bearer ' + result.access_token,
        Accept: 'application/vnd.github+json', 'User-Agent': 'Neunon-CMS-Auth',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!repo.ok || !(await repo.json()).permissions?.push) return fail('Repository write access is required', 403);
    return callbackHtml(result.access_token);
  } catch {
    return fail('Authentication could not be completed. Please retry.', 502);
  }
}
export default { fetch: (request, env) => handle(request, env) };
