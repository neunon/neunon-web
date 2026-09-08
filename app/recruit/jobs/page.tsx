import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { getJobs } from '@/lib/content';
import { termsPendingNote } from '@/lib/recruit';

export const metadata: Metadata = {
  title: '求人票一覧',
  description:
    '募集中の職種の一覧。リサーチ・分析アソシエイト、案件ディレクション（リード学生）、事業開発メンバー。フルリモート・時間帯自由・学部学科不問。',
  alternates: { canonical: '/recruit/jobs' },
};

/** 求人票一覧（要件定義書 4. のサイトマップ） */
export default function JobsPage() {
  const jobs = getJobs();

  return (
    <div className="nc-recruit">
      <PageHero
        title="募集職種"
        lead="いずれもフルリモート・時間帯自由です。学部・学科は問いません。実務未経験でも構いません。"
        crumbs={[{ label: '採用情報', href: '/recruit' }, { label: '募集職種' }]}
      />

      <div className="section">
        <div className="wrap">
          <p className="nc-pending is-lead">
            {termsPendingNote}
            <br />
            <span>
              実装メモ: 要件定義書 14. の未解決事項（求人票の契約形態と報酬額）。確定後に
              <code>content/jobs/*.json</code> の <code>contractType</code> と
              <code>compensation</code> を埋めると、求人票と構造化データの両方に反映される。
            </span>
          </p>

          <ul className="nc-jobcards">
            {jobs.map((job, index) => (
              <li className="nc-jobcard" key={job.id}>
                <span className="nc-job-cat">{job.category}</span>
                <h2>
                  <Link href={`/recruit/jobs/${job.id}`}>{job.title}</Link>
                </h2>
                <p className="nc-job-lead">{job.lead}</p>

                <dl className="nc-jobmeta">
                  <div>
                    <dt>稼働</dt>
                    <dd>{job.workload}</dd>
                  </div>
                  <div>
                    <dt>勤務地</dt>
                    <dd>{job.location}</dd>
                  </div>
                  <div>
                    <dt>契約形態</dt>
                    <dd>{job.contractType || <em className="nc-tbd">準備中</em>}</dd>
                  </div>
                  <div>
                    <dt>報酬</dt>
                    <dd>{job.compensation || <em className="nc-tbd">準備中</em>}</dd>
                  </div>
                </dl>

                <span className="nc-more" aria-hidden="true">
                  <i />
                  求人票を見る
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="nc-cta nc-rcta">
        <div className="wrap">
          <h2>どれに応募すればいいか分からない場合</h2>
          <p>
            エントリーフォームの希望区分は「相談したい」で構いません。面談で状況を伺って、こちらから提案します。
          </p>
          <div className="nc-acts nc-cta-acts">
            <Link href="/entry" className="btn">
              エントリーする
            </Link>
            <Link href="/recruit/flow" className="btn btn-ghost">
              選考フローを見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
