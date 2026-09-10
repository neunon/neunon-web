import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { FormShell } from '@/components/forms/FormShell';
import { contactFields, formEndpoints } from '@/lib/forms';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description:
    '企業のお客様向けのお問い合わせフォーム。スポット業務や小さなご相談からお受けします。',
  alternates: { canonical: '/contact' },
};

/**
 * 企業向け問い合わせ（要件定義書 6.8）。
 * 学生向けは /entry に分けている。
 */
export default function ContactPage() {
  return (
    <>
      <PageHero
        title="お問い合わせ"
        lead="スポット業務や小さなご相談からお受けします。何を調べるべきかが決まっていない段階でも歓迎です。"
        crumbs={[{ label: 'お問い合わせ' }]}
      />

      <div className="section">
        <div className="wrap nc-formwrap">
          <div className="nc-formside">
            <div className="nc-notice">
              <p>
                <b>学生の方はこちら</b>
              </p>
              <p>
                採用へのご応募は
                <Link href="/entry" className="nc-inline-link">
                  エントリーフォーム
                </Link>
                からお願いします。
              </p>
              <Link href="/entry" className="btn nc-contact-entry">
                学生エントリーへ
              </Link>
            </div>

            <dl className="nc-deflist nc-contactinfo">
              <div>
                <dt>返信</dt>
                <dd>
                  当日〜翌営業日にメールでご連絡します。<br />
                  <a href={`mailto:${site.email}`} className="nc-inline-link">{site.email}</a>
                </dd>
              </div>
              <div>
                <dt>電話</dt>
                <dd>
                  <a href={`tel:${site.tel.replace(/-/g, '')}`} className="nc-inline-link">
                    {site.tel}
                  </a>
                  <br />
                  内容の整理のため、フォームからのご連絡を推奨しています。
                </dd>
              </div>
              <div>
                <dt>所在地</dt>
                <dd>
                  {site.address.head}
                </dd>
              </div>
            </dl>
          </div>

          <div className="nc-formmain">
            <FormShell
              fields={contactFields}
              endpoint={formEndpoints.contact}
              thanksPath="/contact/thanks"
              subject="【サイト】企業からのお問い合わせ"
              submitLabel="この内容で送信する"
              envName="NEXT_PUBLIC_CONTACT_FORM_ENDPOINT"
            />
          </div>
        </div>
      </div>
    </>
  );
}
