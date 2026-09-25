# SEO・CMS・実績表示の実装報告

2026-09-19。添付3資料から、既存実装を残しつつ基礎改善と編集基盤を採用。新規LPや記事の量産、分析ツール、URLの大幅変更は対象外としました。

## 変更ファイルと役割

| ファイル/範囲 | 変更 |
|---|---|
| content/site/seo.json、content/pages/home.json | SEOとトップコピーの編集データ |
| lib/seo.ts、lib/editorial-defaults.ts、lib/content.ts | 読込・安全な既定値・型・共通metadata |
| app/{page,services,works,talent,recruit,about,contact}、app/news/[slug] | ページ固有title/description、OG/Twitterとの整合、トップWebSite構造化データ |
| app/sitemap.ts | 正規URL末尾スラッシュ統一。ビルド時刻による架空の更新日を廃止 |
| components/home/Hero.tsx、app/globals.css | コピーの接続、控えめな事業説明 |
| content/services/*.json、components/services/PackageServiceDetail.tsx | SEO項目、メニュー効果2行・小見出しをデータ化 |
| app/editorial-round3.css | 実績の角丸・余白・文字調整、上下端のマスク透過 |
| public/admin/{index.html,admin.css,bootstrap.js} | 管理画面。未設定時の安全な待機画面 |
| scripts/{cms-config,prepare-cms,audit-content,audit}.mjs、scripts/test/ | CMS設定生成、型検査、HTML/SEO監査、テスト |
| cms-auth-worker/ | フォームから独立したOAuth認証・テスト・設定雛形 |
| package.json、package-lock.json、.env.example、.gitignore、render.yaml | 固定CMS依存、ビルド、公開URL変数、生成物除外、admin用CSP |
| README.md、docs/CMS_SETUP.md | 現在の公開状態と初回設定・運用手順 |

## SEOで実施したこと

- 検索意図に合わせ、企業調査・競合分析・市場調査・新規事業・AI業務効率化を、対応するページのtitle/descriptionに自然に反映。
- 主要7ページと事業詳細、ニュース詳細のmetadataを共通生成。会社名の二重付与を防止。
- トップのWebSiteと既存Organizationを共存。canonical/OG URLはコード側で管理。
- 個人人材ページ、旧実績詳細、未確定原稿ページ、フォーム完了画面のnoindex方針を維持。adminもnoindex。
- sitemapのlastmodは有効なコンテンツ日付だけ。毎回のビルド日時を更新日として出さない。
- コンテンツ不正、canonical/OG不整合、sitemapへのnoindex混入、機密語等をデプロイ前に検出。
- 電話番号070-4360-2752、Lists連携、既存フォーム、安全性設定、旧Wixの移転案内を変更していない。

検索順位やGoogleによる再取得時期は保証できません。旧Wixの削除リクエストと新サイトのクロールは別管理です。

## 実績パネル

縦周回・ホバー停止を維持し、上下端でパネルそのものが背景へ溶けるCSSマスクへ変更しました。白い重ね帯は使いません。中央のカードはくっきり保ち、角丸・細い境界・控えめな影と余白で整えています。キーボードフォーカス時・動きを減らす設定ではマスクを解除します。

## CMSの完了範囲と残作業

4コレクション（SEO、トップ、3事業、ニュース）と認証Workerコード・テストを実装。URL、法務、個人情報、secretsは編集項目から除外。詳細は [CMS_SETUP.md](CMS_SETUP.md)。

本番OAuthアプリ登録、Workerへのsecret設定/デプロイ、RenderのCMS_AUTH_BASE_URL設定、実ユーザーでの下書き→レビュー→公開の一往復は未実施です。これらが終わるまでCMSログインは有効にしません。

本番確認: mainの463e645をRenderが自動デプロイし、2026-09-19 15:41 JSTにLiveを確認。新SEOタイトル・実績の16px角丸と上下透過・sitemapの19 URLを確認。Blueprintによりadmin専用CSPも反映済みで、公開トップのCSPは従来の制限を維持しています。`/admin/`はHTTP 200かつnoindex/nofollow、status.jsonはconfigured:false。adminと個別人材ページはsitemapに含まれていません。

公開サイトの本番npm依存監査は0件ですが、Decapを含む依存全体には未解決の警告があります。初回有効化前の確認事項として手順書に記録しています。

## 検査

`build:deploy`（コンテンツ監査・Next静的書出し・HTML監査）、`typecheck`、`test:cms`、`test:worker`を実行。既存ニュースの仮原稿3件は警告として残し、無断で削除・書換えはしません。管理画面のGitHubログインボタンと実績の透過はローカルブラウザーで確認。OAuth実ログイン/実公開のE2Eテストは初回設定後です。

将来Insightsを加えるときは専用モデル・CMS collection・metadata/sitemap・CSP・監査の対象を追加します。いま存在しない実績やSEO記事を生成して公開することはしていません。

## 追加のSEO改善（2026-09-25）

大手コンサルティング会社・国内企業サイト（ベイカレント、Ridgelinez、ドリームインキュベータ、アビーム、NRI など）の head と構造化データを比較し、不足していた点を補った。

### 構造化データ（`lib/schema.ts` に集約）

| ページ | 出力する型 |
|---|---|
| 全ページ | `Organization`（`@id` 付き。正式名称・ロゴ・所在地・電話・メール・設立日・従業員数・専門領域） |
| トップ | `WebSite`（検索結果のサイト名の判定用） |
| 事業詳細3ページ | `Service`（メニューを `OfferCatalog` で列挙）＋ `FAQPage`（画面に出している質問だけ） |
| お知らせ詳細 | `NewsArticle`（公開日・カテゴリ・発行者） |
| 下層ページ | `BreadcrumbList`（リンク先は canonical と同じ末尾スラッシュ付き） |

- 各ノードは `@id` で `Organization` を参照するので、ページをまたいで同じ事業者として扱われる。
- 価格は要件定義書 6.3.1 に従い構造化データに入れない。
- パッケージ型支援で画面から外している価格の質問は、`FAQPage` にも出さない（`getDisplayedFaq`）。
- schema.org の公式バリデーターで、トップ・事業詳細3件・お知らせ・会社情報のエラーと警告が0件であることを確認済み。

### タイトルと説明文

- タイトルの末尾は原則「｜株式会社Neunon Consulting」。付けると全角30字を超えるページだけ「｜Neunon Consulting」に自動で短縮する（`pageTitle`）。ページ名側の検索語が検索結果で切れないようにするため。
- 事業詳細の `seoTitle` を30字前後に収まるよう調整した（CMS から編集できる）。
- 説明文が全角50字未満だったページ（企業情報・会社情報・お問い合わせ・人材パネル・エントリー・選考フロー・お知らせ一覧・利用規約）を、ページの内容に沿って書き直した。
- CMS 管理外のページも `createPageMetadata` に統一した。以前は会社情報などで `og:url` がトップの URL になっており、SNS で共有するとトップページのカードが出ていた。

### 表示速度

- ヘッダー・フッターのロゴを 1774px・169KB から 378px・10KB に縮小（表示は最大 126px）。全ページで preload されており、ヒーロー画像（LCP 要素）と帯域を取り合っていた。
- 使っていない画像 `public/brand-logo.png`（725KB、リポジトリ直下の `neunon-logo.png` と同一）を削除し、ヒーロー写真の元データ `home-hero-city.png`（2.3MB）を `assets/` へ移した。どちらも誰でもダウンロードできる状態だった。
- `render.yaml` に WebP の Cache-Control を追加（PNG と同じ扱い）。

### AI 検索向け

- `/llms.txt` を追加。会社概要と主要ページの一覧を、content/ とサイト定数から自動生成する。index 対象のページだけを載せる。

### 監査（`scripts/audit.mjs`）の追加項目

エラー（デプロイを止める）:
- `og:url` が canonical と一致しない
- `Organization` がない / 事業詳細に `Service` がない / よくある質問があるのに `FAQPage` がない / お知らせ詳細に `NewsArticle` がない
- パンくずの URL が canonical 形式（同一オリジン・末尾スラッシュ）でない

確認推奨（公開は止めない。CMS で文言を編集したときに気付けるように）:
- title が全角32字を超える
- description が全角50字未満、または130字を超える

### 未対応・要判断

- お知らせ3件は仮原稿のまま index 対象（原稿の確定待ち）。
- 実績詳細ページはすべて noindex（守秘義務による匿名化の方針）。業種別の事例ページは検索流入の入口になりやすいため、公開できる範囲が決まれば個別ページ化を検討する。
- `/services` のように末尾スラッシュなしの URL や `/index.html`・`/services/index.html` も 200 を返す（canonical で正規化済みのため実害は小さい）。Render のリダイレクト規則は「そのパスにファイルが存在する場合は適用されない」仕様のため Render 側では直せない。Cloudflare のリダイレクトルール（末尾スラッシュ付与・`index.html` 除去を 301）で対応できる。
- アクセス解析は未導入（導入方針は保留中）。
