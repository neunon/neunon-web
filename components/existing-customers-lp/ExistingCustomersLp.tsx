import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import {
  CONTACT_ESTIMATE, CONTACT_GENERAL, IMG, SAMPLE_PDF,
  comparison, faq, flow, hypotheses, plans, records,
} from './data';
import { ReportViewer } from './ReportViewer';
import { LensSwitcher } from './LensSwitcher';
import { PageZoom } from './PageZoom';
import s from './lp.module.css';

/**
 * 既存顧客企業クローズアップ LP。
 *
 * 主役は「実際に納品されるレポート」。サンプル食品株式会社を分析した5ページのサンプルを、
 * 公式スライドテンプレートで作り（design/existing-customers-sample/）、その画像を見せる。
 * 構成は購買検討の順に並べた:
 *   何が届くか（ヒーロー）→ どう読み解くか → 提案仮説の質 → 中身の全体 → 自社向けに変わるか
 *   → 他の手段との違い → 実績 → いくらで・どう頼むか → 疑問 → 相談
 * 赤は「示唆」だけに使う。実際のレポートで赤字が提案につながる発見を示すのと同じ規則。
 */

/** 4ページ目の取引マップのセル位置（スライド 10.83in × 7.5in に対する %）。build_report.py の GX/CW/GY/RH と一致させる */
function cell(row: number, col: number): CSSProperties {
  return {
    left: `${((5.5 + 1.25 * col) / 10.83) * 100}%`,
    top: `${((2.54 + 0.86 * row) / 7.5) * 100}%`,
    width: `${(1.2 / 10.83) * 100}%`,
    height: `${(0.8 / 7.5) * 100}%`,
  };
}

type Step = {
  no: string;
  title: string;
  body: ReactNode;
  img: string;
  w: number;
  h: number;
  page: number;
  caption: string;
  narrow?: boolean;
};

const steps: Step[] = [
  {
    no: '01',
    title: '業績と事業構成を、数字で分解する',
    body: (
      <>
        <p>決算公告・会社案内から事業別の売上と利益を並べ直し、どの事業が伸び、どこに資金と人が向かっているかを特定します。</p>
        <dl className={s.numbers}>
          <div>
            <dt>冷凍食品の売上</dt>
            <dd><b>68</b>億円<span>→</span><b>113</b>億円</dd>
            <dd className={s.numbersNote}>2023 → 2026予　年+18%</dd>
          </div>
          <div>
            <dt>当社が取引するチルド惣菜</dt>
            <dd><b>61</b>億円<span>→</span><b>64</b>億円</dd>
            <dd className={s.numbersNote}>年+2%。今の取引の延長では伸びにくい</dd>
          </div>
        </dl>
      </>
    ),
    img: 'step-1', w: 1268, h: 1208, page: 1,
    caption: '1ページ目「業績・事業構成」より',
  },
  {
    no: '02',
    title: '強みと、顧客・販売チャネルを押さえる',
    body: (
      <>
        <p>誰に、どの経路で売っているか。販路の構成が変わると、必要になる物流・資材・設備も変わります。</p>
        <p>サンプルでは量販の比率が63%から55%へ下がり、外食・中食とEC・ふるさと納税が伸びています。あわせて、物流部の新設という「意思決定者の変化」も拾います。</p>
      </>
    ),
    img: 'step-2', w: 1119, h: 1208, page: 2,
    caption: '2ページ目「特徴・顧客・販売チャネル」より',
  },
  {
    no: '03',
    title: '商品・サービスごとに、入り込める余地を見る',
    body: (
      <>
        <p>商品・サービスの単位まで降りて、価格帯・販路・伸びを並べ、御社の商材との接点の大小を評価します。</p>
        <p>モノを売る企業でなくても同じです。サービスの種類や提供形態、対象顧客の単位で整理します。</p>
      </>
    ),
    img: 'step-3', w: 1141, h: 1175, page: 3,
    caption: '3ページ目「商品ラインナップ」より（4カテゴリのうち2つ）',
  },
  {
    no: '04',
    title: '筋のよい提案仮説にする',
    body: (
      <>
        <p>集めた事実を「根拠 → 読み → 提案」の順に組み立て、初回にどこへ何を持ち込むかまで書きます。確度と規模も添えて、どれから動くかを決めやすくします。</p>
        <p>サンプルで立てた3つの仮説を、次に示します。</p>
      </>
    ),
    img: 'step-4', w: 745, h: 1163, page: 5,
    caption: '5ページ目「提案仮説」より（3つのうち1つ）',
    narrow: true,
  },
];

