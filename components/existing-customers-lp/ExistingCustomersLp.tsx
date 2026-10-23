import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import {
  CONTACT_DOCS, CONTACT_ESTIMATE, CONTACT_GENERAL, IMG,
  comparison, faq, flow, hypotheses, plans, records, steps, terms,
} from './data';
import { ReportViewer } from './ReportViewer';
import { StickyCta } from './StickyCta';
import { ZoomFigure } from './ZoomFigure';
import s from './lp.module.css';

/**
 * 既存顧客企業クローズアップ LP。主役は実際の納品物と同じ形式のサンプルレポート（2026-10-23 ユーザー承認）。
 *
 *   ファーストビュー（何のサービスか・価値・受け取るもの・相談ボタン・レポートを大きく表示）→ 実績の帯
 *   → 分析の例（変化 → 照合 → 提案テーマ → 優先順位の4ページを1本の筋でたどる）
 *   → レポートに入る内容（分析の範囲・調べる情報・サンプルの設定と商品画像）→ 全ページ
 *   → 途中の相談 → 選ばれる理由と比較 → 実績 → 料金・条件 → 流れ → FAQ → 最後の相談（スマホは画面下に相談ボタン）
 *
 * レポートの画像は影・傾き・重ねを付けずにそのまま見せる（中身の具体性で実物らしさを出す）。
 * 相談の入口は2つだけ。主は「見積もりを相談する」、検討初期の人向けに「資料を請求する」。
 */

function Cta({ id, note = true }: { id?: string; note?: boolean }) {
  return (
    <div className={s.cta} id={id}>
      <div className={s.ctaRow}>
        <Link href={CONTACT_ESTIMATE} className={s.btnPrimary}>
          見積もりを相談する<ArrowRight aria-hidden="true" size={18} strokeWidth={2.4} />
        </Link>
        <Link href={CONTACT_DOCS} className={s.btnGhost}>資料を請求する</Link>
      </div>
      {note && <p className={s.ctaNote}>社名と商材をお知らせいただければ、プランと金額をご案内します。</p>}
    </div>
  );
}

const markLabel: Record<string, string> = { '◎': 'よく合う', '○': '対応できる', '△': '限られる', '×': '向かない' };

