import Link from 'next/link';
import { ArrowRight, ArrowDown, BadgeCheck, Building2, FileLock2, Gauge, Layers, ShieldCheck, Users } from 'lucide-react';
import {
  CONTACT_DOCS, CONTACT_ESTIMATE, CONTACT_GENERAL, IMG,
  faq, flow, hypotheses, labelSample, plans, records, terms, uses, values,
} from './data';
import { CaseStepper } from './CaseStepper';
import { PlanCta } from './PlanCta';
import { ReportViewer } from './ReportViewer';
import { StickyCta } from './StickyCta';
import { Tracker } from './Tracker';
import s from './lp.module.css';

/**
 * 既存顧客企業クローズアップ LP（第10版：受注獲得のための再設計）。
 *
 * 心理の流れと節の役割
 *   認知・興味 … ファーストビュー（何を・いくらで・何が届くか）
 *   理解       … できること（顧客の全体像／取引とのギャップ／次の提案仮説。レポートの実物の切り抜き）
 *   納得       … 分析事例（01〜04 を横のステップで切り替え、1つの筋として見せる）
 *   信頼       … 成果物（代表ページを大きく＋9ページの一覧）
 *   購入検討   … 料金（ページ数の目安で選ぶ。プランと社数を選んでそのまま見積依頼）
 *   信頼       … 選ばれる理由（実績・体制と品質・量への対応・使い分け）
 *   行動       … ご依頼の流れ・FAQ・最後の相談
 * レポートの画像はサンプル（架空企業・ダミー文章）。LP の文章で各ページの役割を説明する。
 */

function Cta({ at, sample = false, light = false }: { at: string; sample?: boolean; light?: boolean }) {
  return (
    <div className={s.ctaRow}>
      <Link href={CONTACT_ESTIMATE} className={light ? s.btnLight : s.btnPrimary} data-track="cta_estimate" data-track-at={at}>
        見積もりを依頼する<ArrowRight aria-hidden="true" size={18} strokeWidth={2.4} />
      </Link>
      {sample ? (
        <a href="#report" className={s.btnGhost} data-track="cta_sample" data-track-at={at}>サンプルレポートを見る<ArrowDown aria-hidden="true" size={17} strokeWidth={2.2} /></a>
      ) : (
        <Link href={CONTACT_DOCS} className={light ? s.btnGhostLight : s.btnGhost} data-track="cta_docs" data-track-at={at}>資料を請求する</Link>
      )}
    </div>
  );
}

