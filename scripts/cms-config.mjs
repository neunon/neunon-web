// Config is generated as JSON (valid YAML). No secrets are accepted here.
const string = (name, label, extra = {}) => ({ name, label, widget: 'string', ...extra });
const text = (name, label, extra = {}) => ({ name, label, widget: 'text', ...extra });
const hidden = (name, value) => ({ name, widget: 'hidden', default: value });
const list = (name, label, fields, extra = {}) => ({ name, label, widget: 'list', fields, ...extra });
const strings = (name, label, extra = {}) => ({
  name, label, widget: 'list', field: string('value', '内容'), ...extra,
});
const seoTitle = (name = 'seoTitle') => string(name, 'SEOタイトル', {
  hint: '通常は会社名不要（自動付与）。会社名を含める場合も重複付与しません。キーワードを列挙しすぎないでください。',
});
const seoDescription = (name = 'seoDescription') => text(name, '検索結果向けの説明', {
  hint: '検索結果で必ずこの文章が表示されるわけではありません。内容を正確に100〜160字程度で説明してください。',
});
const date = (name, label, extra = {}) => ({
  name, label, widget: 'datetime', format: 'YYYY-MM-DD', date_format: 'YYYY/MM/DD',
  time_format: false, ...extra,
});
const serviceFiles = [
  ['consulting', '01-consulting', 'コンサルティング', 1],
  ['package', '02-package', 'パッケージ型支援', 2],
  ['ai', '03-ai', 'AIプロダクト', 3],
].map(([id, file, label, order]) => ({
  name: id, label, file: `content/services/${file}.json`,
  fields: [
    hidden('id', id), hidden('order', order), hidden('number', String(order).padStart(2, '0')),
    hidden('showPricing', id === 'package'),
    string('title', '事業名'), text('summary', '一覧用の説明'),
    seoTitle(), seoDescription(), text('lead', '詳細ページの導入文'),
    strings('highlights', '一覧の主なメニュー', { min: 1 }),
    strings('useCases', '想定課題', { min: 1, hint: id === 'package' ? '保管項目。専用ページの課題欄は各メニューの「想定課題」を使用します。' : '' }),
    list('menu', 'メニュー', [
      string('name', 'メニュー名'),
      ...(id !== 'consulting' ? [text('body', '内容')] : []),
      ...(id !== 'ai' ? [
        text('target', id === 'package' ? '想定顧客（保管用・現在非表示）' : '想定顧客'),
        text('issue', '想定課題'),
      ] : [string('base', '元となるパッケージ名', { required: false })]),
      ...(id === 'package' ? [
        string('caption', '英語の小見出し', { required: false }),
        strings('effects', 'メニュー欄の効果（2行）', { min: 2, max: 2 }),
        text('effect', '課題別の活用イメージ：効果'),
      ] : []),
    ], { min: 1 }),
    list('steps', '進め方', [string('no', 'ステップ番号'), string('title', '見出し'), text('body', '説明')], { min: 1 }),
    list('engagement', '想定期間・体制', [string('label', '項目'), text('value', '内容')], {
      min: 1, hint: id === 'package' ? '保管項目。価格・納期の詳細セクションは公開準備中です。' : '',
    }),
    ...(id === 'package' ? [
      list('pricing', '参考価格', [string('label', 'メニュー'), string('price', '価格')], {
        min: 6, hint: 'トップ・事業一覧には先頭6件を表示。詳細ページの価格・納期欄は公開準備中です。',
      }),
    ] : [hidden('pricing', [])]),
    text('pricingNote', '価格の注記'),
    list('faq', 'よくある質問', [string('q', '質問'), text('a', '回答')], {
      min: 1, hint: id === 'package' ? '現在、質問文に「価格」を含むFAQは専用ページでは非表示です。' : '',
    }),
    date('updatedAt', '内容の更新日', { required: false, default: '', hint: '実際に大きな内容変更をしたときだけ更新してください。SEO文言の微調整だけなら空欄のままで構いません。' }),
  ],
}));

export function createCmsConfig(authBaseUrl) {
  return {
    locale: 'ja',
    backend: {
      name: 'github', repo: 'neunon/neunon-web', branch: 'main', squash_merges: true,
      base_url: authBaseUrl, auth_endpoint: 'auth', site_domain: 'neun-on.com',
    },
    publish_mode: 'editorial_workflow',
    site_url: 'https://neun-on.com', display_url: 'https://neun-on.com',
    logo_url: 'https://neun-on.com/brand-logo-transparent.png',
    editor: { preview: false },
    media_folder: 'public/uploads', public_folder: '/uploads',
    collections: [
      {
        name: 'seo', label: 'SEO設定', format: 'json', editor: { preview: false },
        files: [{
          name: 'site', label: '主要ページのSEO', file: 'content/site/seo.json',
          fields: [
            ['home', 'トップページ'], ['services', '事業内容'], ['works', '支援実績'],
            ['talent', '人材パネル'], ['recruit', '採用情報'], ['about', '企業情報'], ['contact', 'お問い合わせ'],
          ].map(([name, label]) => ({
            name, label, widget: 'object', fields: [seoTitle('title'), seoDescription('description')],
          })),
        }],
      },
      {
        name: 'pages', label: 'トップページ', format: 'json', editor: { preview: false },
        files: [{
          name: 'home', label: 'トップのコピー', file: 'content/pages/home.json',
          fields: [
            string('eyebrow', '小見出し'), string('titleLine1', '主見出し 1行目'), string('titleLine2', '主見出し 2行目'),
            text('lead', '導入文'), text('businessSummary', '事業説明の補助文'),
            string('companyCtaLabel', '企業向けボタンの文言'), string('studentCtaLabel', '学生向けボタンの文言'),
          ],
        }],
      },
      { name: 'services', label: '事業', format: 'json', editor: { preview: false }, files: serviceFiles },
      {
        name: 'news', label: 'ニュース', folder: 'content/news', extension: 'json', format: 'json',
        create: true, delete: false, identifier_field: 'title', slug: '{{fields.slug}}',
        summary: '{{date}} — {{title}}', editor: { preview: false },
        fields: [
          string('slug', 'URL用ID', { pattern: ['^[a-z0-9]+(?:-[a-z0-9]+)*$', '半角英小文字・数字・ハイフンのみ'], hint: '公開後は変更しないでください。例：service-update' }),
          date('date', '掲載日'), string('category', '分類'), string('title', 'タイトル'),
          text('excerpt', '概要・検索結果向けの説明'),
          { name: 'body', label: '本文（段落ごとに追加）', widget: 'list', min: 1, field: text('paragraph', '段落') },
          hidden('placeholder', false),
        ],
      },
    ],
  };
}
