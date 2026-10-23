import Link from 'next/link';
import { ArrowRight, ArrowDown, Building2, Coins, FileLock2, FileText, Layers, Lightbulb, Search, ShieldCheck } from 'lucide-react';
import {
  CONTACT_DOCS, CONTACT_ESTIMATE, CONTACT_GENERAL, IMG,
  compare, faq, flow, hypotheses, insights, labelSample, mainHypothesis, plans, promises, proposals, records,
  salesChecks, scopeItems, signals, terms,
} from './data';
import { PlanCta } from './PlanCta';
import { ReportViewer } from './ReportViewer';
import { StickyCta } from './StickyCta';
import { Tracker } from './Tracker';
import s from './lp.module.css';

/**
 * 既存顧客企業クローズアップ LP（第11版）。
 *
 * デザインの考え方: 「白い紙と黄色のマーカー」。地は白とオフホワイト、文字はチャコール、
 * 強調は1色の黄色（価格の下線・相談ボタン・発見の強調）。濃い面は「提案仮説」と「料金」の2か所だけ。
 * レポートの画像はファーストビューと成果物の2か所に集める。提案仮説は Web 独自の図解で見せる。
 *
 * 構成（重要な節ほど面積と強調を大きく）
 *   ファーストビュー → できること（3つの価値） → ★提案仮説の具体例 → ★成果物 → ★比較表 → ★料金
 *   → 実績と体制 → 流れ・FAQ（簡潔に） → 最後の相談
 */

const FIT_LABEL = ['主な用途ではない', '条件・依頼内容による', '向いている'] as const;

function Cta({ at, sample = false, dark = false }: { at: string; sample?: boolean; dark?: boolean }) {
  return (
    <div className={s.ctaRow}>
      <Link href={CONTACT_ESTIMATE} className={s.btnPrimary} data-track="cta_estimate" data-track-at={at}>
        見積もりを依頼する<span className={s.btnArrow} aria-hidden="true"><ArrowRight size={17} strokeWidth={2.6} /></span>
      </Link>
      {sample ? (
        <a href="#report" className={dark ? s.btnGhostDark : s.btnGhost} data-track="cta_sample" data-track-at={at}>
          サンプルレポートを見る<ArrowDown aria-hidden="true" size={17} strokeWidth={2.2} />
        </a>
      ) : (
        <Link href={CONTACT_DOCS} className={dark ? s.btnGhostDark : s.btnGhost} data-track="cta_docs" data-track-at={at}>資料を請求する</Link>
      )}
    </div>
  );
}

function FitMark({ v }: { v: 0 | 1 | 2 }) {
  return <span className={s.fit} data-v={v} role="img" aria-label={FIT_LABEL[v]} />;
}

const PROMISE_ICON = { price: Coins, scope: Search, idea: Lightbulb } as const;
/** 事実 → 推察のつながり（色で対応させる） */
const LINK_OF: Record<string, number> = { '1': 0, '3': 0, '2': 1, '4': 1, '5': 2 };

