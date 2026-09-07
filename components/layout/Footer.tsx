import Link from 'next/link';
import { Logo } from './Logo';
import { footerNav, site } from '@/lib/site';

/**
 * グローバルフッター。
 * 要件定義書 12.1 の発注者判断により、所在地（本店・事業所）と電話番号を掲載する。
 * ただし問い合わせの主導線はフォームとする。
 */
export function Footer() {
  return (
    <footer className="nc-footer">
      <div className="wrap">
        <div className="nc-fgrid">
          <div>
            <Logo className="nc-flogo" />
            <address className="nc-fmeta">
              {site.name}
              <br />
              【本店】{site.address.head}
              <br />
              【事業所】{site.address.office}
              <br />
              TEL{' '}
              <a href={`tel:${site.tel.replace(/-/g, '')}`} className="nc-flink">
                {site.tel}
              </a>
            </address>
            <p className="nc-fnote">
              お問い合わせは
              <Link href="/contact" className="nc-flink">
                フォーム
              </Link>
              からお願いします。
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.heading}>
              <h2 className="nc-fhead">{group.heading}</h2>
              <ul>
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="nc-fbot">
          <span>© {new Date().getFullYear()} Neunon Consulting, Inc.</span>
          <span>{site.domain}</span>
        </div>
      </div>
    </footer>
  );
}
