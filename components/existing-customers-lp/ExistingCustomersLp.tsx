import Link from 'next/link';
import type { ComponentType } from 'react';
import {
  ArrowRight, Check, Clock3, GraduationCap, Library, Lightbulb, Radar, RefreshCw, Repeat2, SearchX, Users,
  type LucideIcon,
} from 'lucide-react';
import {
  CONTACT_DOCS, CONTACT_ESTIMATE, CONTACT_GENERAL,
  comparison, contents, effects, faq, flow, hypotheses, pains, plans, reasons, records,
} from './data';
import { StickyCta } from './StickyCta';
import { VisChannels, VisHero, VisInsight, VisPerformance, VisProducts, VisSignals } from './Visuals';
import s from './lp.module.css';

/**
 * 既存顧客企業クローズアップ LP。受注（見積もり相談）につなげることを第一に組んだ。
 *
 *   ファーストビュー（誰向けか・何が・いくらで・相談ボタン）→ 実績の帯 → こんなお悩み
 *   → レポートでわかること → 提案仮説の例 → 効果 → 途中の相談 → 選ばれる理由と比較
 *   → 実績 → 料金 → 依頼の流れ → FAQ → 最後の相談（スマホは画面下に相談ボタン）
 *
 * 相談の入口は2つだけ。主は「見積もりを相談する」、検討初期の人向けに「資料を請求する」。
 * 色はサイトのゲンチアンブルー。赤は図の中の「示唆」だけに使う。
 */

const painIcon: Record<string, LucideIcon> = { change: RefreshCw, repeat: Repeat2, miss: SearchX, time: Users };
const effectIcon: Record<string, LucideIcon> = { time: Clock3, idea: Lightbulb, radar: Radar, learn: GraduationCap, library: Library };
const contentVis: Record<string, ComponentType<{ bare?: boolean }>> = {
  perf: VisPerformance, channel: VisChannels, product: VisProducts, signal: VisSignals, insight: VisInsight,
};
const markLabel: Record<string, string> = { '◎': 'よく合う', '○': '対応できる', '△': '限られる', '×': '向かない' };

const filled = (v: string) => v.trim() !== '';

function Cta({ inverse = false, id }: { inverse?: boolean; id?: string }) {
  return (
    <div className={s.cta} id={id}>
      <div className={s.ctaRow}>
        <Link href={CONTACT_ESTIMATE} className={inverse ? s.btnPrimaryInverse : s.btnPrimary}>
          見積もりを相談する<ArrowRight aria-hidden="true" size={18} strokeWidth={2.4} />
        </Link>
        <Link href={CONTACT_DOCS} className={inverse ? s.btnGhostInverse : s.btnGhost}>資料を請求する</Link>
      </div>
      <p className={inverse ? s.ctaNoteInverse : s.ctaNote}>社名と商材をお知らせいただければ、プランと金額をご案内します。数社からのお試しも承ります。</p>
    </div>
  );
}

