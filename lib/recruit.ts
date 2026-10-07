/**
 * 採用サイトの共通コンテンツ（要件定義書 6.6 / 6.7）
 *
 * コピーは社内ポスター案由来のものを「確定扱い」として使う。
 * 短文・断定・余白の多い書き方がこのサイトのトーン。
 *
 * ★重要（要件定義書 6.6）:
 *   社内資料には学歴に関する内部基準の記述があるが、ポスター案では
 *   「学部・学科不問／スキルも成績も問わない」という公開スタンスが
 *   採られている。サイトに学歴要件を明示してはいけない。
 */

import recruitPage from '@/content/pages/recruit.json';

export const recruitHero = recruitPage.hero;
export const recruitCareer = { title: recruitPage.careerTitle, intro: recruitPage.careerIntro };

export const gakuchika = recruitPage.experiences;

/** 募集要項の要旨（ポスター案の内容を踏襲） */
export const conditions = recruitPage.conditions;

/** 求める人物像（内部基準を学生向けの言葉に直したもの） */
export const idealCandidate = recruitPage.idealCandidate;

/** 選考フロー（要件定義書 8.2 の selectionFlow に対応） */
export const selectionSteps = recruitPage.selectionSteps;

/** 学生向けに見せる支援実績の業種（要件定義書 6.6） */
export const recruitIndustries = [
  '人材',
  '製造',
  '物流',
  '小売',
  'メディア',
  'インフラ',
  'AI',
];

/** 契約形態・報酬が未確定であることの共通文言（要件定義書 14. 未解決） */
export const termsPendingNote = recruitPage.termsPendingNote;
