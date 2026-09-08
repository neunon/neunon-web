import fs from 'node:fs';
import path from 'node:path';

/**
 * コンテンツ読み込み層。
 *
 * 要件定義書 15. の実装上の要請:
 *   「/services は3事業固定でハードコードせず、/content/services/ の
 *     ファイル数で自動生成すること」
 * このため事業一覧は必ずこの関数を経由して取得する。
 * 4つ目の事業を追加する場合は content/services/ に JSON を1枚置くだけでよい。
 */

const contentDir = path.join(process.cwd(), 'content');

export type ServiceMenuItem = {
  name: string;
  /** メニューの内容説明。コンサルティングの表には無いため任意 */
  body?: string;
  target?: string;
  issue?: string;
  /** AIプロダクトが元にしているパッケージ型支援のメニュー名 */
  base?: string;
};

export type ServiceStep = { no: string; title: string; body: string };
export type PriceRow = { label: string; price: string };
export type FaqItem = { q: string; a: string };

export type Service = {
  id: string;
  order: number;
  number: string;
  title: string;
  summary: string;
  highlights: string[];
  lead: string;
  useCases: string[];
  menu: ServiceMenuItem[];
  steps: ServiceStep[];
  engagement: { label: string; value: string }[];
  /** 要件定義書 6.3.1: 掲載するのはパッケージ型支援のみ */
  pricing: PriceRow[];
  showPricing: boolean;
  pricingNote: string;
  faq: FaqItem[];
};

/**
 * 支援実績（要件定義書 6.4）。
 * 12.1 により、取引先の実名と案件の具体的な数値は保持しない。
 * 詳細ページは background/challenge → approach → insight の3段構成で見せる。
 */
export type Work = {
  slug: string;
  order: number;
  industry: string;
  title: string;
  background: string;
  challenge: string;
  approach: string;
  insight: string;
  /** この実績が関係する事業の id。事業詳細ページの実績抽出に使う */
  services: string[];
};

export type NewsItem = {
  slug: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  /** 発注者からの原稿待ちのダミー記事（要件定義書 14. 未解決） */
  placeholder?: boolean;
};

function readJsonDir<T>(dir: string): T[] {
  const target = path.join(contentDir, dir);
  if (!fs.existsSync(target)) return [];
  return fs
    .readdirSync(target)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(target, file), 'utf-8')) as T);
}

export function getServices(): Service[] {
  return readJsonDir<Service>('services').sort((a, b) => a.order - b.order);
}

export function getService(id: string): Service | undefined {
  return getServices().find((service) => service.id === id);
}

export function getWorks(): Work[] {
  return readJsonDir<Work>('works').sort((a, b) => a.order - b.order);
}

/** 事業詳細ページ「この事業での実績」（要件定義書 6.3 の6番） */
export function getWorksByService(serviceId: string): Work[] {
  return getWorks().filter((work) => work.services.includes(serviceId));
}

export function getNews(): NewsItem[] {
  return readJsonDir<NewsItem>('news').sort((a, b) => b.date.localeCompare(a.date));
}

/** トップページのお知らせセクション用（最新3件・要件定義書 6.1 セクション8） */
export function getLatestNews(count = 3): NewsItem[] {
  return getNews().slice(0, count);
}

/* ============================================================
   実績（要件定義書 6.4）
   ============================================================ */

export function getWork(slug: string): Work | undefined {
  return getWorks().find((work) => work.slug === slug);
}

/** 一覧のフィルタ用。業種は重複を除いて出現順に返す */
export function getWorkIndustries(): string[] {
  return [...new Set(getWorks().map((work) => work.industry))];
}

/* ============================================================
   求人票（要件定義書 6.7 / 8.2）
   ============================================================ */

export type Job = {
  id: string;
  order: number;
  title: string;
  category: string;
  lead: string;
  description: string;
  tasks: string[];
  /** 【要確認】要件定義書 14. 未解決。空文字なら「準備中」と表示する */
  contractType: string;
  /** 【要確認】要件定義書 14. 未解決。空文字なら「準備中」と表示する */
  compensation: string;
  location: string;
  workload: string;
  period: string;
  requirements: string[];
  selectionFlow: string[];
  /** JobPosting の必須プロパティ。公開時に実際の掲載日へ更新すること */
  datePosted: string;
  /** 空文字なら随時募集として扱う */
  deadline: string;
  isOpen: boolean;
};

export function getJobs(): Job[] {
  return readJsonDir<Job>('jobs')
    .filter((job) => job.isOpen)
    .sort((a, b) => a.order - b.order);
}

export function getJob(id: string): Job | undefined {
  return getJobs().find((job) => job.id === id);
}
