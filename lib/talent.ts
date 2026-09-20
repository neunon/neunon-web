/**
 * 人材パネルの型とラベル（要件定義書 6.5 / 8.1）
 *
 * このファイルはクライアントコンポーネントからも読み込まれるため、
 * node:fs などサーバー専用の API を持ち込まないこと。
 * JSON の読み込みと private の除去は lib/talent.server.ts にある。
 */

export type TalentRole = 'lead' | 'associate';

/** 一般公開してよい項目のみ（フェーズ1・要件定義書 6.5） */
export type PublicTalent = {
  id: string;
  /** イニシャルまたは番号。実名は出さない */
  displayName: string;
  role: TalentRole;
  /** Microsoft Lists の大学名と、学部・研究科の先頭部分 */
  universityCategory: string;
  grade: number;
  /** Microsoft Lists の週稼働可能時間。範囲・注記を含む文字列も許容する */
  weeklyAvailability: string | number | null;
  skills: string[];
  primarySkills: string[];
  serviceAreas: string[];
  primaryAreas: string[];
  /** 匿名化済み。件数と種別のみ */
  recordSummary: string;
  /**
   * 要件定義書 15.:「talents.json に certifications: [] フィールドを
   * 予約しておくこと」。認定制度が始まったらここにバッジが入る。
   */
  certifications: string[];
};

export type TalentFacets = {
  skills: string[];
  serviceAreas: string[];
};

export const roleLabels: Record<TalentRole, string> = {
  lead: 'リード学生',
  associate: 'アソシエイト学生',
};

/**
 * 週稼働時間は Microsoft Lists の入力表現を尊重する。
 * 「10」「10-15」「10〜20時間」「週10時間程度」のいずれも表示できる。
 */
export function formatWeeklyAvailability(
  value: PublicTalent['weeklyAvailability'],
  includeWeek = true,
): string {
  const text = value === null || value === undefined ? '' : String(value).trim();
  if (!text) return '個別相談';
  if (/[週時]|応相談|相談/.test(text)) return text;
  return `${includeWeek ? '週' : ''}${text}時間`;
}

export function getTalentFacets(talents: PublicTalent[]): TalentFacets {
  const collect = (pick: (talent: PublicTalent) => string[]) =>
    [...new Set(talents.flatMap(pick))].sort((a, b) => a.localeCompare(b, 'ja'));

  return {
    skills: collect((talent) => talent.skills),
    serviceAreas: collect((talent) => talent.serviceAreas),
  };
}
