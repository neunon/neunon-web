import Link from 'next/link';
import { ArrowRight, ArrowDown, Building2, FileLock2, FileText, Layers, ShieldCheck } from 'lucide-react';
import {
  CONTACT_DOCS, CONTACT_ESTIMATE, CONTACT_GENERAL, IMG,
  allExamples, compare, faq, filledExamples, flow, labelSample, plans, promises, records, scopeItems, terms,
} from './data';
import { PlanCta } from './PlanCta';
import { ReportGallery } from './ReportGallery';
import { StickyCta } from './StickyCta';
import { Tracker } from './Tracker';
import s from './lp.module.css';

/**
 * 既存顧客企業クローズアップ LP（第12版）。
 *
 * 配色（2026-10-23 ユーザー決定「B案」）: ホワイト #ffffff ／ ブラック #202020 ／ クリアブルー #5264cc。
 * 白が主体、黒で読みやすさと信頼感、青は「価格・主ボタン・選択中・Neunonの列」にだけ使う。
 * 濃い色の大きな面・グラデーション・装飾の円は使わない。余白と文字の大きさの差で強弱をつける。
 *
 * 構成: ファーストビュー → できること → 提案仮説の例 → 成果物（全9ページ） → 比較表 → 料金 → 実績と体制 → 流れ・FAQ → 最後の相談
 * レポートの画像はファーストビューと成果物の2か所だけ。
 *
 * preview: 確認用URLのときだけ true。未入力の「提案仮説の例」を入力待ちとして見せる。
 *          正式URLでは入力済みの組だけを出し、1件もなければ節ごと出さない。
 */

const FIT_LABEL = ['主な用途ではない', '条件・依頼内容による', '向いている'] as const;

function EstimateButton({ at, children = '見積もりを依頼する' }: { at: string; children?: string }) {
  return (
    <Link href={CONTACT_ESTIMATE} className={s.btnPrimary} data-track="cta_estimate" data-track-at={at}>
      {children}<ArrowRight aria-hidden="true" size={18} strokeWidth={2.4} />
    </Link>
  );
}

function FitMark({ v }: { v: 0 | 1 | 2 }) {
  return <span className={s.fit} data-v={v} role="img" aria-label={FIT_LABEL[v]} />;
}

