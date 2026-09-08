import Link from 'next/link';
import { getServices } from '@/lib/content';

/**
 * トップページ セクション4: 事業内容（要件定義書 6.1）
 *
 * 要件定義書 15. の実装上の要請により、3事業をハードコードせず
 * content/services/ の内容から生成する。4つ目の事業を追加する場合は
 * JSON を1枚足すだけでこのセクションと /services が同時に増える。
 */
export function Services() {
  const services = getServices();

  return (
    <section className="section" aria-labelledby="services-heading">
      <div className="wrap">
        <div className="shead">
          <h2 id="services-heading">{services.length}つの提供形態</h2>
          <p>
            案件単位の個別支援から、定型化して低単価で継続提供するパッケージ、
            その工程自体を自動化するAIプロダクトまで。同じ分析の型を、規模に応じて使い分けます。
          </p>
        </div>

        <div className="nc-svcs" data-count={services.length}>
          {services.map((service, index) => (
            <article className="nc-svc" key={service.id}>
              <span className="nc-svc-n">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <ul>
                {service.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
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
  );
}
