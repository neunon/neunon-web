import type { Service } from '@/lib/content';
import { PageBreadcrumbs } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { InteractiveHoverLink } from '@/components/ui/interactive-hover-button';
import { PackagePreviewVisual } from './ServiceVisuals';

const journey = [
  { title: 'メニューを選ぶ', body: '新規営業先、競合、市場など、調べたいテーマに合うメニューを選びます。' },
  { title: '対象・範囲を決める', body: '企業数や確認したい観点を伺い、実施範囲と納品内容を調整します。' },
  { title: '分析資料を受け取る', body: '調査結果を整理し、比較や示唆を含む資料として納品します。' },
];

const outcomes = [
  { title: '調査・分析工数を削減', body: ['情報収集・整理の作業を削減し、検討・判断・実行に時間を使える。', '工数の制約で調べられなかった企業や市場まで、検討対象を広げられる。'] },
  { title: '新たな示唆・機会を発見', body: ['個別情報を横断して分析し、日々の業務では見落としやすい論点を抽出。', '新規提案・クロスセル・再攻略、成長市場、競合の脅威や勝ち筋を見いだす。'] },
  { title: '対象の変化を継続的に把握', body: ['一度きりの調査で終わらず、企業や市場の変化を捉え続ける。', '新商品、戦略変更、投資、提携、M&A、組織変更を適切な判断につなげる。'] },
  { title: '理解・知見を深め、判断・提案を高度化', body: ['企業・市場・競合・製品を多面的に把握し、担当者自身の知見を深める。', '背景や構造を踏まえた、より深く多角的な判断・提案を可能にする。'] },
  { title: '分析品質を標準化・組織知化', body: ['調査項目・分析観点を統一し、担当者による深さや着眼点のばらつきを抑える。', '分析結果と重要な着眼点を蓄積・更新し、組織資産として再利用する。'] },
];

export function PackageServiceDetail({ service }: { service: Service }) {
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
            <div><h2 id="ep-p-journey-title">情報を集めて、<br />終わらせない。</h2></div>
            <p>企業1社のクローズアップから、競合比較、定期レビューまで。調査テーマごとに範囲と進め方を定型化し、必要なメニューを選んで依頼できます。</p>
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
            <div><h2 id="ep-p-menu-title">主な支援メニュー</h2></div>
            <p>{service.summary} メニューを起点に、対象や観点を調整できます。</p>
          </header>
          <div className="ep-p-menu-list">
            {service.menu.map((item) => <details key={item.name} name="package-menu">
              <summary><h3>{item.name}</h3><span>{item.body}</span><i aria-hidden="true" /></summary>
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
          <header className="ep-split-head"><h2 id="ep-p-benefits-title">パッケージ型支援が<br />もたらす効果</h2><p>パッケージ型支援は、日々の業務に直接効く成果と、担当者・組織に残る知見の両方を生み出します。</p></header>
          <div className="ep-p-benefit-groups">
            <div className="ep-p-benefit-list"><h3>業務・成果への直接効果</h3><div>{outcomes.slice(0, 3).map((outcome, index) => <article key={outcome.title}><div className="ep-p-benefit-name"><span>0{index + 1}.</span><h4>{outcome.title}</h4></div><ul>{outcome.body.map((line) => <li key={line}>{line}</li>)}</ul></article>)}</div></div>
            <div className="ep-p-benefit-list"><h3>人・組織の能力向上</h3><div>{outcomes.slice(3).map((outcome, index) => <article key={outcome.title}><div className="ep-p-benefit-name"><span>0{index + 4}.</span><h4>{outcome.title}</h4></div><ul>{outcome.body.map((line) => <li key={line}>{line}</li>)}</ul></article>)}</div></div>
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

      <ContactCta title="まずは、1件から。" body="調べたい企業やテーマをお聞かせください。対象の選定からもご相談いただけます。" primary={{ label: '調査を相談する', href: '/contact/' }} secondary={{ label: '他の事業を見る', href: '/services/' }} />
    </div>
  );
}
