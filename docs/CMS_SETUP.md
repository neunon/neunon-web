# CMS 初回設定・運用

2026-09-19。実装済みと本番設定済みは異なります。OAuth App、認証 Worker、Render の環境変数・ヘッダー設定、実ログイン・下書き公開テストは初回設定が必要です。

## A. 構成と編集範囲

`/admin/` → Decap CMS 3.16.2（固定・同一サイトから配信）→ 専用 OAuth Worker → GitHub `neunon/neunon-web` → main → Render 再ビルド。

| 編集対象 | 保存先 | 補足 |
|---|---|---|
| 主要7ページのSEO title/description | content/site/seo.json | URL・canonicalは編集不可 |
| トップHeroコピー・短い事業説明・CTA文言 | content/pages/home.json | リンク先・レイアウトはコード管理 |
| 3事業の説明・メニュー・FAQ・参考価格 | content/services/*.json | ID/順序/価格公開フラグは固定 |
| ニュース | content/news/*.json | 本文は段落ごとのプレーンテキスト。削除UIなし |

学生マスタ・人材の個人情報、採用情報、電話番号、会社基本情報、Privacy、Terms、フォーム、secrets、schema、robots/noindexはCMSに出しません。CMSの制限はGitHub自体の権限を制限するものではありません。

パッケージの「想定顧客」「契約形態」は保管用で現行画面には出ません。「5つの変化」は引き続きコード管理です。参考価格の先頭6件がトップ・事業一覧に表示され、パッケージ詳細の価格欄は保留したままです。価格・納期に関するFAQは現行ルールにより詳細ページで除外されます。

## B. GitHub OAuth App（管理者の初回操作）

1. GitHub の Settings → Developer settings → OAuth Apps → New OAuth App。
2. Application name: `Neunon CMS`。
3. Homepage URL: `https://neun-on.com`。
4. Authorization callback URL: `https://neunon-cms-auth.keisakamoto.workers.dev/callback`。Workerの実URLが異なる場合は、下記 AUTH_ORIGIN とともに同じURLへ修正。
5. Client IDとClient Secretを安全に保管。チャット・Git・Render・publicファイルにはSecretを置かない。

このアプリは既存フォーム用Worker、Microsoft Lists用アプリとは別です。組織のOAuth承認が必要なら管理者が許可してください。GitHub backendは対象repoのpush権限がある編集者のみ利用できます。2FAを必須にし、編集者を限定してください。

## C. 独立認証Workerの設定・デプロイ

`cms-auth-worker/wrangler.toml`の AUTH_ORIGIN を実際のWorker URLに一致させます。既存 `worker/wrangler.toml` は変更しません。

PowerShellでrepo直下から実行（シークレットは対話入力）。Cloudflare側の認証が必要です。

```powershell
npx.cmd wrangler secret put GITHUB_CLIENT_ID --config cms-auth-worker/wrangler.toml
npx.cmd wrangler secret put GITHUB_CLIENT_SECRET --config cms-auth-worker/wrangler.toml
npx.cmd wrangler deploy --config cms-auth-worker/wrangler.toml
```

公開repoの場合のみ `GITHUB_REPO_PRIVATE = "false"` とし `public_repo` scopeを使えます。非公開repoは `repo` scopeが必要です。OAuth Appのscopeは単一repo限定ではないため、ログインユーザーが持つ他repoへの権限にも注意してください。専用の最小権限編集者アカウントを推奨します。

Workerはstate・PKCE・10分有効cookie・正確なpostMessage送信先/送信元・対象repoのpush権限を検査します。ログにトークン等を出しません。認証画面はno-store/noindex。localhostへのトークン返却は意図的に許可しません。

## D. Render の設定

1. 環境変数 `CMS_AUTH_BASE_URL` に公開済みWorkerのオリジンのみ設定。例: `https://neunon-cms-auth.keisakamoto.workers.dev`。末尾 `/auth` は不要。Secretは設定しません。
2. ビルドは `npm run build:deploy`、公開先は `out`。
3. `render.yaml` のCSP設定を実環境へ反映してください。Blueprint非管理サービスではGit pushだけではヘッダー設定は変わりません。
4. 既存の `/*` Content-Security-Policy と新しい `/admin/*` CSPを重ねないでください。Renderは一致したヘッダーを結合するため、既存の公開用CSPがCMS通信を遮断します。公開HTMLルートとadminを、ファイルに記載したパターンどおり分離します。他の全体セキュリティヘッダーは維持します。
5. 再ビルド後、公開ページのCSPが従来と同じ制限であること、adminのみ別ポリシーであることを実レスポンスで確認。

Decap内のAJV設定検証が `new Function` を使うことをブラウザーで確認したため、`unsafe-eval` は **adminのみ** に限定しています。公開ページには追加していません。adminのインラインJSは許可せず、GitHub通信先も限定。新しい公開ルートを増やすときはCSPパターンも追加してください。

## E. 編集・公開フロー

1. `https://neun-on.com/admin/` → GitHubでログイン。
2. 一箇所を小さく編集して下書き保存。GitHub側にCMS用ブランチ/PRができることを確認。
3. レビューし、承認後に公開。mainへの反映・Renderのビルド成功・本番表示を確認。
4. 初回はテスト用ニュースなどを公開せず、既存の一文の小さな変更→公開→復元で一往復確認してください。

editorial_workflowはレビュー機能ですが、独立したレビュアーを技術的に強制するものではありません。必要ならGitHub branch protectionを別途設計してください（既存の学生自動同期と競合しないことも確認）。

既存ニュース3件の `placeholder: true` は残っています。従来どおり表示されますが、正式原稿の確認が必要です。既存記事のslugを変更するとURLが変わるので、運用中の記事では変更しないでください。

## F. 検査と依存関係

```powershell
npm.cmd run audit:content
npm.cmd run test:cms
npm.cmd run test:worker
npm.cmd run build:deploy
npm.cmd run typecheck
```

CMS未設定では「認証の初期設定待ち」を表示しログインを開始しません。生成される `public/admin/config.yml`・status・vendorはGit対象外で毎ビルド生成。設定スクリプトはシェル/Renderの環境変数を読みます（`.env.local`の自動読込ではありません）。ローカルのNext devで確認するURLは `/admin/index.html` です。

2026-09-19時点のnpm auditでは公開サイトの本番依存関係は0件。Decapを含む開発依存全体には30件（high 7、moderate 23）の警告があり、未解決です。devDependencyでもCMS配布済みブラウザーバンドルは監査対象です。Markdown/HTMLリッチエディタは今回使いませんが、安全性を保証する根拠にはなりません。初回有効化前に最新アドバイザリと上流修正版を再確認し、リスク受容の判断が必要です。安易な `audit fix --force` は行っていません。

## G. 停止・復旧

- 緊急停止: Renderから `CMS_AUTH_BASE_URL` を外し再ビルド。既に発行済みのGitHubトークンはこれだけでは失効しないため、GitHub Authorized OAuth Appsから必要な認可を取り消す。
- 内容を戻す: 対象CMSコミットをGitHub上でrevertして再ビルド。履歴を消すforce pushはしない。
- 認証漏洩時: OAuth SecretをローテーションしWorker secretを更新。認可を失効しアクセス履歴を確認。
- 本文JSON不正時は監査がビルドを失敗させる。既存の正常デプロイを維持し、JSONを修正して再実行。

将来Insightsを追加する場合は、専用JSON schema・loader・collection・slug監査・metadata/sitemap・CSPルート・プレビューを一緒に追加します。今回はLP/記事の量産、analytics、リッチテキスト機能は追加していません。

参考: [Decap GitHub backend](https://decapcms.org/docs/github-backend/)、[OAuth proxy](https://decapcms.org/docs/backends-overview/#using-github-with-an-oauth-proxy)、[GitHub OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)、[Render headers](https://render.com/docs/static-site-headers)。
