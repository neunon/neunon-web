import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { PriceFlow } from '@/components/shared/PriceFlow';
import { ContactCta } from '@/components/shared/ContactCta';
import { TableOfContents, type TocItem } from '@/components/toc/TableOfContents';
import { getService, getServices, getWorksByService } from '@/lib/content';
import { faqSchema, jsonLd, serviceSchema } from '@/lib/schema';

type Props = { params: Promise<{ id: string }> };

/**
 * 静的書き出し（output: 'export'）では動的ルートに generateStaticParams が必須。
 * content/services/ のファイルから生成するので、事業を追加すればページも増える。
 */
export function generateStaticParams() {
  return getServices().map((service) => ({ id: service.id }));
}

/** 一覧に無い id は 404 にする（静的書き出しでは dynamicParams: true が使えない） */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = getService(id);
  if (!service) return {};

  // 事業ページは商談につながる入口なので、
  // 概要だけでなく「どんな課題に使えるか」と主要メニュー名まで入れる
  const menuNames = service.menu
    .slice(0, 3)
    .map((item) => item.name)
    .join('、');

  return {
    title: service.title,
    description: `${service.summary}${service.useCases[0] ?? ''}主なメニュー: ${menuNames} など。`.slice(0, 120),
    alternates: { canonical: `/services/${service.id}` },
  };
}

/**
 * 事業詳細（要件定義書 6.3）。3ページとも同じテンプレートで以下の構成:
 *   1 事業名とひとことでの説明 / 2 こういう課題に使えます / 3 具体的なメニュー
 *   4 進め方 / 5 想定期間・体制 / 6 この事業での実績 / 7 よくある質問 / 8 問い合わせCTA
 * パッケージ型支援のみ、4と5の間に「なぜこの価格か」＋参考価格を挟む（6.3.1）。
 */
