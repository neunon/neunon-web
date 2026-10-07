import Link from 'next/link';
import type { Service } from '@/lib/content';
import { PageBreadcrumbs } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { InteractiveHoverLink } from '@/components/ui/interactive-hover-button';
import { AiLoader } from '@/components/ui/ai-loader';

const root = '/services/ai/';

export function AiServiceDetail({ service }: { service: Service }) {
  return <div className="ep ep-ai">
    <PageBreadcrumbs crumbs={[{ label: '事業内容', href: '/services' }, { label: service.title }]} />
    <section className="ep-a-hero" aria-labelledby="ep-a-title"><div className="ep-wrap ep-a-hero-inner">
      <div className="ep-a-hero-copy"><h1 id="ep-a-title">AI開発・<br />プロダクト</h1><p>{service.lead}</p></div>
      <div className="ep-a-hero-image"><AiLoader /></div>
    </div></section>
    <section className="ep-section ep-a-modes" aria-labelledby="ep-a-modes-title"><div className="ep-wrap">
      <header className="ep-split-head"><h2 id="ep-a-modes-title">仕事に合わせた開発。<br />すぐに試せる製品。</h2><p>自社の業務に合わせて開発するか、実務から生まれた製品を活用するか。目的に近いほうをお選びください。</p></header>
      <div className="ep-a-mode-pair">
        <Link href={`${root}development/`} className="ep-a-mode-build"><h3>AI開発・業務自動化</h3><p>業務・課題整理から要件設計、PoC、本開発、運用改善まで。自社の工程に合う仕組みをつくります。</p><span className="ep-a-mode-action">AI開発を見る <span aria-hidden="true">↗</span></span></Link>
        <Link href={`${root}products/`} className="ep-a-mode-product"><h3>AIプロダクト</h3><p>企業調査や営業の実務から生まれた製品を、用途に合わせてご案内します。</p><span className="ep-a-mode-action">製品を見る <span aria-hidden="true">↗</span></span></Link>
      </div>
    </div></section>
    <ContactCta title="どちらが適するか、相談できます。" body="対象業務と現在の課題をお聞かせください。" primary={{ label: '相談する', href: '/contact/' }} />
  </div>;
}

