import Link from 'next/link';

/**
 * ロゴ・ロックアップ。
 * 要件定義書 9.1:「細めのセリフ体で "Neunon" + 下段に "Consulting"、黒1色」
 * デザイン案 v2 のヘッダー／フッターと同じ構造。
 */
export function Logo({ href = '/', className = '' }: { href?: string | null; className?: string }) {
  const mark = (
    <span className={`nc-logo ${className}`}>
      Neunon
      <small>CONSULTING</small>
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} aria-label="株式会社Neunon Consulting トップページ">
      {mark}
    </Link>
  );
}