export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const service = getService(id);
  if (!service) notFound();

  const works = getWorksByService(service.id);

  const toc: TocItem[] = [
    ...(service.id === 'consulting' ? [{ id: 'consulting-scope', label: '支援できること' }] : []),
    { id: 'use-cases', label: 'こういう課題に使えます' },
    { id: 'menu', label: '具体的なメニュー' },
    { id: 'steps', label: '進め方' },
    ...(service.showPricing ? [{ id: 'price', label: 'なぜこの価格か・参考価格' }] : []),
    { id: 'engagement', label: '想定期間・体制' },
    ...(works.length > 0 ? [{ id: 'works', label: 'この事業での実績' }] : []),
    { id: 'faq', label: 'よくある質問' },
  ];

  // メニュー表の列構成は事業ごとに異なる
  const hasBody = service.menu.some((item) => item.body);
  const hasTarget = service.menu.some((item) => item.target);

  return (
    <>
      {/* 事業そのものと、このページのFAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(serviceSchema(service), faqSchema(service.faq))}
      />

      <PageHero
        title={service.title}
        lead={service.lead}
        crumbs={[{ label: '事業内容', href: '/services' }, { label: service.title }]}
      />

      <div className="section">
        <div className="wrap nc-doc">
          <TableOfContents items={toc} title="このページの目次" />

          <div className="nc-doc-body">
            {service.id === 'consulting' ? (
              <section id="consulting-scope" className="nc-consulting-intro" aria-labelledby="consulting-scope-title">
                <span className="nc-consulting-kicker">Management &amp; research support</span>
                <h2 id="consulting-scope-title">経営課題から、手を動かす実務まで。</h2>
                <p className="nc-consulting-lead">
                  「売上を伸ばしたい」「方向性を整理したい」といった抽象度の高いご相談から、市場規模推定、競合比較、収益性分析、会議資料の作成まで。課題の解像度に応じて、考える支援と実行する支援を組み合わせます。
                </p>
                <div className="nc-consulting-pillars">
                  <article>
                    <span>01</span>
                    <h3>経営コンサルティング</h3>
                    <p>成長戦略、新規事業、収益改善、営業・マーケティングなど、答えが一つではない経営課題を整理し、判断と実行の道筋を設計します。</p>
                  </article>
                  <article>
                    <span>02</span>
                    <h3>調査・分析・資料作成</h3>
                    <p>分散した情報や未整理のデータを集め、比較・構造化・可視化。会議や意思決定でそのまま使える成果物まで仕上げます。</p>
                  </article>
                </div>
                <div className="nc-consulting-value">
                  <strong>品質は経験者が担保し、実行は学生チームが機動的に担う。</strong>
                  <p>専門的なディレクション体制と、固定費を抑えた柔軟なチーム編成によって、実務水準とコスト効率を両立します。</p>
                </div>
              </section>
            ) : null}

            <section aria-labelledby="use-cases">
              <h2 id="use-cases">こういう課題に使えます</h2>
              <ul className="nc-checklist">
                {service.useCases.map((useCase) => (
                  <li key={useCase}>{useCase}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="menu">
              <h2 id="menu">具体的なメニュー</h2>
              <div className="nc-menu-table" role="table">
                <div className="nc-menu-head" role="row">
                  <span role="columnheader">メニュー</span>
                  {hasBody ? <span role="columnheader">内容</span> : null}
                  {hasTarget ? <span role="columnheader">想定顧客</span> : null}
                  <span role="columnheader">想定課題</span>
                </div>
                {service.menu.map((item) => (
                  <div className="nc-menu-row" role="row" key={item.name}>
                    <span className="nc-menu-name" role="cell">
                      {item.name}
                      {item.base ? <em>{item.base} のAI化</em> : null}
                    </span>
                    {/* モバイルでは見出し行が隠れるため、data-label を疑似要素で出す */}
                    {hasBody ? (
                      <span role="cell" data-label="内容">
                        {item.body}
                      </span>
                    ) : null}
                    {hasTarget ? (
                      <span role="cell" data-label="想定顧客">
                        {item.target}
                      </span>
                    ) : null}
                    <span role="cell" data-label="想定課題">
                      {item.issue ?? '—'}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="steps">
              <h2 id="steps">進め方</h2>
              <ol className="nc-steps">
                {service.steps.map((step, index) => (
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

            {service.showPricing ? (
              <section aria-labelledby="price">
                <h2 id="price">なぜ、この価格で提供できるのか</h2>
                <div className="nc-priceblock">
                  <PriceFlow />
                </div>

                <h3 className="nc-price-head">参考価格</h3>
                <dl className="nc-pricelist">
                  {service.pricing.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.price}</dd>
                    </div>
                  ))}
                </dl>
                <p className="nc-note">{service.pricingNote}</p>
                <div className="nc-acts nc-price-acts">
                  <Link href="/contact" className="btn">
                    お見積りを相談する
                  </Link>
                </div>
              </section>
            ) : null}

            <section aria-labelledby="engagement">
              <h2 id="engagement">想定期間・体制</h2>
              <dl className="nc-deflist">
                {service.engagement.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
              {!service.showPricing ? <p className="nc-note">{service.pricingNote}</p> : null}
            </section>

            {works.length > 0 ? (
              <section aria-labelledby="works">
                <h2 id="works">この事業での実績</h2>
                <p className="nc-section-lead">
                  守秘義務のため、企業名と具体的な数値は記載していません。業種と分析アプローチのみを公開しています。
                </p>
                <ul className="nc-worklist">
                  {works.map((work) => (
                    <li key={work.slug}>
                      <span className="nc-work-ind">{work.industry}</span>
                      <h3>
                        <Link href={`/works/${work.slug}`}>{work.title}</Link>
                      </h3>
                      <p className="nc-work-ch">課題: {work.challenge}</p>
                      <p>{work.approach}</p>
                    </li>
                  ))}
                </ul>
                <Link href="/works" className="nc-more">
                  <i aria-hidden="true" />
                  支援実績の一覧へ
                </Link>
              </section>
            ) : null}

            <section aria-labelledby="faq">
              <h2 id="faq">よくある質問</h2>
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

      <ContactCta
        title={`${service.title}について相談する`}
        secondary={{ label: '他の事業を見る', href: '/services' }}
      />
    </>
  );
}
