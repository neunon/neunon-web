import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { TableOfContents, type TocItem } from '@/components/toc/TableOfContents';
import { CompanyTable } from '@/components/about/CompanyTable';
import { OrganizationDiagram } from '@/components/about/OrganizationDiagram';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: '企業情報',
  description:
    '株式会社Neunon Consultingのミッション、学生組織による実行基盤、品質管理体制、会社情報をご紹介します。',
  alternates: { canonical: '/about' },
};

const toc: TocItem[] = [
  { id: 'mission', label: 'ミッション' },
  { id: 'develop-people', label: '人材育成に対する考え' },
  { id: 'structure', label: '組織体制' },
  { id: 'company', label: '会社情報' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="企業情報"
        lead="株式会社Neunon Consultingの理念、学生組織による実行基盤、会社情報をご紹介します。"
        crumbs={[{ label: '企業情報' }]}
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

            <section id="develop-people" className="nc-about-people" aria-labelledby="develop-people-title">
              <span className="nc-about-kicker">02 — Our View on People Development</span>
              <h2 id="develop-people-title">AIが考える時代に、<br />考える力を手放さない。</h2>
              <div className="nc-about-people-intro">
                <h3>学校の授業だけでは、得られない経験があります。</h3>
                <p>私たちは、学生に完成された答えを与えるのではなく、自ら考えなければ前に進めない実務経験を提供します。こうした人間としての経験を土台に、自ら考え、発想し、判断できる人材を育てたいと考えています。</p>
                <p>AIが高度化する時代だからこそ、自ら問い、発想し、考え、判断する力を磨き続けることが、これまで以上に重要になると考えているからです。</p>
              </div>

              <div className="nc-about-people-points">
                <article>
                  <span>01</span>
                  <div>
                    <h3>思考格差の拡大</h3>
                    <p>AIの発展により、多くの作業で一定水準の成果を出しやすくなり、一見すると人々の能力差は縮まるようにも見えます。しかし私たちは、むしろこれまで以上に広がる可能性があると考えています。</p>
                    <p>AIの答えをそのまま受け取るのではなく、自ら問いを持ち、前提を疑い、検証し、必要な情報を選び、異なる考えを統合し、最後は自分自身で判断する能力。AIとともに考えながらも、思考の主導権を自分に残す力です。これが人々の成果の差を大きくしていくと考えています。</p>
                    <p>近年の教育研究でも、AIの出力に異議を唱え、矛盾を捉え、自らの判断を保持する「epistemic agency（知的主体性）」の重要性や、あえて「認知的摩擦」を残し、自ら考える機会を意図的に確保することの必要性が議論されています。</p>
                  </div>
                </article>
                <article>
                  <span>02</span>
                  <div>
                    <h3>「人間」起点の思考差</h3>
                    <p>ビジネスにおける課題に向き合うとき、判断をつくるのは情報や論理だけとは限らず、直感・勘、情、倫理観・良心、価値観・美意識、責任といったものが存在します。人間の思考の起点とその先の判断には、こうした「人間」ならではの経験や感覚が深く関わっています。</p>
                    <p>AIは思考や発想を支援できます。しかし、こうした人間的判断を土台に、自ら問い、発想し、考え、判断する力を磨くことには、AIが発展する時代だからこそ、より大きな意味があると考えています。</p>
                  </div>
                </article>
                <article>
                  <span>03</span>
                  <div>
                    <h3>残り続ける判断主体</h3>
                    <p>ビジネスでは、明確な正解がない中で判断を繰り返す必要があります。AIは思考や発想の支援から、さらには判断そのものも委ねられます。しかし、何をAIに委ね、何を人が担うのか。どの基準で判断させ、どの結果を受け入れるのか。そこには人間自身の判断が残ります。</p>
                    <p>だからこそ、自ら考え、判断する力を磨き続けることが重要です。</p>
                  </div>
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
