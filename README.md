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
- [x] 7. フォーム
- [x] 8. SEO・アクセシビリティ・パフォーマンス調整
- [ ] 9. デプロイ ← **リポジトリ側の準備は完了。Render への接続は発注者の操作待ち**（[docs/DEPLOY.md](docs/DEPLOY.md)）

## セットアップ

```bash
npm install
npm run dev         # http://localhost:3000
npm run build       # out/ に静的書き出し
npm run typecheck
npm run audit:html  # ビルド出力の SEO・アクセシビリティ検査（build のあとに実行）
npm run images      # ロゴから OGP画像・ファビコンを再生成（通常は不要）
```

`npm run audit:html` は out/ の HTML を読んで、title/description の有無と重複、
canonical、h1 の数、見出しレベルの飛び、img の alt、リンクとボタンの名前、
フォーム項目のラベル、スキップリンクの位置、構造化データの JSON 妥当性、
機密に関わる禁止語の混入を検査する。**デプロイ前に必ず通すこと。**

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
  not-found.tsx       404 ページ
  icon.png            ファビコン（scripts/generate-images.mjs が生成）
  apple-icon.png      ホーム画面用アイコン（同上）
  about/              /about, /about/message, /about/company
  services/           /services と /services/[id]（generateStaticParams で静的生成）
  works/              /works と /works/[slug]
  talent/             /talent と /talent/[id]
  recruit/            /recruit, /recruit/jobs, /recruit/jobs/[id], /recruit/flow, /recruit/voice
  news/               /news と /news/[slug]
  contact/            /contact と /contact/thanks
  entry/              /entry と /entry/thanks
  privacy/, terms/    プライバシーポリシー・サイト利用規約
components/
  layout/             Header / Footer / Logo / ScrollReveal
  toc/                目次コンポーネント（要件定義書 5.3）
  shared/             PageHero / ContactCta / StructureDiagram / PriceFlow
  home/               トップページの各セクション
  about/              CompanyTable / History
  works/              WorksGrid（業種フィルタ）
  talent/             TalentPanel（4条件フィルタ）
  forms/              FormShell（入力・検証・確認画面・送信を共通化）
content/
  services/           事業データ。ファイルを増やすと /services が自動で増える（要件定義書 15.）
  works/              支援実績。事業詳細の「この事業での実績」で services タグにより抽出
  talent/             人材パネル。public / private を分けて保持（要件定義書 8.1）
  jobs/               求人票（要件定義書 8.2 のスキーマ）
  news/               お知らせ。現在はダミー記事
public/
  ogp.png             OGP画像（scripts/generate-images.mjs が生成）
  neunon-logo.png     構造化データ用に最適化したロゴ（同上）
render.yaml           Render Static Site の設定（ビルド・環境変数・ヘッダ）
docs/
  DEPLOY.md           デプロイ手順と、公開前チェックリスト
scripts/
  generate-images.mjs OGP画像・ファビコンの生成（ロゴ1枚から合成）
  audit.mjs           ビルド出力の静的検査
lib/
  site.ts             会社情報・ナビ定義
  content.ts          content/ の読み込み（事業・実績・求人票・お知らせ）
  recruit.ts          採用サイトの共通コピーと選考フロー
  forms.ts            フォームの項目定義・検証・送信先
  talent.ts           人材パネルの型とラベル（クライアントからも読み込む）
  talent.server.ts    talents.json の読み込み。private の除去はここだけで行う
