# フォーム運用設定（Cloudflare Worker + Resend）

企業問い合わせと学生エントリーは、Render上の静的サイトからCloudflare Workerへ送信します。Workerが入力検証とTurnstile検証を行い、Resend経由で担当者通知と自動返信を同時に送ります。

## 構成

- Workerコード: `worker/src/index.mjs`
- Worker設定: `worker/wrangler.toml`
- 通知先: `keisakamoto@neun-on.com`
- 企業フォーム: `https://<worker-domain>/contact`
- 学生フォーム: `https://<worker-domain>/entry`
- 添付上限: 10MB、PDF・Word・PowerPoint・PNG・JPEG・WebP

## Cloudflare Workerの変数

通常変数:

- `ALLOWED_ORIGINS=https://neun-on.com,https://www.neun-on.com`
- `NOTIFICATION_EMAIL=keisakamoto@neun-on.com`
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
