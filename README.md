# Neunon Consulting コーポレートサイト刷新

株式会社Neunon Consulting の新コーポレートサイト制作プロジェクト。既存の Wix サイトを廃止し、事業内容の転換（コンサルティング単体 → 学生ネットワークを基盤とした実務支援）を反映した新サイトを構築する。

## 資料

| ファイル | 内容 |
|---|---|
| `neunon-site-requirements.md` | 要件定義書。実装はこの内容に従う |
| `neunon-toppage-design.html` | トップページのデザイン案 v2。**デザインの基準はこちら** |
| `neunon-logo.png` | 会社ロゴ（ブランド資産）。`public/` にも配置済み |

## 実装状況

要件定義書 13. の推奨順序に対する進捗。

- [x] 1. プロジェクト初期化、デザイントークン定義
- [x] 2. 共通レイアウト（ヘッダー／フッター／目次コンポーネント）
- [x] 3. トップページ（発注者レビュー済み）
- [x] 4. 会社概要・事業詳細
- [x] 5. 実績・人材パネル
- [x] 6. 採用サイト・求人票
- [ ] 7. フォーム
- [ ] 8. SEO・アクセシビリティ・パフォーマンス調整
- [ ] 9. デプロイ

## セットアップ

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # out/ に静的書き出し
npm run typecheck
```

環境変数は `.env.example` をコピーして `.env.local` を作る。`.env` はコミットしない。

## 技術構成

要件定義書 10.1 の推奨構成に従う。

- Next.js 16（App Router）+ TypeScript
- Tailwind CSS v4（`@theme` でブランドトークンを定義）
- `output: 'export'` による静的書き出し
- コンテンツは `content/` 配下の JSON

## ディレクトリ

```
app/
  layout.tsx          ルートレイアウト。metadata と Organization 構造化データ
  page.tsx            トップページ（セクションの並びは要件定義書 6.1）
  globals.css         ブランドトークン・共通スタイル
  home.css            トップページ専用スタイル
  pages.css           下層ページ専用スタイル
  sitemap.ts          sitemap.xml 自動生成
  robots.ts           robots.txt 自動生成
  about/              /about, /about/message, /about/company
  services/           /services と /services/[id]（generateStaticParams で静的生成）
  works/              /works と /works/[slug]
  talent/             /talent と /talent/[id]
  recruit/            /recruit, /recruit/jobs, /recruit/jobs/[id], /recruit/flow, /recruit/voice
components/
  layout/             Header / Footer / Logo / ScrollReveal
  toc/                目次コンポーネント（要件定義書 5.3）
  shared/             PageHero / ContactCta / StructureDiagram / PriceFlow
  home/               トップページの各セクション
  about/              CompanyTable / History
  works/              WorksGrid（業種フィルタ）
  talent/             TalentPanel（4条件フィルタ）
content/
  services/           事業データ。ファイルを増やすと /services が自動で増える（要件定義書 15.）
  works/              支援実績。事業詳細の「この事業での実績」で services タグにより抽出
  talent/             人材パネル。public / private を分けて保持（要件定義書 8.1）
  jobs/               求人票（要件定義書 8.2 のスキーマ）
  news/               お知らせ。現在はダミー記事
lib/
  site.ts             会社情報・ナビ定義
  content.ts          content/ の読み込み（事業・実績・求人票・お知らせ）
  recruit.ts          採用サイトの共通コピーと選考フロー
  talent.ts           人材パネルの型とラベル（クライアントからも読み込む）
  talent.server.ts    talents.json の読み込み。private の除去はここだけで行う