```

### 採用サイトで守ること

要件定義書 6.6 に次の指示がある。

> 社内の事業拡大構想には学歴に関する内部基準の記述がありましたが、ポスター案では
> 「学部・学科不問／スキルも成績も問わない」という公開スタンスが既に採られています。
> サイトもこのスタンスに統一してください。**学歴要件をサイトに明示してはいけません。**

`lib/recruit.ts` の冒頭にも同じ注意を書いてある。募集要項を編集するときは必ず確認すること。

### フォームの送信先

静的書き出し（`output: 'export'`）のためサーバー側でメールを送る API Route を持てない。
送信は Formspree のエンドポイントをブラウザから直接叩く構成にしている。
ブラウザに値を渡す必要があるため、環境変数は `NEXT_PUBLIC_` 接頭辞つき
（要件定義書 11. の `CONTACT_FORM_ENDPOINT` に対応）。
企業用と学生用でフォームを分ける指示（6.8）に合わせ、エンドポイントも2つ用意する。

```
NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx
NEXT_PUBLIC_ENTRY_FORM_ENDPOINT=https://formspree.io/f/yyyyyyyy
```

未設定の間は送信ボタンが押せない状態になり、画面に案内が出る。
通知先メールアドレスは Formspree 側のフォーム設定で指定する。

スパム対策は honeypot（Formspree の `_gotcha`）と、
表示から送信までが極端に速い場合の拒否で対応している
（6.8 は「reCAPTCHA v3 もしくは honeypot」を許容）。

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

### 画像とフォント

サイトに `<img>` は1つもなく、どのページも LCP 要素はテキスト。
画像は OGP とアイコンだけで、いずれも受領したロゴ1枚から
`npm run images` で生成している（文字はレンダリングせず合成のみ。
実行環境のフォントに依存させないため）。

| ファイル | 用途 | サイズ |
|---|---|---|
| `neunon-logo.png`（リポジトリ直下） | 受領した元データ。ブランド資産として保管 | 725 KB |
| `public/neunon-logo.png` | 構造化データの logo | 11 KB |
| `public/ogp.png` | OGP 1200x630 | 22 KB |
| `app/icon.png` / `app/apple-icon.png` | ファビコン | 5 KB / 1 KB |

ロゴのセリフ体は `next/font` で自己ホストしている。Google Fonts を
`<link>` で読むとサードパーティへのリクエストがレンダリングを止めるため。
閲覧者のブラウザから Google へリクエストが飛ばなくなる利点もある。

実行時に取得されるフォントは、ロゴの文字に必要な2サブセット 21.6 KB のみ
（`unicode-range` により必要な分だけ取得される）。
ただしビルド出力には未使用のサブセットを含む 3.6 MB のフォントが残る。
配信量は増えないが出力は膨らむので、気になる場合はロゴの文字だけに
サブセット化したフォントを自前で持つ方法がある。

### 動きの方針

要件定義書 9.2 は「スクロールのたびに要素がフェードインしてくる演出」と
「意味のない 01 / 02 / 03 の連番装飾」「見出しの上のトラッキングを広げた英大文字ラベル」
を禁止している。実装の途中でこれらが入ってしまっていたため、撤去した。

- フェードインは **トップページと採用トップのヒーロー2箇所だけ**（`.nc-hero .rise` / `.nc-rhero .rise`）
- JS で class を足す方式はやめ、CSS アニメーション（`@keyframes nc-rise`）だけで完結
- 見出し上の連番＋英字ラベル（`01 THE PROBLEM` など）は全撤去
- `PageHero` の `eyebrow` は、業種・区分・日付など**情報を持つ場合だけ**渡す

CSS アニメーションにしたことで、JavaScript が動かない環境でも要素の
基準状態が可視のままになり、`prefers-reduced-motion` も
`animation: none` だけで成立する。特別なフォールバックは不要。

## デプロイ

Render の Static Site で配信する。手順とチェックリストは [docs/DEPLOY.md](docs/DEPLOY.md)。
設定は `render.yaml` に置いてあるので、Render では **New → Blueprint** から作成できる。

| 項目 | 値 |
|---|---|
| Service type | Static Site |
| Build command | `npm run build:deploy` |
| Publish directory | `out` |

`build:deploy` はビルド後に `scripts/audit.mjs` を実行する。
監査で指摘が出るとビルドが失敗し、壊れた状態が公開されない。

レスポンスヘッダ（セキュリティ・キャッシュ）は `render.yaml` の `headers` で定義している。
**Cloudflare Pages や Netlify で使う `public/_headers` 形式は Render では解釈されない。**
他のホスティングへ移す場合は書き直しが必要で、置き忘れてもエラーにならず
ヘッダが黙って付かなくなるので注意すること。

**公開前に、キーボードだけでサイト全体をたどってフォーカスリングの
見え方を人の目で確認すること。** 静的解析でわかるのは「CSS のルールが
出力に含まれているか」までで、実際に見えるかどうかは実機で人が触らないと
判断できない。確認項目は docs/DEPLOY.md の 5.2 にある。

## 発注者への確認事項

**解決済み** と書いていないものは、まだ判断または素材の提供が必要な項目。

| # | 論点 | 現状の実装 |
|---|---|---|
| 1 | アクセント色 | 要件定義書 9.1 は `#2F73FF`（変更不可と明記）、デザイン案 v2 はマットネイビー `#26385C`。**デザイン案 v2 を採用**している |
| 2 | 書体 | 要件定義書 9.3 は「見出し Noto Serif JP / 本文 Noto Sans JP」、デザイン案 v2 は Apple 系システムフォント（セリフはロゴのみ）。**デザイン案 v2 を採用**している |
| 3 | スクロール演出 | 要件定義書 9.2 は「スクロールのたびのフェードイン」を禁止、デザイン案 v2 は実装している。**解決済み。** 全セクション一律のフェードインは撤去し、トップと採用トップのヒーロー2箇所だけに絞った。JS ではなく CSS アニメーションで実装 |
| 4 | 導入の流れの日数 | デザイン案 v2 に該当セクションがないため新規作成。各ステップの所要日数は暫定値 |
| 5 | 実績件数 | パッケージ型支援「数百件」、AIプロダクト「5件」はデザイン案 v2 の値をそのまま使用（要件定義書 14. で未解決） |
| 6 | お知らせ | 初期記事が未確定のためダミー3件。`content/news/` の JSON を差し替える |
| 7 | 代表メッセージ | 原稿が未確定。実在の代表者名義の文章は創作していない。`/about/message` は準備中の表示とし、`noindex` にしている。原稿反映時に noindex を外すこと |
| 8 | 沿革 | 載せる出来事が未確定。確認済みの設立日のみ掲載。`components/about/History.tsx` の entries に追記する |
| 9 | 事業詳細のFAQ・進め方・想定期間 | 要件定義書に記載がないため実装側で作成した暫定内容。`content/services/*.json` の `faq` / `steps` / `engagement` を確認いただきたい |
| 10 | 実績の事業への割り当て | `content/works/*.json` の `services` タグは実装側の判断。事業詳細ページに出す実績の対応付けを確認いただきたい |
| 11 | 実績の「背景」「得られた示唆」 | 要件定義書 6.4 の3段構成に必要だが原文がないため、記載済みのアプローチから実装側で起草した。事実確認をお願いしたい |
| 12 | 人材パネルのデータ | `content/talent/talents.json` は全件ダミー。実データへの差し替え前に、本人の掲載同意（6.5）の取得が必要 |
| 13 | 稼働状況の区分 | **解決済み。** `availabilityStatus`（受付中／調整中／満稼働）を発注者確認のうえ採用 |
| 14 | 実績の記載粒度 | **解決済み。** 要件定義書 12.1（案件の具体的な数値は抽象化）に照らし、発注者判断で3箇所を修正済み — 「青果物流」→「食品領域の物流」、「約2.5倍」→傾向の記述、評価段階数の記述を削除 |
| 15 | 求人票の契約形態・報酬額 | 未確定。画面は「準備中」、構造化データは該当プロパティを出力しない。顧問弁護士・社労士への確認後に `content/jobs/*.json` を埋める |
| 16 | 募集職種の内容 | 3職種（リサーチ・分析アソシエイト／案件ディレクション／事業開発メンバー）は組織体制と事業拡大構想から実装側で起草した。職種構成と業務内容を確認いただきたい |
| 17 | 選考フローの詳細 | 4段階の名称は要件定義書 8.2 のとおり。各段階の所要時間・期間は暫定値 |
| 18 | 求人の掲載日 | JobPosting の必須項目のため `datePosted` を追加し、暫定で 2026-09-01 としている。公開時に実際の掲載日へ更新すること |
| 19 | メンバーインタビュー | 実施可否が未確定。12.1 により社内メンバーの個人名は本人同意なしに掲載できないため、`/recruit/voice` は準備中の表示とし noindex にしている |
| 20 | プライバシーポリシー | **公開前に必ずリーガルチェックを受けること。** 記載は 12.2 の必須項目を満たすよう実装側で起草した。本文中の【要確認】（保管期間、解析サービス名、個人情報の問い合わせ窓口アドレス）は会社として決める必要がある |
| 21 | サイト利用規約 | 同上。公開前にリーガルチェックが必要 |
| 22 | フォームの送信先 | Formspree のフォームを2つ作成し、エンドポイントを環境変数に設定する必要がある。通知先アドレスは Formspree 側で指定する（要件定義書 14. の「代表メールアドレスの新設」と合わせて決定） |
| 23 | お知らせの本文 | 一覧・詳細ページを作るにあたり本文が必要だったため、確認済みの事実の範囲で実装側が起草した。原稿受領後に差し替えること |
| 24 | CSP の強制 | 配信状態での検証ができていないため `Content-Security-Policy-Report-Only` にしてある。デプロイ後に違反0件を確認してから強制に切り替えること（docs/DEPLOY.md 5.1） |
| 25 | Render への接続 | アカウント操作とリポジトリのアクセス許可が必要なため、発注者ご自身の操作。GitHub 連携の認可は `shn51020-max/WEBSITE` のみに絞ることを推奨 |
| 26 | Render の 404 とディレクトリ配信 | 実配信でしか確定できないため未確認。初回デプロイ直後に `/about/` が表示されるか、存在しないURLで404ページが出るかを確認し、必要ならリライトルールを追加する（docs/DEPLOY.md 4章） |

その他の未確定事項は `neunon-site-requirements.md` の「14. 未確定事項一覧」を参照。

## 注意事項

このリポジトリには、社内の事業計画書から抽出した情報を含むが、以下は意図的に除外している。

- 実際の取引先名・案件の具体的数値
- フィー・原価・利益率
- 学生の実名・大学名
- 社内メンバーの個人名（代表以外）

詳細は `neunon-site-requirements.md` の「12. 機密・個人情報の取り扱い」を参照。
