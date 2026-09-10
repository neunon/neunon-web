# 文章を手動で修正する場所

文章は管理画面ではなく、リポジトリ内のファイルで編集できます。変更後は npm run dev でローカル確認し、npm run build:deploy で公開用ビルドを確認してください。

## よく編集する場所

- 会社名・住所・電話・メール・共通文言：lib/site.ts
- 事業内容：content/services 内の JSON
- 実績：content/works 内の JSON
- 人材：content/talent/talents.json
- 採用の共通文言：lib/recruit.ts
- フォーム項目：lib/forms.ts
- 各ページ本文：app 内の各 page.tsx
- トップページ：components/home 内

JSON は、文字列を囲む記号や行末のカンマを誤って消さないよう注意してください。見た目は app 内の CSS で調整できます。

将来、ブラウザ上で本文を編集したい場合は CMS を追加できます。現状は GitHub 上で直接編集する構成です。
