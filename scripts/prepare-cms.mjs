import fs from 'node:fs/promises';
import path from 'node:path';
import { createCmsConfig } from './cms-config.mjs';

const target = 'public/admin';
const raw = process.env.CMS_AUTH_BASE_URL?.trim();
const authUrl = raw || 'https://cms-auth-not-configured.invalid';
if (raw) {
  const parsed = new URL(raw);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('CMS_AUTH_BASE_URL はパス・認証情報を含まないHTTPSオリジンにしてください');
  }
}
await fs.mkdir(path.join(target, 'vendor'), { recursive: true });
const dist = 'node_modules/decap-cms/dist';
// Chunk assets are required by the distributed CMS; source maps are not published.
for (const name of await fs.readdir(dist)) {
  if (name.endsWith('.map') || /(^|\.)cms\.js/.test(name)) continue;
  if (!/\.(js|css|wasm|txt)$/.test(name)) continue;
  await fs.copyFile(path.join(dist, name), path.join(target, 'vendor', name));
}
await fs.writeFile(path.join(target, 'config.yml'), JSON.stringify(createCmsConfig(new URL(authUrl).origin), null, 2) + '\n');
await fs.writeFile(path.join(target, 'status.json'), JSON.stringify({ configured: Boolean(raw) }) + '\n');
console.log(raw ? 'CMS assets ready (OAuth login requires deployed Worker).' : 'CMS assets ready; OAuth disabled until CMS_AUTH_BASE_URL is set.');
