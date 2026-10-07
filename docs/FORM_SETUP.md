# フォーム運用設定（Cloudflare Worker + Resend）

## 送信履歴の管理（追加設定が必要）

`/admin/submissions.html` で企業お問い合わせと学生エントリーの一覧・詳細、学生の添付ファイルを確認できる。従来のメール通知も続ける。閲覧はGitHub OAuthログイン後に、`INBOX_ALLOWED_USERS` に記載したアカウントで、かつリポジトリのpush権限を持つ場合だけ許可する。トークンはブラウザーのメモリにのみ保持し、URLやlocalStorageには置かない。添付は非公開R2バケットから認証後にのみダウンロード可能で、公開URLは付けない。

新しい送信分だけが蓄積される。従来の通知メールは自動移行されない。保存期限は自動設定しない（無期限保管）。削除依頼・不要データの整理は管理者がCloudflare側で対応する。個人情報の長期保管について、プライバシーポリシーのリーガルチェックと管理者アカウントの棚卸しを公開前に行うこと。

**既存のフォームWorkerを先にデプロイしない。** この版はD1/R2の両バインディングがない場合にフォーム送信を拒否する。次の順で設定する。

1. CloudflareでD1データベース `neunon-submissions` と、公開アクセスを無効にしたR2バケット `neunon-submission-files` を作成する。R2の利用料金・請求設定を事前確認する。
2. `worker/schema.sql` をD1に適用する（例: `npx wrangler d1 execute neunon-submissions --remote --file worker/schema.sql`）。
3. `worker/wrangler.toml` にD1の `database_id` を含む `[[d1_databases]]`（binding=`SUBMISSIONS`）と `[[r2_buckets]]`（binding=`ATTACHMENTS`, bucket_name=`neunon-submission-files`）を追加する。D1のIDは実際に作成した値を使う。R2バケットの公開URLを有効にしない。
4. `INBOX_ALLOWED_USERS` を閲覧許可するGitHubログイン名のみにする。追加するアカウントにもOAuth App利用許可とリポジトリpush権限が必要。
5. `npm run test:worker` 後にWorkerをデプロイ。企業フォームと学生フォーム（添付あり）のテスト送信を行い、メール到着、管理一覧、詳細、添付ダウンロード、権限のないアカウントでの拒否を確認する。
6. Renderの `CMS_AUTH_BASE_URL` と `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` を設定してサイトを再ビルドし、`/admin/submissions.html` にログインして確認。`render.yaml` のadmin用CSPにはフォームWorkerのオリジンが必要。独自ドメインに変更した場合はCSPも更新する。

送信処理は先にD1へ記録し、添付をR2へ保存してからResendへ送信する。メール送信成功で `sent`、失敗で `failed` と表示する。同じ送信IDを再試行したときはResendのIdempotency-Keyを使う。失敗した送信も原因調査のため一覧に残る。管理画面は公開HTMLとして存在するが、本文と添付のAPIは認証なしでは返さない。

企業問い合わせと学生エントリーは、Render上の静的サイトからCloudflare Workerへ送信します。Workerが入力検証とTurnstile検証を行い、Resend経由で担当者通知と自動返信を同時に送ります。

## 構成

- Workerコード: `worker/src/index.mjs`
- Worker設定: `worker/wrangler.toml`
- 通知先: `info@neun-on.com`
- 企業フォーム: `https://<worker-domain>/contact`
- 学生フォーム: `https://<worker-domain>/entry`
- 添付上限: 10MB、PDF・Word・PowerPoint・PNG・JPEG・WebP

## Cloudflare Workerの変数

通常変数:

- `ALLOWED_ORIGINS=https://neun-on.com,https://www.neun-on.com`
- `NOTIFICATION_EMAIL=info@neun-on.com`
- `FROM_EMAIL=Neunon Website <website@neun-on.com>`

暗号化して登録するSecret:

- `RESEND_API_KEY`
- `TURNSTILE_SECRET`

## Renderの環境変数

- `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=https://<worker-domain>/contact`
- `NEXT_PUBLIC_ENTRY_FORM_ENDPOINT=https://<worker-domain>/entry`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY=<Turnstileの公開sitekey>`

環境変数を保存した後、RenderでManual Deployを実行します。

## 動作

- 企業フォーム: 担当者通知と問い合わせ者への受付メールを送信
- 学生フォーム: 添付を含む担当者通知と応募者への受付メールを送信
- 同一送信IDにはResendのIdempotency-Keyを付け、再送による重複を抑止
- 許可したドメインとローカル開発環境以外からの送信を拒否
- Workerログへフォーム本文やメールアドレスを出力しない

環境変数が空の間は、画面の送信ボタンは無効になります。
