import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  CONTACT_ESTIMATE, CONTACT_GENERAL, IMG, SAMPLE_PDF,
  caseFile, comparison, faq, flow, plans, type Mark,
} from './data';
import { ReportViewer } from './ReportViewer';
import { LensSwitcher } from './LensSwitcher';
import { PageZoom } from './PageZoom';
import s from './lp.module.css';

/**
 * 既存顧客企業クローズアップ LP。
 *
 * 主役は「実際に納品されるレポート」。架空企業ミオリ食品の5ページのサンプルを、
 * 実物と同じ型・同じ分量で作り（design/existing-customers-sample/）、その画像を見せる。
 * 構成は購買検討の順に並べた:
 *   何が届くか（ヒーロー）→ どう読み解くか → 中身の全体 → 自社向けに変わるか
 *   → 他の手段との違い → 信頼できるか → いくらで・どう頼むか → 疑問 → 相談
 * 赤は「示唆」だけに使う。実際のレポートで赤字が提案につながる発見を示すのと同じ規則。
 */

/** スライド上の位置（in）を、切り抜き画像に対する % に直す。スライドは 10.83in × 7.5in */
type Crop = { x: number; y: number; w: number; h: number };
const PAGE: Crop = { x: 0, y: 0, w: 10.83, h: 7.5 };
const MAP_CROP: Crop = { x: 0.25, y: 1.95, w: 7.32, h: 4.75 };
/** 4ページ目の取引マップのセル（row: 商品カテゴリ, col: 物流工程） */
function cell(row: number, col: number, crop: Crop): CSSProperties {
  return {
    left: `${((1.6 + 1.48 * col - crop.x) / crop.w) * 100}%`,
    top: `${((2.68 + 0.92 * row - crop.y) / crop.h) * 100}%`,
    width: `${(1.42 / crop.w) * 100}%`,
    height: `${(0.86 / crop.h) * 100}%`,
  };
}

function MarkIcon({ mark }: { mark: Mark }) {
  const label = mark === 'yes' ? '対応' : mark === 'part' ? '一部' : '対応しない';
  return <span className={s.mark} data-mark={mark} aria-label={label} role="img" />;
}

