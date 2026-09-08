# デプロイ手順（Cloudflare Pages）

要件定義書 13. のステップ9。静的書き出し（`output: 'export'`）した `out/` を
Cloudflare Pages で配信する。

このリポジトリ側の準備は完了している。以下は**発注者ご自身の操作**が必要な作業。
Cloudflare のアカウント作成と、GitHub リポジトリへのアクセス許可は、
アカウントの持ち主でないと行えないため。

---

## 1. Cloudflare Pages にリポジトリを接続する

1. Cloudflare にログインし、**Workers & Pages → Create → Pages → Connect to Git** を開く
2. GitHub 連携を承認する
   - 認可の対象は **`shn51020-max/WEBSITE` のみ**に絞ることを推奨（全リポジトリへの許可は不要）
   - private リポジトリでも問題なく連携できる
3. リポジトリ `shn51020-max/WEBSITE` を選択

## 2. ビルド設定

| 項目 | 値 |
|---|---|
| Framework preset | **None**（Next.js プリセットは選ばない） |
| Build command | `npm run build:deploy` |
| Build output directory | `out` |
| Root directory | （空欄のまま） |

> **Framework preset に Next.js を選ばないこと。**
> Pages の Next.js プリセットは SSR 前提の構成に切り替わる。
> 本サイトは純粋な静的書き出しなので None が正しい。

`build:deploy` は `next build` のあとに `scripts/audit.mjs` を実行する。
title の重複、見出しレベル、リンクやボタンの名前、フォームのラベル、
機密に関わる禁止語の混入などを検査し、問題があればビルドが失敗する。
壊れた状態が公開されるのを防ぐための関門なので、
Build command は `npm run build` ではなくこちらを指定すること。

Node のバージョンは `.node-version`（現在 24.14.0）で固定している。

## 3. 環境変数

Pages の **Settings → Environment variables** に設定する。
Production と Preview の両方に入れること。

| 変数 | 値 | 状態 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 公開URL（末尾スラッシュなし） | ドメイン確定後に本番URLへ変更 |
| `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` | `https://formspree.io/f/xxxxxxxx` | **未確定**。Formspree でフォーム作成後 |
| `NEXT_PUBLIC_ENTRY_FORM_ENDPOINT` | `https://formspree.io/f/yyyyyyyy` | **未確定**。企業用とは別に作る |

`NEXT_PUBLIC_SITE_URL` は sitemap.xml と構造化データの絶対URLに使われる。
未設定だと `https://neun-on.com` が既定値になるので、
ドメイン取得前は Pages の `*.pages.dev` のURLを入れておくこと。

環境変数を変更したら、**再デプロイしないと反映されない**（ビルド時に埋め込まれるため）。

### Formspree の設定（未着手）

1. Formspree でフォームを2つ作る（企業用・学生用）
2. それぞれの通知先メールアドレスを Formspree 側で指定する
   - 【要確認】要件定義書 14.「代表メールアドレスの新設」と合わせて決める
3. 発行されたエンドポイントを上記の環境変数に入れる

未設定の間、フォームは送信ボタンが押せない状態になり、
画面に「送信先が未設定のため送信できません」と表示される。

## 4. 独自ドメイン（`neun-on.com`）

【要確認】要件定義書 14. の未解決事項。取得状況が判明してから。

1. Pages の **Custom domains → Set up a domain** で `neun-on.com` を追加
2. DNS を Cloudflare に向ける（ネームサーバーを Cloudflare に変更するか、CNAME を設定）
3. 証明書は Cloudflare が自動発行する（HTTPS 必須の要件を満たす）
4. `www` の有無を決め、片方からもう片方へリダイレクトする
5. `NEXT_PUBLIC_SITE_URL` を本番URLに変更して再デプロイ
6. Google Search Console にサイトを登録し、`sitemap.xml` を送信する

ドメイン取得前でも `*.pages.dev` で公開・確認はできる。

---

## 5. デプロイ後の確認（ステップ9の完了条件）

以下がすべて完了して、はじめてステップ9を完了とする。

### 5.1 自動でできる確認

- [ ] Cloudflare Pages のビルドが成功している（`build:deploy` の監査を含む）
- [ ] 全ページが表示される（`/`, `/services/*`, `/works/*`, `/talent/*`, `/recruit/*`, `/about/*`, `/news/*`, `/contact`, `/entry`, `/privacy`, `/terms`）
- [ ] 存在しないURLで 404 ページが出る
- [ ] `https://<公開URL>/sitemap.xml` と `/robots.txt` が返る
- [ ] レスポンスヘッダに `X-Content-Type-Options` / `Referrer-Policy` / `X-Frame-Options` が付いている

#### CSP を強制に切り替える

