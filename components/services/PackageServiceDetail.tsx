import type { Service } from '@/lib/content';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';

const deliverablePoints = [
  {
    no: '01',
    title: '実態把握',
    body: '市場の規模・成長性・主要プレイヤーを整理し、対象企業の事業・商品・顧客・販売チャネル・戦略を把握します。',
  },
  {
    no: '02',
    title: '分析・評価',
    body: '収集した事実を比較・構造化し、特徴・競争力・成長余地・課題を読み解きます。',
  },
  {
    no: '03',
    title: '示唆・活用',
    body: '分析結果を具体的な判断・優先順位・提案につなげ、営業先選定、既存顧客深耕、競合分析、M&A候補評価に活用できる形にまとめます。',
  },
];

const packageBenefits = [
  {
    no: '01',
    title: '調査・分析工数を削減',
    points: [
      '情報収集・整理にかかる作業を削減し、本来注力すべき検討・判断・実行に時間を使える',
      '工数制約で十分に調べられなかった企業・市場等まで検討対象を広げられる',
    ],
  },
  {
    no: '02',
    title: '新たな示唆・機会を発見',
    points: [
      '個別情報を横断的に分析することで、通常業務で見落としやすい論点や示唆・機会を抽出できる',
      '新規提案・クロスセル・再攻略、成長市場、競合の脅威・勝ち筋、M&A候補等',
    ],
  },
  {
    no: '03',
    title: '対象の変化を継続的に把握',
    points: [
      '一度きりの調査で終わらず、企業や市場の変化を捉え続け、機会損失を抑える',
      '新商品、戦略変更、投資、提携、M&A、組織変更等',
      '適切なタイミングで判断・アクションにつなげられる',
    ],
  },
  {
    no: '04',
    title: '理解・知見を深め、判断・提案を高度化',
    points: [
      '企業・市場・競合・製品を多面的に把握することで、担当者自身の理解・知見が深まる',
      '背景や構造まで踏まえた、より深く多角的な判断・提案が可能になる',
    ],
  },
  {
    no: '05',
    title: '分析品質を標準化・組織知化',
    points: [
      '調査項目・分析観点を統一し、担当者ごとの深さ・着眼点のばらつきを抑制',
      '分析結果や重要な着眼点を蓄積・更新し、個人知を組織資産として再利用できる',
    ],
  },
];

export function PackageServiceDetail({ service }: { service: Service }) {
  const faq = service.faq.filter((item) => !item.q.includes('価格'));

  return (
    <div className="nc-package-page">
      <PageHero
        eyebrow="Package research support"
        title={service.title}
        lead={service.lead}
        crumbs={[{ label: '事業内容', href: '/services' }, { label: service.title }]}
      />

      <div className="nc-package-content">
        <section className="nc-package-opening" aria-labelledby="package-opening-title">
          <div className="wrap">
            <div className="nc-package-opening-copy">
              <span className="nc-package-kicker">Small start, decision ready</span>
              <h2 id="package-opening-title">
                「調べる」で止めず、
                <br />
                判断できるところまで。
              </h2>
              <p>
                公開情報を横断的に収集・分析し、市場・競争環境から対象企業の実態、
                目的に応じた示唆までを一気通貫で支援します。
              </p>
            </div>
            <dl className="nc-package-principles">
              <div>
                <dt>Minimum unit</dt>
                <dd>1件・1案件から</dd>
              </div>
              <div>
                <dt>Output</dt>
                <dd>そのまま使える資料</dd>
              </div>
              <div>
                <dt>Quality</dt>
                <dd>経験者が最終確認</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="section nc-package-menu" aria-labelledby="package-menu-title">
          <div className="wrap">
            <header className="nc-package-section-head is-light">
              <span>Research menu</span>
              <h2 id="package-menu-title">調査テーマに合わせて、必要な型を選ぶ。</h2>
              <p>単発の企業調査から、複数社比較、継続的な競合観測まで。目的と利用場面から組み立てます。</p>
            </header>
            <div className="nc-package-menu-grid">
              {service.menu.map((item, index) => (
                <article key={item.name}>
                  <div className="nc-package-menu-meta">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>{item.caption}</span>
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.body}</p>
                  <div className="nc-package-menu-effects">
                    <span>効果</span>
                    <ul>
                      {(item.effects ?? []).map((effect) => (
                        <li key={effect}>{effect}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section nc-package-benefits" aria-labelledby="package-benefits-title">
          <div className="wrap">
            <header className="nc-package-section-head">
              <span>Five changes</span>
              <h2 id="package-benefits-title">支援がもたらす5つの変化</h2>
            </header>
            <div className="nc-package-benefit-list">
              {packageBenefits.map((benefit) => (
                <article key={benefit.no}>
                  <span>{benefit.no}</span>
                  <h3>{benefit.title}</h3>
                  <ul>
                    {benefit.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section nc-package-impact" aria-labelledby="package-impact-title">
          <div className="wrap">
            <header className="nc-package-section-head">
              <span>Issue to impact</span>
              <h2 id="package-impact-title">課題別の活用イメージ</h2>
            </header>
            <div className="nc-package-impact-list">
              {service.menu.map((item, index) => (
                <article key={item.name}>
                  <span className="nc-package-impact-no">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <small>Issue</small>
                    <p>{item.issue}</p>
                  </div>
                  <i aria-hidden="true" />
                  <div>
                    <small>Impact</small>
                    <p>{item.effect}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section nc-package-output" aria-labelledby="package-output-title">
          <div className="wrap">
            <header className="nc-package-section-head">
              <span>Decision-ready output</span>
              <h2 id="package-output-title">情報収集から、意思決定の材料へ。</h2>
            </header>
            <div className="nc-package-output-flow">
              {deliverablePoints.map((point) => (
                <article key={point.no}>
                  <span>{point.no}</span>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section nc-package-process" aria-labelledby="package-process-title">
          <div className="wrap">
            <header className="nc-package-section-head">
              <span>How we work</span>
              <h2 id="package-process-title">お問い合わせから納品まで。</h2>
            </header>
            <ol>
              {service.steps.map((step) => (
                <li key={step.no}>
                  <span>{step.no.replace('STEP ', '')}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Reserved for the future price and delivery-time section. */}
        <div className="nc-package-price-delivery-slot" data-reserved-section="price-and-delivery" hidden />

        <section className="section nc-package-faq" aria-labelledby="package-faq-title">
          <div className="wrap">
            <header className="nc-package-section-head">
              <span>Questions</span>
              <h2 id="package-faq-title">よくある質問</h2>
            </header>
            <div className="nc-package-faq-list">
              {faq.map((item, index) => (
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
        title="まだ、依頼内容が固まっていなくても大丈夫です。"
        body="調べたいテーマや対象企業だけでもお聞かせください。必要な調査範囲から一緒に整理します。"
        primary={{ label: '小さな相談から始める', href: '/contact' }}
        secondary={{ label: '他の事業を見る', href: '/services' }}
      />
    </div>
  );
}
