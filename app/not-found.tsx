import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';

export const metadata: Metadata = {
  title: 'ページが見つかりません',
  description: 'お探しのページは移動または削除された可能性があります。',
  robots: { index: false, follow: true },
};

/** 404 ページ。ルートレイアウトの既定タイトルを使い回さないよう独自に用意する */
export default function NotFound() {
  const links = [
    { href: '/services', label: '事業内容', note: '3つの提供形態' },
    { href: '/works', label: '支援実績', note: '業種と分析アプローチ' },
    { href: '/recruit', label: '採用情報', note: '学生の方はこちら' },
    { href: '/about', label: '会社概要', note: '会社情報・沿革' },
    { href: '/contact', label: 'お問い合わせ', note: '企業のお客様' },
  ];

  return (
    <>
      <PageHero
        title="ページが見つかりません"
        lead="お探しのページは移動または削除された可能性があります。以下からお探しください。"
      />

      <div className="section">
        <div className="wrap nc-doc-narrow">
          <ul className="nc-joblist">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  <span className="nc-job-cat">{link.note}</span>
                  <span className="nc-job-title">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="nc-acts nc-form-acts">
            <Link href="/" className="btn">
              トップへ戻る
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
