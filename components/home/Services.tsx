import Link from 'next/link';
import { getService, getServices } from '@/lib/content';
import { TrackRecord } from './TrackRecord';

const serviceAchievements: Record<
  string,
  { label: string; value: string; unit: string }
> = {
  consulting: { label: '累計業務支援件数', value: '約50', unit: '件' },
  package: { label: '累計レポート作成件数', value: '数百', unit: '件' },
  ai: { label: 'プロダクト開発・運用数', value: '5', unit: '件' },
};

function ServiceAchievement({ serviceId }: { serviceId: string }) {
  const achievement = serviceAchievements[serviceId];
  if (!achievement) return null;

  return (
    <div className="nc-svc-achievement">
      <div className="nc-svc-achievement-copy">
        <span>{achievement.label}</span>
        <strong>
          {achievement.value}<small>{achievement.unit}</small>
        </strong>
      </div>
    </div>
  );
}

/**
 * トップページ セクション4: 事業内容（要件定義書 6.1）
 *
 * 要件定義書 15. の実装上の要請により、3事業をハードコードせず
 * content/services/ の内容から生成する。4つ目の事業を追加する場合は
 * JSON を1枚足すだけでこのセクションと /services が同時に増える。
 */
export function Services() {
  const services = getServices();
  const packageService = getService('package');
  const referencePricing = packageService?.pricing.slice(0, 6) ?? [];

  return (
    <section className="section nc-home-services" aria-labelledby="services-heading">
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

        <section className="nc-achievements" aria-labelledby="achievements-heading">
          <h3 id="achievements-heading" className="sr-only-text">実績件数</h3>
          <div className="nc-achievements-grid">
            {services.map((service) => (
              <ServiceAchievement serviceId={service.id} key={service.id} />
            ))}
          </div>
          <span className="nc-achievements-word" aria-hidden="true">Achievements</span>
        </section>

        <TrackRecord />

        {referencePricing.length > 0 ? (
          <aside className="nc-reference-price" aria-labelledby="reference-price-heading">
            <div className="nc-reference-price-intro">
              <span>Reference price</span>
              <h3 id="reference-price-heading">参考価格</h3>
              <p>
                定型化した調査メニューは、1件・1案件からご依頼いただけます。
                必要な範囲だけを選び、まず小さく試すことも可能です。
              </p>
              <Link href="/contact" className="nc-reference-price-link">
                見積りを相談する
                <i aria-hidden="true" />
              </Link>
            </div>
            <dl className="nc-reference-price-list">
              {referencePricing.map((row, index) => (
                <div key={row.label}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <dt>{row.label}</dt>
                  <dd>{row.price}</dd>
                </div>
              ))}
            </dl>
            <p className="nc-reference-price-note">{packageService?.pricingNote}</p>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
