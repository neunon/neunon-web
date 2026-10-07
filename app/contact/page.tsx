import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { FormShell } from '@/components/forms/FormShell';
import { contactFields, formEndpoints } from '@/lib/forms';
import { site } from '@/lib/site';
import { Mail } from 'lucide-react';

export const metadata: Metadata = pageMetadata('contact', '/contact/');

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

      <div className="section nc-contact-page">
        <div className="wrap nc-formwrap">
          <div className="nc-formside">
            <span className="nc-contact-kicker">CONTACT</span>
            <h2>ご相談はこちらから</h2>
            <p className="nc-contact-intro">ご相談内容が固まっていない段階でも構いません。当日〜翌営業日にメールでご連絡します。</p>

            <dl className="nc-deflist nc-contactinfo">
              <div>
                <dt><Mail aria-hidden="true" size={19} strokeWidth={1.7} /><span>返信</span></dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="nc-inline-link">{site.email}</a>
                </dd>
              </div>
            </dl>
            <div className="nc-notice">
              <p><b>学生の方はこちら</b></p>
              <p>採用へのご応募は<Link href="/entry" className="nc-inline-link">エントリーフォーム</Link>からお願いします。</p>
              <Link href="/entry" className="btn nc-contact-entry">学生エントリーへ</Link>
            </div>
          </div>

          <div className="nc-formmain">
            <div className="nc-contact-formhead">
              <h2>お問い合わせフォーム</h2>
              <p>必要事項をご入力ください。確認画面で内容を確かめてから送信できます。</p>
            </div>
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
