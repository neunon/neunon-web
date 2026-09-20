import fs from 'node:fs';
import path from 'node:path';
import type { PublicTalent, TalentRole } from './talent';

/**
 * 人材パネルのサーバー専用データ層。
 *
 * 本番では Microsoft Lists の「学生マスタ」をビルド時に読み、
 * 「サイト掲載可」が「可」の行だけを公開用の型へ変換する。
 * 実名・メールアドレス・単価などの非公開データは、このモジュールの外へ
 * 一切返さない。Graph の設定がないローカル環境では従来の JSON を使う。
 */

type TalentRecord = {
  id: string;
  public: Omit<PublicTalent, 'id'> & { consentPublish: boolean };
  private?: Record<string, unknown>;
};

type GraphConfig = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  siteId: string;
  listId: string;
};

type GraphColumn = { name?: string; displayName?: string };
type GraphListItem = { id?: string; fields?: Record<string, unknown> };
type GraphPage<T> = { value?: T[]; '@odata.nextLink'?: string };

const talentsPath = path.join(process.cwd(), 'content', 'talent', 'talents.json');
const generatedTalentsPath = path.join(process.cwd(), 'content', 'talent', 'talents.generated.json');
let publicTalentsPromise: Promise<PublicTalent[]> | undefined;

function getGraphConfig(): GraphConfig | undefined {
  const config = {
    tenantId: process.env.MS_GRAPH_TENANT_ID,
    clientId: process.env.MS_GRAPH_CLIENT_ID,
    clientSecret: process.env.MS_GRAPH_CLIENT_SECRET,
    siteId: process.env.MS_GRAPH_SITE_ID,
    listId: process.env.MS_GRAPH_TALENT_LIST_ID,
  };

  if (Object.values(config).every(Boolean)) return config as GraphConfig;
  if (Object.values(config).some(Boolean)) {
    throw new Error('Microsoft Lists の環境変数が一部だけ設定されています。5項目すべてを設定してください。');
  }
  return undefined;
}