export function ExistingCustomersLp() {
  return (
    <div className={s.lp}>
      {/* ------------------------------------------------------------ ファーストビュー */}
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
              顧客の業績・販売チャネル・商品・変化のシグナルを公開情報から調べ、御社の商材との接点と提案のヒントまで、1社1レポートにまとめます。
            </p>
            <ul className={s.checks}>
              <li><Check aria-hidden="true" size={18} strokeWidth={3} />1社3,000円から<small>（税抜）</small></li>
              <li><Check aria-hidden="true" size={18} strokeWidth={3} />数社からお試しOK</li>
              <li><Check aria-hidden="true" size={18} strokeWidth={3} />週10社のペースで納品<small>（Standard）</small></li>
            </ul>
            <Cta id="lp-hero-cta" />
          </div>
          <div className={s.heroArt}>
            <VisHero />
          </div>
        </div>

        <div className={s.trust}>
          <div className={s.trustInner}>
            <p className={s.trustNum}>
              <span>企業・競合・市場分析レポート</span>
              累計<b>数百</b>件
            </p>
            <ul className={s.trustList} aria-label="主な支援先">
              {records.map((r) => <li key={r.client}>{r.client}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ こんなお悩み */}
      <section className={s.pains} aria-labelledby="pains-title">
        <div className={s.wrap}>
          <h2 id="pains-title" className={s.h2Center}>既存顧客の深耕で、<br className={s.brSp} />こんなお悩みはありませんか</h2>
          <ul className={s.painList}>
            {pains.map((p) => {
              const Icon = painIcon[p.icon];
              return (
                <li key={p.text}>
                  <span className={s.painIcon}><Icon aria-hidden="true" size={26} strokeWidth={1.8} /></span>
                  <p>{p.text}</p>
                </li>
              );
            })}
          </ul>
          <div className={s.bridge}>
            <p>顧客を<b>調べる・整理する・読み解く</b>作業を、<br className={s.brSp} />まるごとお任せください。</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ レポートでわかること */}
      <section className={s.contents} id="contents" aria-labelledby="contents-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <p className={s.eyebrow}>レポートでわかること</p>
            <h2 id="contents-title" className={s.h2}>1社1レポートで、次の提案の材料が揃う</h2>
            <p className={s.secLead}>
              企業情報を集めて並べるだけでは、営業の次の一手にはなりません。御社の商材を起点に4つの面から事実を集め、最後に提案のヒントへまとめます。
            </p>
          </header>
          <ol className={s.contentList}>
            {contents.map((c, i) => {
              const Vis = contentVis[c.key];
              return (
                <li key={c.key} className={c.key === 'insight' ? s.contentLast : undefined}>
                  <div className={s.contentVis}><Vis bare /></div>
                  <p className={s.contentNo}>{`0${i + 1}`}</p>
                  <h3 className={s.h3}>{c.title}</h3>
                  <p>{c.body}</p>
                </li>
              );
            })}
          </ol>
          <ul className={s.notes}>
            <li>現在の取引状況を伺える場合は、取引中・未取引の区分まで整理します（任意）。</li>
            <li>モノを売る企業でなくても、サービスの種類や提供形態の単位で同じように整理します。</li>
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------ 提案仮説の例 */}
      <section className={s.hypo} id="hypotheses" aria-labelledby="hypo-title">
        <div className={s.wrapMid}>
          <header className={s.secHead}>
            <p className={s.eyebrow}>提案仮説の例</p>
            <h2 id="hypo-title" className={s.h2}>調べてわかったことから、営業が動ける一言へ</h2>
            <p className={s.secLead}>「伸びている事業に、自社の商材を提案する」だけでは、誰でも思いつく仮説です。事実を組み合わせて、その会社ならではの筋を探します。</p>
          </header>
          <ol className={s.hypoList}>
            {hypotheses.map((h, i) => {
              const ok = filled(h.fact);
              return (
                <li key={i} className={ok ? s.hypoRow : s.hypoRowDraft}>
                  <div className={s.hypoFact}>
                    <p className={s.hypoLabel}>調べてわかったこと</p>
                    <p>{ok ? h.fact : '記入待ち'}</p>
                  </div>
                  <span className={s.hypoArrow} aria-hidden="true"><ArrowRight size={22} strokeWidth={2.4} /></span>
                  <div className={s.hypoInsight}>
                    <p className={s.hypoLabel}>そこから言えること</p>
                    <p>{ok && filled(h.insight) ? h.insight : '記入待ち'}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          {hypotheses.some((h) => !filled(h.fact)) && (
            <p className={s.draftNote}>確認用の表示です。content/pages/existing-customers.json に記入すると、ここに表示されます。</p>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ 効果 */}
      <section className={s.effects} id="effects" aria-labelledby="effects-title">
        <div className={s.wrap}>
          <header className={s.secHeadCenter}>
            <p className={s.eyebrow}>導入の効果</p>
            <h2 id="effects-title" className={s.h2}>調べる時間を、提案する時間へ</h2>
          </header>
          {effects.map((g, gi) => (
            <div key={g.group} className={s.fxGroup}>
              <h3 className={s.fxGroupTitle}>{g.group}</h3>
              <ul className={gi === 0 ? s.fxList3 : s.fxList2}>
                {g.items.map((e, ei) => {
                  const Icon = effectIcon[e.icon];
                  const no = effects.slice(0, gi).reduce((n, x) => n + x.items.length, 0) + ei + 1;
                  return (
                    <li key={e.title} className={s.fxCard}>
                      <div className={s.fxTop}>
                        <span className={s.fxIcon}><Icon aria-hidden="true" size={24} strokeWidth={1.8} /></span>
                        <span className={s.fxNo}>{`0${no}`}</span>
                      </div>
                      <h4 className={s.fxTitle}>{e.title}</h4>
                      <p>{e.body}</p>
                      <p className={s.fxPoint}><Check aria-hidden="true" size={16} strokeWidth={3} />{e.point}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ 途中の相談 */}
      <section className={s.band} aria-labelledby="band-title">
        <div className={s.bandInner}>
          <div>
            <h2 id="band-title" className={s.bandTitle}>まずは数社から、御社の顧客でお試しください</h2>
            <p>対象の社名と御社の商材を伺い、観点とプランをご提案します。</p>
          </div>
          <Cta inverse />
        </div>
      </section>

      {/* ------------------------------------------------------------ 選ばれる理由 */}
      <section className={s.reasons} id="reasons" aria-labelledby="reasons-title">
        <div className={s.wrap}>
          <header className={s.secHeadCenter}>
            <p className={s.eyebrow}>選ばれる理由</p>
            <h2 id="reasons-title" className={s.h2}>多くの取引先を、同じ型で、提案のヒントまで</h2>
          </header>
          <ol className={s.reasonList}>
            {reasons.map((r, i) => (
              <li key={r.title}>
                <p className={s.reasonNo}>{`0${i + 1}`}</p>
                <h3 className={s.h3}>{r.title}</h3>
                <p>{r.body}</p>
              </li>
            ))}
          </ol>

          <h3 className={s.cmpTitle}>企業分析の他の方法との比較</h3>
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
              <p className={s.eyebrow}>支援実績</p>
              <h2 id="records-title" className={s.h2}>大手企業の企業分析を、<br />累計数百件</h2>
              <p className={s.recordLabel}>企業・競合・市場分析レポートの累計作成件数（パッケージ型支援）。プロフェッショナルコンサルタントとの協働案件を含みます。</p>
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
              <p className={s.small}>守秘のため、取引先の名称は業種のみで記載しています。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ 料金 */}
      <section className={s.price} id="price" aria-labelledby="price-title">
        <div className={s.wrap}>
          <header className={s.secHeadCenter}>
            <p className={s.eyebrow}>料金</p>
            <h2 id="price-title" className={s.h2}>1社3,000円から。必要な深さで選べます</h2>
            <p className={s.secLead}>1社単位の参考価格（税抜）です。対象企業数・調査範囲・納期によって変動するため、正式な金額はお見積りでお伝えします。</p>
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
          <p className={s.trial}><b>お試し</b>数社からのご依頼も承ります。まず成果物をご確認いただいてから、対象を広げるかどうかをご判断ください。</p>
        </div>
      </section>

      {/* ------------------------------------------------------------ 依頼の流れ */}
      <section className={s.flowSec} id="flow" aria-labelledby="flow-title">
        <div className={s.wrap}>
          <header className={s.secHeadCenter}>
            <p className={s.eyebrow}>依頼の流れ</p>
            <h2 id="flow-title" className={s.h2}>社名と商材を伺うところから</h2>
          </header>
          <ol className={s.flow}>
            {flow.map((f, i) => (
              <li key={f.title}>
                <span className={s.flowNo}>{`STEP ${i + 1}`}</span>
                <h3 className={s.flowStep}>{f.title}</h3>
                <p>{f.body}</p>
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
        <div className={s.wrapNarrow}>
          <header className={s.secHeadCenter}>
            <p className={s.eyebrow}>よくある質問</p>
            <h2 id="faq-title" className={s.h2}>ご依頼前によくいただく質問</h2>
          </header>
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
          <p className={s.finalKicker}>既存顧客企業クローズアップ</p>
          <h2 id="final-title" className={s.finalTitle}>取引先の「次の提案」を、<br className={s.brSp} />まず数社で試してみませんか</h2>
          <p className={s.finalLead}>分析したい顧客の社名と、御社の商材をお知らせください。観点とプランをご提案し、お見積りをお送りします。</p>
          <Cta inverse />
          <p className={s.finalSub}>サービスについてのご質問は<Link href={CONTACT_GENERAL}>こちら</Link></p>
        </div>
      </section>

      <StickyCta />
    </div>
  );
}
