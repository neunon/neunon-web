import Link from 'next/link';
import type { Service } from '@/lib/content';
import { PageBreadcrumbs } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';

export function AiServiceDetail({ service }: { service: Service }) {
  return (
    <div className="ep ep-ai">
      <PageBreadcrumbs crumbs={[{ label: '事業内容', href: '/services' }, { label: service.title }]} />

      <section className="ep-a-hero" aria-labelledby="ep-a-title">
        <div className="ep-wrap ep-a-hero-inner">
          <div className="ep-a-hero-copy">
            <span className="ep-overline">AI development & products</span>
            <h1 id="ep-a-title">AI開発と、<br /><em>プロダクト。</em></h1>
            <p>{service.lead}</p>
            <div className="ep-a-hero-actions">
              <Link href="/contact/" className="ep-pill-link">開発を相談する <span aria-hidden="true">↗</span></Link>
              <a href="#ep-a-products-title" className="ep-text-link">プロダクトを見る <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="ep-a-hero-image" role="img" aria-label="分析画面を開いたワークスペースの写真" />
        </div>
      </section>

      <section className="ep-section ep-a-modes" aria-labelledby="ep-a-modes-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <div><span className="ep-overline">提供形態</span><h2 id="ep-a-modes-title">仕事に合わせた開発。<br />すぐに試せる製品。</h2></div>
            <p>AIの導入自体を目的にしません。業務に合わせてつくる方法と、既存のプロダクトを活用する方法があります。</p>
          </header>
          <div className="ep-a-mode-pair">
            <article className="ep-a-mode-build">
              <span>企業ごとの業務に</span>
              <h3>AI開発・<br />業務自動化</h3>
              <p>課題と業務フローを整理し、必要なシステム・ツールを設計、開発します。</p>
              <ul><li>社内業務ツール・Webアプリ</li><li>情報収集・分析・資料作成の自動化</li><li>既存システムとの連携</li></ul>
            </article>
            <article className="ep-a-mode-product">
              <span>業務別の選択肢として</span>
              <h3>AIプロダクト</h3>
              <p>調査・営業の実務から生まれた製品を、用途に合わせて使えます。</p>
              <ul><li>業務別の機能を選んで試す</li><li>出力や利用方法の個社向け調整</li><li>導入後も運用を改善</li></ul>
            </article>
          </div>
        </div>
      </section>

      <section className="ep-section ep-a-questions" aria-labelledby="ep-a-questions-title">
        <div className="ep-wrap ep-a-questions-inner">
          <div><span className="ep-overline">こんな課題に</span><h2 id="ep-a-questions-title">今の業務を、<br />どこから変えるか。</h2></div>
          <ul>{service.useCases.map((item) => <li key={item}>{item}</li>)}</ul>
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
            <span className="ep-overline">開発の進め方</span>
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
          <div><span className="ep-overline">相談から導入まで</span><h2 id="ep-a-engagement-title">対象業務だけでも、<br />お聞かせください。</h2></div>
          <div><p>何をAI化すべきか決まっていなくても構いません。現状の仕事から、検証に適した範囲を見つけます。</p>
            <dl>{(service.engagement ?? []).map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
          </div>
        </div>
      </section>

      <section className="ep-section ep-faq" aria-labelledby="ep-a-faq-title">
        <div className="ep-wrap ep-faq-inner">
          <div><span className="ep-overline">よくある質問</span><h2 id="ep-a-faq-title">導入の前に。</h2><Link href="/services/package/" className="ep-text-link">パッケージ型支援も見る <span aria-hidden="true">↗</span></Link></div>
          <div className="ep-faq-list">{service.faq.map((item) => <details key={item.q}><summary>{item.q}<span aria-hidden="true">＋</span></summary><p>{item.a}</p></details>)}</div>
        </div>
      </section>

      <ContactCta title="業務を、少しずつ変えていく。" body="対象業務と、いま困っていることをお聞かせください。小さな検証からご相談いただけます。" primary={{ label: '相談する', href: '/contact/' }} secondary={{ label: '他の事業を見る', href: '/services/' }} />
    </div>
  );
}
