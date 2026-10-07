import type { Service } from '@/lib/content';
import { PageBreadcrumbs } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { InteractiveHoverLink } from '@/components/ui/interactive-hover-button';
import { PackagePreviewVisual } from './ServiceVisuals';

export function PackageServiceDetail({ service }: { service: Service }) {
  const detail = service.packageDetail;
  if (!detail) return null;
  return (
    <div className="ep ep-package">
      <PageBreadcrumbs crumbs={[{ label: '事業内容', href: '/services' }, { label: service.title }]} />

      <section className="ep-p-hero" aria-labelledby="ep-p-title">
        <div className="ep-wrap ep-p-hero-inner">
          <div className="ep-p-hero-copy">
            <h1 id="ep-p-title">パッケージ型<br />支援</h1>
            <p>{service.lead}</p>
            <div className="ep-p-hero-actions">
              <InteractiveHoverLink href="/contact/" text="調査を相談する" />
              <InteractiveHoverLink href="#ep-p-menu-title" text="メニューを見る" className="is-outline" />
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
      </section>

      <section className="ep-section ep-p-journey" aria-labelledby="ep-p-journey-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <div><h2 id="ep-p-journey-title">{detail.journeyTitle}</h2></div>
            <p>{detail.journeyIntro}</p>
          </header>
          <div className="ep-p-journey-track">
            {detail.journey.map((step, index) => <article key={step.title}>
              <span>0{index + 1}</span><h3>{step.title}</h3><p>{step.body}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="ep-section ep-p-menu" aria-labelledby="ep-p-menu-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <div><h2 id="ep-p-menu-title">主な支援メニュー</h2></div>
            <p>{service.summary} メニューを起点に、対象や観点を調整できます。</p>
          </header>
          <div className="ep-p-menu-list">
            {service.menu.map((item) => <details key={item.name} name="package-menu">
              <summary><h3>{item.name}</h3><span>{item.body}</span><span className="ep-c-theme-plus" aria-hidden="true">＋</span></summary>
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
            <div><h2 id="ep-p-output-title">報告の先にある、<br />次の判断まで。</h2></div>
            <p>以下は納品資料の構成例です。実際の企業名・数値・納品物は守秘のため掲載していません。</p>
          </header>
          <div className="ep-p-output-grid">
            {service.examples.map((example, index) => <article key={example.title}>
              <div className="ep-p-output-cover"><h3>{example.title}</h3><PackagePreviewVisual index={index} /></div>
              <div className="ep-p-output-copy"><p>{example.body}</p><strong>{example.takeaway}</strong></div>
            </article>)}
          </div>
        </div>
      </section> : null}

      <section className="ep-section ep-p-benefits" aria-labelledby="ep-p-benefits-title">
        <div className="ep-wrap">
          <header className="ep-split-head"><h2 id="ep-p-benefits-title">{detail.benefitsTitle}</h2><p>{detail.benefitsIntro}</p></header>
          <div className="ep-p-benefit-groups">
            <div className="ep-p-benefit-list"><h3>{detail.benefitGroupTitles[0]}</h3><div>{detail.outcomes.slice(0, 3).map((outcome, index) => <article key={outcome.title}><div className="ep-p-benefit-name"><span>0{index + 1}.</span><h4>{outcome.title}</h4></div><ul>{outcome.body.map((line) => <li key={line}>{line}</li>)}</ul></article>)}</div></div>
            <div className="ep-p-benefit-list"><h3>{detail.benefitGroupTitles[1]}</h3><div>{detail.outcomes.slice(3).map((outcome, index) => <article key={outcome.title}><div className="ep-p-benefit-name"><span>0{index + 4}.</span><h4>{outcome.title}</h4></div><ul>{outcome.body.map((line) => <li key={line}>{line}</li>)}</ul></article>)}</div></div>
          </div>
        </div>
      </section>

      {service.showPricing && service.pricing.length > 0 ? (
        <section className="ep-section ep-p-pricing" aria-labelledby="ep-p-pricing-title">
          <div className="ep-wrap">
            <header className="ep-split-head">
              <h2 id="ep-p-pricing-title">小さな単位から、<br />料金を見通せる。</h2>
              <p>定型の調査を必要な件数から。下記は価格の目安です。対象や調査範囲に合わせてお見積りします。</p>
            </header>
            <div className="ep-p-pricing-grid">
              {service.pricing.map((row) => <div className="ep-p-pricing-row" key={row.label}><span>{row.label}</span><strong>{row.price}</strong></div>)}
            </div>
            <p className="ep-pricing-note">{service.pricingNote}</p>
            <InteractiveHoverLink href="/contact/" text="見積りを相談する" className="is-outline" />
          </div>
        </section>
      ) : null}

      <section className="ep-section ep-faq" aria-labelledby="ep-p-faq-title">
        <div className="ep-wrap ep-faq-inner">
          <div><h2 id="ep-p-faq-title">依頼の前に。</h2></div>
          <div className="ep-faq-list">{service.faq.map((item) => <details key={item.q}><summary>{item.q}<span aria-hidden="true">＋</span></summary><p>{item.a}</p></details>)}</div>
        </div>
      </section>

      <ContactCta title={detail.ctaTitle} body={detail.ctaBody} primary={{ label: '調査を相談する', href: '/contact/' }} secondary={{ label: '他の事業を見る', href: '/services/' }} />
    </div>
  );
}
