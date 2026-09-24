# Neunon Consulting コーポレートサイト（neunon-web）

このファイルは **Codex と Claude Code の共通ルール**。
`CLAUDE.md` は `@AGENTS.md` の1行だけで、ここを読み込んでいる。
片方だけに書かない。ルールを変えるときは必ずこのファイルを直す。

## プロジェクト

- 本番: https://neun-on.com/ （Render Static Site、`origin/main` push で自動デプロイ）
- リポジトリ: `neunon/neunon-web`（private / neunon organization）
- Next.js 16 静的書き出し + Tailwind 4。フォームと CMS 認証は別の Cloudflare Worker
- 仕様の正: `neunon-site-requirements.md` / デザインの正: `neunon-toppage-design.html`
- 現在の運用状況: `docs/SEO_IMPLEMENTATION.md`、`docs/CMS_SETUP.md`

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # out/ へ静的書き出し（content の型検査が先に走る）
npm run typecheck
npm run audit:html   # build のあとに実行。title/description・canonical・sitemap を検査
```

---

# 二人体制のルール（Codex ⇄ Claude Code）

**このプロジェクトは Codex と Claude Code を交代で回す。**
片方が利用上限に達したら、もう片方が続きを引き取る。
そのために、進行状況は人間の記憶ではなく **GitHub と `docs/AGENT_LOG.md`** に置く。

## セッションを始めるとき（必ず最初にやる）

```bash
git fetch origin
git status
```

1. `docs/AGENT_LOG.md` を読む。**ここが引き継ぎの正。** 口頭の指示より優先して状況把握に使う
2. `git log --oneline -10 origin/main` で、相手が何を進めたか確認する
3. 作業ブランチが AGENT_LOG に書かれていれば `git switch <branch> && git pull` で追いつく
4. 何も書かれていなければ `git switch main && git pull` から始める

**ローカルの状態を信じない。** 相手は別セッションで push している可能性がある。
必ず `git fetch` してから判断する。

## 作業中

- `main` に直接コミットしない。`hp/<やっていること>` 形式のブランチを切る
  （例: `hp/seo-structured-data`、`hp/news-layout`）
- **こまめに commit する。** 「完成したら一度に」は禁止。
  上限は予告なく来る。中途半端でも commit されていれば相手が拾える
- commit メッセージは日本語でも英語でもよいが、**何をしたか**を書く
- 大きな判断（構成を変える、方針を決める）をしたら、その場で `docs/AGENT_LOG.md` の
  「決まったこと」に1行足す。あとでまとめて書こうとしない

## セッションを終えるとき／上限が近いと感じたとき

**作業を止める前に、必ずこの4つを実行する。**

```bash
git add -A
git commit -m "<途中でもよい。何をどこまでやったか>"
git push -u origin <ブランチ名>
```

4. `docs/AGENT_LOG.md` を更新して、それも commit & push する

push していない作業は、もう片方からは**存在しないのと同じ**。
「あとで push する」は成立しない。上限は作業の途中で来る。

## 相手の作業を壊さないために

- 相手が push したコミットを `git push --force` で消さない
- 相手が切ったブランチを勝手に削除・マージしない。マージは人間（坂本）が判断する
- 同じファイルを両方が同時に触っている気配があれば、`docs/AGENT_LOG.md` に書いて避ける
- `main` への直接 push は本番デプロイが走る。人間の承認なしにやらない

---

# このサイト固有の決まりごと

## SEO

`docs/SEO_IMPLEMENTATION.md` が現行方針。以下を勝手に覆さない。

- URL は末尾スラッシュ統一。既存 URL を変えるときは必ず人間に確認する（被リンクと検索順位に影響）
- metadata は `lib/seo.ts` の共通生成を通す。ページごとに手書きしない。会社名の二重付与に注意
- sitemap の `lastmod` は実際のコンテンツ日付だけ。ビルド日時を入れない
- noindex 方針を維持する対象: 個人人材ページ、旧実績詳細、未確定原稿ページ、
  フォーム完了画面、`/admin`
- 新規 LP や記事の量産、分析ツール導入は今回のスコープ外

## コンテンツ

コードを触らずに直せる設計になっている。文言修正は `content/` の JSON を優先する。

| 直したいもの | ファイル |
|---|---|
| 事業の説明・メニュー・料金・FAQ | `content/services/*.json` |
| 支援実績 | `content/works/*.json` |
| 人材パネル | `content/talent/talents.json`（Microsoft Lists 連携。手で消さない） |
| 求人票 | `content/jobs/*.json` |
| お知らせ | `content/news/*.json` |
| SEO文言・トップコピー | `content/site/seo.json`、`content/pages/home.json` |
| 会社情報・電話番号・住所 | `lib/site.ts` |

## 触らないもの

- `neunon-logo.png`（受領した元データ。加工前の状態で保持）
- 法務文書（プライバシーポリシー・利用規約）の中身。リーガルチェック待ち
- secrets、`.env`、CMS の認証設定値
- `node_modules/`、`out/`、`.next/`

## 出す前に通すもの

```bash
npm run typecheck && npm run build && npm run audit:html
```

`build` は content の型検査を兼ねている。ここが通らないものは push しない。

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
