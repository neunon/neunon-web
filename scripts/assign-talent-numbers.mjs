import { randomInt } from 'node:crypto';

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
  assigned += 1;
}

console.log(assigned > 0 ? `Assigned ${assigned} student number(s).` : 'All students already have a student number.');
