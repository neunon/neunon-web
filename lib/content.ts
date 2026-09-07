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

export type Service = {
  id: string;
  order: number;
  number: string;
  title: string;
  summary: string;
  highlights: string[];
  showPricing: boolean;
  pricingNote: string;
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

export function getNews(): NewsItem[] {
  return readJsonDir<NewsItem>('news').sort((a, b) => b.date.localeCompare(a.date));
}

/** トップページのお知らせセクション用（最新3件・要件定義書 6.1 セクション8） */
export function getLatestNews(count = 3): NewsItem[] {
  return getNews().slice(0, count);
}
