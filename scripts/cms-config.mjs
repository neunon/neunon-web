// Config is generated as JSON (valid YAML). No secrets are accepted here.
const string = (name, label, extra = {}) => ({ name, label, widget: 'string', ...extra });
const text = (name, label, extra = {}) => ({ name, label, widget: 'text', ...extra });
const hidden = (name, value) => ({ name, widget: 'hidden', default: value });
const bool = (name, label, value = true) => ({ name, label, widget: 'boolean', default: value });
const select = (name, label, options, value) => ({ name, label, widget: 'select', options, default: value });
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
const sectionBase = [
  bool('visible', 'このセクションを表示'),
  select('tone', '背景', ['white', 'soft', 'dark'], 'white'),
  string('eyebrow', '小見出し', { required: false }),
  string('title', '見出し'),
];
const paragraphList = () => strings('paragraphs', '本文（段落ごと）', { min: 1 });
const safeLink = (name, label, extra = {}) => string(name, label, {
  pattern: ['^/(?!/)[A-Za-z0-9/_#-]*$', 'サイト内のパスのみ。例：/contact/'], ...extra,
});
const obj = (name, label, fields) => ({ name, label, widget: 'object', fields });
const consultingFields = obj('consulting', 'コンサルティング詳細', [
  obj('vision', '提供価値', [string('title', '見出し'), list('values', '価値', [string('no', '番号'), string('en', '英語見出し'), text('body', '説明')], { min: 1 })]),
  obj('principles', '基本方針', [text('lead', '導入文'), list('items', '方針', [string('no', '番号'), string('title', '見出し'), text('body', '説明')], { min: 1 })]),
  obj('themes', '検討テーマ', [text('lead', '導入文'), list('items', 'テーマ', [string('no', '番号'), string('title', '見出し'), string('question', '問い'), strings('items', '内容', { min: 1 })], { min: 1 })]),
  obj('formats', '支援形態', [
    text('lead', '導入文'),
    list('items', '支援形態', [string('no', '番号'), string('title', '見出し'), string('role', '役割'), text('body', '説明'), select('from', '主体', ['pro', 'student', 'partner'], 'pro'), strings('chain', '支援経路', { min: 2 })], { min: 1 }),
    obj('diagram', '関係図', [string('client', 'クライアント'), string('clientNote', '注記', { required: false }), list('actors', '主体', [select('id', 'ID', ['pro', 'student', 'partner'], 'pro'), string('label', '表示名'), string('note', '注記', { required: false })], { min: 3 })]),
  ]),
  obj('cases', '事例', [text('lead', '導入文'), list('items', '事例', [string('no', '番号'), string('title', '見出し'), text('summary', '概要'), strings('issue', '課題', { min: 1 }), strings('approach', 'アプローチ', { min: 1 }), strings('insight', '示唆', { min: 1 })], { min: 1 })]),
  obj('record', '実績', [
    string('heading', '見出し'), text('lead', '導入文'), text('industryLead', '業界の説明'),
    list('stats', '数値', [string('value', '値'), string('unit', '単位'), string('label', '説明')], { min: 1 }),
    strings('industries', '業界', { min: 1 }),
    list('examples', '事例', [string('client', '顧客'), strings('items', '内容', { min: 1 })], { min: 1 }),
    text('note', '注記'),
  ]),
  obj('price', '価格説明', [
    text('lead', '導入文'), list('reasons', '価格の理由', [string('no', '番号'), string('title', '見出し'), text('body', '説明')], { min: 3 }),
    obj('chart', '価格図', [string('caption', '見出し'), text('annotation', '説明'), text('note', '注記'), list('columns', '比較列', [string('label', '見出し'), list('segments', '構成要素', [string('label', '項目'), { name: 'value', label: '数値', widget: 'number', value_type: 'float', min: 0 }, select('tone', '色', ['muted', 'pro', 'student'], 'muted')], { min: 2 })], { min: 2 })]),
  ]),
]);
const landingSections = {
  name: 'sections', label: 'セクション（追加・削除・並べ替え可能）', widget: 'list',
  allow_add: true, min: 0, summary: '{{fields.title}}',
  types: [
    { name: 'text', label: '文章', widget: 'object', fields: [...sectionBase, paragraphList()] },
    { name: 'cards', label: 'カード一覧', widget: 'object', fields: [
      ...sectionBase, text('lead', '導入文', { required: false }),
      list('cards', 'カード', [bool('visible', '表示'), string('title', '見出し'), text('body', '説明'), safeLink('href', 'リンク先', { required: false })], { min: 1 }),
    ] },
    { name: 'imageText', label: '画像＋文章', widget: 'object', fields: [
      ...sectionBase, paragraphList(), { name: 'image', label: '画像', widget: 'image' },
      string('imageAlt', '画像の説明（代替テキスト）'), select('imageSide', '画像の位置', ['left', 'right'], 'right'),
    ] },
    { name: 'faq', label: 'よくある質問', widget: 'object', fields: [
      ...sectionBase,
      list('questions', '質問', [bool('visible', '表示'), string('question', '質問'), text('answer', '回答')], { min: 1 }),
    ] },
    { name: 'cta', label: '行動ボタン', widget: 'object', fields: [
      ...sectionBase, text('body', '説明'), string('label', 'ボタン文言'), safeLink('href', 'リンク先'),
    ] },
  ],
};
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
    ...(id === 'consulting' ? [consultingFields] : [
    list('steps', '進め方', [string('no', 'ステップ番号'), string('title', '見出し'), text('body', '説明')], { min: 1 }),
    list('engagement', '想定期間・体制', [string('label', '項目'), text('value', '内容')], {
      min: 1, hint: id === 'package' ? '保管項目。価格・納期の詳細セクションは公開準備中です。' : '',
    }),
    ]),
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
            { name: 'problem', label: '次世代の力', widget: 'object', fields: [
              bool('visible', 'セクションを表示'), string('title', '見出し'), text('intro', '導入文'),
              list('opportunities', '4つの力', [string('title', '見出し'), strings('body', '説明文（行ごと）', { min: 1 })], { min: 1 }),
              string('studentTitle', '学生の成長 見出し'), text('studentBody', '学生の成長 説明'),
              string('businessTitle', '企業の成長 見出し'), text('businessBody', '企業の成長 説明'),
            ] },
          ],
        }],
      },
      {
        name: 'aboutPage', label: '企業情報ページ', format: 'json', editor: { preview: false },
        files: [{ name: 'about', label: '理念・人材育成', file: 'content/pages/about.json', fields: [
          text('heroLead', 'ヒーローの導入文'),
          { name: 'mission', label: 'ミッション', widget: 'object', fields: [bool('visible', '表示'), string('title', '見出し'), text('body', '本文')] },
          { name: 'people', label: '人材育成に対する考え', widget: 'object', fields: [
            bool('visible', '表示'), string('title', '見出し'), string('introTitle', '導入見出し'),
            strings('introParagraphs', '導入文（段落ごと）', { min: 1 }),
            list('points', '論点（追加・削除・並べ替え可能）', [string('title', '見出し'), strings('paragraphs', '本文（段落ごと）', { min: 1 })], { min: 1 }),
          ] },
          bool('companyVisible', '会社情報を表示'),
        ] }],
      },
      { name: 'services', label: '事業', format: 'json', editor: { preview: false }, files: serviceFiles },
      {
        name: 'landing', label: 'LP・コンテンツページ', folder: 'content/landing', extension: 'json', format: 'json',
        create: true, delete: true, identifier_field: 'title', slug: '{{fields.slug}}',
        summary: '{{title}}', editor: { preview: false },
        fields: [
          string('slug', 'URL用ID', { pattern: ['^[a-z0-9]+(?:-[a-z0-9]+)*$', '半角英小文字・数字・ハイフンのみ'], hint: '公開後は変更しないでください。/lp/ID/ で公開されます。' }),
          bool('published', 'サイトに公開する', false),
          string('title', 'ページ見出し'), text('lead', 'ページ導入文'),
          string('eyebrow', '小見出し', { required: false }), seoTitle(), seoDescription(),
          date('updatedAt', '内容の更新日', { required: false }), landingSections,
        ],
      },
      {
        name: 'news', label: 'ニュース', folder: 'content/news', extension: 'json', format: 'json',
        create: true, delete: true, identifier_field: 'title', slug: '{{fields.slug}}',
        summary: '{{date}} — {{title}}', editor: { preview: false },
        fields: [
          string('slug', 'URL用ID', { pattern: ['^[a-z0-9]+(?:-[a-z0-9]+)*$', '半角英小文字・数字・ハイフンのみ'], hint: '公開後は変更しないでください。例：service-update' }),
          date('date', '掲載日'), string('category', '分類'), string('title', 'タイトル'),
          bool('published', 'サイトに公開する'),
          text('excerpt', '概要・検索結果向けの説明'),
          { name: 'body', label: '本文（段落ごとに追加）', widget: 'list', min: 1, field: text('paragraph', '段落') },
          hidden('placeholder', false),
        ],
      },
    ],
  };
}
