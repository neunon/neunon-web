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
  /** 「国立大 / 理工系」程度。大学名は出さない */
  universityCategory: string;
  grade: number;
  skills: string[];
  availableWork: string[];
  /** 匿名化済み。件数と種別のみ */
  recordSummary: string;
  availability: string;
  /** フィルタ用の稼働状況 */
  availabilityStatus: string;
  /**
   * 要件定義書 15.:「talents.json に certifications: [] フィールドを
   * 予約しておくこと」。認定制度が始まったらここにバッジが入る。
   */
  certifications: string[];
};

export type TalentFacets = {
  roles: TalentRole[];
  skills: string[];
  availableWork: string[];
  availabilityStatus: string[];
};

export const roleLabels: Record<TalentRole, string> = {
  lead: 'リード学生',
  associate: 'アソシエイト学生',
};

/** フィルタの選択肢（要件定義書 6.5: 区分／スキルタグ／対応可能業務／稼働状況） */
export function getTalentFacets(talents: PublicTalent[]): TalentFacets {
  const collect = (pick: (talent: PublicTalent) => string[]) =>
    [...new Set(talents.flatMap(pick))].sort((a, b) => a.localeCompare(b, 'ja'));

  return {
    roles: [...new Set(talents.map((talent) => talent.role))],
    skills: collect((talent) => talent.skills),
    availableWork: collect((talent) => talent.availableWork),
    availabilityStatus: [...new Set(talents.map((talent) => talent.availabilityStatus))],
  };
}