export function AiDevelopmentDetail({ service }: { service: Service }) {
  return <div className="ep ep-ai ep-ai-subpage">
    <PageBreadcrumbs crumbs={[{ label: '事業内容', href: '/services' }, { label: service.title, href: root }, { label: 'AI開発・業務自動化' }]} />
    <section className="ep-a-hero ep-a-sibling-hero" aria-labelledby="ep-a-development-title"><div className="ep-wrap ep-a-hero-inner"><div className="ep-a-hero-copy"><h1 id="ep-a-development-title">AI開発・<br />業務自動化</h1><p>業務と課題を起点に、必要な機能を設計します。小さな検証を経て、実際に使える仕組みへ育てます。</p><InteractiveHoverLink href="/contact/" text="開発を相談する" /></div><div className="ep-a-hero-image"><AiLoader /></div></div></section>
    <section className="ep-section ep-a-development-menu" aria-labelledby="ep-a-development-menu-title"><div className="ep-wrap"><header className="ep-split-head"><h2 id="ep-a-development-menu-title">開発メニュー・例</h2><p>業務課題に応じ、AIシステム・業務ツール・自動化アプリ等を柔軟に開発します。</p></header><div className="ep-a-menu-columns"><div><h3>開発メニュー</h3><ul>{service.aiDevelopmentMenu?.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3>開発例</h3><ul>{service.aiDevelopmentExamples?.map((item) => <li key={item}>{item}</li>)}</ul></div></div></div></section>
    <section className="ep-section ep-a-process" aria-labelledby="ep-a-process-title"><div className="ep-wrap"><header className="ep-split-head ep-a-process-heading"><h2 id="ep-a-process-title">開発アプローチ</h2><p>業務・課題整理を起点に、AI・データ分析・業務改善等の最適な解決手段を設計し、必要に応じて開発・導入まで支援します。</p></header><div className="ep-a-process-map"><div className="ep-a-process-phases" aria-hidden="true"><span>開発・導入</span><span>コンサル・業務設計</span></div><ol>{(service.steps ?? []).map((step, index) => <li key={step.no} style={{ '--step-offset': `${index * 9}%` } as React.CSSProperties}><div className="ep-a-process-step"><span>{step.no.replace('STEP ', '')}</span><h3>{step.title}</h3></div><span className="ep-a-process-chevron" aria-hidden="true" /><p>{step.body}</p></li>)}</ol></div></div></section>
    <section className="ep-section ep-a-engagement" aria-labelledby="ep-a-engagement-title"><div className="ep-wrap ep-a-engagement-inner"><div><h2 id="ep-a-engagement-title">導入範囲に合わせた見積り</h2><p className="ep-a-estimate-label">個別見積り</p></div><div><p>{service.pricingNote}</p><dl>{(service.engagement ?? []).map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl><InteractiveHoverLink href="/contact/" text="見積りを相談する" className="is-outline" /></div></div></section>
    <section className="ep-section ep-faq" aria-labelledby="ep-a-faq-title"><div className="ep-wrap ep-faq-inner"><h2 id="ep-a-faq-title">よくある質問</h2><div className="ep-faq-list">{service.faq.filter((item) => !item.q.includes('パッケージ型')).map((item) => <details key={item.q}><summary>{item.q}<span aria-hidden="true">＋</span></summary><p>{item.a}</p></details>)}</div></div></section>
    <ContactCta title="対象業務から、一緒に整理します。" primary={{ label: '相談する', href: '/contact/' }} secondary={{ label: 'AI開発・プロダクトに戻る', href: root }} />
  </div>;
}

export function AiProductsDetail({ service }: { service: Service }) {
  return <div className="ep ep-ai ep-ai-subpage">
    <PageBreadcrumbs crumbs={[{ label: '事業内容', href: '/services' }, { label: service.title, href: root }, { label: 'AIプロダクト' }]} />
    <section className="ep-a-hero ep-a-sibling-hero ep-a-product-hero" aria-labelledby="ep-a-product-title"><div className="ep-wrap ep-a-hero-inner"><div className="ep-a-hero-copy"><h1 id="ep-a-product-title">AI<br />プロダクト</h1><p>調査・営業の現場から生まれた製品です。現在提供中のものと構想中のものを分けて掲載しています。</p><InteractiveHoverLink href="#ep-a-products-title" text="製品を見る" /></div><div className="ep-a-hero-image"><AiLoader /></div></div></section>
    <section className="ep-section ep-a-product-features" aria-labelledby="ep-a-product-features-title"><div className="ep-wrap"><header className="ep-split-head"><h2 id="ep-a-product-features-title">特徴</h2><p>特定業務に特化した自社AIプロダクトを提供し、短期間・低負荷でのAI導入を支援します。</p></header><div className="ep-a-features-grid">{service.aiProductFeatures?.map((feature) => <article key={feature.title}><h3>{feature.title}</h3><p>{feature.body}</p></article>)}</div></div></section>
    <section className="ep-section ep-a-products" aria-labelledby="ep-a-products-title"><div className="ep-wrap"><header className="ep-split-head"><h2 id="ep-a-products-title">プロダクトラインナップ</h2><p>個別製品の詳細ページは、製品化に合わせて追加します。導入範囲と調整内容はお問い合わせください。</p></header><div className="ep-a-product-grid">{service.menu.map((product) => <article key={product.name} className={product.status === '構想中' ? 'is-planned' : ''}>{product.status ? <small>{product.status}</small> : null}<h3>{product.name}</h3><p>{product.body}</p></article>)}</div></div></section>
    <ContactCta title="利用方法をご相談ください。" primary={{ label: '相談する', href: '/contact/' }} secondary={{ label: 'AI開発・プロダクトに戻る', href: root }} />
  </div>;
}
