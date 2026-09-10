import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { TableOfContents, type TocItem } from '@/components/toc/TableOfContents';
import { CompanyTable } from '@/components/about/CompanyTable';
import { OrganizationDiagram } from '@/components/about/OrganizationDiagram';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: '会社概要',
  description:
    '株式会社Neunon Consulting の会社概要。ミッション、私たちの考え方（なぜ学生なのか、品質はどう担保するのか）、組織体制、会社情報を掲載しています。経験のあるコンサルタントが監修し、学生チームが実務を担う体制です。',
  alternates: { canonical: '/about' },
};

const toc: TocItem[] = [
  { id: 'mission', label: 'ミッション' },
  { id: 'philosophy', label: '私たちの考え方' },
  { id: 'structure', label: '組織体制' },
  { id: 'company', label: '会社情報' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="限られたリソースで、より大きなインパクトを。"
        lead="実務品質の成果と、次世代のビジネス人材育成を、ひとつの仕組みで実現します。"
        crumbs={[{ label: '会社概要' }]}
      />

      <div className="section nc-about-page">
        <div className="wrap nc-doc">
          <TableOfContents items={toc} title="Contents" />

          <div className="nc-doc-body">
            <section id="mission" className="nc-about-mission" aria-labelledby="mission-title">
              <span className="nc-about-kicker">01 — Mission</span>
              <h2 id="mission-title">支援と育成を、同じ現場で。</h2>
              <blockquote>{site.mission}</blockquote>
            </section>

            <section id="philosophy" className="nc-about-philosophy" aria-labelledby="philosophy-title">
              <span className="nc-about-kicker">02 — Philosophy</span>
              <h2 id="philosophy-title">学生だから任せるのではなく、<br />仕組みがあるから任せられる。</h2>
              <div className="nc-about-principles">
                <article>
                  <span>Why students</span>
                  <h3>工数集約型の実務に、若い知性と推進力を。</h3>
                  <p>
                    調査・分析・資料作成など、品質を保ちながら多くの工数を要する業務を、一定のスキルを備えた学生が担います。企業には実行力を、学生には実案件で成長する機会を届けます。
                  </p>
                </article>
                <article>
                  <span>Quality control</span>
                  <h3>品質の責任は、プロフェッショナルが持つ。</h3>
                  <p>
                    論点設計と成果物の監修は経験あるコンサルタントが担当。リード学生が進捗と実務を管理し、確認工程を経た成果物だけを納品します。
                  </p>
                </article>
              </div>
            </section>

            <section id="structure" className="nc-about-structure" aria-labelledby="structure-title">
              <span className="nc-about-kicker">03 — Organization</span>
              <h2 id="structure-title">学生組織による実行基盤</h2>
              <p className="nc-section-lead">
                プロフェッショナルの品質管理のもと、リード学生とアソシエイト学生が複層的に動く体制です。この構造そのものが当社の提供価値です。
                <br />
                アソシエイト学生がリード学生へ昇格し、新しいチームを組成する循環によって、対応できる案件量が拡大していきます。
              </p>
              <OrganizationDiagram />
            </section>

            <section id="company" className="nc-about-company" aria-labelledby="company-title">
              <span className="nc-about-kicker">04 — Company</span>
              <h2 id="company-title">会社情報</h2>
              <CompanyTable />
            </section>
          </div>
        </div>
      </div>

      <ContactCta secondary={{ label: '事業内容を見る', href: '/services' }} />
    </>
  );
}
