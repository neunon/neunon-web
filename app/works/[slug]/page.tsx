import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { getService, getWork, getWorks } from '@/lib/content';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getWorks().map((work) => ({ slug: work.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return {};

  return {
    // 事例タイトル自体が25〜32字あり、日本語SERPの表示枠をすでに使い切る。
    // 業種は description の冒頭とパンくずで示すので、接尾辞は一切付けない
    title: { absolute: work.title },
    description: `${work.industry}の支援事例。${work.challenge}という課題に対し、${work.approach}`.slice(0, 120),
    alternates: { canonical: `/works/${work.slug}` },
  };
}

/**
 * 実績詳細（要件定義書 6.4）。
 * 「背景・課題 → 分析アプローチ → 得られた示唆」の3段構成。
 * 社内の実際の分析プロセスと同じ型を踏襲している。
 */
export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const relatedServices = work.services
    .map((id) => getService(id))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  const others = getWorks()
    .filter((item) => item.slug !== work.slug)
    .slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={work.industry}
        title={work.title}
        crumbs={[{ label: '支援実績', href: '/works' }, { label: work.industry }]}
      />

      <div className="section nc-case-detail">
        <div className="wrap nc-case-layout">
          <aside className="nc-case-aside">
            <span>Case study</span>
            <strong>{work.industry}</strong>
            <p>企業名や固有情報を伏せ、課題と分析の組み立てを公開しています。</p>
          </aside>
          <div className="nc-case-main">
          <ol className="nc-caseflow" aria-label="この事例の構成">
            <li>背景・課題</li>
            <li>分析アプローチ</li>
            <li>得られた示唆</li>
          </ol>

          <section aria-labelledby="case-background">
            <h2 id="case-background" className="nc-sub-head">
              背景・課題
            </h2>
            <p>{work.background}</p>
            <p className="nc-case-challenge">{work.challenge}</p>
          </section>

          <section aria-labelledby="case-approach">
            <h2 id="case-approach" className="nc-sub-head">
              分析アプローチ
            </h2>
            <p>{work.approach}</p>
          </section>

          <section aria-labelledby="case-insight">
            <h2 id="case-insight" className="nc-sub-head">
              得られた示唆
            </h2>
            <p>{work.insight}</p>
          </section>

          <p className="nc-note">
            守秘義務のため、企業名・具体的な数値・成果物は記載していません。同種の課題についてのご相談は個別に承ります。
          </p>

          {relatedServices.length > 0 ? (
            <section aria-labelledby="case-services">
              <h2 id="case-services" className="nc-sub-head">
                この事例に関係する事業
              </h2>
              <ul className="nc-relservices">
                {relatedServices.map((service) => (
                  <li key={service.id}>
                    <Link href={`/services/${service.id}`}>
                      <span className="nc-svc-n">{service.number}</span>
                      <span className="nc-rel-title">{service.title}</span>
                      <span className="nc-rel-sum">{service.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          </div>
        </div>
      </div>

      {others.length > 0 ? (
        <section className="section section-alt" aria-labelledby="other-works">
          <div className="wrap">
            <div className="shead">
              <h2 id="other-works">ほかの支援実績</h2>
            </div>
            <div className="nc-workgrid">
              {others.map((item) => (
                <article className="nc-workcard" key={item.slug}>
                  <span className="nc-work-ind">{item.industry}</span>
                  <h3>
                    <Link href={`/works/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="nc-work-ch">課題: {item.challenge}</p>
                </article>
              ))}
            </div>
            <div className="nc-recs-act">
              <Link href="/works" className="nc-more">
                <i aria-hidden="true" />
                実績一覧へ戻る
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <ContactCta secondary={{ label: '支援実績一覧へ', href: '/works' }} />
    </>
  );
}
