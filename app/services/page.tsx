import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { StructureDiagram } from '@/components/shared/StructureDiagram';
import { ContactCta } from '@/components/shared/ContactCta';
import { getServices } from '@/lib/content';

export const metadata: Metadata = {
  title: '事業内容',
  description:
    'コンサルティング、パッケージ型支援、AIプロダクトの3つの提供形態。案件単位の個別支援から、定型化して低単価で継続提供するパッケージ、その工程自体を自動化するAIまで。',
  alternates: { canonical: '/services' },
};

/**
 * 事業一覧（3事業のハブ・要件定義書 4. のサイトマップ）
 *
 * 要件定義書 15.: 事業を固定でハードコードせず content/services/ から生成する。
 */
export default function ServicesPage() {
  const services = getServices();

  return (
    <>
      <PageHero
        eyebrow="SERVICES"
        title={`${services.length}つの提供形態`}
        lead="同じ分析の型を、規模と頻度に応じて使い分けます。どれを選ぶべきか決まっていない段階でのご相談も歓迎です。"
        crumbs={[{ label: '事業内容' }]}
      />

      <section className="section" aria-label="事業一覧">
        <div className="wrap">
          <div className="nc-svcs" data-count={services.length}>
            {services.map((service, index) => (
              <article className="nc-svc rise" data-d={index + 1} key={service.id}>
                <span className="nc-svc-n">{service.number}</span>
                <h2>{service.title}</h2>
                <p>{service.summary}</p>
                <ul>
                  {service.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <p className="nc-svc-price">
                  {service.showPricing ? '参考価格を掲載しています' : '価格は個別見積り'}
                </p>
                <Link href={`/services/${service.id}`} className="nc-more">
                  <i aria-hidden="true" />
                  詳しく見る
                  <span className="sr-only-text">（{service.title}）</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="services-structure">
        <div className="wrap">
          <div className="shead rise">
            <span className="snum">COMMON&nbsp;&nbsp;体制</span>
            <h2 id="services-structure">3事業に共通する提供体制</h2>
            <p>
              いずれの事業も、工数集約的な工程を学生チームが担い、経験のあるコンサルタントが監修する体制で提供しています。
            </p>
          </div>
          <StructureDiagram />
        </div>
      </section>

      {/* /works はステップ5で実装するため、現時点では会社概要へ誘導する */}
      <ContactCta secondary={{ label: '会社概要を見る', href: '/about' }} />
    </>
  );
}