export function ExistingCustomersLp() {
  return (
    <div className={s.lp}>
      <Tracker />

      {/* ============================================================ ファーストビュー */}
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
            <p className={s.heroTag}><span>既存顧客企業クローズアップ</span>企業分析の代行サービス</p>
            <h1 id="lp-title" className={s.h1}>
              既存顧客の<br />企業分析を代行<span className={s.srOnly}>。</span>
              <span className={s.h1Sub}>取引先ごとに<em>「次の提案」</em>が見つかる、営業のための個社別レポート</span>
            </h1>
            <div className={s.heroPrice}>
              <p className={s.heroPriceMain}>
                <span className={s.heroPriceUnit}>1社</span>
                <b>3,000</b>
                <span className={s.heroPriceYen}>円から</span>
              </p>
              <p className={s.heroPriceNote}>税抜の参考価格。1社単位で依頼でき、数社のお試しも承ります</p>
            </div>
            <div id="lp-hero-cta"><Cta at="hero" sample /></div>
            <ul className={s.heroAssure}>
              <li><ShieldCheck aria-hidden="true" size={16} strokeWidth={2} />秘密保持契約を締結</li>
              <li><FileText aria-hidden="true" size={16} strokeWidth={2} />スライド形式で納品</li>
              <li><Building2 aria-hidden="true" size={16} strokeWidth={2} />非上場企業も対応</li>
            </ul>
          </div>

          <figure className={s.mock}>
            <div className={s.heroBlob} aria-hidden="true" />
            <div className={s.laptop}>
              <div className={s.screen}>
                <img
                  src={`${IMG}/matching-960.webp`}
                  srcSet={`${IMG}/matching-640.webp 640w, ${IMG}/matching-960.webp 960w, ${IMG}/matching-1440.webp 1440w`}
                  sizes="(min-width: 1200px) 640px, 92vw"
                  width={960}
                  height={665}
                  alt="サンプルレポートの「既存取引との照合」のページ。ブランドと容器のカテゴリごとに、当社取引中・他社・新規発生・要確認を示した表"
                  fetchPriority="high"
                />
              </div>
              <div className={s.base} aria-hidden="true" />
            </div>
            <div className={s.printBack} aria-hidden="true">
              <img src={`${IMG}/products-640.webp`} width={640} height={443} alt="" />
            </div>
            <div className={s.print}>
              <img
                src={`${IMG}/proposal-640.webp`}
                srcSet={`${IMG}/proposal-640.webp 640w, ${IMG}/proposal-960.webp 960w`}
                sizes="(min-width: 1200px) 300px, 45vw"
                width={640}
                height={443}
                alt="サンプルレポートの「提案・連携余地」のページ"
              />
            </div>
            <p className={`${s.badge} ${s.badgeA}`}><b>数百</b><span>件の分析実績</span></p>
            <p className={`${s.badge} ${s.badgeB}`}><span>Standard</span><b>週10</b><span>社が目安</span></p>
            <figcaption className={s.mockCap}>納品レポートの例（架空企業のサンプル）</figcaption>
          </figure>
        </div>
        <div className={s.logoBar}>
          <p className={s.logoBarLabel}>主な支援先</p>
          <ul>
            {records.map((r) => <li key={r.client}>{r.client}</li>)}
          </ul>
        </div>
      </section>

      {/* ============================================================ できること */}
      <section className={s.promise} id="value" aria-labelledby="value-title">
        <div className={s.wrap}>
          <div className={s.promiseHead}>
            <p className={s.eyebrow}>できること</p>
            <h2 id="value-title" className={s.h2}>安く、広く、深く。<br />既存顧客の深耕に、<mark className={s.hl}>営業の目線の企業分析</mark>を</h2>
          </div>
          <ol className={s.promiseList}>
            {promises.map((p, i) => {
              const Icon = PROMISE_ICON[p.key];
              return (
                <li key={p.key}>
                  <span className={s.promiseIcon} aria-hidden="true"><Icon size={26} strokeWidth={1.9} /></span>
                  <p className={s.promiseStat}><b>{p.stat}</b>{p.unit}</p>
                  <h3 className={s.promiseTitle}><span>{String(i + 1).padStart(2, '0')}</span>{p.title}</h3>
                  <p className={s.promiseBody}>{p.body}</p>
                </li>
              );
            })}
          </ol>
          <div className={s.scopeRow}>
            <p className={s.scopeLabel}>調べる領域</p>
            <ul className={s.scopeTags}>
              {scopeItems.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================ ★提案仮説の具体例 */}
      <section className={s.idea} id="hypothesis" aria-labelledby="idea-title">
        <div className={s.wrap}>
          <header className={s.ideaHead}>
            <p className={s.eyebrowDark}>提案仮説の具体例</p>
            <h2 id="idea-title" className={s.h2Dark}>ばらばらの事実を組み合わせると、<br /><mark className={s.hlDark}>まだ頼まれていない提案</mark>が見えてくる</h2>
            <p className={s.ideaLead}>「新商品が出たから、その容器を提案する」だけなら誰でも考えます。企業クローズアップでは、商品・組織・取引の情報を掛け合わせて、顧客がまだ言葉にしていないニーズを仮説にします。</p>
            <p className={s.ideaCase}><span>例</span>樹脂容器メーカーの依頼で、化粧品メーカー（架空）を分析した場合</p>
          </header>

          <div className={s.board}>
            <div className={s.col}>
              <p className={s.colHead}><b>A</b>集めた事実<small>公開情報・取引情報</small></p>
              <ol className={s.signals}>
                {signals.map((x) => (
                  <li key={x.no} data-link={LINK_OF[x.no]}>
                    <span className={s.sigNo}>{x.no}</span>
                    <div>
                      <p className={s.sigTitle}>{x.title}</p>
                      <p className={s.sigBody}>{x.body}</p>
                      <p className={s.sigSrc}>出所：{x.src}</p>
                    </div>
                    {'img' in x && <img className={s.sigImg} src={`${IMG}/${x.img}.webp`} width={960} height={656} alt="" loading="lazy" decoding="async" />}
                  </li>
                ))}
              </ol>
            </div>
            <div className={s.col}>
              <p className={s.colHead}><b>B</b>組み合わせて読む<small>推察</small></p>
              <ol className={s.insights}>
                {insights.map((x, i) => (
                  <li key={x.title} data-link={i}>
                    <p className={s.insFrom}>{x.from.map((n) => <span key={n}>{n}</span>)}<i aria-hidden="true">を重ねると</i></p>
                    <p className={s.insTitle}>{x.title}</p>
                    <p className={s.insBody}>{x.body}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className={s.col}>
              <p className={s.colHead}><b>C</b>提案の仮説<small>商談で確かめる</small></p>
              <ol className={s.proposals}>
                {proposals.map((x, i) => (
                  <li key={x.title}>
                    <span>{i + 1}</span>
                    <div><p className={s.propTitle}>{x.title}</p><p className={s.propBody}>{x.body}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className={s.verdict}>
            <p className={s.verdictLabel}>導いた提案の方向</p>
            <p className={s.verdictText}>{mainHypothesis}</p>
            <p className={s.verdictNote}>案件ごとの取引から、継続的な開発パートナーへ。調査だけで確定はできないため、次の商談で確かめます。</p>
          </div>

          <div className={s.checks}>
            <div>
              <p className={s.checksHead}>次の商談で確かめること</p>
              <ul>
                {salesChecks.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
            <div className={s.checksCta}>
              <p>御社の顧客でも、この粒度で提案の仮説をまとめます。</p>
              <Link href={CONTACT_ESTIMATE} className={s.btnPrimary} data-track="cta_estimate" data-track-at="hypothesis">
                自社の顧客で相談する<span className={s.btnArrow} aria-hidden="true"><ArrowRight size={17} strokeWidth={2.6} /></span>
              </Link>
            </div>
          </div>
          <p className={s.ideaFoot}>架空の企業を使った分析の考え方の例です。「事実」は公開情報や取引情報で確かめる項目、「推察」と「仮説」は商談での確認が必要な見立てです。</p>

          {hypotheses.length > 0 && (
            <div className={s.realHypo}>
              <p className={s.checksHead}>実際のご依頼での例</p>
              <ol>
                {hypotheses.map((h, i) => (
                  <li key={i}><p><span>調べてわかったこと</span>{h.fact}</p><p><span>そこから言えること</span>{h.insight}</p></li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ ★成果物 */}
      <section className={s.reportSec} id="report" aria-labelledby="report-title" data-track-view="report">
        <div className={s.wrap}>
          <header className={s.secHeadSplit}>
            <div>
              <p className={s.eyebrow}>成果物</p>
              <h2 id="report-title" className={s.h2}>納品するのは、<mark className={s.hl}>そのまま営業会議で使える</mark>レポート</h2>
            </div>
            <p className={s.secLead}>実際の納品物と同じ形式（スライド）のサンプルです。代表的な4ページに印を付けています。一覧から選び、押すと拡大して読めます。</p>
          </header>
          <ReportViewer />
          <p className={s.note}>サンプルは架空の企業を分析したもので、社名・数値・文章はダミーです。ページの構成と分量は、対象企業とご依頼の目的に合わせて決めます。</p>
        </div>
      </section>

      {/* ============================================================ ★比較表 */}
      <section className={s.compareSec} id="compare" aria-labelledby="compare-title">
        <div className={s.wrap}>
          <header className={s.secHeadSplit}>
            <div>
              <p className={s.eyebrow}>他の方法との比較</p>
              <h2 id="compare-title" className={s.h2}>企業調査・企業分析を外注するなら、<br />目的に合った方法を</h2>
            </div>
            <p className={s.secLead}>どの方法にも向く場面があります。Neunonは「多くの既存顧客を、営業の観点で、1社ずつレポートにしたい」ときの選択肢です。</p>
          </header>
          <div className={s.tableScroll} tabIndex={0} aria-label="比較表（横にスクロールできます）">
            <table className={s.cmp}>
              <caption className={s.srOnly}>企業分析の方法の比較（一般的な傾向）</caption>
              <thead>
                <tr>
                  <th scope="col" className={s.cmpCorner}>
                    <span className={s.fitLegend}><FitMark v={2} />向いている</span>
                    <span className={s.fitLegend}><FitMark v={1} />条件による</span>
                    <span className={s.fitLegend}><FitMark v={0} />主な用途ではない</span>
                  </th>
                  {compare.columns.map((c) => (
                    <th scope="col" key={c.name} className={'us' in c ? s.cmpUsHead : s.cmpHead}>
                      {'us' in c && <span className={s.cmpPick}>営業向けの個社分析なら</span>}
                      <b>{c.name}</b><small>{c.note}</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compare.rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    {r.cells.map(([v, t], i) => (
                      <td key={i} className={i === 3 ? s.cmpUs : undefined}><FitMark v={v} /><span>{t}</span></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={s.scrollHint}>横にスクロールして比較できます</p>
          <div className={s.others}>
            <p className={s.othersHead}>こんなときは、ほかの方法が向いています</p>
            <ul>
              {compare.others.map((o) => <li key={o.name}><b>{o.name}</b>{o.when}</li>)}
            </ul>
            <p className={s.note}>一般的な傾向をまとめたもので、個別のサービスや契約によって異なります。</p>
          </div>
          <div className={s.midCta}>
            <p>多くの既存顧客を、営業の観点で1社ずつ。<b>1社3,000円から</b>お見積りします。</p>
            <div className={s.ctaRow}>
              <Link href={CONTACT_ESTIMATE} className={s.btnPrimary} data-track="cta_estimate" data-track-at="compare">
                見積もりを依頼する<span className={s.btnArrow} aria-hidden="true"><ArrowRight size={17} strokeWidth={2.6} /></span>
              </Link>
              <a href="#price" className={s.textLink} data-track="cta_price" data-track-at="compare">料金を見る</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ ★料金 */}
      <section className={s.price} id="price" aria-labelledby="price-title" data-track-view="price">
        <div className={s.wrap}>
          <header className={s.priceHead}>
            <p className={s.eyebrowDark}>料金</p>
            <h2 id="price-title" className={s.h2Dark}>1社 <span className={s.priceMark}>3,000円</span> から。<br />ページ数の目安で選べます</h2>
            <p className={s.ideaLead}>1社単位の参考価格（税抜）です。実際の分量と深さは、対象企業について得られる情報量、御社にとっての重要度、見たい論点に合わせて調整します。</p>
          </header>
          <div className={s.plans}>
            {plans.map((p) => (
              <article key={p.name} className={s.plan}>
                <div className={s.planTop}>
                  <h3 className={s.planName}>{p.name}</h3>
                  <p className={s.planPages}><b>{p.volume.replace('／社', '')}</b>／社</p>
                </div>
                <p className={s.planPrice}><b>{p.price}</b><span>円／社</span><small>（税抜）</small></p>
                <p className={s.planFit}>{p.fit}</p>
                <p className={s.planPace}><span>納期の目安</span><b>{p.pace}</b></p>
              </article>
            ))}
          </div>
          <ul className={s.terms}>
            {terms.map((t, i) => {
              const Icon = [Building2, FileLock2, ShieldCheck, Layers][i];
              return <li key={t.k}><Icon aria-hidden="true" size={20} strokeWidth={1.9} /><div><b>{t.k}</b><span>{t.v}</span></div></li>;
            })}
          </ul>
          <PlanCta />
        </div>
      </section>

      {/* ============================================================ 実績と体制 */}
      <section className={s.proof} id="why" aria-labelledby="why-title">
        <div className={s.wrap}>
          <div className={s.proofGrid}>
            <div className={s.proofNumBox}>
              <p className={s.eyebrow}>支援実績</p>
              <h2 id="why-title" className={s.srOnly}>支援実績と選ばれる理由</h2>
              <p className={s.bigNum}><span>累計</span><b>数百</b><span>件</span></p>
              <p className={s.bigNumNote}>企業・競合・市場分析レポートの作成件数。パッケージ型支援全体の実績で、プロフェッショナルコンサルタントとの協働案件を含みます（2026年10月時点）。</p>
            </div>
            <ol className={s.cases}>
              {records.map((r, i) => (
                <li key={r.client} data-same={'same' in r ? 'true' : undefined}>
                  <span className={s.caseIdx}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    {'same' in r && <span className={s.sameTag}>このサービスと同じ型</span>}
                    <p className={s.caseClient}>{r.client}</p>
                    <p className={s.caseWork}>{r.work}</p>
                  </div>
                </li>
              ))}
              <li className={s.casesNote}>守秘のため、取引先の名称は業種のみで記載しています。</li>
            </ol>
          </div>
          <ul className={s.pillars}>
            <li>
              <p className={s.pillarKicker}>体制</p>
              <h3 className={s.pillarTitle}>型と確認の二段で、品質を揃える</h3>
              <p>学生チームが定型の型と評価項目に沿って調査・作成し、経験のあるコンサルタントが納品前に内容を確認します。</p>
            </li>
            <li>
              <p className={s.pillarKicker}>書き方</p>
              <h3 className={s.pillarTitle}>事実・推察・不明を書き分ける</h3>
              <ul className={s.tags}>
                {labelSample.map((l) => <li key={l.tag}><span data-tag={l.tag}>{l.tag}</span>{l.text}</li>)}
              </ul>
            </li>
            <li>
              <p className={s.pillarKicker}>価格</p>
              <h3 className={s.pillarTitle}>数十社でも、同じ型で並べられる</h3>
              <p>工数のかかる調査と資料作成を学生チームが担うため、1社3,000円から。重点顧客だけでなく、手が回っていなかった取引先まで対象にできます。</p>
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================================ 流れ・FAQ（簡潔に） */}
      <section className={s.faqSec} id="faq" aria-labelledby="faq-title">
        <div className={s.wrap}>
          <div className={s.faqGrid}>
            <div>
              <h2 className={s.h3big}>ご依頼の流れ</h2>
              <ol className={s.flow}>
                {flow.map((f, i) => (
                  <li key={f.title}>
                    <span className={s.flowNo}>{i + 1}</span>
                    <div><h3 className={s.flowStep}>{f.title}</h3><p>{f.body}</p></div>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h2 id="faq-title" className={s.h3big}>よくある質問</h2>
              <div className={s.faqList}>
                {faq.map((item) => (
                  <details key={item.q} className={s.faqItem}>
                    <summary><span className={s.faqMark} aria-hidden="true">Q</span><h3 className={s.faqQ}>{item.q}</h3></summary>
                    <p><span className={s.faqMarkA} aria-hidden="true">A</span>{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ 最後の相談（黄色の面） */}
      <section className={s.final} id="lp-final" aria-labelledby="final-title">
        <div className={s.finalInner}>
          <p className={s.finalKicker}>まずは数社から</p>
          <h2 id="final-title" className={s.finalTitle}>御社の既存顧客で、<br />見積もりを取ってみませんか</h2>
          <p className={s.finalLead}>分析したい顧客の社名と、御社の商材をお知らせください。見る観点とプランをご提案し、お見積りをお送りします。</p>
          <div className={s.finalCta}>
            <Link href={CONTACT_ESTIMATE} className={s.btnDark} data-track="cta_estimate" data-track-at="final">
              見積もりを依頼する<span className={s.btnArrowY} aria-hidden="true"><ArrowRight size={17} strokeWidth={2.6} /></span>
            </Link>
            <Link href={CONTACT_DOCS} className={s.btnGhost} data-track="cta_docs" data-track-at="final">資料を請求する</Link>
          </div>
          <p className={s.finalSub}>1社3,000円（税抜）から　｜　秘密保持契約を締結　｜　サービスについてのご質問は<Link href={CONTACT_GENERAL}>こちら</Link></p>
        </div>
      </section>

      <StickyCta />
    </div>
  );
}
