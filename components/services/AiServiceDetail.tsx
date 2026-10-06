import Link from 'next/link';
import type { Service } from '@/lib/content';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';

/** 提案資料（2026-10-03）の二つの提供形態を、他の事業詳細と同じ章立てで示す。 */
export function AiServiceDetail({ service }: { service: Service }) {
  return (
    <div className="nc-ai-page nc-service-refined">
      <PageHero
        eyebrow="AI development & products"
        title={service.title}
        lead={service.lead}
        crumbs={[{ label: '事業内容', href: '/services' }, { label: service.title }]}
      />

      <section className="nc-ai-intro" aria-labelledby="ai-intro-title">
        <div className="wrap nc-ai-intro-grid">
          <div>
            <span className="nc-refined-kicker">事業概要</span>
            <h2 id="ai-intro-title">業務を見つめ、<br />必要な技術をつくる。</h2>
          </div>
          <p>{service.summary} AIの導入を目的にせず、業務の流れや課題に合わせて、使い続けられる仕組みを設計します。</p>
        </div>
      </section>

      <section className="section nc-ai-offerings" aria-labelledby="ai-offerings-title">
        <div className="wrap">
          <header className="nc-refined-head">
            <span className="nc-refined-kicker">提供形態</span>
            <h2 id="ai-offerings-title">開発とプロダクト、<br />二つの入り口。</h2>
          </header>
          <div className="nc-ai-offering-list">
            <article>
              <span className="nc-ai-offering-index">01</span>
              <div>
                <h3>AI開発・業務自動化</h3>
                <p>企業ごとの課題・業務に合わせ、AIを活用したシステムや自動化環境を設計・開発します。</p>
              </div>
              <ul>
                <li>社内業務ツール・Webアプリ</li>
                <li>情報収集・分析や資料作成の自動化</li>
                <li>既存システムへのAI機能の追加</li>
              </ul>
            </article>
            <article>
              <span className="nc-ai-offering-index">02</span>
              <div>
                <h3>自社AIプロダクト</h3>
                <p>実務で培った調査・営業の知見を、特定業務に使えるツールとして提供します。</p>
              </div>
              <ul>
                <li>業務別の機能をすぐに試せる</li>
                <li>出力や利用方法を個社に合わせて調整</li>
                <li>運用後の改善にも対応</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section nc-ai-challenges" aria-labelledby="ai-challenges-title">
        <div className="wrap">
          <header className="nc-refined-head">
            <span className="nc-refined-kicker">こういう課題に</span>
            <h2 id="ai-challenges-title">まず、どこに時間がかかっているか。</h2>
          </header>
          <ul>
            {service.useCases.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="section nc-ai-products" aria-labelledby="ai-products-title">
        <div className="wrap">
          <header className="nc-refined-head nc-refined-head-split">
            <div>
              <span className="nc-refined-kicker">自社プロダクト</span>
              <h2 id="ai-products-title">プロダクトラインナップ</h2>
            </div>
            <p>提供中のものと構想中のものを分けて掲載しています。導入範囲や個社向けの調整はご相談ください。</p>
          </header>
          <div className="nc-ai-product-grid">
            {service.menu.map((product) => (
              <article key={product.name} className={product.status === '構想中' ? 'is-planned' : ''}>
                <div className="nc-ai-product-top">
                  <span>{product.base}</span>
                  {product.status ? <small>{product.status}</small> : null}
                </div>
                <h3>{product.name}</h3>
                <p>{product.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section nc-ai-process" aria-labelledby="ai-process-title">
        <div className="wrap">
          <header className="nc-refined-head nc-refined-head-split">
            <div>
              <span className="nc-refined-kicker">開発アプローチ</span>
              <h2 id="ai-process-title">小さく検証し、実運用へ。</h2>
            </div>
            <p>業務整理から運用改善まで。必要な範囲を選び、段階的に進めます。</p>
          </header>
          <ol>
            {(service.steps ?? []).map((step) => (
              <li key={step.no}>
                <span>{step.no.replace('STEP ', '')}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section nc-ai-engagement" aria-labelledby="ai-engagement-title">
        <div className="wrap nc-ai-engagement-grid">
          <div>
            <span className="nc-refined-kicker">ご相談について</span>
            <h2 id="ai-engagement-title">開発範囲が決まる前でも、<br />ご相談ください。</h2>
            <p>{service.pricingNote}</p>
          </div>
          <dl>
            {(service.engagement ?? []).map((item) => (
              <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section nc-ai-faq" aria-labelledby="ai-faq-title">
        <div className="wrap">
          <header className="nc-refined-head">
            <span className="nc-refined-kicker">よくある質問</span>
            <h2 id="ai-faq-title">導入前に確認したいこと</h2>
          </header>
          <div className="nc-refined-faq-list">
            {service.faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}<span aria-hidden="true">＋</span></summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
          <Link href="/services/package" className="nc-ai-related">パッケージ型支援も見る <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <ContactCta
        title="自社の業務で、何ができるか。"
        body="対象業務と、いま困っていることをお聞かせください。小さな検証からご相談いただけます。"
        primary={{ label: '相談する', href: '/contact' }}
        secondary={{ label: '他の事業を見る', href: '/services' }}
      />
    </div>
  );
}