function PageStack({ n }: { n: number }) {
  return (
    <span className={s.stack} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => <i key={i} />)}
    </span>
  );
}

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
            <p className={s.heroTag}>既存顧客企業クローズアップ</p>
            <h1 id="lp-title" className={s.h1}>
              既存顧客の企業分析を代行<span className={s.srOnly}>。</span>
              <span className={s.h1Sub}>取引先ごとに「次の提案」が見つかる、営業のための個社別レポート</span>
            </h1>
            <div className={s.heroPrice}>
              <p className={s.heroPriceMain}>
                <span className={s.heroPriceUnit}>1社</span>
                <b>3,000</b>
                <span className={s.heroPriceYen}>円から</span>
                <small>（税抜）</small>
              </p>
              <ul className={s.heroPoints}>
                <li>1社単位で依頼できます</li>
                <li>数社からのお試しも可</li>
                <li>週10社が目安<small>（Standard）</small></li>
              </ul>
            </div>
            <div id="lp-hero-cta"><Cta at="hero" sample /></div>
            <p className={s.heroSub}>
              <Link href={CONTACT_DOCS} data-track="cta_docs" data-track-at="hero">サービス資料を請求する</Link>
              <span aria-hidden="true">｜</span>
              社名と商材をお知らせいただければ、プランと金額をご案内します
            </p>
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
                <span className={`${s.callout} ${s.calloutA}`}><b>01</b>まだ入れていない区画を特定</span>
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
              <span className={`${s.callout} ${s.calloutB}`}><b>02</b>根拠つきの提案テーマ</span>
            </div>
            <figcaption className={s.mockCap}>納品レポートの例（架空企業のサンプル）</figcaption>
          </figure>
        </div>

        <div className={s.proofBar}>
          <div className={s.proofInner}>
            <p className={s.proofNum}><span>分析レポート 累計</span><b>数百</b><span>件</span></p>
            <p className={s.proofText}>
              国内主要容器メーカーの<strong>顧客企業クローズアップ</strong>ほか、建設・建設コンサルティング・消費財の企業分析を支援
              <small>パッケージ型支援全体の実績（2026年10月時点）</small>
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ できること（理解） */}
      <section className={s.value} id="value" aria-labelledby="value-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <p className={s.eyebrow}>できること</p>
            <h2 id="value-title" className={s.h2}>既存顧客の深耕に、営業の目線の企業分析を</h2>
            <p className={s.secLead}>公開情報から顧客1社を調べ、御社の取引と照らし合わせます。営業担当者が自分で調べると時間がかかる下調べと読み解きを、レポートとしてお渡しします。</p>
          </header>
          <ol className={s.values}>
            {values.map((v, i) => (
              <li key={v.title}>
                <div className={s.valueFig}>
                  <img src={`${IMG}/${v.img}.webp`} width={v.w} height={v.h} alt={`サンプルレポート（${v.page}）の一部`} loading="lazy" decoding="async" />
                </div>
                <p className={s.valueNo}>{String(i + 1).padStart(2, '0')}</p>
                <h3 className={s.valueTitle}>{v.title}</h3>
                <p className={s.valueBody}>{v.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================================================ 分析事例（納得） */}
      <section className={s.caseSec} id="case" aria-labelledby="case-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <p className={s.eyebrow}>分析事例</p>
            <h2 id="case-title" className={s.h2}>1社の分析が、次の訪問になるまで</h2>
            <p className={s.secLead}>架空の化粧品メーカーを、容器メーカーの目線で分析したサンプルです。顧客の変化から訪問先の部署まで、1本の筋でつながります。</p>
          </header>
          <CaseStepper />
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

      {/* ============================================================ 成果物（信頼） */}
      <section className={s.reportSec} id="report" aria-labelledby="report-title" data-track-view="report">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <p className={s.eyebrow}>成果物</p>
            <h2 id="report-title" className={s.h2}>納品するレポートの例</h2>
            <p className={s.secLead}>実際の納品物と同じ形式（スライド）です。代表的な4ページに印を付けています。一覧から選び、押すと拡大して読めます。</p>
          </header>
          <ReportViewer />
          <p className={s.note}>サンプルは架空の企業を分析したもので、社名・数値・文章はダミーです。ページの構成と分量は、対象企業とご依頼の目的に合わせて決めます。</p>
        </div>
      </section>

      {/* ============================================================ 料金（購入検討） */}
      <section className={s.price} id="price" aria-labelledby="price-title" data-track-view="price">
        <div className={s.wrap}>
          <header className={s.secHeadCenter}>
            <p className={s.eyebrow}>料金</p>
            <h2 id="price-title" className={s.h2}>1社 <span className={s.mark}>3,000円</span> から。ページ数の目安で選べます</h2>
            <p className={s.secLead}>1社単位の参考価格（税抜）です。実際の分量と深さは、対象企業について得られる情報量、御社にとっての重要度、見たい論点に合わせて調整します。</p>
          </header>
          <div className={s.plans}>
            {plans.map((p) => (
              <article key={p.name} className={s.plan}>
                <h3 className={s.planName}>{p.name}</h3>
                <div className={s.planVolume}>
                  <PageStack n={p.pages} />
                  <p><b>{p.volume.replace('／社', '')}</b><span>／社</span></p>
                </div>
                <p className={s.planPrice}><b>{p.price}</b><span>円／社</span><small>（税抜）</small></p>
                <p className={s.planFit}>{p.fit}</p>
                <dl className={s.planSpec}><div><dt>納期の目安</dt><dd>{p.pace}</dd></div></dl>
              </article>
            ))}
          </div>
          <ul className={s.terms}>
            {terms.map((t, i) => {
              const Icon = [Building2, FileLock2, ShieldCheck, Layers][i];
              return (
                <li key={t.k}><Icon aria-hidden="true" size={20} strokeWidth={1.8} /><div><b>{t.k}</b><span>{t.v}</span></div></li>
              );
            })}
          </ul>
          <PlanCta />
        </div>
      </section>

      {/* ============================================================ 選ばれる理由（信頼） */}
      <section className={s.why} id="why" aria-labelledby="why-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <p className={s.eyebrow}>選ばれる理由</p>
            <h2 id="why-title" className={s.h2}>企業分析の外注先として、Neunonが選ばれる理由</h2>
          </header>
          <div className={s.whyGrid}>
            <div className={s.records}>
              <p className={s.recordsKicker}>支援実績</p>
              <p className={s.recordsNum}>累計<b>数百</b>件</p>
              <p className={s.recordsScope}>企業・競合・市場分析レポートの作成件数（パッケージ型支援全体、2026年10月時点）。プロフェッショナルコンサルタントとの協働案件を含みます。</p>
              <ul className={s.recordList}>
                {records.map((r) => (
                  <li key={r.client} data-same={'same' in r ? 'true' : undefined}>
                    {'same' in r && <span className={s.sameTag}>このサービスと同じ型</span>}
                    <b>{r.client}</b>
                    <span>{r.work}</span>
                  </li>
                ))}
              </ul>
              <p className={s.recordsNote}>守秘のため、取引先の名称は業種のみで記載しています。</p>
            </div>
            <ul className={s.reasons}>
              <li>
                <Users aria-hidden="true" size={24} strokeWidth={1.8} />
                <h3 className={s.reasonTitle}>型と確認の二段で、品質を揃える</h3>
                <p>学生チームが定型の型と評価項目に沿って調査・作成し、経験のあるコンサルタントが納品前に内容を確認します。</p>
              </li>
              <li>
                <BadgeCheck aria-hidden="true" size={24} strokeWidth={1.8} />
                <h3 className={s.reasonTitle}>事実・推察・不明を書き分ける</h3>
                <ul className={s.tags}>
                  {labelSample.map((l) => <li key={l.tag}><span data-tag={l.tag}>{l.tag}</span>{l.text}</li>)}
                </ul>
              </li>
              <li>
                <Gauge aria-hidden="true" size={24} strokeWidth={1.8} />
                <h3 className={s.reasonTitle}>数十社でも、同じ型で並べられる</h3>
                <p>週10社が目安（Standard）。1社3,000円からなので、重点顧客だけでなく、手が回っていなかった取引先まで対象にできます。</p>
              </li>
            </ul>
          </div>

          <div className={s.uses}>
            <h3 className={s.usesTitle}>企業分析の方法の使い分け</h3>
            <p className={s.usesLead}>どれが優れているかではなく、目的によって向く方法が違います。</p>
            <ul className={s.usesList}>
              {uses.map((u) => (
                <li key={u.name} data-us={'us' in u ? 'true' : undefined}>
                  <b>{u.name}</b>
                  <span>{u.fit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================ 流れ・FAQ（行動） */}
      <section className={s.faqSec} id="faq" aria-labelledby="faq-title">
        <div className={s.wrap}>
          <div className={s.flowBox}>
            <h2 className={s.flowTitle}>ご依頼の流れ</h2>
            <ol className={s.flow}>
              {flow.map((f, i) => (
                <li key={f.title}>
                  <span className={s.flowNo}>{i + 1}</span>
                  <h3 className={s.flowStep}>{f.title}</h3>
                  <p>{f.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className={s.faqGrid}>
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
        </div>
      </section>

      {/* ============================================================ 最後の相談 */}
      <section className={s.final} id="lp-final" aria-labelledby="final-title">
        <div className={s.finalInner}>
          <div>
            <p className={s.finalKicker}>まずは数社から</p>
            <h2 id="final-title" className={s.finalTitle}>御社の既存顧客で、見積もりを取ってみませんか</h2>
            <p className={s.finalLead}>分析したい顧客の社名と、御社の商材をお知らせください。見る観点とプランをご提案し、お見積りをお送りします。1社3,000円（税抜）から承ります。</p>
            <Cta at="final" light />
            <p className={s.finalSub}>サービスについてのご質問は<Link href={CONTACT_GENERAL}>こちら</Link></p>
          </div>
          <div className={s.finalArt} aria-hidden="true">
            <img src={`${IMG}/actions-960.webp`} srcSet={`${IMG}/actions-640.webp 640w, ${IMG}/actions-960.webp 960w`} sizes="(min-width: 1024px) 460px, 0px" width={960} height={665} alt="" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      <StickyCta />
    </div>
  );
}
