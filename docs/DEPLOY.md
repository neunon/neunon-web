# デプロイ手順（Render Static Site）

要件定義書 13. のステップ9。静的書き出し（`output: 'export'`）した `out/` を
Render の Static Site で配信する。

Static Site は無料 Web Service のようなスリープが発生しない（要件定義書 10.1 の注記どおり）。

このリポジトリ側の準備は完了している。以下は**発注者ご自身の操作**が必要な作業。
Render のアカウント操作と、GitHub リポジトリへのアクセス許可は、
アカウントの持ち主でないと行えないため。

---

## 1. Render にリポジトリを接続する

`render.yaml` を置いてあるので、Blueprint から作るのが確実。

1. Render にログインし、**New → Blueprint** を開く
2. GitHub 連携を承認する
   - 認可の対象は **`neunon` organization の `neunon-web` のみ**に絞ることを推奨（全リポジトリへの許可は不要）
   - private リポジトリでも問題なく連携できる
3. リポジトリ `neunon/neunon-web` を選択すると `render.yaml` が読み込まれる
4. 環境変数の入力を求められる（次項）

ダッシュボードから手動で作る場合の設定は以下。

| 項目 | 値 |
|---|---|
| Service type | **Static Site** |
| Build command | `npm run build:deploy` |
| Publish directory | `out` |

`build:deploy` は `next build` のあとに `scripts/audit.mjs` を実行する。
title の重複、見出しレベル、リンクやボタンの名前、フォームのラベル、
機密に関わる禁止語の混入などを検査し、問題があればビルドが失敗する。
壊れた状態が公開されるのを防ぐための関門なので、
Build command は `npm run build` ではなくこちらを指定すること。

Node のバージョンは `render.yaml` の `NODE_VERSION`（24.14.0）で固定している。
`.node-version` も同じ値にしてあるので、変更するときは両方直すこと。

## 2. 環境変数

`render.yaml` で `sync: false` にしてあるものは、Render のダッシュボードで入力する。

| 変数 | 値 | 状態 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 公開URL（末尾スラッシュなし） | ドメイン確定後に本番URLへ変更 |
| `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` | `https://formspree.io/f/xxxxxxxx` | **未確定**。Formspree でフォーム作成後 |
| `NEXT_PUBLIC_ENTRY_FORM_ENDPOINT` | `https://formspree.io/f/yyyyyyyy` | **未確定**。企業用とは別に作る |

`NEXT_PUBLIC_SITE_URL` は sitemap.xml と構造化データの絶対URLに使われる。
未設定だと `https://neun-on.com` が既定値になるので、
ドメイン取得前は Render の `*.onrender.com` のURLを入れておくこと。

環境変数を変更したら、**再デプロイしないと反映されない**（ビルド時に埋め込まれるため）。

### Formspree の設定（未着手）

1. Formspree でフォームを2つ作る（企業用・学生用）
2. それぞれの通知先メールアドレスを Formspree 側で指定する
   - 【要確認】要件定義書 14.「代表メールアドレスの新設」と合わせて決める
3. 発行されたエンドポイントを上記の環境変数に入れる

未設定の間、フォームは送信ボタンが押せない状態になり、
画面に「送信先が未設定のため送信できません」と表示される。

## 3. 独自ドメイン（`neun-on.com`）

【要確認】要件定義書 14. の未解決事項。取得状況が判明してから。

1. Render の **Settings → Custom Domains** で `neun-on.com` を追加
2. 表示される DNS レコード（A / CNAME）を、ドメインを管理しているところに設定する
3. TLS 証明書は Render が Let's Encrypt / Google Trust Services で自動発行・更新する（HTTPS 必須の要件を満たす）
4. `www` の有無を決め、片方からもう片方へリダイレクトする
5. **`NEXT_PUBLIC_SITE_URL` を本番URLに変更して再デプロイする**
6. Google Search Console にサイトを登録し、`sitemap.xml` を送信する

> **5番を忘れないこと。**
> `NEXT_PUBLIC_SITE_URL` はビルド時に埋め込まれ、`sitemap.xml` の各URLと、
> 構造化データ（`Organization` の `url`・`logo`、`JobPosting` の `url`、
> `BreadcrumbList` の各 `item`）の絶対URLに使われる。
>
> 仮URL（`*.onrender.com`）のままドメインを繋いでも、サイト自体は表示される。
> しかし sitemap と構造化データは古いURLを指し続けるため、
> 検索エンジンには仮URLのサイトとして認識され、
> ドメインを変えた意味がなくなる。**環境変数を変えたら必ず再デプロイすること**
> （ビルドし直さないと値が反映されない）。
>
> 切り替え後は次で確認する。
>
> ```bash
> curl -s https://<本番URL>/sitemap.xml | head -5
> ```
>
> - [ ] sitemap.xml のURLが本番ドメインになっている
> - [ ] トップページの構造化データ（`Organization`）の `url` が本番ドメインになっている

ドメイン取得前でも `*.onrender.com` で公開・確認はできる。

---

## 4. 初回デプロイ直後に確認すること

