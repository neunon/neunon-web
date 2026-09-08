import fs from 'node:fs';
import path from 'node:path';
import type { PublicTalent } from './talent';

/**
 * 人材パネルのデータ層（要件定義書 6.5 ★設計注意 / 8.1）
 *
 * ------------------------------------------------------------------
 * このファイルが唯一の出入口である理由
 * ------------------------------------------------------------------
 * 要件定義書 8.1 に「**重要：`private` はビルド時に静的出力へ含めないこと。**」
 * とある。静的書き出しでは、ページやクライアントコンポーネントに渡した値が
 * そのまま HTML と RSC ペイロードに書き出されるため、private を持ったまま
 * 引き回すと出力に混入する。
 *
 * そこで talents.json を読む場所をこのファイルだけに限定し、読み込んだ直後に
 * public のみを取り出して返す。private はこのモジュールの外へ出ない。
 * 呼び出し側は PublicTalent 型しか受け取れないので、型の上でも混入を防げる。
 *
 * あわせて 6.5 の「学生本人の同意」に対応し、consentPublish が true の
 * ものだけを返す。同意のない登録者はページ自体が生成されない。
 *
 * サーバー専用（node:fs を使う）。クライアントコンポーネントからは
 * lib/talent.ts の型とラベルだけを読み込むこと。
 * ------------------------------------------------------------------
 */

/** JSON の生の形。private を含むため、この型は export しない */
type TalentRecord = {
  id: string;
  public: Omit<PublicTalent, 'id'> & { consentPublish: boolean };
  private?: Record<string, unknown>;
};

const talentsPath = path.join(process.cwd(), 'content', 'talent', 'talents.json');

/**
 * 掲載同意済みの学生の、公開項目だけを返す。
 * private フィールドはここで破棄され、呼び出し側には決して渡らない。
 */
export function getPublicTalents(): PublicTalent[] {
  if (!fs.existsSync(talentsPath)) return [];

  const records = JSON.parse(fs.readFileSync(talentsPath, 'utf-8')) as TalentRecord[];

  return records
    .filter((record) => record.public?.consentPublish === true)
    .map((record) => {
      // consentPublish 自体も公開する必要がないので、ここで落とす
      const { consentPublish: _consentPublish, ...rest } = record.public;
      return { id: record.id, ...rest } satisfies PublicTalent;
    });
}

export function getPublicTalent(id: string): PublicTalent | undefined {
  return getPublicTalents().find((talent) => talent.id === id);
}
