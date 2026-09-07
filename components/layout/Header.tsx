'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { Logo } from './Logo';
import { contactNav, globalNav } from '@/lib/site';

/**
 * グローバルヘッダー（要件定義書 5.4）
 *
 * - 「事業内容」はホバー／タップで3事業のドロップダウン
 * - 右端の「お問い合わせ」だけがボタン要素
 * - モバイルはハンバーガーメニュー
 *   （開閉アニメーションは「ユーザー操作への応答」なので 9.3 の許容範囲）
 * - ページ遷移は通常の <Link>。スムーススクロールは使わない（5.2）
 */
export function Header() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileId = useId();

  // ページ遷移したらメニューを畳む
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // モバイルメニューを開いている間は背面をスクロールさせない
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  // Esc で閉じる
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setOpenDropdown(null);
      setMobileOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function openNow(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  }

  // ポインタが項目間を横切るときのちらつきを防ぐため、閉じるのは少し遅らせる
  function closeSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  }

  function isCurrent(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="nc-header">
      <div className="wrap nc-hbar">
        <Logo />

        <nav className="nc-nav" aria-label="グローバルナビゲーション">
          <ul>
            {globalNav.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const isOpen = openDropdown === item.label;

              return (
                <li
                  key={item.label}
                  className={hasChildren ? 'nc-has-children' : undefined}
                  onMouseEnter={hasChildren ? () => openNow(item.label) : undefined}
                  onMouseLeave={hasChildren ? closeSoon : undefined}
                >
                  {hasChildren ? (
                    <>
                      <Link
                        href={item.href}
                        aria-current={isCurrent(item.href) ? 'page' : undefined}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        onFocus={() => openNow(item.label)}
                        onClick={() => setOpenDropdown(null)}
                      >
                        {item.label}
                        <svg
                          className={`nc-caret ${isOpen ? 'is-open' : ''}`}
                          width="9"
                          height="6"
                          viewBox="0 0 9 6"
                          aria-hidden="true"
                        >
                          <path
                            d="M1 1l3.5 3.5L8 1"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                        </svg>
                      </Link>
                      <div className={`nc-dropdown ${isOpen ? 'is-open' : ''}`}>
                        <ul>
                          {item.children?.map((child) => (
                            <li key={child.href}>
                              <Link href={child.href}>
                                <span className="nc-dd-num">{child.note}</span>
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <Link href={contactNav.href} className="btn nc-contact-btn">
          {contactNav.label}
        </Link>

        <button
          type="button"
          className="nc-burger"
          aria-expanded={mobileOpen}
          aria-controls={mobileId}
          aria-label={mobileOpen ? 'メニューを閉じる' : 'メニューを開く'}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className={mobileOpen ? 'is-open' : ''} />
        </button>
      </div>

      <div id={mobileId} className={`nc-mobile ${mobileOpen ? 'is-open' : ''}`} hidden={!mobileOpen}>
        <nav className="wrap" aria-label="モバイルナビゲーション">
          <ul>
            {globalNav.map((item) => (
              <li key={item.label}>
                <Link href={item.href}>{item.label}</Link>
                {item.children?.length ? (
                  <ul className="nc-mobile-sub">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href}>
                          <span className="nc-dd-num">{child.note}</span>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <Link href={contactNav.href} className="btn nc-mobile-cta">
            {contactNav.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
