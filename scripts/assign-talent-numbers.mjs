import { randomInt } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';

const accessToken = process.env.MS_GRAPH_ACCESS_TOKEN;
const siteId = process.env.MS_GRAPH_SITE_ID;
const listId = process.env.MS_GRAPH_TALENT_LIST_ID;

if (!accessToken || !siteId || !listId) {
  throw new Error('Student number assignment requires an access token, site ID, and list ID.');
}

const root = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}`;

async function graph(url, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Microsoft Graph returned ${response.status}: ${body.slice(0, 500)}`);
  }
  return response.status === 204 ? undefined : response.json();
}

async function getAll(initialUrl) {
  const values = [];
  let nextUrl = initialUrl;
  while (nextUrl) {
    const page = await graph(nextUrl);
    values.push(...(page.value ?? []));
    nextUrl = page['@odata.nextLink'];
  }
  return values;
}

const numberColumnNames = new Set(['学生No', '学生No.', 'StudentNo']);
const columns = await getAll(`${root}/columns?$select=id,name,displayName`);
let numberColumn = columns.find((column) => numberColumnNames.has(column.displayName));

if (!numberColumn) {
  numberColumn = await graph(`${root}/columns`, {
    method: 'POST',
    body: JSON.stringify({
      name: '学生No',
      description: '公開用の匿名5桁番号。自動同期が未採番の学生に一度だけ付番します。',
      enforceUniqueValues: true,
      hidden: false,
      indexed: true,
      text: {
        allowMultipleLines: false,
        appendChangesToExistingText: false,
        linesForEditing: 1,
        maxLength: 5,
      },
    }),
  });
  console.log(`Created Microsoft Lists column: ${numberColumn.displayName}`);
}

const items = await getAll(`${root}/items?$expand=fields&$top=999`);
const usedNumbers = new Set(
  items
    .map((item) => String(item.fields?.[numberColumn.name] ?? '').trim())
    .filter((value) => /^\d{5}$/.test(value)),
);

function nextStudentNumber() {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const candidate = String(randomInt(10000, 100000));
    if (!usedNumbers.has(candidate)) {
      usedNumbers.add(candidate);
      return candidate;
    }
  }
  throw new Error('Could not generate a unique five-digit student number.');
}

let assigned = 0;
for (const item of items) {
  const current = String(item.fields?.[numberColumn.name] ?? '').trim();
  if (/^\d{5}$/.test(current)) continue;

  const studentNumber = nextStudentNumber();
  await graph(`${root}/items/${item.id}/fields`, {
    method: 'PATCH',
    body: JSON.stringify({ [numberColumn.name]: studentNumber }),
  });
  item.fields[numberColumn.name] = studentNumber;
  assigned += 1;
}

console.log(assigned > 0 ? `Assigned ${assigned} student number(s).` : 'All students already have a student number.');

const internalNames = new Map(
  columns
    .concat(numberColumn)
    .filter((column) => column.name && column.displayName)
    .map((column) => [column.displayName, column.name]),
);
const field = (fields, displayName) => fields[internalNames.get(displayName) ?? displayName];
const text = (value) => (typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '');
const number = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
const strings = (value) => {
  const raw = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[;,、\n]/) : [];
  return [...new Set(raw.map((entry) => String(entry).trim()).filter((entry) => entry && entry !== '0' && entry !== '-' && entry !== 'なし'))];
};
const studyCategory = (universityValue, facultyValue) => {
  const university = text(universityValue);
  const normalized = text(facultyValue).replace(/\s+/g, '');
  const faculty = normalized.match(/^(.+?(?:学部|研究科))/)?.[1];
  return [university || '大学生', faculty].filter(Boolean).join(' / ');
};

const publicTalents = items
  .filter((item) => text(field(item.fields ?? {}, 'サイト掲載可')) === '可')
  .map((item) => {
    const fields = item.fields ?? {};
    const studentNumber = text(fields[numberColumn.name]);
    if (!/^\d{5}$/.test(studentNumber)) return undefined;
    const skills = strings(field(fields, 'スキル'));
    const serviceAreas = strings(field(fields, '対応領域'));
    const experienceCount = Math.max(0, Math.trunc(number(field(fields, '案件経験数'))));
    const weeklyAvailability =
      text(field(fields, '週稼働可能時間')) || text(field(fields, '週稼働時間'));

    return {
      id: `t-${studentNumber}`,
      displayName: `No.${studentNumber}`,
      role: /リード/i.test(text(field(fields, '学生区分'))) ? 'lead' : 'associate',
      universityCategory: studyCategory(field(fields, '大学'), field(fields, '学部・研究科')),
      grade: Math.max(1, Math.min(9, Math.trunc(number(field(fields, '学年')) || 1))),
      weeklyAvailability: weeklyAvailability || null,
      skills,
      primarySkills: skills.slice(0, 3),
      serviceAreas,
      primaryAreas: serviceAreas.slice(0, 2),
      recordSummary: experienceCount > 0 ? `案件経験 ${experienceCount}件` : '実務参加に向けて準備中',
      certifications: [],
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.id.localeCompare(b.id, 'ja'));

await mkdir('content/talent', { recursive: true });
await writeFile('content/talent/talents.generated.json', `${JSON.stringify(publicTalents, null, 2)}\n`, 'utf8');
console.log(`Wrote ${publicTalents.length} public talent profile(s).`);
