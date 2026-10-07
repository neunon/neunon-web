/**
 * サイト共通の定数。
 * 会社情報は要件定義書 2. の表をそのまま反映している。
 * 掲載可否は要件定義書 12.1 の判断に従う（所在地・電話番号は掲載する）。
 */

import settings from '@/content/site/settings.json';

export const site = {
  name: settings.company.name,
  nameEn: settings.company.nameEn,
  // 要確認: 独自ドメインの取得状況（要件定義書 10.3 / 14）
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://neun-on.com',
  domain: 'neun-on.com',
  description: settings.company.description,
  keyMessage: settings.company.keyMessage,
  mission: settings.company.mission,
  founded: settings.company.founded,
  representative: settings.company.representative,
  employees: settings.company.employees,
  address: {
    head: settings.company.address,
  },
  business: settings.company.business,
  tel: settings.company.tel,
  // 代表問い合わせ先
  email: settings.company.email,
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
    label: settings.navigation.services,
    href: '/services',
    children: [
      { label: settings.navigation.consulting, href: '/services/consulting', note: '01' },
      { label: settings.navigation.package, href: '/services/package', note: '02' },
      { label: settings.navigation.ai, href: '/services/ai', note: '03' },
    ],
  },
  { label: settings.navigation.works, href: '/works' },
  { label: settings.navigation.talent, href: '/talent' },
  { label: settings.navigation.about, href: '/about' },
  { label: settings.navigation.recruit, href: '/recruit' },
];

export const contactNav = { label: settings.navigation.contact, href: '/contact' };

export const footerNav = [
  {
    heading: settings.footer.servicesHeading,
    items: [
      { label: settings.navigation.consulting, href: '/services/consulting' },
      { label: settings.navigation.package, href: '/services/package' },
      { label: settings.navigation.ai, href: '/services/ai' },
      { label: '支援実績', href: '/works' },
      { label: '人材パネル', href: '/talent' },
    ],
  },
  {
    heading: settings.footer.companyHeading,
    items: [
      { label: settings.navigation.about, href: '/about' },
      { label: '会社情報', href: '/about/company' },
      { label: 'お知らせ', href: '/news' },
    ],
  },
  {
    heading: settings.footer.careersHeading,
    items: [
      { label: settings.navigation.recruit, href: '/recruit' },
      { label: '学生エントリー', href: '/entry' },
      { label: settings.navigation.contact, href: '/contact' },
      { label: 'プライバシーポリシー', href: '/privacy' },
      { label: 'サイト利用規約', href: '/terms' },
    ],
  },
] as const;