```

### 採用サイトで守ること

要件定義書 6.6 に次の指示がある。

> 社内の事業拡大構想には学歴に関する内部基準の記述がありましたが、ポスター案では
> 「学部・学科不問／スキルも成績も問わない」という公開スタンスが既に採られています。
> サイトもこのスタンスに統一してください。**学歴要件をサイトに明示してはいけません。**

`lib/recruit.ts` の冒頭にも同じ注意を書いてある。募集要項を編集するときは必ず確認すること。

### 求人票の契約形態・報酬が未確定の間

`content/jobs/*.json` の `contractType` と `compensation` が空文字の間は、
画面上「準備中」と表示し、JobPosting 構造化データの `employmentType` /
`baseSalary` プロパティ自体を出力しない。「準備中」のような文字列を
構造化データに入れると不正な求人情報として配信されるため。
値を埋めれば画面と構造化データの両方に自動で反映される。

### 人材パネルの個人情報の扱い

要件定義書 6.5 / 8.1 の「`private` はビルド時に静的出力へ含めないこと」に対応するため、
`content/talent/talents.json` を読む場所を `lib/talent.server.ts` だけに限定している。
読み込んだ直後に `public` のみを取り出し、`private` はこのモジュールの外へ出さない。
呼び出し側は `PublicTalent` 型しか受け取れないので、型の上でも混入を防げる。
あわせて `consentPublish` が false の登録者は一覧にもURLにも現れない。

ビルド後は次のコマンドで出力を監査できる（いずれも 0 件であること）。

```bash
grep -rl "consentPublish" out/ | wc -l
```

`lib/talent.ts` はクライアントコンポーネントからも読み込まれるため、
`node:fs` などサーバー専用の API を持ち込まないこと。

### 事業を追加するとき

要件定義書 15. の要請により、事業一覧はハードコードしていない。
`content/services/` に JSON を1枚追加すれば、トップページの事業セクションと
`/services` の両方に反映される。

## 発注者への確認事項

| # | 論点 | 現状の実装 |
|---|---|---|
| 1 | アクセント色 | 要件定義書 9.1 は `#2F73FF`（変更不可と明記）、デザイン案 v2 はマットネイビー `#26385C`。**デザイン案 v2 を採用**している |
| 2 | 書体 | 要件定義書 9.3 は「見出し Noto Serif JP / 本文 Noto Sans JP」、デザイン案 v2 は Apple 系システムフォント（セリフはロゴのみ）。**デザイン案 v2 を採用**している |
| 3 | スクロール演出 | 要件定義書 9.2 は「スクロールのたびのフェードイン」を禁止、デザイン案 v2 は実装している。**デザイン案 v2 を採用**。`NEXT_PUBLIC_SCROLL_REVEAL=off` で無効化可能 |
| 4 | 導入の流れの日数 | デザイン案 v2 に該当セクションがないため新規作成。各ステップの所要日数は暫定値 |
| 5 | 実績件数 | パッケージ型支援「数百件」、AIプロダクト「5件」はデザイン案 v2 の値をそのまま使用（要件定義書 14. で未解決） |
| 6 | お知らせ | 初期記事が未確定のためダミー3件。`content/news/` の JSON を差し替える |
| 7 | 代表メッセージ | 原稿が未確定。実在の代表者名義の文章は創作していない。`/about/message` は準備中の表示とし、`noindex` にしている。原稿反映時に noindex を外すこと |
| 8 | 沿革 | 載せる出来事が未確定。確認済みの設立日のみ掲載。`components/about/History.tsx` の entries に追記する |
| 9 | 事業詳細のFAQ・進め方・想定期間 | 要件定義書に記載がないため実装側で作成した暫定内容。`content/services/*.json` の `faq` / `steps` / `engagement` を確認いただきたい |
| 10 | 実績の事業への割り当て | `content/works/*.json` の `services` タグは実装側の判断。事業詳細ページに出す実績の対応付けを確認いただきたい |
| 11 | 実績の「背景」「得られた示唆」 | 要件定義書 6.4 の3段構成に必要だが原文がないため、記載済みのアプローチから実装側で起草した。事実確認をお願いしたい |
| 12 | 人材パネルのデータ | `content/talent/talents.json` は全件ダミー。実データへの差し替え前に、本人の掲載同意（6.5）の取得が必要 |
| 13 | 稼働状況の区分 | 発注者確認済み。`availabilityStatus`（受付中／調整中／満稼働）をそのまま採用 |
| 14 | 実績の記載粒度 | 発注者提供の原文をそのまま反映しているが、要件定義書 12.1（案件の具体的な数値は抽象化）との関係で、公開前に次の3点の判断が必要 — 物流ケースの「青果物流」（6.4 の元表では業種を「物流」とのみ記載）、「密度を倍にすると応募が約2.5倍」、「4段階から5段階評価へ改良された」 |
| 15 | 求人票の契約形態・報酬額 | 未確定。画面は「準備中」、構造化データは該当プロパティを出力しない。顧問弁護士・社労士への確認後に `content/jobs/*.json` を埋める |
| 16 | 募集職種の内容 | 3職種（リサーチ・分析アソシエイト／案件ディレクション／事業開発メンバー）は組織体制と事業拡大構想から実装側で起草した。職種構成と業務内容を確認いただきたい |
| 17 | 選考フローの詳細 | 4段階の名称は要件定義書 8.2 のとおり。各段階の所要時間・期間は暫定値 |
| 18 | 求人の掲載日 | JobPosting の必須項目のため `datePosted` を追加し、暫定で 2026-09-01 としている。公開時に実際の掲載日へ更新すること |
| 19 | メンバーインタビュー | 実施可否が未確定。12.1 により社内メンバーの個人名は本人同意なしに掲載できないため、`/recruit/voice` は準備中の表示とし noindex にしている |

その他の未確定事項は `neunon-site-requirements.md` の「14. 未確定事項一覧」を参照。

## 注意事項

このリポジトリには、社内の事業計画書から抽出した情報を含むが、以下は意図的に除外している。

- 実際の取引先名・案件の具体的数値
- フィー・原価・利益率
- 学生の実名・大学名
- 社内メンバーの個人名（代表以外）

詳細は `neunon-site-requirements.md` の「12. 機密・個人情報の取り扱い」を参照。
