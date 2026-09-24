import type { Service } from '@/lib/content';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { TableOfContents, type TocItem } from '@/components/toc/TableOfContents';

/**
 * コンサルティング事業詳細（要件定義書 6.3）。
 *
 * 構成の出典は「コンサルティング事業_紹介資料.pptx」(2026-09-25 受領):
 *   目指す姿(S5) → 問題解決の考え方(S7) → 主な支援テーマ(S8) → 支援実績(S6)
 *   → 事例(S10-12) → 成果物イメージ(S13-14) → 支援形態(S9) → 価格(S15)
 * これに既存の 進め方 / 想定期間・体制 / よくある質問 を続ける。
 *
 * 内容は service.consulting に持たせているため、文言修正は
 * content/services/01-consulting.json だけで完結する。
 */
export function ConsultingServiceDetail({ service }: { service: Service }) {
  const detail = service.consulting;
  // 拡張ブロックが無い場合でもページを壊さない（build 時は audit-content が検出する）
  if (!detail) return null;

  const toc: TocItem[] = [
    { id: 'vision', label: '目指す姿' },
    { id: 'principles', label: '問題解決の考え方' },
    { id: 'themes', label: '主な支援テーマ' },
    { id: 'record', label: '支援実績' },
    { id: 'cases', label: '支援事例' },
    { id: 'outputs', label: '成果物イメージ' },
    { id: 'formats', label: '支援形態' },
    { id: 'price', label: 'なぜこの価格か' },
    { id: 'steps', label: '進め方' },
    { id: 'engagement', label: '想定期間・体制' },
    { id: 'faq', label: 'よくある質問' },
  ];

  return (
    <div className="nc-consulting-page">
      <PageHero
        eyebrow="Management consulting"
        title={service.title}
        lead={service.lead}
        crumbs={[{ label: '事業内容', href: '/services' }, { label: service.title }]}
      />

      <div className="nc-consulting-content">
        <section className="section nc-consulting-vision" id="vision" aria-labelledby="vision-title">
          <div className="wrap">
            <header className="nc-consulting-section-head">
              <span>Our aim</span>
              <h2 id="vision-title">{detail.vision.title}</h2>
            </header>
            <dl className="nc-consulting-values">
              {detail.vision.values.map((value) => (
                <div key={value.no}>
                  <dt>
                    <span className="nc-consulting-no">{value.no}</span>
                    {value.en}
                  </dt>
                  <dd>{value.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section nc-consulting-principles" id="principles" aria-labelledby="principles-title">
          <div className="wrap">
            <header className="nc-consulting-section-head is-dark">
              <span>How we solve</span>
              <h2 id="principles-title">問題解決の考え方</h2>
              <p>{detail.principles.lead}</p>
            </header>
            <div className="nc-consulting-principle-grid">
              {detail.principles.items.map((item) => (
                <article key={item.no}>
                  <span className="nc-consulting-no">{item.no}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="section nc-consulting-doc">
          <div className="wrap nc-doc">
            <TableOfContents items={toc} title="このページの目次" />

            <div className="nc-doc-body">
              <section id="themes" aria-labelledby="themes-title">
                <h2 id="themes-title">主な支援テーマ</h2>
                <p className="nc-consulting-note">{detail.themes.lead}</p>
                <div className="nc-consulting-theme-grid">
                  {detail.themes.items.map((theme) => (
                    <article key={theme.no}>
                      <span className="nc-consulting-no">{theme.no}</span>
                      <h3>{theme.title}</h3>
                      <p className="nc-consulting-theme-q">{theme.question}</p>
                      <ul>
                        {theme.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>

              <section id="record" aria-labelledby="record-title">
                <h2 id="record-title">支援実績</h2>
                <div className="nc-consulting-stats">
                  {detail.record.stats.map((stat) => (
                    <div key={stat.label}>
                      <strong>
                        {stat.value}
                        <em>{stat.unit}</em>
                      </strong>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                  <p>{detail.record.lead}</p>
                </div>

                <h3 className="nc-consulting-sub">支援業界</h3>
                <ul className="nc-consulting-tags">
                  {detail.record.industries.map((industry) => (
                    <li key={industry}>{industry}</li>
                  ))}
                </ul>

                <h3 className="nc-consulting-sub">支援テーマの例</h3>
                <dl className="nc-consulting-examples">
                  {detail.record.examples.map((example) => (
                    <div key={example.client}>
                      <dt>{example.client}</dt>
                      <dd>
                        <ul>
                          {example.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="nc-note">{detail.record.note}</p>
              </section>

              <section id="cases" aria-labelledby="cases-title">
                <h2 id="cases-title">支援事例</h2>
                <p className="nc-consulting-note">{detail.cases.lead}</p>
                <div className="nc-consulting-cases">
                  {detail.cases.items.map((item) => (
                    <article key={item.no}>
                      <header>
                        <span className="nc-consulting-no">{item.no}</span>
                        <h3>{item.title}</h3>
                        <p>{item.summary}</p>
                      </header>
                      <div className="nc-consulting-case-cols">
                        <div>
                          <h4>課題</h4>
                          <ul>
                            {item.issue.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4>アプローチ</h4>
                          <ul>
                            {item.approach.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4>示唆・アウトプット</h4>
                          <ul>
                            {item.insight.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section id="outputs" aria-labelledby="outputs-title">
                <h2 id="outputs-title">成果物イメージ</h2>
                <p className="nc-consulting-note">{detail.outputs.lead}</p>
                <dl className="nc-consulting-outputs">
                  {detail.outputs.items.map((output) => (
                    <div key={output.title}>
                      <dt>{output.title}</dt>
                      <dd>{output.body}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section id="formats" aria-labelledby="formats-title">
                <h2 id="formats-title">支援形態</h2>
                <p className="nc-consulting-note">{detail.formats.lead}</p>
                <ol className="nc-consulting-formats">
                  {detail.formats.items.map((format) => (
                    <li key={format.no}>
                      <span className="nc-consulting-no">{format.no}</span>
                      <div>
                        <h3>{format.title}</h3>
                        <small>{format.role}</small>
                        <p>{format.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section id="price" aria-labelledby="price-title">
                <h2 id="price-title">なぜ、この価格で提供できるのか</h2>
                <p className="nc-consulting-note">{detail.price.lead}</p>
                <div className="nc-consulting-reasons">
                  {detail.price.reasons.map((reason) => (
                    <article key={reason.no}>
                      <span className="nc-consulting-no">{reason.no}</span>
                      <h3>{reason.title}</h3>
                      <p>{reason.body}</p>
                    </article>
                  ))}
                </div>
                <p className="nc-note">{service.pricingNote}</p>
              </section>

              <section id="steps" aria-labelledby="steps-title">
                <h2 id="steps-title">進め方</h2>
                <ol className="nc-steps">
                  {service.steps.map((step) => (
                    <li className="nc-step" key={step.no}>
                      <div className="nc-step-n">{step.no.replace('STEP', 'Step')}</div>
                      <div className="nc-step-c">
                        <h3>{step.title}</h3>
                        <p>{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section id="engagement" aria-labelledby="engagement-title">
                <h2 id="engagement-title">想定期間・体制</h2>
                <dl className="nc-deflist">
                  {service.engagement.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section id="faq" aria-labelledby="faq-title">
                <h2 id="faq-title">よくある質問</h2>
                <dl className="nc-faq">
                  {service.faq.map((item) => (
                    <div key={item.q}>
                      <dt>{item.q}</dt>
                      <dd>{item.a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </div>
        </div>
      </div>

      <ContactCta
        title="まだ、論点が固まっていなくても大丈夫です。"
        body="「何を判断したいのか」だけお聞かせください。必要な支援の範囲と体制は、こちらから設計してご提案します。"
        primary={{ label: '相談する', href: '/contact' }}
        secondary={{ label: '他の事業を見る', href: '/services' }}
      />
    </div>
  );
}
