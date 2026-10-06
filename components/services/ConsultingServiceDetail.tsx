import Link from 'next/link';
import type { Service } from '@/lib/content';
import { PageBreadcrumbs } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';

export function ConsultingServiceDetail({ service }: { service: Service }) {
  const detail = service.consulting;
  if (!detail) return null;

  return (
    <div className="ep ep-consulting">
      <PageBreadcrumbs crumbs={[{ label: '事業内容', href: '/services' }, { label: service.title }]} />

      <section className="ep-c-hero" aria-labelledby="ep-c-title">
        <div className="ep-wrap ep-c-hero-inner">
          <div className="ep-c-hero-copy">
            <span className="ep-overline">Consulting / 01</span>
            <h1 id="ep-c-title">コンサルティング<span className="ep-c-hero-dot">.</span></h1>
            <p>{service.lead}</p>
            <Link href="/contact/" className="ep-text-link ep-text-link-light">相談する <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="ep-c-hero-visual" role="img" aria-label="夜の都市とビジネスの風景">
            <span>Purpose → Insight → Action</span>
          </div>
          <div className="ep-c-hero-bottom">
            <span>経営と事業の、判断を支える。</span>
            <span>Scroll to explore <i aria-hidden="true">↓</i></span>
          </div>
        </div>
      </section>

      <section className="ep-section ep-c-vision" aria-labelledby="ep-c-vision-title">
        <div className="ep-wrap">
          <div className="ep-c-vision-intro">
            <span className="ep-overline">目指す姿</span>
            <h2 id="ep-c-vision-title">{detail.vision.title}</h2>
          </div>
          <div className="ep-c-values">
            {detail.vision.values.map((value) => (
              <article key={value.no}>
                <span>{value.en}</span>
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
              <span className="ep-overline">主な支援テーマ</span>
              <h2 id="ep-c-themes-title">経営課題を、<br />具体的な問いに。</h2>
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
          <div className="ep-c-method-heading">
            <span className="ep-overline">問題解決の考え方</span>
            <h2 id="ep-c-method-title">{detail.principles.lead}</h2>
          </div>
          <div className="ep-c-method-steps">
            {detail.principles.items.map((item) => (
              <article key={item.no}>
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
              <span className="ep-overline">支援事例</span>
              <h2 id="ep-c-cases-title">課題から、<br />判断材料まで。</h2>
            </div>
            <p>{detail.cases.lead}</p>
          </header>
          <div className="ep-c-case-list">
            {detail.cases.items.map((item) => (
              <article key={item.no}>
                <div className="ep-c-case-main">
                  <span className="ep-overline">Case {item.no}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </div>
                <div className="ep-c-case-detail">
                  <div><span>課題</span><p>{item.issue.join('／')}</p></div>
                  <div><span>アプローチ</span><p>{item.approach.join('／')}</p></div>
                  <div><span>示唆・アウトプット</span><p>{item.insight.join('／')}</p></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ep-section ep-c-proof" aria-labelledby="ep-c-proof-title">
        <div className="ep-wrap">
          <div className="ep-c-proof-top">
            <div>
              <span className="ep-overline">支援実績</span>
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
            <Link href="/works/" className="ep-text-link">支援実績を見る <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="ep-section ep-c-formats" aria-labelledby="ep-c-formats-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <div>
              <span className="ep-overline">支援形態</span>
              <h2 id="ep-c-formats-title">案件に合わせて、<br />体制を組む。</h2>
            </div>
            <p>{detail.formats.lead}</p>
          </header>
          <div className="ep-c-format-list">
            {detail.formats.items.map((format) => (
              <article key={format.no}>
                <div><span>{format.role}</span><h3>{format.title}</h3></div>
                <p>{format.body}</p>
                <div className="ep-c-format-chain">{format.chain.map((node, index) => (
                  <span key={`${node}-${index}`}>{index > 0 ? <i aria-hidden="true">→</i> : null}{node}</span>
                ))}</div>
              </article>
            ))}
          </div>
          <p className="ep-c-pricing-note">{service.pricingNote}</p>
        </div>
      </section>

      <section className="ep-section ep-faq" aria-labelledby="ep-c-faq-title">
        <div className="ep-wrap ep-faq-inner">
          <div><span className="ep-overline">よくある質問</span><h2 id="ep-c-faq-title">相談の前に。</h2></div>
          <div className="ep-faq-list">
            {service.faq.map((item) => <details key={item.q}><summary>{item.q}<span aria-hidden="true">＋</span></summary><p>{item.a}</p></details>)}
          </div>
        </div>
      </section>

      <ContactCta
        title="何を判断したいか、からご相談ください。"
        body="テーマや支援範囲が未整理でも構いません。課題の整理からご一緒します。"
        primary={{ label: '相談する', href: '/contact/' }}
        secondary={{ label: '他の事業を見る', href: '/services/' }}
      />
    </div>
  );
}
