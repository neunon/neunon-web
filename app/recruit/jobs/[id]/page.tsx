import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { getJob, getJobs, type Job } from '@/lib/content';
import { selectionSteps, termsPendingNote } from '@/lib/recruit';
import { site } from '@/lib/site';

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getJobs().map((job) => ({ id: job.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = getJob(id);
  if (!job) return {};

  return {
    title: job.title,
    description: `${job.category}の募集要項。${job.lead} ${job.location}／${job.workload}`,
    alternates: { canonical: `/recruit/jobs/${job.id}` },
  };
}

/**
 * JobPosting 構造化データ（要件定義書 10.2）。
 * Google しごと検索に載るため必須とされている。
 *
 * 契約形態（employmentType）と報酬（baseSalary）は要件定義書 14. で未解決のため、
 * 値が入るまでプロパティ自体を出力しない。「準備中」のような文字列を
 * 構造化データに入れると不正な求人情報として扱われるため。
 * content/jobs/*.json が埋まれば自動でここにも出る。
 */
function buildJobPostingJsonLd(job: Job) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: [job.description, ...job.tasks.map((task) => `・${task}`)].join('\n'),
    // Google の JobPosting では必須プロパティ
    datePosted: job.datePosted,
    identifier: {
      '@type': 'PropertyValue',
      name: site.name,
      value: job.id,
    },
    hiringOrganization: {
      '@type': 'Organization',
      name: site.name,
      sameAs: site.url,
      logo: `${site.url}/neunon-logo.png`,
    },
    jobLocationType: 'TELECOMMUTE',
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'JP',
    },
    directApply: true,
    url: `${site.url}/recruit/jobs/${job.id}`,
  };

  // 未確定の項目は出力しない（誤った求人情報を配信しないため）
  if (job.contractType) jsonLd.employmentType = job.contractType;
  if (job.compensation) jsonLd.baseSalary = job.compensation;
  if (job.deadline) jsonLd.validThrough = job.deadline;

  return jsonLd;
}

/** 求人票（要件定義書 6.7 の必須項目をすべて満たす） */
export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();

  const flow = job.selectionFlow.map(
    (name) => selectionSteps.find((step) => step.title === name) ?? { no: '', title: name, body: '', span: '' },
  );

  const termsPending = !job.contractType || !job.compensation;

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: '募集職種', value: job.title },
    { label: '区分', value: job.category },
    {
      label: '雇用形態 / 契約形態',
      value: job.contractType || <em className="nc-tbd">準備中</em>,
    },
    {
      label: '報酬',
      value: job.compensation || <em className="nc-tbd">準備中</em>,
    },
    { label: '勤務地', value: job.location },
    { label: '稼働時間の目安', value: job.workload },
    { label: '期間', value: job.period },
    { label: '応募締切', value: job.deadline || '随時（締切は設けていません）' },
  ];

  return (
    <div className="nc-recruit">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJobPostingJsonLd(job)) }}
      />

      <PageHero
        eyebrow={job.category}
        title={job.title}
        lead={job.lead}
        crumbs={[
          { label: '採用情報', href: '/recruit' },
          { label: '募集職種', href: '/recruit/jobs' },
          { label: job.title },
        ]}
      />

      <div className="section">
        <div className="wrap nc-doc-narrow">
          <section aria-labelledby="job-desc">
            <h2 id="job-desc" className="nc-sub-head">
              業務内容
            </h2>
            <p>{job.description}</p>
            <ul className="nc-checklist">
              {job.tasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="job-terms">
            <h2 id="job-terms" className="nc-sub-head">
              募集要項
            </h2>
            <dl className="nc-deflist">
              {rows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            {termsPending ? <p className="nc-pending">{termsPendingNote}</p> : null}
          </section>

          <section aria-labelledby="job-req">
            <h2 id="job-req" className="nc-sub-head">
              応募資格
            </h2>
            <ul className="nc-checklist">
              {job.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="job-flow">
            <h2 id="job-flow" className="nc-sub-head">
              選考フロー
            </h2>
            <ol className="nc-steps">
              {flow.map((step, index) => (
                <li className="nc-step" key={step.title}>
                  <div className="nc-step-n">{step.no ? `STEP ${step.no}` : `STEP 0${index + 1}`}</div>
                  <div className="nc-step-c">
                    <h3>{step.title}</h3>
                    {step.body ? <p>{step.body}</p> : null}
                  </div>
                  <div className="nc-step-s">{step.span}</div>
                </li>
              ))}
            </ol>
            <Link href="/recruit/flow" className="nc-more">
              <i aria-hidden="true" />
              選考フローの詳細へ
            </Link>
          </section>
        </div>
      </div>

      <div className="nc-cta nc-rcta">
        <div className="wrap">
          <h2>{job.title}に応募する</h2>
          <p>
            志望動機はきれいにまとめなくて構いません。何をやりたいかが伝われば十分です。迷っている段階での応募も歓迎します。
          </p>
          <div className="nc-acts nc-cta-acts">
            <Link href="/entry" className="btn">
              エントリーする
            </Link>
            <Link href="/recruit/jobs" className="btn btn-ghost">
              他の募集職種を見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