async function getAccessToken(config: GraphConfig): Promise<string> {
  const response = await fetch(
    `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      }),
    },
  );

  if (!response.ok) throw new Error(`Microsoft Graph のトークン取得に失敗しました (${response.status})`);
  const payload = (await response.json()) as { access_token?: string };
  if (!payload.access_token) throw new Error('Microsoft Graph のアクセストークンが空です。');
  return payload.access_token;
}

async function graphGet<T>(url: string, accessToken: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(`Microsoft Graph の読取りに失敗しました (${response.status}: ${url})`);
  return (await response.json()) as T;
}

async function getAllPages<T>(initialUrl: string, accessToken: string): Promise<T[]> {
  const values: T[] = [];
  let nextUrl: string | undefined = initialUrl;

  while (nextUrl) {
    const page: GraphPage<T> = await graphGet<GraphPage<T>>(nextUrl, accessToken);
    values.push(...(page.value ?? []));
    nextUrl = page['@odata.nextLink'];
  }
  return values;
}

function toStrings(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[;,、\n]/) : [];
  return [
    ...new Set(
      raw
        .map((item) => String(item).trim())
        .filter((item) => item && item !== '0' && item !== '-' && item !== 'なし'),
    ),
  ];
}

function toText(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
}

function toNumber(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function publicStudyCategory(university: string, facultyOrGraduateSchool: string): string {
  const normalized = facultyOrGraduateSchool.replace(/\s+/g, '');
  const faculty = normalized.match(/^(.+?(?:学部|研究科))/)?.[1];
  return [university || '大学生', faculty].filter(Boolean).join(' / ');
}

function roleFrom(value: unknown): TalentRole {
  return /リード/i.test(toText(value)) ? 'lead' : 'associate';
}

function loadLocalTalents(): PublicTalent[] {
  if (!fs.existsSync(talentsPath)) return [];
  const records = JSON.parse(fs.readFileSync(talentsPath, 'utf-8')) as TalentRecord[];

  return records
    .filter((record) => record.public?.consentPublish === true)
    .map((record) => {
      const { consentPublish: _consentPublish, ...rest } = record.public;
      return { id: record.id, ...rest, weeklyAvailability: rest.weeklyAvailability ?? null } satisfies PublicTalent;
    });
}

function loadGeneratedTalents(): PublicTalent[] | undefined {
  if (!fs.existsSync(generatedTalentsPath)) return undefined;
  const talents = JSON.parse(fs.readFileSync(generatedTalentsPath, 'utf-8')) as PublicTalent[];
  return talents.map((talent) => ({
    ...talent,
    weeklyAvailability:
      talent.weeklyAvailability === null || talent.weeklyAvailability === undefined
        ? null
        : String(talent.weeklyAvailability).trim() || null,
  }));
}

async function loadGraphTalents(config: GraphConfig): Promise<PublicTalent[]> {
  const accessToken = await getAccessToken(config);
  const root = `https://graph.microsoft.com/v1.0/sites/${config.siteId}/lists/${config.listId}`;
  const [columns, items] = await Promise.all([
    getAllPages<GraphColumn>(`${root}/columns?$select=name,displayName`, accessToken),
    getAllPages<GraphListItem>(`${root}/items?$expand=fields`, accessToken),
  ]);
  const internalNames = new Map(
    columns
      .filter((column): column is Required<GraphColumn> => Boolean(column.name && column.displayName))
      .map((column) => [column.displayName, column.name]),
  );
  const field = (fields: Record<string, unknown>, displayName: string) =>
    fields[internalNames.get(displayName) ?? displayName];

  return items
    .filter((item) => item.fields && toText(field(item.fields, 'サイト掲載可')) === '可')
    .map((item): PublicTalent | undefined => {
      const fields = item.fields ?? {};
      const studentNumber = toText(field(fields, '学生No')) || toText(field(fields, '学生No.'));
      if (!/^\d{5}$/.test(studentNumber)) return undefined;

      const skills = toStrings(field(fields, 'スキル'));
      const serviceAreas = toStrings(field(fields, '対応領域'));
      const primarySkills = skills.slice(0, 3);
      const primaryAreas = serviceAreas.slice(0, 2);
      const experienceCount = Math.max(0, Math.trunc(toNumber(field(fields, '案件経験数'))));
      const weeklyAvailability =
        toText(field(fields, '週稼働可能時間')) || toText(field(fields, '週稼働時間'));

      return {
        id: `t-${studentNumber}`,
        displayName: `No.${studentNumber}`,
        role: roleFrom(field(fields, '学生区分')),
        universityCategory: publicStudyCategory(
          toText(field(fields, '大学')),
          toText(field(fields, '学部・研究科')),
        ),
        grade: Math.max(1, Math.min(9, Math.trunc(toNumber(field(fields, '学年')) || 1))),
        weeklyAvailability: weeklyAvailability || null,
        skills,
        primarySkills,
        serviceAreas,
        primaryAreas,
        recordSummary: experienceCount > 0 ? `案件経験 ${experienceCount}件` : '実務参加に向けて準備中',
        certifications: [],
      };
    })
    .filter((talent): talent is PublicTalent => Boolean(talent))
    .sort((a, b) => a.id.localeCompare(b.id, 'ja'));
}

/** 掲載許可済みの学生について、匿名化した公開項目だけを返す。 */
export function getPublicTalents(): Promise<PublicTalent[]> {
  publicTalentsPromise ??= (async () => {
    const generatedTalents = loadGeneratedTalents();
    if (generatedTalents) return generatedTalents;
    const config = getGraphConfig();
    return config ? loadGraphTalents(config) : loadLocalTalents();
  })();
  return publicTalentsPromise;
}

export async function getPublicTalent(id: string): Promise<PublicTalent | undefined> {
  return (await getPublicTalents()).find((talent) => talent.id === id);
}
