/**
 * サイト共通の定数。
 * 会社情報は要件定義書 2. の表をそのまま反映している。
 * 掲載可否は要件定義書 12.1 の判断に従う（所在地・電話番号は掲載する）。
 */

export const site = {
  name: '株式会社Neunon Consulting',
  nameEn: 'Neunon Consulting, Inc.',
  // 要確認: 独自ドメインの取得状況（要件定義書 10.3 / 14）
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://neun-on.com',
  domain: 'neun-on.com',
  description:
    '選抜・育成された学生人材が企業の実務に挑み、プロフェッショナルが成長と成果物の品質を支えることで、企業の成果創出と次世代ビジネス人材の育成を両立します。',
  keyMessage: '次世代の成長を、企業の成長へ。',
  mission:
    '企業の成長・再建・立上げに伴う多様な課題に対し、画一的なフレームワークに頼らず、個々の状況に応じた柔軟かつ実践的な支援を提供すると共に、実務支援を通じて次世代ビジネス人材を育成し、社会的価値の創出を目指します',
  founded: '2026年1月27日',
  representative: '代表取締役社長　坂本 慧',
  employees: '5名',
  address: {
    head: '東京都江東区南砂6-7-36-306',
  },
  tel: '070-4360-2652',
  // 代表問い合わせ先
  email: 'keisakamoto@neun-on.com',
} as const;

/**
 * グローバルナビ（要件定義書 5.4）
 * [ロゴ] 事業内容▾ 実績 人材 会社概要 採用情報 [お問い合わせ]
 * 右端の「お問い合わせ」だけがボタン要素。
 */
export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; note?: string }[];
};

export const globalNav: NavItem[] = [
  {
    label: '事業内容',
    href: '/services',
    children: [
      { label: 'コンサルティング', href: '/services/consulting', note: '01' },
      { label: 'パッケージ型支援', href: '/services/package', note: '02' },
      { label: 'AIプロダクト', href: '/services/ai', note: '03' },
    ],
  },
  { label: '実績', href: '/works' },
  { label: '人材', href: '/talent' },
  { label: '企業情報', href: '/about' },
  { label: '採用情報', href: '/recruit' },
];

export const contactNav = { label: 'お問い合わせ', href: '/contact' };

export const footerNav = [
  {
    heading: 'Services',
    items: [
      { label: 'コンサルティング', href: '/services/consulting' },
      { label: 'パッケージ型支援', href: '/services/package' },
      { label: 'AIプロダクト', href: '/services/ai' },
      { label: '支援実績', href: '/works' },
      { label: '人材パネル', href: '/talent' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: '企業情報', href: '/about' },
      { label: '代表メッセージ', href: '/about/message' },
      { label: '会社情報', href: '/about/company' },
      { label: 'お知らせ', href: '/news' },
    ],
  },
  {
    heading: 'Careers & Contact',
    items: [
      { label: '採用情報', href: '/recruit' },
      { label: '学生エントリー', href: '/entry' },
      { label: 'お問い合わせ', href: '/contact' },
      { label: 'プライバシーポリシー', href: '/privacy' },
      { label: 'サイト利用規約', href: '/terms' },
    ],
  },
] as const;
