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

本番OAuthアプリ登録、Workerへのsecret設定/デプロイ、Render環境変数とCSP反映、実ユーザーでの下書き→レビュー→公開の一往復は未実施です。これらが終わるまでCMSログインは有効にしません。

公開サイトの本番npm依存監査は0件ですが、Decapを含む依存全体には未解決の警告があります。初回有効化前の確認事項として手順書に記録しています。

## 検査

`build:deploy`（コンテンツ監査・Next静的書出し・HTML監査）、`typecheck`、`test:cms`、`test:worker`を実行。既存ニュースの仮原稿3件は警告として残し、無断で削除・書換えはしません。管理画面のGitHubログインボタンと実績の透過はローカルブラウザーで確認。OAuth実ログイン/実公開のE2Eテストは初回設定後です。

将来Insightsを加えるときは専用モデル・CMS collection・metadata/sitemap・CSP・監査の対象を追加します。いま存在しない実績やSEO記事を生成して公開することはしていません。