`public/_headers` の CSP は、いま **`Content-Security-Policy-Report-Only`** にしてある。
配信した状態での検証ができていないため、いきなり強制するとサイトが
表示されなくなる可能性があるため。Report-Only なら違反はコンソールに出るだけで表示は壊れない。

- [ ] 各ページ種別（トップ / 事業詳細 / 実績 / 人材 / 採用 / フォーム）を開き、
      ブラウザのコンソールに `Content Security Policy` の違反が **1件も出ない**ことを確認する
- [ ] フォームを実際に送信し、Formspree への通信がブロックされないことを確認する
- [ ] 上記が確認できたら `public/_headers` のヘッダ名を
      `Content-Security-Policy-Report-Only` → `Content-Security-Policy` に変更して再デプロイ
- [ ] 変更後にもう一度、全ページ種別が正常に表示されることを確認する
- [ ] **PageSpeed Insights** をモバイル・デスクトップ両方で実行し、LCP が 2.5 秒以内（要件定義書 10.3）
- [ ] リッチリザルトテスト（Google）で `Organization` / `JobPosting` / `BreadcrumbList` が認識される
- [ ] OGP をカードで確認（Slack や X に公開URLを貼って画像が出るか）

### 5.2 人の手でしか確認できないこと

**自動チェックでは代替できないため、必ず一度は人力で行うこと。**

静的解析でわかるのは「CSS のルールが出力に含まれているか」までで、
「実際にフォーカスリングが見えるか」「操作の順番が自然か」は
実機で人が触らないと判断できない。

#### キーボードだけでサイト全体をたどる

マウスとトラックパッドに一切触れず、`Tab` / `Shift+Tab` / `Enter` /
`Space` / 矢印キーだけで以下を確認する。

- [ ] ページを開いて最初に `Tab` を押すと「本文へスキップ」が現れ、`Enter` で本文へ飛べる
- [ ] **フォーカスが今どこにあるか、常に目で見てわかる**（ネイビーの枠線が出る）
- [ ] フォーカスの移動順が、画面の見た目の並び順と一致している
- [ ] ヘッダーの「事業内容」で `Tab` を進めるとドロップダウンが開き、3事業へ移動できる
- [ ] `Esc` でドロップダウンが閉じる
- [ ] スマートフォン幅でハンバーガーメニューを開閉でき、開いている間に背面へフォーカスが抜けない
- [ ] 会社概要・事業詳細の目次を `Enter` で選ぶと、その見出しへ即座に移動する（アニメーションなし）
- [ ] 移動先の見出しが、固定ヘッダーに隠れていない
- [ ] 実績・人材パネルのフィルタをキーボードで操作でき、選択状態が見てわかる
- [ ] フォームの全項目を `Tab` だけで入力でき、エラーが出たときにその項目へ戻れる
- [ ] 同意チェックを `Space` で入れられ、入れるまで送信ボタンが押せない
- [ ] フォーカスが画面外に隠れたまま進む箇所がない

#### スクリーンリーダーでの確認（できれば）

- [ ] 見出しだけを拾って読み上げたとき、ページの構造が理解できる
- [ ] フォームのエラーが読み上げられる

#### 動きを減らす設定での確認

OS の設定を「視差効果を減らす」にした状態で開く。
（macOS: システム設定 → アクセシビリティ → ディスプレイ /
Windows: 設定 → アクセシビリティ → 視覚効果 → アニメーション効果）

- [ ] スクロールしても要素がフェードインせず、最初から表示されている
- [ ] 内容が読めなくなる箇所がない

#### JavaScript を無効にした状態での確認

ブラウザの設定で JavaScript を切って開く。

- [ ] 本文がすべて読める（`<noscript>` のフォールバックが効いているか）
- [ ] ヘッダーとフッターのリンクをたどれる

---

## 6. 公開前に必ず済ませること

デプロイの手順とは別に、公開してよい状態かの判断が必要な項目。

- [ ] **プライバシーポリシーとサイト利用規約のリーガルチェック**（`/privacy`, `/terms`）
- [ ] 実績の記載粒度の最終確認（要件定義書 12.1 との整合）
- [ ] 代表メッセージの原稿を反映し、`noindex` を外す
- [ ] メンバーインタビューの扱いを決める（`/recruit/voice` は現在 `noindex`）
- [ ] お知らせのダミー記事を実記事に差し替える
- [ ] 求人票の契約形態と報酬額を確定し、`content/jobs/*.json` に反映する
- [ ] 人材パネルのダミーデータを実データに差し替える（本人の掲載同意が前提）
- [ ] 各ページの「実装メモ」の表示ブロックを削除する

詳細は README の「発注者への確認事項」を参照。