export function ExistingCustomersLp({ preview = false }: { preview?: boolean }) {
  const examples = preview ? allExamples : filledExamples;
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
            <p className={s.kicker}>既存顧客企業クローズアップ<span>企業分析の代行</span></p>
            <h1 id="lp-title" className={s.h1}>
              既存顧客の<br />企業分析を代行<span className={s.srOnly}>。</span>
              <span className={s.h1Sub}>取引先ごとに「次の提案」が見つかる、営業のための個社別レポート</span>
            </h1>
            <div className={s.heroPrice}>
              <p className={s.heroPriceMain}>
                <span className={s.heroPriceUnit}>1社</span>
                <b>3,000</b>
                <span className={s.heroPriceYen}>円から</span>
                <small>税抜</small>
              </p>
              <p className={s.heroPriceNote}>1社から依頼できます。数社のお試しも承ります。</p>
            </div>
            <div id="lp-hero-cta" className={s.ctaRow}>
              <EstimateButton at="hero" />
              <a href="#report" className={s.btnSecondary} data-track="cta_sample" data-track-at="hero">
                サンプルレポートを見る<ArrowDown aria-hidden="true" size={17} strokeWidth={2.2} />
              </a>
            </div>
            <ul className={s.heroAssure}>
              <li><ShieldCheck aria-hidden="true" size={16} strokeWidth={1.9} />秘密保持契約を締結</li>
              <li><FileText aria-hidden="true" size={16} strokeWidth={1.9} />スライド形式で納品</li>
              <li><Building2 aria-hidden="true" size={16} strokeWidth={1.9} />非上場企業も対応</li>
            </ul>
          </div>

          <figure className={s.mock}>
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
            <figcaption className={s.mockCap}>納品レポートの例（架空企業のサンプル）</figcaption>
          </figure>
        </div>

        <div className={s.facts}>
          <dl className={s.factsInner}>
            <div><dt>費用</dt><dd><b>3,000</b>円〜／社</dd></div>
            <div><dt>納期の目安（Standard）</dt><dd>週<b>10</b>社</dd></div>
            <div><dt>分析レポートの累計（パッケージ型支援）</dt><dd><b>数百</b>件</dd></div>
            <div className={s.factsClients}><dt>主な支援先</dt><dd>{records.map((r) => r.client).join('／')}</dd></div>
          </dl>
        </div>
      </section>

      {/* ============================================================ できること */}
      <section className={s.promise} id="value" aria-labelledby="value-title">
        <div className={s.wrap}>
          <header className={s.head}>
            <p className={s.eyebrow}>できること</p>
            <h2 id="value-title" className={s.h2}>営業が追いきれない顧客の情報を、<br />1社ずつ、提案につながる形で。</h2>
          </header>
          <ol className={s.promiseList}>
            {promises.map((p, i) => (
              <li key={p.key}>
                <p className={s.promiseNo}>{String(i + 1).padStart(2, '0')}</p>
                <h3 className={s.promiseTitle}>{p.title}</h3>
                <p className={s.promiseBody}>{p.body}</p>
              </li>
            ))}
          </ol>
          <p className={s.scope}><span>調べる領域</span>{scopeItems.join('　／　')}</p>
        </div>
      </section>

      {/* ============================================================ 提案仮説の例（中身はユーザーが content/pages/existing-customers.json に記入） */}
      {examples.length > 0 && (
        <section className={s.examples} id="hypothesis" aria-labelledby="examples-title">
          <div className={s.wrap}>
            <header className={s.headSplit}>
              <div>
                <p className={s.eyebrow}>提案仮説の例</p>
                <h2 id="examples-title" className={s.h2}>調べた情報から、<br /><span className={s.accent}>次の提案</span>を考えます。</h2>
              </div>
              <p className={s.lead}>企業情報を集めて終わりではありません。顧客の変化と御社の取引を照らし合わせ、営業担当者が普段気づきにくい提案の可能性を、仮説として書き出します。</p>
            </header>
            <ol className={s.exList}>
              {examples.map((e, i) => {
                const empty = e.source === '' || e.proposal === '';
                return (
                  <li key={i} className={s.exRow} data-empty={empty ? 'true' : undefined}>
                    <span className={s.exNo}>{String(i + 1).padStart(2, '0')}</span>
                    <div className={s.exSource}>
                      <p className={s.exLabel}>調査から見つけた情報</p>
                      <p>{e.source || '（入力待ち）調査から見つけた情報を content/pages/existing-customers.json の source に書く'}</p>
                    </div>
                    <span className={s.exArrow} aria-hidden="true"><ArrowRight size={22} strokeWidth={2} /></span>
                    <div className={s.exProposal}>
                      <p className={s.exLabel}>そこから考えられる提案仮説</p>
                      <p>{e.proposal || '（入力待ち）提案仮説を proposal に書く'}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className={s.exFoot}>
              <p>仮説は調査から導いた見立てです。実際の提案の前に、商談で確かめる事項もレポートに書き出します。</p>
              <EstimateButton at="hypothesis">自社の顧客で相談する</EstimateButton>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ 成果物（全9ページ） */}
      <section className={s.report} id="report" aria-labelledby="report-title" data-track-view="report">
        <div className={s.wrap}>
          <header className={s.headSplit}>
            <div>
              <p className={s.eyebrow}>成果物</p>
              <h2 id="report-title" className={s.h2}>1社につき、<span className={s.accent}>このレポート</span>を<br />お届けします。</h2>
            </div>
            <p className={s.lead}>架空の化粧品メーカーを、容器メーカーの目線で分析したサンプル（9ページ）です。会社概要から営業アクションまで、分析の範囲を一覧できます。ページを押すと拡大して読めます。</p>
          </header>
          <ReportGallery />
          <p className={s.note}>社名・数値・文章はダミーです。ページの構成と分量は、対象企業とご依頼の目的に合わせて決めます。</p>
        </div>
      </section>

      {/* ============================================================ 比較表 */}
      <section className={s.compare} id="compare" aria-labelledby="compare-title">
        <div className={s.wrap}>
          <header className={s.headSplit}>
            <div>
              <p className={s.eyebrow}>他の方法との比較</p>
              <h2 id="compare-title" className={s.h2}>企業調査・企業分析を<br />外注するなら、目的に合った方法を。</h2>
            </div>
            <p className={s.lead}>どの方法にも向く場面があります。Neunonは「多くの既存顧客を、営業の観点で、1社ずつレポートにしたい」ときの選択肢です。</p>
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
          <p className={s.scrollHint}>表は横にスクロールできます</p>
          <div className={s.others}>
            <p className={s.othersHead}>こんなときは、ほかの方法が向いています</p>
            <ul>
              {compare.others.map((o) => <li key={o.name}><b>{o.name}</b>{o.when}</li>)}
            </ul>
            <p className={s.note}>一般的な傾向をまとめたもので、個別のサービスや契約によって異なります。</p>
          </div>
        </div>
      </section>

      {/* ============================================================ 料金 */}
      <section className={s.price} id="price" aria-labelledby="price-title" data-track-view="price">
        <div className={s.wrap}>
          <header className={s.headCenter}>
            <p className={s.eyebrow}>料金</p>
            <h2 id="price-title" className={s.h2}>1社 <span className={s.accentNum}>3,000</span>円から。<br />ページ数の目安で選べます。</h2>
            <p className={s.lead}>1社単位の参考価格（税抜）です。実際の分量と深さは、対象企業について得られる情報量、御社にとっての重要度、見たい論点に合わせて調整します。</p>
          </header>
          <div className={s.plans}>
            {plans.map((p) => (
              <article key={p.name} className={s.plan}>
                <h3 className={s.planName}>{p.name}</h3>
                <p className={s.planPages}><b>{p.volume.replace('／社', '')}</b><span>／社</span></p>
                <p className={s.planPrice}><b>{p.price}</b><span>円／社（税抜）</span></p>
                <p className={s.planFit}>{p.fit}</p>
                <p className={s.planPace}><span>納期の目安</span>{p.pace}</p>
              </article>
            ))}
          </div>
          <ul className={s.terms}>
            {terms.map((t, i) => {
              const Icon = [Building2, FileLock2, ShieldCheck, Layers][i];
              return <li key={t.k}><Icon aria-hidden="true" size={19} strokeWidth={1.8} /><div><b>{t.k}</b><span>{t.v}</span></div></li>;
            })}
          </ul>
          <PlanCta />
        </div>
      </section>

      {/* ============================================================ 実績と体制 */}
      <section className={s.proof} id="why" aria-labelledby="why-title">
        <div className={s.wrap}>
          <div className={s.proofGrid}>
            <div>
              <p className={s.eyebrow}>支援実績</p>
              <h2 id="why-title" className={s.srOnly}>支援実績と選ばれる理由</h2>
              <p className={s.bigNum}><span>累計</span><b>数百</b><span>件</span></p>
              <p className={s.bigNumNote}>企業・競合・市場分析レポートの作成件数。パッケージ型支援全体の実績で、プロフェッショナルコンサルタントとの協働案件を含みます（2026年10月時点）。</p>
            </div>
            <ol className={s.cases}>
              {records.map((r, i) => (
                <li key={r.client}>
                  <span className={s.caseIdx}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className={s.caseClient}>{r.client}{'same' in r && <span className={s.sameTag}>このサービスと同じ型</span>}</p>
                    <p className={s.caseWork}>{r.work}</p>
                  </div>
                </li>
              ))}
              <li className={s.casesNote}>守秘のため、取引先の名称は業種のみで記載しています。</li>
            </ol>
          </div>
          <ul className={s.pillars}>
            <li>
              <h3 className={s.pillarTitle}>型と確認の二段で、品質を揃える</h3>
              <p>学生チームが定型の型と評価項目に沿って調査・作成し、経験のあるコンサルタントが納品前に内容を確認します。</p>
            </li>
            <li>
              <h3 className={s.pillarTitle}>事実・推察・不明を書き分ける</h3>
              <ul className={s.tags}>
                {labelSample.map((l) => <li key={l.tag}><span data-tag={l.tag}>{l.tag}</span>{l.text}</li>)}
              </ul>
            </li>
            <li>
              <h3 className={s.pillarTitle}>数十社でも、同じ型で並べられる</h3>
              <p>工数のかかる調査と資料作成を学生チームが担うため、1社3,000円から。手が回っていなかった取引先まで対象にできます。</p>
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================================ 流れ・FAQ */}
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

      {/* ============================================================ 最後の相談 */}
      <section className={s.final} id="lp-final" aria-labelledby="final-title">
        <div className={s.finalInner}>
          <h2 id="final-title" className={s.finalTitle}>御社の既存顧客で、<br />見積もりを取ってみませんか。</h2>
          <p className={s.finalLead}>分析したい顧客の社名と、御社の商材をお知らせください。見る観点とプランをご提案し、お見積りをお送りします。</p>
          <div className={s.finalCta}>
            <EstimateButton at="final" />
            <Link href={CONTACT_DOCS} className={s.btnSecondary} data-track="cta_docs" data-track-at="final">資料を請求する</Link>
          </div>
          <p className={s.finalSub}>1社3,000円（税抜）から ・ 秘密保持契約を締結 ・ サービスについてのご質問は<Link href={CONTACT_GENERAL}>こちら</Link></p>
        </div>
      </section>

      <StickyCta />
    </div>
  );
}