/** 分量の目安を紙の枚数で見せる（実際のページではなく、枚数の記号） */
function Sheets({ count, more }: { count: number; more?: boolean }) {
  return (
    <span className={s.sheets} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => <i key={i} />)}
      {more ? <em>…</em> : null}
    </span>
  );
}

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
              顧客の事業・業績・商品・販路・直近の動向を公開情報から調べ、御社の商材との接点を整理します。
              まだ取引できていない領域と、そこへの提案仮説まで。営業がそのまま使えるレポートにして納品します。
            </p>
            <dl className={s.facts}>
              <div>
                <dt>参考価格（1社）</dt>
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
                  alt="サンプルレポート4ページ目。架空企業ミオリ食品の商品カテゴリと物流工程を掛け合わせ、取引中・他社委託・新規発生の区画を色分けした取引マップ"
                  fetchPriority="high"
                />
                <span className={s.hitHave} style={cell(1, 1, PAGE)} aria-hidden="true"><b>1</b></span>
                <span className={s.hitNew} style={cell(0, 2, PAGE)} aria-hidden="true"><b>2</b></span>
                <span className={s.hitNew} style={cell(2, 2, PAGE)} aria-hidden="true" />
                <span className={s.hitNew} style={cell(3, 3, PAGE)} aria-hidden="true" />
              </div>
              <figcaption className={s.finding}>
                <p className={s.findingHead}>この1枚から読み取れること</p>
                <ol>
                  <li><b className={s.findingNoHave}>1</b>取引できているのは、この1区画だけ</li>
                  <li><b className={s.findingNoNew}>2</b>伸びている冷凍の側に、未取引の区画が3つ</li>
                </ol>
                <p className={s.findingFoot}>→ 5ページ目で、優先度つきの提案仮説3件に</p>
              </figcaption>
            </figure>
          </div>
        </div>
        <p className={s.provenance}>
          掲載しているのは説明用の架空企業「ミオリ食品」のサンプルです。実際の納品物と同じ型・同じ分量で作成しています。
        </p>
      </section>

      {/* ------------------------------------------------------- 読み解きの4段 */}
      <section className={s.reading} id="reading" aria-labelledby="reading-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <h2 id="reading-title" className={s.h2}>1社を、こう読み解きます</h2>
            <p className={s.secLead}>
              企業情報を集めて並べるだけでは、営業の次の一手にはなりません。
              サンプルのミオリ食品を例に、事実から提案仮説に至るまでの4つの段階を、レポートの実物でたどります。
            </p>
          </header>

          <dl className={s.caseStrip} aria-label="サンプルの前提">
            <div className={s.caseStripName}>
              <dt>分析対象</dt>
              <dd>{caseFile.name}<small>{caseFile.note}</small></dd>
            </div>
            {caseFile.rows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <ol className={s.steps}>
            {/* 01: 図と、そこから読む数字を左右に */}
            <li className={s.stepSplit}>
              <div className={s.stepText}>
                <p className={s.stepNo}>01</p>
                <h3 className={s.h3}>伸びている事業を、数字で特定する</h3>
                <p>決算公告・会社案内から事業別の売上を並べ直します。顧客の中で「どこに資金と人が向かっているか」から読み始めます。</p>
                <dl className={s.numbers}>
                  <div>
                    <dt>冷凍食品の売上</dt>
                    <dd><b>68</b>億円<span>→</span><b>113</b>億円</dd>
                    <dd className={s.numbersNote}>2023 → 2026予　約1.7倍</dd>
                  </div>
                  <div>
                    <dt>冷凍食品の売上比率</dt>
                    <dd><b>32</b>%<span>→</span><b>41</b>%</dd>
                    <dd className={s.numbersNote}>中計では2028年度に50%</dd>
                  </div>
                </dl>
              </div>
              <figure className={s.stepFigure}>
                <PageZoom page={1}>
                  <img src={`${IMG}/detail-sales-1600.webp`} srcSet={`${IMG}/detail-sales-960.webp 960w, ${IMG}/detail-sales-1600.webp 1097w`} sizes="(min-width: 1200px) 640px, 100vw" width={1097} height={671} alt="1ページ目より、事業別の売上の積み上げ棒グラフ（2023年から2026年予想）" loading="lazy" decoding="async" />
                </PageZoom>
                <figcaption>1ページ目「会社概要」より。事業別の売上推移（単位：億円）</figcaption>
              </figure>
            </li>

            {/* 02: 横長の時系列と影響表は全幅で読ませる */}
            <li className={s.stepFull}>
              <div className={s.stepTextWide}>
                <p className={s.stepNo}>02</p>
                <h3 className={s.h3}>変化を、時系列の線にする</h3>
                <p>中期経営計画、工場の新設、EC開設、業務用の拡販。ばらばらに出ている情報を一本の時系列に並べ、それぞれが御社の領域に何をもたらすかまで書きます。</p>
              </div>
              <figure className={s.stepFigure}>
                <PageZoom page={3}>
                  <img src={`${IMG}/detail-events-1600.webp`} srcSet={`${IMG}/detail-events-960.webp 960w, ${IMG}/detail-events-1600.webp 1600w`} sizes="(min-width: 1280px) 1200px, 100vw" width={1600} height={372} alt="3ページ目より、2024年から2026年の主な出来事を並べた時系列" loading="lazy" decoding="async" />
                <img className={s.stepFigureNext} src={`${IMG}/detail-impact-1600.webp`} srcSet={`${IMG}/detail-impact-960.webp 960w, ${IMG}/detail-impact-1600.webp 1600w`} sizes="(min-width: 1280px) 1200px, 100vw" width={1600} height={442} alt="3ページ目より、出来事ごとの物流への影響・物量の伸び・当社の現状を整理した表" loading="lazy" decoding="async" />
                </PageZoom>
                <figcaption>3ページ目「直近の動向」より。出来事の時系列と、物流への影響</figcaption>
              </figure>
            </li>

            {/* 03: 取引マップは印を重ね、読み取りを横に置く */}
            <li className={s.stepSplitReverse}>
              <figure className={s.stepFigure}>
                <PageZoom page={4}>
                  <span className={s.marked}>
                  <img src={`${IMG}/detail-map-1600.webp`} srcSet={`${IMG}/detail-map-960.webp 960w, ${IMG}/detail-map-1600.webp 1600w`} sizes="(min-width: 1200px) 760px, 100vw" width={1600} height={1039} alt="4ページ目より、商品カテゴリと物流工程の取引マップ" loading="lazy" decoding="async" />
                  <span className={s.hitHave} style={cell(1, 1, MAP_CROP)} aria-hidden="true"><b>1</b></span>
                  <span className={s.hitNew} style={cell(0, 2, MAP_CROP)} aria-hidden="true"><b>2</b></span>
                  <span className={s.hitNew} style={cell(2, 2, MAP_CROP)} aria-hidden="true" />
                  <span className={s.hitNew} style={cell(3, 3, MAP_CROP)} aria-hidden="true" />
                  </span>
                </PageZoom>
                <figcaption>4ページ目「取引状況の整理」より。商品カテゴリ × 物流工程の取引マップ</figcaption>
              </figure>
              <div className={s.stepText}>
                <p className={s.stepNo}>03</p>
                <h3 className={s.h3}>御社の取引と、突き合わせる</h3>
                <p>ご共有いただける範囲の取引状況を、顧客の事業と重ねます。</p>
                <ol className={s.readout}>
                  <li><b className={s.findingNoHave}>1</b>取引できているのは「チルド惣菜 × 関西の量販配送」の1区画だけ</li>
                  <li className={s.readoutSignal}><b className={s.findingNoNew}>2</b>伸びている冷凍の側に、委託先がまだ固まっていない区画が3つ</li>
                </ol>
              </div>
            </li>

            {/* 04: 提案は全幅で、文字が読める大きさに */}
            <li className={s.stepFull}>
              <div className={s.stepTextWide}>
                <p className={s.stepNo}>04</p>
                <h3 className={s.h3}>次に打つ手まで、書き切る</h3>
                <p>提案仮説ごとに、根拠となる事実と推察を分けて記し、想定規模・初回の打ち手・確認事項まで添えます。「調べて終わり」にせず、営業会議でそのまま検討できる形にします。</p>
              </div>
              <figure className={s.stepFigure}>
                <PageZoom page={5}>
                  <img src={`${IMG}/detail-proposal-1600.webp`} srcSet={`${IMG}/detail-proposal-960.webp 960w, ${IMG}/detail-proposal-1600.webp 1600w`} sizes="(min-width: 1280px) 1200px, 100vw" width={1600} height={240} alt="5ページ目より、優先度・高の提案仮説。事実・推察・提案・想定規模・初回の打ち手・確認事項を記載" loading="lazy" decoding="async" />
                </PageZoom>
                <figcaption>5ページ目「提案・連携余地」より。優先度・高の提案仮説（ほか2件を同じ形式で記載）</figcaption>
              </figure>
            </li>
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
                Standardプランのサンプル全5ページです。ページを選ぶと切り替わり、拡大すると原寸で読めます。
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
              企業データベースは基本情報を速く引くのに向いています。
              その先の「自社の商材がどこに入るか」と「何を提案するか」を、担当者の時間を使わずに揃えられるのがこのサービスです。
            </p>
          </header>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <caption className={s.srOnly}>営業担当の自主調査・企業データベース・Neunonへの依頼の比較</caption>
              <thead>
                <tr>
                  <th scope="col"><span className={s.srOnly}>比較の観点</span></th>
                  {comparison.columns.map((c, i) => (
                    <th key={c} scope="col" className={i === 2 ? s.colUs : undefined}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.cells.map(([mark, text], i) => (
                      <td key={i} className={i === 2 ? s.colUs : undefined} data-col={comparison.columns[i]}>
                        <MarkIcon mark={mark} />
                        <span>{text}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ 体制・実績 */}
      <section className={s.quality} id="quality" aria-labelledby="quality-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <h2 id="quality-title" className={s.h2}>品質は、レポートの中で確かめられます</h2>
            <p className={s.secLead}>
              読み手が「どこまでが事実か」を判断できるよう、書き方の決まりを全ページに通しています。サンプルの該当箇所を示します。
            </p>
          </header>

          <figure className={s.proof}>
            <PageZoom page={5}>
            <span className={s.marked}>
              <img src={`${IMG}/detail-proposal-1600.webp`} width={1600} height={240} alt="5ページ目の提案仮説。【事実】【推察】の書き分けと確認事項の記載箇所" loading="lazy" decoding="async" />
              <span className={s.pin} style={{ left: '27.2%', top: '8.5%' }} aria-hidden="true">1</span>
              <span className={s.pin} style={{ left: '27.2%', top: '21.5%' }} aria-hidden="true">2</span>
              <span className={s.pin} style={{ left: '27.2%', top: '66.5%' }} aria-hidden="true">3</span>
            </span>
            </PageZoom>
            <PageZoom page={3}>
            <span className={s.marked}>
              <img className={s.proofSource} src={`${IMG}/detail-source-1600.webp`} width={1600} height={78} alt="3ページ目の下部。出所・注記・作成時点の記載" loading="lazy" decoding="async" />
              <span className={s.pin} style={{ left: '-1.4%', top: '30%' }} aria-hidden="true">4</span>
            </span>
            </PageZoom>
          </figure>
          <ol className={s.proofList}>
            <li><b>1</b><div><h3 className={s.h4}>【事実】</h3><p>公開情報で確認できたこと。日付や数値を添えます。</p></div></li>
            <li><b>2</b><div><h3 className={s.h4}>【推察】【推定】</h3><p>事実から推し量ったこと。事実と同じ書き方にはしません。</p></div></li>
            <li><b>3</b><div><h3 className={s.h4}>確認事項</h3><p>提案の前に、顧客へ確かめるべきことを書き出します。</p></div></li>
            <li><b>4</b><div><h3 className={s.h4}>出所と時点</h3><p>各ページの下に情報源と作成時点を明記します。</p></div></li>
          </ol>

          <div className={s.qualityGrid}>
            <div className={s.team}>
              <h3 className={s.h3}>調査と確認の分担</h3>
              <ol className={s.teamFlow}>
                <li><span>調査・作成</span><b>リード学生1名＋アソシエイト学生1〜5名</b><small>定型の型に沿って調査し、資料にまとめる</small></li>
                <li><span>確認</span><b>経験のあるコンサルタント</b><small>納品前に内容を確認する</small></li>
                <li><span>納品</span><b>スライド形式</b><small>社内フォーマットへの合わせ込みも可</small></li>
              </ol>
              <p className={s.teamNote}>
                工数のかかる調査・資料作成を学生チームが担い、高い付加価値が必要な工程だけを経験者が担当する分業にしているため、この価格で提供できます。
                調査項目と評価の観点を型にしているので、担当者が変わっても水準が揃い、複数社を同じ物差しで並べられます。
              </p>
            </div>
            <div className={s.record}>
              <p className={s.recordNum}><b>数百</b>件</p>
              <p className={s.recordLabel}>企業・競合・市場分析レポートの累計作成件数（パッケージ型支援）</p>
              <h3 className={s.h3}>主な支援実績</h3>
              <ul className={s.recordList}>
                <li><b>国内主要容器メーカー</b>顧客企業クローズアップ、新規営業対象企業クローズアップ</li>
                <li><b>大手建設会社</b>M&amp;A候補企業の個社クローズアップ</li>
                <li><b>大手建設コンサルティング企業</b>新規事業候補市場の主要企業分析</li>
                <li><b>大手消費財メーカー</b>新規事業候補市場の競合企業分析</li>
              </ul>
              <p className={s.small}>守秘のため、取引先の名称は業種のみで記載しています。</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- 料金 */}
      <section className={s.price} id="price" aria-labelledby="price-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <h2 id="price-title" className={s.h2}>料金と依頼の流れ</h2>
            <p className={s.secLead}>1社単位の参考価格です。対象企業数・調査範囲・納期によって変動するため、正式な金額はお見積りでお伝えします。</p>
          </header>

          <div className={s.plans}>
            {plans.map((p) => {
              const featured = 'featured' in p && p.featured;
              return (
                <article key={p.name} className={featured ? s.planFeatured : s.plan}>
                  {featured ? <p className={s.planBadge}>このページのサンプル</p> : null}
                  <div className={s.planHead}>
                    <h3 className={s.planName}>{p.name}</h3>
                    <Sheets count={p.name === 'Light' ? 2 : p.name === 'Standard' ? 5 : 10} />
                  </div>
                  <p className={s.planPrice}><b>{p.price}</b>円／社</p>
                  <dl className={s.planSpec}>
                    <div><dt>分量</dt><dd>{p.volume}</dd></div>
                    <div><dt>納期の目安</dt><dd>{p.pace}</dd></div>
                    <div><dt>内容</dt><dd>{p.contents}</dd></div>
                  </dl>
                  <p className={s.planFit}>{p.fit}</p>
                </article>
              );
            })}
          </div>
          <p className={s.example}>
            例：重点顧客20社をStandardで依頼した場合、参考価格で<b>100,000円</b>。数社からのお試しも承ります。
          </p>

          <div className={s.flowGrid}>
            <ol className={s.flow}>
              {flow.map((f, i) => (
                <li key={f.title}>
                  <span className={s.flowNo}>{i + 1}</span>
                  <div>
                    <h3 className={s.h3}>{f.title}</h3>
                    <p>{f.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={s.prepare}>
              <h3 className={s.h3}>ご相談時にお知らせいただくこと</h3>
              <ul>
                <li>分析したい顧客の社名（数社からで構いません）</li>
                <li>御社の商材と、特に見てほしい観点</li>
                <li>わかる範囲での現在の取引状況</li>
              </ul>
              <Link href={CONTACT_ESTIMATE} className={s.btnPrimary}>見積もりを相談する</Link>
            </div>
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
