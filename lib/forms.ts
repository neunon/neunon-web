/**
 * フォーム定義（要件定義書 6.8）
 *
 * 企業用（/contact）と学生用（/entry）でフォームを分ける。
 * 項目は 6.8 の指定どおり。
 *
 * 送信先について:
 *   本サイトは output: 'export' の静的書き出しなので、サーバー側で
 *   メールを送る API Route を持てない。そのため送信先は Formspree の
 *   エンドポイントをブラウザから直接叩く構成にしている。
 *   ブラウザに値を渡す必要があるため、環境変数は NEXT_PUBLIC_ 接頭辞つき。
 *   要件定義書 11. の CONTACT_FORM_ENDPOINT に対応する。
 *
 *   エンドポイントが未設定の間は送信ボタンを押せない状態にし、
 *   画面上に「送信先未設定」と表示する。
 */

export type FieldType = 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select';

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  help?: string;
  options?: string[];
  autoComplete?: string;
  maxLength?: number;
};

/** 企業向け問い合わせ（要件定義書 6.8） */
export const contactFields: FieldDef[] = [
  {
    name: 'company',
    label: '会社名',
    type: 'text',
    required: true,
    placeholder: '株式会社〇〇',
    autoComplete: 'organization',
    maxLength: 100,
  },
  {
    name: 'department',
    label: '部署名',
    type: 'text',
    required: false,
    placeholder: '経営企画部',
    autoComplete: 'organization-title',
    maxLength: 100,
  },
  {
    name: 'name',
    label: 'お名前',
    type: 'text',
    required: true,
    placeholder: '山田 太郎',
    autoComplete: 'name',
    maxLength: 60,
  },
  {
    name: 'email',
    label: 'メールアドレス',
    type: 'email',
    required: true,
    placeholder: 'you@example.com',
    autoComplete: 'email',
    maxLength: 200,
  },
  {
    name: 'tel',
    label: '電話番号',
    type: 'tel',
    required: false,
    placeholder: '03-0000-0000',
    help: '任意です。返信はメールで差し上げます。',
    autoComplete: 'tel',
    maxLength: 30,
  },
  {
    name: 'topic',
    label: 'ご相談内容の種別',
    type: 'select',
    required: true,
    options: [
      'コンサルティングについて',
      'パッケージ型支援について',
      'AIプロダクトについて',
      'お見積りの依頼',
      '提携・協業のご相談',
      '採用・掲載に関するご連絡',
      'その他',
    ],
  },
  {
    name: 'message',
    label: 'ご相談内容',
    type: 'textarea',
    required: true,
    placeholder:
      '検討中の内容や、判断したいことをお書きください。まとまっていない状態でも構いません。',
    help: '内容が固まっていない段階でのご相談も歓迎です。',
    maxLength: 2000,
  },
];

/** 学生向けエントリー（要件定義書 6.8） */
export const entryFields: FieldDef[] = [
  {
    name: 'name',
    label: 'お名前',
    type: 'text',
    required: true,
    placeholder: '山田 太郎',
    autoComplete: 'name',
    maxLength: 60,
  },
  {
    name: 'email',
    label: 'メールアドレス',
    type: 'email',
    required: true,
    placeholder: 'you@example.com',
    autoComplete: 'email',
    maxLength: 200,
  },
  {
    name: 'school',
    label: '大学・学部・学年',
    type: 'text',
    required: true,
    placeholder: '〇〇大学 〇〇学部 2年',
    help: '選考で学校名や学部は問いません。連絡と稼働の相談のために伺っています。',
    maxLength: 120,
  },
  {
    name: 'position',
    label: '希望区分',
    type: 'select',
    required: true,
    options: [
      'リサーチ・分析アソシエイト',
      '案件ディレクション（リード学生）',
      '事業開発メンバー',
      '相談したい（決まっていない）',
    ],
    help: '決まっていなければ「相談したい」で構いません。',
  },
  {
    name: 'experience',
    label: 'スキル・経験',
    type: 'textarea',
    required: true,
    placeholder:
      '使えるツール、これまでにやったこと、勉強中のことなど。実務未経験でも構いません。',
    help: '書けることがなければ「未経験」とだけでも構いません。',
    maxLength: 1500,
  },
  {
    name: 'motivation',
    label: '志望動機',
    type: 'textarea',
    required: true,
    placeholder: '何をやってみたいか、なぜ応募したかをお書きください。',
    help: 'きれいにまとめる必要はありません。何をやりたいかが伝われば十分です。',
    maxLength: 1500,
  },
  {
    name: 'portfolio',
    label: 'ポートフォリオURL',
    type: 'url',
    required: false,
    placeholder: 'https://',
    help: '任意です。GitHub、note、制作物など、あれば。',
    maxLength: 300,
  },
];

/**
 * 送信先エンドポイント。
 * 静的書き出しではビルド時に値が埋め込まれるため、
 * process.env.NEXT_PUBLIC_* を直接参照する必要がある
 * （動的なキーでのアクセスは置換されない）。
 */
export const formEndpoints = {
  contact: process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? '',
  entry: process.env.NEXT_PUBLIC_ENTRY_FORM_ENDPOINT ?? '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 1項目分の検証。問題なければ null を返す */
export function validateField(field: FieldDef, raw: string): string | null {
  const value = raw.trim();

  if (field.required && value === '') {
    return field.type === 'select'
      ? `${field.label}を選択してください。`
      : `${field.label}を入力してください。`;
  }
  if (value === '') return null;

  if (field.maxLength && value.length > field.maxLength) {
    return `${field.label}は${field.maxLength}文字以内で入力してください。`;
  }
  if (field.type === 'email' && !emailPattern.test(value)) {
    return 'メールアドレスの形式が正しくありません。';
  }
  if (field.type === 'url' && !/^https?:\/\/\S+$/.test(value)) {
    return 'URLは http:// または https:// から始まる形式で入力してください。';
  }
  if (field.type === 'select' && field.options && !field.options.includes(value)) {
    return `${field.label}を選択してください。`;
  }
  return null;
}

export function validateAll(fields: FieldDef[], values: Record<string, string>) {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const error = validateField(field, values[field.name] ?? '');
    if (error) errors[field.name] = error;
  }
  return errors;
}
