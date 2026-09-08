import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { TableOfContents, type TocItem } from '@/components/toc/TableOfContents';
import { contactFields, entryFields } from '@/lib/forms';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: `${site.name}における個人情報の取り扱いについて。取得する項目、利用目的、第三者提供の有無、保管期間と削除請求の方法、問い合わせ窓口。`,
  alternates: { canonical: '/privacy' },
};

/**
 * プライバシーポリシー（要件定義書 7. で「必須」/ 記載内容は 12.2）
 *
 * 12.2 の必須記載項目:
 *   取得する個人情報の項目 / 利用目的 / 第三者提供の有無 /
 *   保管期間と削除請求の方法 / 問い合わせ窓口
 *
 * ★このページは実装側が作成した案です。公開前に必ずリーガルチェックを受けること。
 *   保管期間など、会社として決める必要がある箇所は【要確認】としてある。
 */
const toc: TocItem[] = [
  { id: 'items', label: '取得する個人情報の項目' },
  { id: 'purpose', label: '利用目的' },
  { id: 'third-party', label: '第三者提供' },
  { id: 'outsourcing', label: '業務委託先への提供', level: 2 },
  { id: 'retention', label: '保管期間と削除・開示の請求' },
  { id: 'security', label: '安全管理措置' },
  { id: 'cookie', label: 'Cookie とアクセス解析' },
  { id: 'talent', label: '人材パネルへの掲載' },
  { id: 'contact-window', label: 'お問い合わせ窓口' },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="プライバシーポリシー"
        lead={`${site.name}（以下「当社」）は、当サイトを通じて取得する個人情報を以下のとおり取り扱います。`}
        crumbs={[{ label: 'プライバシーポリシー' }]}
      />

      <div className="section">
        <div className="wrap nc-doc">
          <TableOfContents items={toc} title="このページの目次" />

          <div className="nc-doc-body">
            <p className="nc-pending">
              このページは公開前の案です。
              <br />
              <span>
                実装メモ: 要件定義書 7. で必須とされているページ。記載内容は 12.2
                の項目を満たすよう実装側で起草した。
                <b>公開前に必ず顧問弁護士等のリーガルチェックを受けること。</b>
                本文中の【要確認】は会社として決める必要がある箇所。
              </span>
            </p>

            <section aria-labelledby="items">
              <h2 id="items">取得する個人情報の項目</h2>
              <p>当サイトでは、以下のフォームから個人情報を取得します。</p>

              <h3>お問い合わせフォーム（企業のお客様向け）</h3>
              <ul className="nc-checklist">
                {contactFields.map((field) => (
                  <li key={field.name}>
                    {field.label}
                    {field.required ? '' : '（任意）'}
                  </li>
                ))}
              </ul>

              <h3>エントリーフォーム（学生向け）</h3>
              <ul className="nc-checklist">
                {entryFields.map((field) => (
                  <li key={field.name}>
                    {field.label}
                    {field.required ? '' : '（任意）'}
                  </li>
                ))}
              </ul>

              <p>
                このほか、アクセス解析のために、閲覧されたページ、ブラウザの種類、参照元などの情報を取得します。これらは個人を特定できる形では取得しません。
              </p>
            </section>

            <section aria-labelledby="purpose">
              <h2 id="purpose">利用目的</h2>
              <p>取得した個人情報は、以下の目的にのみ利用します。</p>
              <ul className="nc-checklist">
                <li>お問い合わせへの回答、お見積りの提示、ご契約に関するご連絡</li>
                <li>採用選考の実施、選考結果のご連絡、採用後の業務連絡</li>
                <li>当社サービスに関するご案内（ご本人の同意がある場合に限ります）</li>
                <li>サイトの利用状況の分析と改善</li>
              </ul>
              <p>上記の目的の範囲を超えて利用する場合は、あらためてご本人の同意を得ます。</p>
            </section>

            <section aria-labelledby="third-party">
              <h2 id="third-party">第三者提供</h2>
              <p>
                当社は、以下の場合を除き、ご本人の同意なく個人情報を第三者に提供しません。
              </p>
              <ul className="nc-checklist">
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要で、本人の同意を得ることが困難な場合</li>
                <li>国の機関等の法令の定める事務の遂行に協力する必要がある場合</li>
              </ul>

              <h3 id="outsourcing">業務委託先への提供</h3>
              <p>
                フォームの送信・保管には外部サービス（Formspree）を利用しています。送信いただいた内容は同サービスを経由して当社に届きます。また、アクセス解析には解析サービスを利用します。いずれも利用目的の達成に必要な範囲でのみ取り扱わせ、適切に監督します。
              </p>
              <p className="nc-note">
                【要確認】実際に利用する解析サービス（Google Analytics または Plausible）が確定したら、サービス名とプライバシーポリシーへのリンクをここに明記すること。
              </p>
            </section>

            <section aria-labelledby="retention">
              <h2 id="retention">保管期間と削除・開示の請求</h2>
              <p>
                取得した個人情報は、利用目的の達成に必要な期間に限って保管し、期間の経過後は速やかに削除します。
              </p>
              <p className="nc-note">
                【要確認】お問い合わせ内容・エントリー内容それぞれの具体的な保管期間を会社として決め、ここに明記すること。
              </p>
              <p>
                ご本人からの求めに応じて、保有する個人情報の開示、訂正、追加、削除、利用停止に応じます。ご請求は下記の窓口までご連絡ください。ご本人であることを確認したうえで、法令に従い速やかに対応します。
              </p>
            </section>

            <section aria-labelledby="security">
              <h2 id="security">安全管理措置</h2>
              <p>
                個人情報への不正アクセス、紛失、破壊、改ざん、漏えいを防ぐため、取り扱う担当者を限定し、アクセス権限を管理しています。当サイトの通信はすべて暗号化（HTTPS）しています。
              </p>
            </section>

            <section aria-labelledby="cookie">
              <h2 id="cookie">Cookie とアクセス解析</h2>
              <p>
                当サイトでは、利用状況の把握と改善のためにアクセス解析を利用します。ブラウザの設定により Cookie
                を無効にすることができます。無効にした場合でも、サイトの閲覧に支障はありません。
              </p>
            </section>

            <section aria-labelledby="talent">
              <h2 id="talent">人材パネルへの掲載</h2>
              <p>
                <Link href="/talent" className="nc-inline-link">
                  人材パネル
                </Link>
                に掲載している登録者の情報は、あらかじめご本人の同意を得たうえで、個人が特定できない範囲に限って公開しています。実名・大学名・詳細な経歴は公開していません。
              </p>
              <p>
                掲載の停止をご希望の場合は、下記の窓口または
                <Link href="/contact" className="nc-inline-link">
                  お問い合わせフォーム
                </Link>
                からご連絡ください。確認のうえ速やかに取り下げます。
              </p>
            </section>

            <section aria-labelledby="contact-window">
              <h2 id="contact-window">お問い合わせ窓口</h2>
              <dl className="nc-deflist">
                <div>
                  <dt>事業者</dt>
                  <dd>{site.name}</dd>
                </div>
                <div>
                  <dt>所在地</dt>
                  <dd>{site.address.head}</dd>
                </div>
                <div>
                  <dt>代表者</dt>
                  <dd>{site.representative}</dd>
                </div>
                <div>
                  <dt>電話</dt>
                  <dd>
                    <a href={`tel:${site.tel.replace(/-/g, '')}`} className="nc-inline-link">
                      {site.tel}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>フォーム</dt>
                  <dd>
                    <Link href="/contact" className="nc-inline-link">
                      お問い合わせフォーム
                    </Link>
                  </dd>
                </div>
              </dl>
              <p className="nc-note">
                【要確認】個人情報に関する問い合わせ用のメールアドレスを新設し、ここに明記すること（要件定義書 14. の「代表メールアドレスの新設」と合わせて検討）。
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
