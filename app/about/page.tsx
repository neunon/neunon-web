import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { StructureDiagram } from '@/components/shared/StructureDiagram';
import { ContactCta } from '@/components/shared/ContactCta';
import { TableOfContents, type TocItem } from '@/components/toc/TableOfContents';
import { CompanyTable } from '@/components/about/CompanyTable';
import { History } from '@/components/about/History';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: '会社概要',
  description:
    '株式会社Neunon Consulting の会社概要。ミッション、私たちの考え方（なぜ学生なのか、品質はどう担保するのか）、組織体制、会社情報、沿革。',
  alternates: { canonical: '/about' },
};

/** 目次付きの長尺ページ（要件定義書 6.2） */
const toc: TocItem[] = [
  { id: 'mission', label: 'ミッション' },
  { id: 'message', label: '代表メッセージ' },
  { id: 'philosophy', label: '私たちの考え方' },
  { id: 'why-students', label: 'なぜ学生なのか', level: 2 },
  { id: 'quality', label: '品質はどう担保するのか', level: 2 },
  { id: 'structure', label: '組織体制' },
  { id: 'company', label: '会社情報' },
  { id: 'history', label: '沿革' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="会社概要"
        lead="実務支援を通じて次世代ビジネス人材を育成しながら、企業の高度支援をより広く届けることを目指しています。"
        crumbs={[{ label: '会社概要' }]}
      />

      <div className="section">
        <div className="wrap nc-doc">
          <TableOfContents items={toc} title="このページの目次" />

          <div className="nc-doc-body">
            <section aria-labelledby="mission">
              <h2 id="mission">ミッション</h2>
              <blockquote className="nc-quote">{site.mission}</blockquote>
            </section>

            <section aria-labelledby="message">
              <h2 id="message">代表メッセージ</h2>
              <p className="nc-pending">
                原稿を準備中です。公開までしばらくお待ちください。
                <br />
                <span>
                  実装メモ: 要件定義書 14. の未解決事項。発注者から原稿を受領後、
                  <code>app/about/message/page.tsx</code> に反映してください。
                </span>
              </p>
              <Link href="/about/message" className="nc-more">
                <i aria-hidden="true" />
                代表メッセージのページへ
              </Link>
            </section>

            <section aria-labelledby="philosophy">
              <h2 id="philosophy">私たちの考え方</h2>

              <h3 id="why-students">なぜ学生なのか</h3>
              <p>
                戦略コンサルティングでは、本来高い付加価値が発揮されるべき考察・示唆の工程に加え、調査・分析・資料作成といった工数集約的な業務も一体として提供されることが多く、必ずしも高付加価値を必要としない工程にも相応のコストが発生しています。
              </p>
              <p>
                この構造がある限り、「外注するほどではない」「社内では手が回らない」規模の課題は手つかずのまま残ります。当社は、工数集約的で再現性の高い工程を一定のスキル水準が担保された学生が担うことで、この価格帯の壁を下げることを選びました。
              </p>
              <p>
                同時に、学生にとっては練習課題ではない実際の企業案件が経験になります。企業の課題解決と人材育成を同じ仕組みの中で成立させること自体が、当社の事業設計です。
              </p>

              <h3 id="quality">品質はどう担保するのか</h3>
              <p>
                学生に丸投げする体制ではありません。役割を3層に分け、経験のあるコンサルタントが論点設定と成果物の監修を担当します。品質の責任は当社が負います。
              </p>
              <ul className="nc-checklist">
                <li>論点の設定と成果物の監修は、経験のあるコンサルタントが行う</li>
                <li>リード学生が案件のディレクションと進捗管理、企業との窓口を担う</li>
                <li>調査の型と評価項目を定型化し、担当者が変わっても出力の水準を揃える</li>
                <li>納品前に必ず内容の確認工程を挟む</li>
              </ul>
            </section>

            <section aria-labelledby="structure">
              <h2 id="structure">組織体制</h2>
              <p className="nc-section-lead">
                アソシエイト学生がリード学生へ昇格し、新しいチームを組成する。この循環によって、対応できる案件量が拡大していきます。
              </p>
              <StructureDiagram />
            </section>

            <section aria-labelledby="company">
              <h2 id="company">会社情報</h2>
              <CompanyTable />
              <Link href="/about/company" className="nc-more">
                <i aria-hidden="true" />
                会社情報の詳細へ
              </Link>
            </section>

            <section aria-labelledby="history">
              <h2 id="history">沿革</h2>
              <History />
            </section>
          </div>
        </div>
      </div>

      <ContactCta secondary={{ label: '事業内容を見る', href: '/services' }} />
    </>
  );
}
