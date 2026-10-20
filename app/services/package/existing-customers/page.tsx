import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBreadcrumbs } from '@/components/shared/PageHero';
import { InteractiveHoverLink } from '@/components/ui/interactive-hover-button';
import { createPageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';
import content from '@/content/service-pages/existing-customers.json';
import { ReportVisual } from './ReportVisual';
import { ReportGallery } from './ReportGallery';
import styles from './page.module.css';

const pathname = '/services/package/existing-customers/';

export const metadata: Metadata = createPageMetadata({
  title: content.seoTitle,
  description: content.seoDescription,
  ogAlt: '既存顧客企業クローズアップ｜Neunon Consulting',
}, pathname);

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: '既存顧客企業クローズアップ',
  description: content.seoDescription,
  serviceType: '既存顧客の企業調査・分析',
  provider: { '@type': 'Organization', name: site.name, url: site.url },
  areaServed: { '@type': 'Country', name: '日本' },
  url: `${site.url}${pathname}`,
};

export default function ExistingCustomersPage() {
  return <div className={styles.page}>
    <PageBreadcrumbs crumbs={[{ label: '事業内容', href: '/services/' }, { label: 'パッケージ型支援', href: '/services/package/' }, { label: '既存顧客企業クローズアップ' }]} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd).replace(/</g, '\\u003c') }} />

    <section className={styles.hero} aria-labelledby="existing-customers-title">
      <div className={styles.wrap}>
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <p className={styles.heroOverline}>パッケージ型支援 ／ 既存顧客企業クローズアップ</p>
            <h1 id="existing-customers-title">既存顧客を深く知り、<br /><em>次の提案機会を見つける。</em></h1>
            <p className={styles.heroLead}>{content.heroLead}</p>
            <div className={styles.heroActions}>
              <InteractiveHoverLink href="/contact/" text="調査・見積りを相談する" className="is-light" data-cta-location="existing-customers-hero" />
              <a href="#report-samples" className={styles.anchorLink}>成果物のサンプルを見る <span aria-hidden="true">↘</span></a>
            </div>
            <p className={styles.heroFoot}>1社から相談可能 <span aria-hidden="true">／</span> 調査から提案仮説まで</p>
          </div>
          <div className={styles.heroArt} aria-label="架空の企業分析レポートのプレビュー">
            <div className={`${styles.heroSheet} ${styles.heroSheetBack}`}><ReportVisual kind="products" /></div>
            <div className={`${styles.heroSheet} ${styles.heroSheetFront}`}><ReportVisual kind="overview" /></div>
            <span className={styles.heroArtNote}>実在企業の情報を含まない架空サンプル</span>
          </div>
        </div>
      </div>
    </section>

    <section className={`${styles.section} ${styles.painSection}`} aria-labelledby="pain-title">
      <div className={styles.wrap}>
        <div className={styles.splitHead}><h2 id="pain-title">取引があることと、<br />顧客を知っていることは違う。</h2><p>深耕営業の起点となるのは、取引履歴だけでは見えない顧客の事業と変化です。</p></div>
        <div className={styles.painList}>{content.pains.map((pain, i) => <article key={pain.title}><span className={styles.index}>0{i + 1}</span><h3>{pain.title}</h3><p>{pain.body}</p></article>)}</div>
        <p className={styles.painBottom}>点在する情報を、<strong>次の提案を考えるための顧客理解</strong>へ。</p>
      </div>
    </section>

    <section className={`${styles.section} ${styles.processSection}`} aria-labelledby="process-title">
      <div className={styles.wrap}>
        <div className={styles.splitHead}><h2 id="process-title">企業調査を、営業の次の一手まで。</h2><p>情報の収集で終わらせず、顧客の変化と貴社の提供価値をつなぐ仮説へ。確認できた事実と、検証が必要な仮説は明確に分けます。</p></div>
        <ol className={styles.processTrack}>{content.process.map((step, i) => <li key={step.title}><span className={styles.processNumber}>{String(i + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>
      </div>
    </section>

    <section className={`${styles.section} ${styles.scopeSection}`} aria-labelledby="scope-title">
      <div className={styles.wrap}>
        <div className={styles.splitHead}><h2 id="scope-title">既存顧客の何を調べるのか。</h2><p>事業の全体像から現在の取引の外側まで、営業の問いに沿って調査項目を設計します。</p></div>
        <div className={styles.scopeGrid}>{content.scope.map((group, i) => <div className={styles.scopeGroup} key={group.group}><span className={styles.index}>0{i + 1}</span><h3>{group.group}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div>
        <p className={styles.note}>公開情報で確認できない事項や、対象企業ごとに取得可能性が異なる事項は事前に確認します。調査範囲は目的に応じて調整可能です。</p>
      </div>
    </section>

    <section className={`${styles.section} ${styles.sampleSection}`} id="report-samples" aria-labelledby="samples-title">
      <div className={styles.wrap}>
        <div className={styles.splitHead}><h2 id="samples-title">調べた結果が、<br />営業で使える資料になる。</h2><p>事業構成から提案仮説まで、一社の企業分析をどう組み立てるか。各ページをクリックすると拡大できます。</p></div>
        <ReportGallery />
        <div className={styles.sampleBottom}><p>図表・企業・構成比は説明用の架空サンプルです。実際の納品資料は対象と調査範囲に合わせて設計します。</p><InteractiveHoverLink href="/contact/" text="成果物について相談する" data-cta-location="existing-customers-samples" /></div>
      </div>
    </section>

    <section className={`${styles.section} ${styles.useSection}`} aria-labelledby="use-title">
      <div className={styles.wrap}>
        <div className={styles.splitHead}><h2 id="use-title">こんな営業の場面に。</h2><p>特定の業界に限定せず、既存顧客への提案を深めたいBtoB企業で活用できます。以下は想定例です。</p></div>
        <div className={styles.useGrid}>{content.useCases.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
      </div>
    </section>

    <section className={`${styles.section} ${styles.strengthSection}`} aria-labelledby="strength-title">
      <div className={styles.wrap}>
        <div className={styles.splitHead}><h2 id="strength-title">調査品質と、<br />営業での使いやすさを両立する。</h2><p>依頼しやすい仕組みより先に、資料として何を判断できるかを重視します。</p></div>
        <div className={styles.strengthList}>{content.strengths.map((item, i) => <article key={item.title}><span className={styles.index}>0{i + 1}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
        <div className={styles.relatedLinks}><Link href="/services/package/">パッケージ型支援の全体を見る <span aria-hidden="true">↗</span></Link><Link href="/works/">公開中の支援実績を見る <span aria-hidden="true">↗</span></Link></div>
      </div>
    </section>

    <section className={`${styles.section} ${styles.deliverySection}`} aria-labelledby="delivery-title">
      <div className={styles.wrap}>
        <div className={styles.splitHead}><h2 id="delivery-title">ご相談から納品まで。</h2><p>最初に対象と目的を揃え、必要な範囲を決めてから調査に入ります。</p></div>
        <ol className={styles.deliveryList}>{content.delivery.map((item, i) => <li key={item.title}><span>{String(i + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.body}</p></li>)}</ol>
      </div>
    </section>

    <section className={`${styles.section} ${styles.pricingSection}`} aria-labelledby="pricing-title">
      <div className={styles.wrap}><div className={styles.pricingInner}><div><h2 id="pricing-title">1社から、必要な範囲で。</h2><p>まずは対象企業を1社指定してご相談いただけます。調査項目・分析の深さ・成果物の形式を確認し、範囲と料金、納期を個別にご案内します。複数社の比較や継続的な更新もご相談ください。</p></div><InteractiveHoverLink href="/contact/" text="対象企業について相談する" data-cta-location="existing-customers-pricing" /></div></div>
    </section>

    <section className={`${styles.section} ${styles.faqSection}`} aria-labelledby="faq-title">
      <div className={styles.wrap}><div className={styles.splitHead}><h2 id="faq-title">よくあるご質問。</h2><p>調査範囲や納品形式など、依頼前に確認したい点をまとめました。</p></div><div className={styles.faqList}>{content.faq.map((item) => <details key={item.q}><summary>{item.q}<span aria-hidden="true">＋</span></summary><p>{item.a}</p></details>)}</div></div>
    </section>

    <section className={styles.finalCta} aria-labelledby="final-title"><div className={styles.wrap}><div className={styles.finalInner}><div><h2 id="final-title">次に知るべき顧客から、<br />一社ずつ。</h2><p>対象企業名だけでも構いません。調査したい観点がまだ定まっていない場合も、まずはご相談ください。</p></div><InteractiveHoverLink href="/contact/" text="既存顧客の分析を相談する" className="is-light" data-cta-location="existing-customers-final" /></div></div></section>
  </div>;
}