Render 固有の挙動で、実際に配信してみないと確定できない点が2つある。
**最初のデプロイが終わったら、まずここを確認すること。**

### 4.1 ディレクトリのインデックスが返るか

本サイトは `trailingSlash: true` で書き出しているので、
`/about/` に対して `out/about/index.html` が返る必要がある。

- [ ] `https://<公開URL>/about/` が正しく表示される
- [ ] `https://<公開URL>/services/package/` が正しく表示される

もし 404 になる場合は、Render のダッシュボードで Rewrite ルールを追加する。

| Source | Destination | Action |
|---|---|---|
| `/**/` | `/**/index.html` | Rewrite |

### 4.2 404 ページが出るか

- [ ] 存在しないURL（例 `https://<公開URL>/no-such-page/`）で、
      作成した404ページ（「ページが見つかりません」）が表示される

Render が `404.html` を自動で使わない場合は、
**Not Found ページ**の設定、または以下の Rewrite ルールを追加する。

| Source | Destination | Action |
|---|---|---|
| `/*` | `/404.html` | Rewrite（他のルールの最後に置く） |

> **注意:** ここで `/*` → `/index.html` の SPA 用リライトを入れてはいけない。
> 本サイトはページごとに実ファイルがある多ページ構成なので、
> 全部トップページになってしまう。

### 4.3 キャッシュヘッダが効いているか

`render.yaml` では `/_next/static/*` に対して恒久キャッシュを指定している。
公式ドキュメントの `/blog/*` の説明が
"Matches `/blog/`, `/blog/latest-post/`, and all other paths under `/blog/`"
となっており、単一の `*` は配下すべてに一致すると読める。
ただしプレフィックスを付けた場合の挙動は明記がないため、実配信で確認する。

```bash
curl -I https://<公開URL>/_next/static/chunks/<ファイル名>.js | grep -i cache-control
```

ファイル名はサイトのHTMLソース、または DevTools の Network タブで確認できる。

- [ ] `Cache-Control: public, max-age=31536000, immutable` が返る

返らない場合は `render.yaml` の該当パスを `/_next/static/**/*` に変更して再デプロイし、
もう一度確認する。効かないままだと毎回再検証が走り、表示が遅くなる。

---

## 5. デプロイ後の確認（ステップ9の完了条件）

以下がすべて完了して、はじめてステップ9を完了とする。

### 5.1 自動でできる確認

- [ ] Render のビルドが成功している（`build:deploy` の監査を含む）
- [ ] 全ページが表示される（`/`, `/services/*`, `/works/*`, `/talent/*`, `/recruit/*`, `/about/*`, `/news/*`, `/contact`, `/entry`, `/privacy`, `/terms`）
- [ ] 上の 4.1 / 4.2 が解決している
- [ ] `https://<公開URL>/sitemap.xml` と `/robots.txt` が返る
- [ ] レスポンスヘッダに `X-Content-Type-Options` / `Referrer-Policy` / `X-Frame-Options` が付いている
      （`render.yaml` の headers が効いているかの確認。効いていなければ設定の取り違え）
- [ ] `https://<公開URL>/_headers` が **404 になる**（Cloudflare 用のファイルが残っていないことの確認）
- [ ] **PageSpeed Insights** をモバイル・デスクトップ両方で実行し、LCP が 2.5 秒以内（要件定義書 10.3）
- [ ] リッチリザルトテスト（Google）で `Organization` / `JobPosting` / `BreadcrumbList` が認識される
- [ ] OGP をカードで確認（Slack や X に公開URLを貼って画像が出るか）

#### CSP を強制に切り替える

`render.yaml` の CSP は、いま **`Content-Security-Policy-Report-Only`** にしてある。
配信した状態での検証ができていないため、いきなり強制するとサイトが
表示されなくなる可能性があるため。Report-Only なら違反はコンソールに出るだけで表示は壊れない。

- [ ] 各ページ種別（トップ / 事業詳細 / 実績 / 人材 / 採用 / フォーム）を開き、
      ブラウザのコンソールに `Content Security Policy` の違反が **1件も出ない**ことを確認する
- [ ] フォームを実際に送信し、Formspree への通信がブロックされないことを確認する
- [ ] 上記が確認できたら `render.yaml` のヘッダ名を
      `Content-Security-Policy-Report-Only` → `Content-Security-Policy` に変更して再デプロイ
- [ ] 変更後にもう一度、全ページ種別が正常に表示されることを確認する

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

---

## 付記: 他のホスティングに移る場合

`render.yaml` は Render 専用。Cloudflare Pages や Netlify に移す場合は
`public/_headers`（別形式）にヘッダを書き直す必要がある。
**ファイルを置き忘れてもエラーにならず、ヘッダが黙って付かなくなる**ので、
移設したら必ず 5.1 のヘッダ確認を行うこと。

ワイルドカードの意味も異なる。Render の `/*` は階層をまたがないため
`/_next/static/**/*` と書く必要があるが、Cloudflare Pages では
`/_next/static/*` で配下すべてに一致する。
