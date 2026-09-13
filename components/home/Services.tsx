import Image from 'next/image';
import Link from 'next/link';
import { getServices } from '@/lib/content';
import { TrackRecord } from './TrackRecord';

const serviceAchievements: Record<
  string,
  { label: string; prefix?: string; value: string; unit: string }
> = {
  consulting: { label: '累計業務支援件数', prefix: '約', value: '50', unit: '件' },
  package: { label: '累計レポート作成件数', value: '数百', unit: '件' },
  ai: { label: 'プロダクト開発・運用数', value: '5', unit: '件' },
};

const serviceVisuals: Record<string, { src?: string; position?: string }> = {
  consulting: { src: '/home-hero-city.webp', position: 'center 58%' },
  package: { src: '/outcome-buildings.webp', position: 'center 36%' },
  ai: { src: '/ai-product-workspace-v1.webp', position: 'center 52%' },
};

function ServiceAchievement({ serviceId }: { serviceId: string }) {
  const achievement = serviceAchievements[serviceId];
  if (!achievement) return null;

  return (
    <div className="nc-svc-achievement">
      <div className="nc-svc-achievement-copy">
        <span>{achievement.label}</span>
        <strong>
          {achievement.prefix ? (
            <em className="nc-achievement-prefix">{achievement.prefix}</em>
          ) : null}
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

  return (
    <section className="section nc-home-services nc-home-wide" aria-labelledby="services-heading">
      <div className="wrap">
        <div className="shead">
          <h2 id="services-heading">{services.length}つの提供形態</h2>
          <p>
            案件単位の個別支援から、定型化して低単価で継続提供するパッケージ、
            その工程自体を自動化するAIプロダクトまで。同じ分析の型を、規模に応じて使い分けます。
          </p>
        </div>

        <div className="nc-svcs nc-service-showcase" data-count={services.length}>
          <h3 id="achievements-heading" className="sr-only-text">実績件数</h3>
          {services.map((service) => {
            const visual = serviceVisuals[service.id];
            return (
            <article className="nc-svc" key={service.id}>
              <div className="nc-svc-copy">
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
              </div>
              <div className={`nc-svc-side is-${service.id}`}>
                <div className="nc-svc-visual" aria-hidden="true">
                  {visual?.src ? (
                    <Image
                      src={visual.src}
                      alt=""
                      fill
                      sizes="(max-width: 700px) 100vw, 38vw"
                      style={{ objectPosition: visual.position }}
                    />
                  ) : null}
                </div>
                <ServiceAchievement serviceId={service.id} />
              </div>
            </article>
            );
          })}
          <span className="nc-achievements-word" aria-hidden="true">Achievements</span>
        </div>

        <TrackRecord />
      </div>
    </section>
  );
}
