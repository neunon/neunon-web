import Link from 'next/link';
import type { Service, Work } from '@/lib/content';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';

const deliverablePoints = [
  {
    no: '01',
    title: '事実を集める',
    body: '公開情報や指定資料から、判断の前提になる情報を抜け漏れなく収集します。',
  },
  {
    no: '02',
    title: '比較できる形にする',
    body: '企業や商品ごとに異なる情報を、同じ評価軸で並べ直します。',
  },
  {
    no: '03',
    title: '変化と意味を読む',
    body: '単なる情報の羅列で終わらせず、競争環境や営業機会への示唆を整理します。',
  },
  {
    no: '04',
    title: '次の行動につなげる',
    body: '会議・提案・優先順位付けにそのまま使える成果物として納品します。',
  },
];

export function PackageServiceDetail({ service, works }: { service: Service; works: Work[] }) {
  const faq = service.faq.filter((item) => !item.q.includes('価格'));

  return (
    <div className="nc-package-page">
      <PageHero
        eyebrow="Package research support"
        title="パッケージ型支援"
        lead="営業・戦略判断の前提となる調査を、必要な範囲から。調査設計と品質基準を定型化し、1件単位でも発注しやすい実務支援にしました。"
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
                商談前の企業調査、競合の比較、休眠・失注顧客の再攻略。
                必要性は分かっていても、社内では後回しになりやすい調査業務を、
                目的に合わせて整理されたスライドへ仕上げます。
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

        <section className="section nc-package-use" aria-labelledby="package-use-title">
          <div className="wrap">
            <header className="nc-package-section-head">
              <span>When to use</span>
              <h2 id="package-use-title">こんな停滞を、前に進めます。</h2>
            </header>
            <div className="nc-package-use-grid">
              {service.useCases.map((useCase, index) => (
                <article key={useCase}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{useCase}</p>
                </article>
              ))}
            </div>
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
                    <span>{index < 2 ? 'Company' : index < 5 ? 'Competition' : 'Re-approach'}</span>
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.body}</p>
                  <dl>
                    <div>
                      <dt>想定顧客</dt>
                      <dd>{item.target}</dd>
                    </div>
                    <div>
                      <dt>解決する課題</dt>
                      <dd>{item.issue}</dd>
                    </div>
                  </dl>
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

        {works.length > 0 ? (
          <section className="section nc-package-case" aria-labelledby="package-case-title">
            <div className="wrap">
              <header className="nc-package-section-head">
                <span>Case study</span>
                <h2 id="package-case-title">実務で生まれた成果。</h2>
              </header>
              <div className="nc-package-case-grid">
                {works.map((work) => (
                  <Link href={`/works/${work.slug}`} key={work.slug}>
                    <span>{work.industry}</span>
                    <h3>{work.title}</h3>
                    <p>{work.approach}</p>
                    <i aria-hidden="true">↗</i>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

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
