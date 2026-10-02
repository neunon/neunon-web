import fs from 'node:fs';
import path from 'node:path';

// Next static export requires one generated parameter when no LP is public.
// Remove only that reserved, build-generated 404 page before deployment.
const out = path.resolve(process.cwd(), 'out');
const placeholder = path.resolve(out, 'lp', '__cms-placeholder');
if (!placeholder.startsWith(out + path.sep)) throw new Error('Invalid placeholder path');
fs.rmSync(placeholder, { recursive: true, force: true });