const markLabel: Record<string, string> = { '◎': 'よく合う', '○': '対応できる', '△': '限られる', '×': '向かない' };

export function ExistingCustomersLp() {
  return (
    <div className={s.lp}>
      {/* ------------------------------------------------------------ ヒーロー */}
      <section className={s.hero} aria-labelledby="lp-title">
        <div className={s.heroInner}>
          <div className={s.heroCopy}>
            <nav aria-label="パンくず" className={s.crumbs}>
              <Link href="/">ホーム</Link>
              <span aria-hidden="true">/</span>
              <Link href="/services/package/">パッケージ型支援</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">既存顧客企業クローズアップ</span>
            </nav>
            <p className={s.kicker}>既存顧客企業クローズアップ</p>
            <h1 id="lp-title" className={s.h1}>
              既存顧客の企業分析を代行<span className={s.srOnly}>。</span>
              <span className={s.h1Sub}>取引先ごとの「次の提案」を、1社1レポートに。</span>
            </h1>
            <p className={s.lead}>
              顧客の業績・顧客と販売チャネル・商品・直近の変化を公開情報から調べ、御社の商材との接点を整理します。
              まだ取引できていない領域と、そこへの提案仮説まで。営業がそのまま使えるレポートにして納品します。
            </p>
            <dl className={s.facts}>
              <div>
                <dt>参考価格（1社・税抜）</dt>
                <dd><b>3,000</b>円〜</dd>
              </div>
              <div>
                <dt>分量（1社）</dt>
                <dd><b>1〜10</b>枚</dd>
              </div>
              <div>
                <dt>納期の目安</dt>
                <dd>週<b>10</b>社<small>Standard</small></dd>
              </div>
            </dl>
            <div className={s.ctaRow}>
              <Link href={CONTACT_ESTIMATE} className={s.btnPrimary}>見積もりを相談する</Link>
              <a href="#report" className={s.btnGhost}>サンプルレポートを見る</a>
            </div>
            <p className={s.heroNote}>数社からのお試しも承ります</p>
          </div>

          <div className={s.desk}>
            <img className={s.deskBack2} src={`${IMG}/page-1-720.webp`} width={720} height={499} alt="" aria-hidden="true" />
            <img className={s.deskBack1} src={`${IMG}/page-5-720.webp`} width={720} height={499} alt="" aria-hidden="true" />
            <figure className={s.deskFront}>
              <div className={s.deskSheet}>
                <img
                  src={`${IMG}/page-4-1440.webp`}
                  srcSet={`${IMG}/page-4-1440.webp 1440w, ${IMG}/page-4-2400.webp 2400w`}
                  sizes="(min-width: 1200px) 760px, 100vw"
                  width={1440}
                  height={997}
                  alt="サンプルレポート4ページ目。出来事の時系列と、商品カテゴリと物流工程を掛け合わせて取引中・他社委託・新規発生の区画を色分けした取引マップ"
                  fetchPriority="high"
                />
                <span className={s.hitHave} style={cell(1, 1)} aria-hidden="true"><b>1</b></span>
                <span className={s.hitNew} style={cell(0, 2)} aria-hidden="true"><b>2</b></span>
                <span className={s.hitNew} style={cell(2, 2)} aria-hidden="true" />
                <span className={s.hitNew} style={cell(3, 3)} aria-hidden="true" />
              </div>
              <figcaption className={s.finding}>
                <p className={s.findingHead}>この1枚から読み取れること</p>
                <ol>
                  <li><b className={s.findingNoHave}>1</b>取引できているのは、この1区画だけ</li>
                  <li><b className={s.findingNoNew}>2</b>伸びている冷凍の側に、未取引の区画が3つ</li>
                </ol>
                <p className={s.findingFoot}>→ 5ページ目で、筋のよい提案仮説3つに</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- 読み解きの4段 */}
      <section className={s.reading} id="reading" aria-labelledby="reading-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <h2 id="reading-title" className={s.h2}>1社を、こう読み解きます</h2>
            <p className={s.secLead}>
              企業情報を集めて並べるだけでは、営業の次の一手にはなりません。
              低温物流の会社が、取引先のサンプル食品を分析した例で、事実から提案仮説に至るまでをレポートの実物でたどります。
            </p>
          </header>

          <ol className={s.steps}>
            {steps.map((step, i) => (
              <li key={step.no} className={i % 2 === 0 ? s.stepSplit : s.stepSplitReverse}>
                <div className={s.stepText}>
                  <p className={s.stepNo}>{step.no}</p>
                  <h3 className={s.h3}>{step.title}</h3>
                  {step.body}
                </div>
                <figure className={step.narrow ? s.stepFigureNarrow : s.stepFigure}>
                  <PageZoom page={step.page}>
                    <img
                      src={`${IMG}/${step.img}-1600.webp`}
                      srcSet={`${IMG}/${step.img}-960.webp ${Math.min(960, step.w)}w, ${IMG}/${step.img}-1600.webp ${step.w}w`}
                      sizes="(min-width: 1200px) 620px, 100vw"
                      width={step.w}
                      height={step.h}
                      alt={step.caption}
                      loading="lazy"
                      decoding="async"
                    />
                  </PageZoom>
                  <figcaption>{step.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------- 提案仮説の例 */}
      <section className={s.hypo} id="hypotheses" aria-labelledby="hypo-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <h2 id="hypo-title" className={s.h2}>提案仮説の例</h2>
            <p className={s.secLead}>
              「冷凍が伸びているので保管を提案」のような、誰でも思いつく仮説では商談は動きません。
              時期の兆し、競合が持たない切り口、小さく入る入口。事実を組み合わせて、その会社ならではの筋を探します。
            </p>
          </header>
          <ol className={s.hypoList}>
            {hypotheses.map((h) => (
              <li key={h.no} className={s.hypoCard}>
                <div className={s.hypoHead}>
                  <p className={s.hypoNo}>仮説{h.no}</p>
                  <h3 className={s.hypoTitle}>{h.title}</h3>
                  <p className={s.hypoTags}>
                    {h.tags.map((t) => <span key={t} data-hot={t.endsWith('高') || t.endsWith('大') ? 'true' : undefined}>{t}</span>)}
                  </p>
                </div>
                <dl className={s.hypoChain}>
                  <div>
                    <dt>根拠（事実）</dt>
                    <dd><ul>{h.facts.map((f) => <li key={f}>{f}</li>)}</ul></dd>
                  </div>
                  <div>
                    <dt>読み（推察）</dt>
                    <dd>{h.reading}</dd>
                  </div>
                  <div className={s.hypoProposal}>
                    <dt>提案・初回の打ち手</dt>
                    <dd>{h.proposal}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------ レポート */}
      <section className={s.report} id="report" aria-labelledby="report-title">
        <div className={s.wrap}>
          <header className={s.secHeadRow}>
            <div>
              <h2 id="report-title" className={s.h2}>納品されるレポート</h2>
              <p className={s.secLead}>
                Standardプランの全5ページです。ページを選ぶと切り替わり、拡大すると原寸で読めます。
              </p>
            </div>
            <a href={SAMPLE_PDF} className={s.textLink}>PDFで開く（5ページ）</a>
          </header>
          <ReportViewer />
        </div>
      </section>

      {/* ---------------------------------------------------------------- 視点 */}
      <section className={s.lensSec} id="lens" aria-labelledby="lens-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <h2 id="lens-title" className={s.h2}>分析の視点は、御社の商材で変わります</h2>
            <p className={s.secLead}>
              同じ顧客でも、売るものが違えば見るべき場所は変わります。
              ご依頼のたびに御社の商材を伺い、その商材が入り込める接点を中心にレポートを組み立てます。
            </p>
          </header>
          <LensSwitcher />
        </div>
      </section>

      {/* ---------------------------------------------------------------- 比較 */}
      <section className={s.compare} id="compare" aria-labelledby="compare-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <h2 id="compare-title" className={s.h2}>企業分析を外注するなら、何が違うか</h2>
            <p className={s.secLead}>
              基本情報を速く引くなら企業データベース、戦略の検討なら調査会社やコンサルが向いています。
              このサービスが得意なのは、多くの取引先を同じ型で、御社の商材の視点から、提案仮説まで揃えることです。
            </p>
          </header>
          <div className={s.cmp} role="table" aria-label="自社調査・企業データベース・調査会社・Neunonの比較">
            <div className={s.cmpHead} role="row">
              <span role="columnheader" className={s.cmpCorner}>
                <span className={s.cmpLegend}>◎ よく合う　○ 対応できる　△ 限られる　× 向かない</span>
              </span>
              {comparison.columns.map((c, i) => (
                <span role="columnheader" key={c.name} className={i === 3 ? s.cmpUsHead : s.cmpColHead}>
                  <b>{c.name}</b>
                  <small>{c.note}</small>
                </span>
              ))}
            </div>
            {comparison.rows.map((row, ri) => (
              <div role="row" key={row.label} className={s.cmpRow} data-last={ri === comparison.rows.length - 1 ? 'true' : undefined}>
                <span role="rowheader" className={s.cmpLabel}>{row.label}</span>
                {row.cells.map(([mark, t], i) => (
                  <span role="cell" key={i} className={i === 3 ? s.cmpUs : s.cmpCell} data-col={comparison.columns[i].name}>
                    <i className={s.cmpMark} data-mark={mark} aria-label={markLabel[mark]}>{mark}</i>
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- 実績 */}
      <section className={s.records} id="records" aria-labelledby="records-title">
        <div className={s.wrap}>
          <div className={s.recordsGrid}>
            <div>
              <h2 id="records-title" className={s.h2}>支援実績</h2>
              <p className={s.recordNum}><b>数百</b>件</p>
              <p className={s.recordLabel}>企業・競合・市場分析レポートの累計作成件数（パッケージ型支援）</p>
            </div>
            <div>
              <ul className={s.recordList}>
                {records.map((r) => (
                  <li key={r.client}>
                    <b>{r.client}</b>
                    <span>{r.work}</span>
                  </li>
                ))}
              </ul>
              <p className={s.small}>守秘のため、取引先の名称は業種のみで記載しています。プロフェッショナルコンサルタントとの協働案件を含みます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- 料金 */}
      <section className={s.price} id="price" aria-labelledby="price-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <h2 id="price-title" className={s.h2}>料金と依頼の流れ</h2>
            <p className={s.secLead}>1社単位の参考価格（税抜）です。対象企業数・調査範囲・納期によって変動するため、正式な金額はお見積りでお伝えします。数社からのお試しも承ります。</p>
          </header>

          <div className={s.plans}>
            {plans.map((p) => (
              <article key={p.name} className={s.plan}>
                <h3 className={s.planName}>{p.name}</h3>
                <p className={s.planPrice}><b>{p.price}</b>円／社<small>（税抜）</small></p>
                <dl className={s.planSpec}>
                  <div><dt>分量</dt><dd>{p.volume}</dd></div>
                  <div><dt>納期の目安</dt><dd>{p.pace}</dd></div>
                  <div><dt>内容</dt><dd>{p.contents}</dd></div>
                </dl>
                <p className={s.planFit}>{p.fit}</p>
              </article>
            ))}
          </div>

          <h3 className={s.flowTitle}>依頼の流れ</h3>
          <ol className={s.flow}>
            {flow.map((f, i) => (
              <li key={f.title}>
                <span className={s.flowNo}>{i + 1}</span>
                <h4 className={s.flowStep}>{f.title}</h4>
                <p>{f.body}</p>
              </li>
            ))}
          </ol>

          <div className={s.prepare}>
            <div>
              <h3 className={s.h3}>ご相談時にお知らせいただくこと</h3>
              <ul>
                <li>分析したい顧客の社名（数社からで構いません）</li>
                <li>御社の商材と、特に見てほしい観点</li>
                <li>（任意）わかる範囲での現在の取引状況</li>
              </ul>
            </div>
            <Link href={CONTACT_ESTIMATE} className={s.btnPrimary}>見積もりを相談する</Link>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- FAQ */}
      <section className={s.faq} id="faq" aria-labelledby="faq-title">
        <div className={s.wrapNarrow}>
          <header className={s.secHead}>
            <h2 id="faq-title" className={s.h2}>よくある質問</h2>
          </header>
          <div className={s.faqList}>
            {faq.map((item) => (
              <details key={item.q} className={s.faqItem}>
                <summary><h3 className={s.faqQ}>{item.q}</h3></summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ 最後の相談 */}
      <section className={s.final} aria-labelledby="final-title">
        <div className={s.finalInner}>
          <div>
            <h2 id="final-title" className={s.finalTitle}>まず数社、御社の顧客で試してみませんか。</h2>
            <p>分析したい顧客の社名と、御社の商材をお知らせください。観点とプランをご提案し、お見積りをお送りします。</p>
          </div>
          <div className={s.finalActions}>
            <Link href={CONTACT_ESTIMATE} className={s.btnPrimaryInverse}>見積もりを相談する</Link>
            <Link href={CONTACT_GENERAL} className={s.btnGhostInverse}>サービスについて質問する</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
