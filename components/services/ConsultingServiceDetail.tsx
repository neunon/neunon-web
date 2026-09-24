import type { Service } from '@/lib/content';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { FormatDiagram, PriceChart } from '@/components/services/ConsultingDiagrams';

/**
 * コンサルティング事業詳細（要件定義書 6.3）。
 *
 * 構成の出典は「コンサルティング事業_紹介資料.pptx」(2026-09-25 受領):
 *   目指す姿(S5) → 問題解決の考え方(S7) → 主な支援テーマ(S8) → 支援実績(S6)
 *   → 事例(S10-12) → 支援形態(S9) → 価格(S15)
 *
 * 見せ方はパッケージ型支援（PackageServiceDetail）と同じ体系に揃えている:
 *   全幅セクションを明暗交互に重ね、各セクションは
 *   <header class="nc-consulting-section-head"> の英字ラベル＋見出し＋補足で始める。
 *
 * 内容は service.consulting に持たせているため、文言修正は
 * content/services/01-consulting.json だけで完結する。
 */
export function ConsultingServiceDetail({ service }: { service: Service }) {
  const detail = service.consulting;
  // 拡張ブロックが無い場合でもページを壊さない（build 時は audit-content が検出する）
  if (!detail) return null;

  return (
    <div className="nc-consulting-page">
      <PageHero
        eyebrow="Management consulting"
        title={service.title}
        lead={service.lead}
        crumbs={[{ label: '事業内容', href: '/services' }, { label: service.title }]}
      />

      <div className="nc-consulting-content">
        {/* ---------- 目指す姿 ---------- */}
        <section className="nc-consulting-opening" aria-labelledby="consulting-aim-title">
          <div className="wrap">
            <div className="nc-consulting-opening-copy">
              <span className="nc-consulting-kicker">Our aim</span>
              <h2 id="consulting-aim-title">{detail.vision.title}</h2>
              <p>{detail.themes.lead}</p>
            </div>
            <dl className="nc-consulting-values">
              {detail.vision.values.map((value) => (
                <div key={value.no}>
                  <dt>{value.en}</dt>
                  <dd>{value.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- こういう課題に使えます ---------- */}
        <section className="section nc-consulting-use" aria-labelledby="consulting-use-title">
          <div className="wrap">
            <header className="nc-consulting-section-head">
              <span>Where it helps</span>
              <h2 id="consulting-use-title">こういう課題に使えます</h2>
            </header>
            <div className="nc-consulting-use-grid">
              {service.useCases.map((useCase, index) => (
                <article key={useCase}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{useCase}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 問題解決の考え方（暗転） ---------- */}
        <section className="section nc-consulting-principles" aria-labelledby="consulting-principles-title">
          <div className="wrap">
            <header className="nc-consulting-section-head is-light">
              <span>How we solve</span>
              <h2 id="consulting-principles-title">問題解決の考え方</h2>
              <p>{detail.principles.lead}</p>
            </header>
            <div className="nc-consulting-principle-grid">
              {detail.principles.items.map((item) => (
                <article key={item.no}>
                  <span>{item.no}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 主な支援テーマ ---------- */}
        <section className="section nc-consulting-themes" aria-labelledby="consulting-themes-title">
          <div className="wrap">
            <header className="nc-consulting-section-head">
              <span>Support themes</span>
              <h2 id="consulting-themes-title">意思決定のテーマから、支援を組み立てる。</h2>
              <p>{detail.themes.lead}</p>
            </header>
            <div className="nc-consulting-theme-grid">
              {detail.themes.items.map((theme) => (
                <article key={theme.no}>
                  <div className="nc-consulting-theme-meta">
                    <span>{theme.no}</span>
                    <h3>{theme.title}</h3>
                  </div>
                  <p className="nc-consulting-theme-q">{theme.question}</p>
                  <ul>
                    {theme.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 支援実績 ---------- */}
        <section className="section nc-consulting-record" aria-labelledby="consulting-record-title">
          <div className="wrap">
            <header className="nc-consulting-section-head">
              <span>Track record</span>
              <h2 id="consulting-record-title">支援実績</h2>
              <p>{detail.record.lead}</p>
            </header>

            <div className="nc-consulting-record-top">
              {detail.record.stats.map((stat) => (
                <div className="nc-consulting-stat" key={stat.label}>
                  <strong>
                    {stat.value}
                    <em>{stat.unit}</em>
                  </strong>
                  <span>{stat.label}</span>
                </div>
              ))}
              <div className="nc-consulting-industries">
                <small>支援業界</small>
                <ul>
                  {detail.record.industries.map((industry) => (
                    <li key={industry}>{industry}</li>
                  ))}
                </ul>
              </div>
            </div>

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
            <p className="nc-consulting-footnote">{detail.record.note}</p>
          </div>
        </section>

        {/* ---------- 支援事例 ---------- */}
        <section className="section nc-consulting-cases" aria-labelledby="consulting-cases-title">
          <div className="wrap">
            <header className="nc-consulting-section-head">
              <span>Selected cases</span>
              <h2 id="consulting-cases-title">課題から示唆まで、実際の流れ。</h2>
              <p>{detail.cases.lead}</p>
            </header>
            <div className="nc-consulting-case-list">
              {detail.cases.items.map((item) => (
                <article key={item.no}>
                  <header>
                    <span>{item.no}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                    </div>
                  </header>
                  <div className="nc-consulting-case-cols">
                    {([
                      ['課題', item.issue],
                      ['アプローチ', item.approach],
                      ['示唆・アウトプット', item.insight],
                    ] as const).map(([label, lines]) => (
                      <div key={label}>
                        <h4>{label}</h4>
                        <ul>
                          {lines.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 支援形態（図） ---------- */}
        <section className="section nc-consulting-formats" aria-labelledby="consulting-formats-title">
          <div className="wrap">
            <header className="nc-consulting-section-head">
              <span>Engagement models</span>
              <h2 id="consulting-formats-title">誰が担うかは、案件に合わせて設計する。</h2>
              <p>{detail.formats.lead}</p>
            </header>

            <FormatDiagram diagram={detail.formats.diagram} items={detail.formats.items} />

            <ol className="nc-consulting-format-list">
              {detail.formats.items.map((format) => (
                <li key={format.no}>
                  <span>{format.no}</span>
                  <div>
                    <h3>{format.title}</h3>
                    <small>{format.role}</small>
                    <p>{format.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- 価格（図） ---------- */}
        <section className="section nc-consulting-price" aria-labelledby="consulting-price-title">
          <div className="wrap">
            <header className="nc-consulting-section-head">
              <span>Why it costs less</span>
              <h2 id="consulting-price-title">なぜ、この価格で提供できるのか。</h2>
              <p>{detail.price.lead}</p>
            </header>

            <div className="nc-consulting-price-body">
              <div className="nc-consulting-price-chart">
                <h3>{detail.price.chart.caption}</h3>
                <PriceChart chart={detail.price.chart} />
              </div>

              <ol className="nc-consulting-reasons">
                {detail.price.reasons.map((reason) => (
                  <li key={reason.no}>
                    <span>{reason.no}</span>
                    <div>
                      <h3>{reason.title}</h3>
                      <p>{reason.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <p className="nc-consulting-footnote">{service.pricingNote}</p>
          </div>
        </section>

        {/* ---------- よくある質問 ---------- */}
        <section className="section nc-consulting-faq" aria-labelledby="consulting-faq-title">
          <div className="wrap">
            <header className="nc-consulting-section-head">
              <span>Questions</span>
              <h2 id="consulting-faq-title">よくある質問</h2>
            </header>
            <div className="nc-consulting-faq-list">
              {service.faq.map((item, index) => (
                <details key={item.q}>
                  <summary>
                    <span>Q{String(index + 1).padStart(2, '0')}</span>
                    {item.q}
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
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
