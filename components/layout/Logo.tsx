import Link from 'next/link';

export function Logo({ href = '/', className = '' }: { href?: string | null; className?: string }) {
  const mark = (
    <span className={`nc-logo ${className}`.trim()}>
      <img src="/brand-logo-transparent.png" alt="Neunon Consulting" width="378" height="189" />
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} aria-label="株式会社Neunon Consulting トップページ">
      {mark}
    </Link>
  );
}