export function ExistingCustomersLp() {
  return (
    <div className={s.lp}>
      {/* ------------------------------------------------------------ ファーストビュー（第7版の型） */}
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
            <p className={s.target}>法人営業・営業企画のご担当者へ</p>
            <h1 id="lp-title" className={s.h1}>
              既存顧客の企業分析を代行<span className={s.srOnly}>。</span>
              <span className={s.h1Sub}>取引先ごとの「次の提案」が見つかるレポートを、<em>1社3,000円</em>から。</span>
            </h1>
            <p className={s.lead}>
              顧客の業績・組織・販路・商品・直近の変化を公開情報から調べ、御社の取引と照らし合わせて、提案テーマと次の営業アクションまで1社1レポートにまとめます。
            </p>
            <ul className={s.checks}>
              <li><Check aria-hidden="true" size={16} strokeWidth={3.2} />1社3,000円から<small>（税抜）</small></li>
              <li><Check aria-hidden="true" size={16} strokeWidth={3.2} />数社からお試しできます</li>
              <li><Check aria-hidden="true" size={16} strokeWidth={3.2} />週10社のペースで納品<small>（Standard）</small></li>
            </ul>
            <Cta id="lp-hero-cta" />
          </div>

          <figure className={s.mock}>
            <div className={s.laptop}>
              <div className={s.screen}>
                <img
                  src={`${IMG}/matching-960.webp`}
                  srcSet={`${IMG}/matching-640.webp 640w, ${IMG}/matching-960.webp 960w, ${IMG}/matching-1440.webp 1440w`}
                  sizes="(min-width: 1200px) 620px, 90vw"
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
            <figcaption className={s.mockCap}>架空の化粧品メーカーを分析したレポートの例</figcaption>
          </figure>
        </div>

        <div className={s.trust}>
          <div className={s.trustInner}>
            <div className={s.trustNum}>
              <span className={s.trustKicker}>分析レポートの累計作成件数</span>
              <p><b>数百</b>件</p>
            </div>
            <div>
              <p className={s.trustKicker}>主な支援先</p>
              <ul className={s.trustList}>
                {records.map((r) => <li key={r.client}><b>{r.client}</b><span>{r.work}</span></li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ サンプルレポート（タブで全ページ） */}
      <section className={s.viewerSec} id="report" aria-labelledby="report-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <p className={s.eyebrow}>サンプルレポート</p>
            <h2 id="report-title" className={s.h2}>実際の納品物と同じ形式のレポートをご覧ください</h2>
            <p className={s.secLead}>架空の化粧品メーカーを、容器メーカーの目線で分析した9ページです。タブでページを切り替え、押すと拡大できます。</p>
          </header>
          <ReportViewer />
        </div>
      </section>

      {/* ------------------------------------------------------------ 分析の例 */}
      <section className={s.how} id="how" aria-labelledby="how-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <p className={s.eyebrow}>分析の例</p>
            <h2 id="how-title" className={s.h2}>顧客の変化と御社の取引を照らし合わせて、提案の筋を立てます</h2>
            <p className={s.secLead}>
              サンプルは、架空の化粧品メーカーを容器メーカーの目線で分析したものです。直近の出来事から次の営業アクションまで、4つのページが1本の筋でつながっています。
            </p>
          </header>
          <ol className={s.zig}>
            {steps.map((st, i) => (
              <li key={st.slug} className={s.zigRow} data-flip={i % 2 ? 'true' : undefined}>
                <div className={s.zigText}>
                  <p className={s.zigNo}>{String(i + 1).padStart(2, '0')}</p>
                  <p className={s.zigValue}>{st.value}</p>
                  <h3 className={s.h3}>{st.title}</h3>
                  <p className={s.stepBody}>{st.body}</p>
                  <div className={s.trace}>
                    <p className={s.traceLabel}>サンプルでは</p>
                    <p>{st.trace}</p>
                  </div>
                </div>
                <ZoomFigure slug={st.slug} sizes="(min-width: 1200px) 680px, (min-width: 900px) 56vw, 100vw" />
              </li>
            ))}
          </ol>
          {hypotheses.length > 0 && (
            <div className={s.hypo}>
              <h3 className={s.h3}>実際のご依頼での提案仮説の例</h3>
              <ol className={s.hypoList}>
                {hypotheses.map((h, i) => (
                  <li key={i} className={s.hypoRow}>
                    <div className={s.hypoFact}><p className={s.hypoLabel}>調べてわかったこと</p><p>{h.fact}</p></div>
                    <span className={s.hypoArrow} aria-hidden="true"><ArrowRight size={22} strokeWidth={2.4} /></span>
                    <div className={s.hypoInsight}><p className={s.hypoLabel}>そこから言えること</p><p>{h.insight}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ 途中の相談 */}
      <section className={s.band} aria-labelledby="band-title">
        <div className={s.bandInner}>
          <div>
            <h2 id="band-title" className={s.bandTitle}>まずは数社、御社の顧客でお試しください</h2>
            <p>対象の社名と御社の商材を伺い、見る観点とプランをご提案します。</p>
          </div>
          <Cta note={false} />
        </div>
      </section>

      {/* ------------------------------------------------------------ 選ばれる理由 */}
      <section className={s.reasons} id="reasons" aria-labelledby="reasons-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <h2 id="reasons-title" className={s.h2}>企業調査・企業分析を外注する他の方法との比較</h2>
          </header>
          <div className={s.cmp} role="table" aria-label="自社調査・企業データベース・調査会社・Neunonの比較">
            <div className={s.cmpHead} role="row">
              <span role="columnheader" className={s.cmpCorner}>
                <span className={s.cmpLegend}>◎ よく合う　○ 対応できる<br />△ 限られる　× 向かない</span>
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

      {/* ------------------------------------------------------------ 実績 */}
      <section className={s.records} id="records" aria-labelledby="records-title">
        <div className={s.wrap}>
          <div className={s.recordsGrid}>
            <div>
              <h2 id="records-title" className={s.h2}>支援実績</h2>
              <p className={s.recordNum}>累計<b>数百</b>件</p>
              <p className={s.recordLabel}>企業・競合・市場分析レポートの累計作成件数（パッケージ型支援）。プロフェッショナルコンサルタントとの協働案件を含みます。</p>
            </div>
            <div>
              <ul className={s.recordList}>
                {records.map((r) => (
                  <li key={r.client}><b>{r.client}</b><span>{r.work}</span></li>
                ))}
              </ul>
              <p className={s.small}>守秘のため、取引先の名称は業種のみで記載しています。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ 料金・条件 */}
      <section className={s.price} id="price" aria-labelledby="price-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <h2 id="price-title" className={s.h2}>料金とご依頼の条件</h2>
            <p className={s.secLead}>1社単位の参考価格（税抜）です。対象企業数・調査範囲・納期によって変動するため、正式な金額はお見積りでお伝えします。</p>
          </header>
          <div className={s.plans}>
            {plans.map((p) => (
              <article key={p.name} className={s.plan}>
                <h3 className={s.planName}>{p.name}</h3>
                <p className={s.planPrice}><b>{p.price}</b><span>円／社</span><small>（税抜）</small></p>
                <dl className={s.planSpec}>
                  <div><dt>分量の目安</dt><dd>{p.volume}</dd></div>
                  <div><dt>納期の目安</dt><dd>{p.pace}</dd></div>
                </dl>
                <p className={s.planFit}>{p.fit}</p>
              </article>
            ))}
          </div>
          <div className={s.termsRow}>
            <dl className={s.terms}>
              {terms.map((t) => <div key={t.k}><dt>{t.k}</dt><dd>{t.v}</dd></div>)}
            </dl>
            <div className={s.custom}>
              <p>プランは目安です。ページの構成と深さは、対象企業とご依頼の目的に合わせて決めます。</p>
              <Link href={CONTACT_ESTIMATE} className={s.btnPrimary}>見積もりを相談する<ArrowRight aria-hidden="true" size={18} strokeWidth={2.4} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ 依頼の流れ */}
      <section className={s.flowSec} id="flow" aria-labelledby="flow-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <h2 id="flow-title" className={s.h2}>ご依頼の流れ</h2>
          </header>
          <ol className={s.flow}>
            {flow.map((f, i) => (
              <li key={f.title}>
                <span className={s.flowNo}>{i + 1}</span>
                <div>
                  <h3 className={s.flowStep}>{f.title}</h3>
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
              <li>（任意）わかる範囲での現在の取引状況</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ FAQ */}
      <section className={s.faq} id="faq" aria-labelledby="faq-title">
        <div className={`${s.wrap} ${s.faqGrid}`}>
          <h2 id="faq-title" className={s.h2}>よくある質問</h2>
          <div className={s.faqList}>
            {faq.map((item) => (
              <details key={item.q} className={s.faqItem}>
                <summary><span className={s.faqMark} aria-hidden="true">Q</span><h3 className={s.faqQ}>{item.q}</h3></summary>
                <p><span className={s.faqMarkA} aria-hidden="true">A</span>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ 最後の相談 */}
      <section className={s.final} id="lp-final" aria-labelledby="final-title">
        <div className={s.finalInner}>
          <div>
            <h2 id="final-title" className={s.finalTitle}>まず数社、御社の顧客で試してみませんか</h2>
            <p className={s.finalLead}>分析したい顧客の社名と、御社の商材をお知らせください。見る観点とプランをご提案し、お見積りをお送りします。</p>
            <Cta />
            <p className={s.finalSub}>サービスについてのご質問は<Link href={CONTACT_GENERAL}>こちら</Link></p>
          </div>
          <div className={s.finalArt}>
            <img src={`${IMG}/actions-960.webp`} srcSet={`${IMG}/actions-640.webp 640w, ${IMG}/actions-960.webp 960w`} sizes="(min-width: 1024px) 460px, 0px" width={960} height={665} alt="" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      <StickyCta />
    </div>
  );
}
