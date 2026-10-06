import Link from 'next/link';
import type { Service } from '@/lib/content';
import { PageBreadcrumbs } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';

const journey = [
  { title: '調べる', body: '市場・企業・競合の公開情報を、目的に合わせて集める。' },
  { title: '読み解く', body: '比較・構造化し、変化や事業上の意味を捉える。' },
  { title: '使える形に', body: '優先順位や提案の論点まで、資料にまとめる。' },
];

export function PackageServiceDetail({ service }: { service: Service }) {
  const faq = service.faq.filter((item) => !item.q.includes('価格'));

  return (
    <div className="ep ep-package">
      <PageBreadcrumbs crumbs={[{ label: '事業内容', href: '/services' }, { label: service.title }]} />

      <section className="ep-p-hero" aria-labelledby="ep-p-title">
        <div className="ep-wrap ep-p-hero-inner">
          <div className="ep-p-hero-copy">
            <span className="ep-overline">Package support / 02</span>
            <h1 id="ep-p-title">パッケージ型<br />支援<span>.</span></h1>
            <p>{service.lead}</p>
            <div className="ep-p-hero-actions">
              <Link href="/contact/" className="ep-pill-link">調査を相談する <span aria-hidden="true">↗</span></Link>
              <a href="#ep-p-menu-title" className="ep-text-link">メニューを見る <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="ep-p-report" aria-label="成果物の構成イメージ">
            <div className="ep-p-report-sheet ep-p-report-back" aria-hidden="true" />
            <div className="ep-p-report-sheet ep-p-report-front">
              <div className="ep-p-report-top"><span>Research brief</span><span>NEUNON / SAMPLE</span></div>
              <strong>調査から、<br />判断へ。</strong>
              <div className="ep-p-report-rule" />
              <div className="ep-p-report-graphic" aria-hidden="true"><i /><i /><i /><i /><i /></div>
              <div className="ep-p-report-foot"><span>市場・企業・競合</span><span>分析 / 示唆 / 資料化</span></div>
            </div>
          </div>
        </div>
        <div className="ep-wrap ep-p-hero-foot"><span>1件・1案件から</span><span>経験者が成果物を確認</span><span>継続的な観測にも対応</span></div>
      </section>

      <section className="ep-section ep-p-journey" aria-labelledby="ep-p-journey-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <div><span className="ep-overline">提供する価値</span><h2 id="ep-p-journey-title">情報を集めて、<br />終わらせない。</h2></div>
            <p>調査対象と用途を先に決め、収集から分析、社内で使える資料化までを一続きで進めます。</p>
          </header>
          <div className="ep-p-journey-track">
            {journey.map((step, index) => <article key={step.title}>
              <span>0{index + 1}</span><h3>{step.title}</h3><p>{step.body}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="ep-section ep-p-menu" aria-labelledby="ep-p-menu-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <div><span className="ep-overline">調査メニュー</span><h2 id="ep-p-menu-title">必要なテーマを、<br />必要な範囲で。</h2></div>
            <p>{service.summary} メニューを起点に、対象や観点を調整できます。</p>
          </header>
          <div className="ep-p-menu-list">
            {service.menu.map((item) => <details key={item.name} name="package-menu">
              <summary><h3>{item.name}</h3><span>{item.body}</span><i aria-hidden="true">↗</i></summary>
              <div className="ep-p-menu-expanded">
                <div><strong>想定する課題</strong><p>{item.issue}</p></div>
                <div><strong>得られるもの</strong><p>{item.effect}</p></div>
              </div>
            </details>)}
          </div>
          <p className="ep-p-menu-help">どれに当てはまるか分からない場合も、調査したい対象だけお聞かせください。</p>
        </div>
      </section>

      {service.examples?.length ? <section className="ep-section ep-p-output" aria-labelledby="ep-p-output-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <div><span className="ep-overline">成果物イメージ</span><h2 id="ep-p-output-title">報告の先にある、<br />次の判断まで。</h2></div>
            <p>以下は納品資料の構成例です。実際の企業名・数値・納品物は守秘のため掲載していません。</p>
          </header>
          <div className="ep-p-output-grid">
            {service.examples.map((example, index) => <article key={example.title}>
              <div className="ep-p-output-cover"><span>RESEARCH / 0{index + 1}</span><h3>{example.title}</h3><div className="ep-p-output-lines" aria-hidden="true"><i /><i /><i /></div></div>
              <div className="ep-p-output-copy"><p>{example.body}</p><strong>{example.takeaway}</strong></div>
            </article>)}
          </div>
        </div>
      </section> : null}

      <section className="ep-section ep-p-benefits" aria-labelledby="ep-p-benefits-title">
        <div className="ep-wrap ep-p-benefits-inner">
          <div><span className="ep-overline">導入後の変化</span><h2 id="ep-p-benefits-title">調べる仕事を、<br />前に進む仕事へ。</h2></div>
          <div className="ep-p-benefit-list">
            <article><h3>検討の幅が広がる</h3><p>工数の制約で調べきれなかった企業や市場まで検討できます。</p></article>
            <article><h3>提案の質が変わる</h3><p>事実を横断して、営業機会や競争上の論点を見いだします。</p></article>
            <article><h3>変化を追い続けられる</h3><p>市場・競合・取引先を定期的に見直し、判断の前提を更新します。</p></article>
          </div>
        </div>
      </section>

      <section className="ep-section ep-p-process" aria-labelledby="ep-p-process-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <div><span className="ep-overline">進め方</span><h2 id="ep-p-process-title">小さな依頼から、<br />始められます。</h2></div>
            <p>対象が1社だけでも構いません。納品物をご確認いただいてから、継続の要否を判断できます。</p>
          </header>
          <ol>{(service.steps ?? []).map((step) => <li key={step.no}><span>{step.no.replace('STEP ', '')}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>
        </div>
      </section>

      <section className="ep-section ep-faq" aria-labelledby="ep-p-faq-title">
        <div className="ep-wrap ep-faq-inner">
          <div><span className="ep-overline">よくある質問</span><h2 id="ep-p-faq-title">依頼の前に。</h2></div>
          <div className="ep-faq-list">{faq.map((item) => <details key={item.q}><summary>{item.q}<span aria-hidden="true">＋</span></summary><p>{item.a}</p></details>)}</div>
        </div>
      </section>

      <ContactCta title="まずは、1件から。" body="調べたい企業やテーマをお聞かせください。対象の選定からもご相談いただけます。" primary={{ label: '調査を相談する', href: '/contact/' }} secondary={{ label: '他の事業を見る', href: '/services/' }} />
    </div>
  );
}
