import type { Service } from '@/lib/content';
import { PageBreadcrumbs } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { EditorialSections } from '@/components/shared/EditorialSections';
import { getExtraSections } from '@/lib/extra-sections';
import { InteractiveHoverLink } from '@/components/ui/interactive-hover-button';
import { GridPattern } from '@/components/ui/grid-pattern';
import { CaseIllustration, PriceComposition } from './ServiceVisuals';
import { SupportFormatsDiagram } from './SupportFormatsDiagram';

export function ConsultingServiceDetail({ service }: { service: Service }) {
  const detail = service.consulting;
  if (!detail) return null;

  return (
    <div className="ep ep-consulting">
      <PageBreadcrumbs crumbs={[{ label: '事業内容', href: '/services' }, { label: service.title }]} />

      <section className="ep-c-hero" aria-labelledby="ep-c-title">
        <GridPattern width={54} height={54} squares={[[8,2],[11,4],[15,3],[17,7],[10,9],[20,5],[6,10],[14,11]]} className="ep-c-hero-grid" />
        <div className="ep-wrap ep-c-hero-inner">
          <div className="ep-c-hero-copy">
            <h1 id="ep-c-title">コンサルティング</h1>
            <p>{service.lead}</p>
            <InteractiveHoverLink href="/contact/" text="相談する" />
          </div>
        </div>
      </section>

      <section className="ep-section ep-c-vision" aria-labelledby="ep-c-vision-title">
        <div className="ep-wrap">
          <div className="ep-c-vision-intro">
            <h2 id="ep-c-vision-title">{detail.vision.title}</h2>
          </div>
          <div className="ep-c-values">
            {detail.vision.values.map((value) => (
              <article key={value.no}>
                <h3>{value.en}</h3>
                <p>{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ep-section ep-c-themes" aria-labelledby="ep-c-themes-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <div>
              <h2 id="ep-c-themes-title">主な支援テーマ例</h2>
            </div>
            <p>{detail.themes.lead}</p>
          </header>
          <div className="ep-c-theme-list">
            {detail.themes.items.map((theme) => (
              <details key={theme.no} name="consulting-themes">
                <summary>
                  <span className="ep-c-theme-no">{theme.no}</span>
                  <span className="ep-c-theme-name">{theme.title}</span>
                  <span className="ep-c-theme-question">{theme.question}</span>
                  <span className="ep-c-theme-plus" aria-hidden="true">＋</span>
                </summary>
                <ul>{theme.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="ep-section ep-c-method" aria-labelledby="ep-c-method-title">
        <div className="ep-wrap ep-c-method-inner">
          <div className="ep-split-head ep-c-method-heading">
            <h2 id="ep-c-method-title">問題解決の考え方</h2>
            <p>{detail.principles.lead}</p>
          </div>
          <div className="ep-c-method-steps">
            {detail.principles.items.map((item) => (
              <article key={item.no}>
                <span className="ep-c-method-no">{item.no}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ep-section ep-c-cases" aria-labelledby="ep-c-cases-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <div>
              <h2 id="ep-c-cases-title">事例</h2>
            </div>
            <p>{detail.cases.lead}</p>
          </header>
          <div className="ep-c-case-list">
            {detail.cases.items.map((item) => (
              <article key={item.no}>
                <div className="ep-c-case-main">
                  <h3>{item.title}</h3>
                  <p>{item.no === '02' && item.summary.includes('一貫して設計') ? <>{item.summary.split('一貫して設計')[0]}<span className="ep-c-no-break">一貫して設計</span></> : item.summary}</p>
                  <div className="ep-c-case-detail">
                    <div><span>課題</span><p>{item.issue.join('／')}</p></div>
                    <div><span>アプローチ</span><p>{item.approach.join('／')}</p></div>
                    <div><span>示唆・アウトプット</span><p>{item.insight.join('／')}</p></div>
                  </div>
                </div>
                <CaseIllustration item={item} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ep-section ep-c-proof" aria-labelledby="ep-c-proof-title">
        <div className="ep-wrap">
          <div className="ep-c-proof-top">
            <div>
              <h2 id="ep-c-proof-title">{detail.record.heading}</h2>
              <p>{detail.record.lead}</p>
            </div>
            <div className="ep-c-proof-stats">
              {detail.record.stats.map((stat) => (
                <div key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}<small>{stat.unit}</small></strong>
                </div>
              ))}
              <p>{detail.record.note}</p>
            </div>
          </div>
          <div className="ep-c-proof-bottom">
            <p>{detail.record.industryLead}</p>
            <ul>{detail.record.industries.map((industry) => <li key={industry}>{industry}</li>)}</ul>
          </div>
          <div className="ep-c-proof-examples">
            {detail.record.examples.map((example) => <article key={example.client}><h3>{example.client}</h3><p>{example.items.join('、')}</p></article>)}
          </div>
          <InteractiveHoverLink href="/works/" text="支援実績を見る" className="is-outline ep-c-proof-link" />
        </div>
      </section>

      <section className="ep-section ep-c-formats" aria-labelledby="ep-c-formats-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <div>
              <h2 id="ep-c-formats-title">4つの支援形態</h2>
            </div>
            <p>{detail.formats.lead}</p>
          </header>
          <SupportFormatsDiagram />
        </div>
      </section>

      <section className="ep-section ep-c-pricing" aria-labelledby="ep-c-pricing-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <h2 id="ep-c-pricing-title">品質を担保し、<br />費用を抑える仕組み。</h2>
            <p>{detail.price.lead}</p>
          </header>
          <div className="ep-c-pricing-layout">
            <PriceComposition chart={detail.price.chart} />
            <div className="ep-c-pricing-reasons">
              {detail.price.reasons.map((reason) => <article key={reason.no}><h3>{reason.title}</h3><p>{reason.body}</p></article>)}
            </div>
          </div>
          <InteractiveHoverLink href="/contact/" text="見積りを相談する" className="is-outline" />
        </div>
      </section>

      <section className="ep-section ep-faq" aria-labelledby="ep-c-faq-title">
        <div className="ep-wrap ep-faq-inner">
          <div><h2 id="ep-c-faq-title">相談の前に。</h2></div>
          <div className="ep-faq-list">
            {service.faq.map((item) => <details key={item.q}><summary>{item.q}<span aria-hidden="true">＋</span></summary><p>{item.a}</p></details>)}
          </div>
        </div>
      </section>

      <EditorialSections sections={getExtraSections('consulting')} />
      <ContactCta
        title="何を判断したいか、からご相談ください。"
        body="テーマや支援範囲が未整理でも構いません。課題の整理からご一緒します。"
        primary={{ label: '相談する', href: '/contact/' }}
        secondary={{ label: '他の事業を見る', href: '/services/' }}
      />
    </div>
  );
}
