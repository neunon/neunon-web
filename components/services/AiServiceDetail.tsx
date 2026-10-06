import type { Service } from '@/lib/content';
import { PageBreadcrumbs } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { InteractiveHoverLink } from '@/components/ui/interactive-hover-button';
import { AiWorkflowDiagram } from './ServiceVisuals';

export function AiServiceDetail({ service }: { service: Service }) {
  return (
    <div className="ep ep-ai">
      <PageBreadcrumbs crumbs={[{ label: '事業内容', href: '/services' }, { label: service.title }]} />

      <section className="ep-a-hero" aria-labelledby="ep-a-title">
        <div className="ep-wrap ep-a-hero-inner">
          <div className="ep-a-hero-copy">
            <h1 id="ep-a-title">AI開発と、<br /><em>プロダクト。</em></h1>
            <p>{service.lead}</p>
            <div className="ep-a-hero-actions">
              <InteractiveHoverLink href="/contact/" text="開発を相談する" />
              <InteractiveHoverLink href="#ep-a-products-title" text="プロダクトを見る" className="is-outline" />
            </div>
          </div>
          <div className="ep-a-hero-image" role="img" aria-label="分析画面を開いたワークスペースの写真" />
        </div>
      </section>

      <section className="ep-section ep-a-modes" aria-labelledby="ep-a-modes-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <div><h2 id="ep-a-modes-title">仕事に合わせた開発。<br />すぐに試せる製品。</h2></div>
            <p>AIの導入自体を目的にしません。業務に合わせてつくる方法と、既存のプロダクトを活用する方法があります。</p>
          </header>
          <div className="ep-a-mode-pair">
            <article className="ep-a-mode-build">
              <h3>AI開発・<br />業務自動化</h3>
              <p>課題と業務フローを整理し、必要なシステム・ツールを設計、開発します。</p>
              <ul><li>社内業務ツール・Webアプリ</li><li>情報収集・分析・資料作成の自動化</li><li>既存システムとの連携</li></ul>
            </article>
            <article className="ep-a-mode-product">
              <h3>AIプロダクト</h3>
              <p>調査・営業の実務から生まれた製品を、用途に合わせて使えます。</p>
              <ul><li>業務別の機能を選んで試す</li><li>出力や利用方法の個社向け調整</li><li>導入後も運用を改善</li></ul>
            </article>
          </div>
        </div>
      </section>

      <section className="ep-section ep-a-questions" aria-labelledby="ep-a-questions-title">
        <div className="ep-wrap ep-a-questions-inner">
          <div><h2 id="ep-a-questions-title">今の業務を、<br />どこから変えるか。</h2></div>
          <ul>{service.useCases.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      <section className="ep-section ep-a-workflow-section" aria-labelledby="ep-a-workflow-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <h2 id="ep-a-workflow-title">任せる工程と、<br />人が判断する工程。</h2>
            <p>情報の収集や整理をAIで支援し、事実の確認と最終判断は人が担います。業務のどこを変えるかを先に設計します。</p>
          </header>
          <AiWorkflowDiagram />
        </div>
      </section>

      <section className="ep-section ep-a-products" aria-labelledby="ep-a-products-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <div><h2 id="ep-a-products-title">プロダクトラインナップ</h2></div>
            <p>提供中のものと構想中のものを分けて掲載しています。導入範囲や個社向けの調整はご相談ください。</p>
          </header>
          <div className="ep-a-product-grid">
            {service.menu.map((product) => <article key={product.name} className={product.status === '構想中' ? 'is-planned' : ''}>
              {product.status ? <small>{product.status}</small> : null}
              <h3>{product.name}</h3>
              <p>{product.body}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="ep-section ep-a-process" aria-labelledby="ep-a-process-title">
        <div className="ep-wrap ep-a-process-inner">
          <div className="ep-a-process-intro">
            <h2 id="ep-a-process-title">小さく確かめて、<br />実際に使うところまで。</h2>
            <p>業務の整理から運用後の改善まで。必要な工程を一緒に設計します。</p>
          </div>
          <ol>{(service.steps ?? []).map((step) => <li key={step.no}>
            <span>{step.no.replace('STEP ', '')}</span><div><h3>{step.title}</h3><p>{step.body}</p></div>
          </li>)}</ol>
        </div>
      </section>

      <section className="ep-section ep-a-engagement" aria-labelledby="ep-a-engagement-title">
        <div className="ep-wrap ep-a-engagement-inner">
          <div><h2 id="ep-a-engagement-title">価格は、導入範囲に<br />合わせて設計。</h2><p className="ep-a-estimate-label">個別見積り</p></div>
          <div><p>{service.pricingNote}</p><p className="ep-a-estimate-help">対象業務が未整理でも、小さな検証に適した範囲からご提案します。</p>
            <dl>{(service.engagement ?? []).map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
            <InteractiveHoverLink href="/contact/" text="見積りを相談する" className="is-outline" />
          </div>
        </div>
      </section>

      <section className="ep-section ep-faq" aria-labelledby="ep-a-faq-title">
        <div className="ep-wrap ep-faq-inner">
          <div><h2 id="ep-a-faq-title">導入の前に。</h2><InteractiveHoverLink href="/services/package/" text="パッケージ型支援も見る" className="is-outline" /></div>
          <div className="ep-faq-list">{service.faq.map((item) => <details key={item.q}><summary>{item.q}<span aria-hidden="true">＋</span></summary><p>{item.a}</p></details>)}</div>
        </div>
      </section>

      <ContactCta title="業務を、少しずつ変えていく。" body="対象業務と、いま困っていることをお聞かせください。小さな検証からご相談いただけます。" primary={{ label: '相談する', href: '/contact/' }} secondary={{ label: '他の事業を見る', href: '/services/' }} />
    </div>
  );
}
