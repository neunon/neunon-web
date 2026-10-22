import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import {
  CONTACT_DOCS, CONTACT_ESTIMATE, CONTACT_GENERAL, IMG,
  comparison, effects, faq, flow, hypotheses, labelSample, pains, perspectives, plans, records,
} from './data';
import { ReportGallery } from './ReportGallery';
import { StickyCta } from './StickyCta';
import s from './lp.module.css';

/**
 * 既存顧客企業クローズアップ LP。受注（見積もり相談）につなげることを第一に組んだ。
 *
 *   ファーストビュー（誰向け・何が・いくらで・相談ボタン・納品物の実物）→ 実績の帯 → こんなこと
 *   → レポートの中身（サンプルの全ページ）→ 提案仮説の例 → 効果 → 途中の相談 → 選ばれる理由と比較
 *   → 実績 → 料金 → 依頼の流れ → FAQ → 最後の相談（スマホは画面下に相談ボタン）
 *
 * 画像はすべてサンプルレポート（サンプル食品株式会社を分析した例）の実物の書き出し。
 * 相談の入口は2つだけ。主は「見積もりを相談する」、検討初期の人向けに「資料を請求する」。
 */

const PAGE_W = 1440;
const PAGE_H = 997;

function pageSrc(name: string) {
  return {
    src: `${IMG}/${name}-960.webp`,
    srcSet: `${IMG}/${name}-640.webp 640w, ${IMG}/${name}-960.webp 960w, ${IMG}/${name}-1440.webp 1440w`,
  };
}

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

const filled = (v: string) => v.trim() !== '';
const markLabel: Record<string, string> = { '◎': 'よく合う', '○': '対応できる', '△': '限られる', '×': '向かない' };

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
              顧客の業績・販売チャネル・商品・直近の変化を公開情報から調べ、御社の商材との接点と提案のヒントまで、1社1レポートにまとめます。
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
                  {...pageSrc('summary')}
                  sizes="(min-width: 1200px) 620px, 90vw"
                  width={PAGE_W}
                  height={PAGE_H}
                  alt="サンプルレポートの「サマリー」のページ。企業プロフィール、業績・顧客と販路・商品・変化の4つの要点、依頼元との接点"
                  fetchPriority="high"
                />
              </div>
              <div className={s.base} aria-hidden="true" />
            </div>
            <div className={s.printBack} aria-hidden="true">
              <img src={`${IMG}/segments-640.webp`} width={640} height={443} alt="" />
            </div>
            <div className={s.print}>
              <img
                {...pageSrc('cover')}
                sizes="(min-width: 1200px) 300px, 45vw"
                width={PAGE_W}
                height={PAGE_H}
                alt="サンプルレポートの表紙「サンプル食品株式会社　企業クローズアップ」"
              />
            </div>
            <figcaption className={s.mockCap}>サンプル食品株式会社を分析したレポートの例</figcaption>
          </figure>
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

      {/* ------------------------------------------------------------ こんなこと */}
      <section className={s.pains} aria-labelledby="pains-title">
        <div className={s.wrapMid}>
          <div className={s.painBox}>
            <h2 id="pains-title" className={s.painTitle}>既存顧客の営業で、こんなことはありませんか</h2>
            <ul className={s.checklist}>
              {pains.map((p) => (
                <li key={p}><span className={s.checkbox} aria-hidden="true"><Check size={16} strokeWidth={3.4} /></span>{p}</li>
              ))}
            </ul>
          </div>
          <p className={s.bridge}>
            顧客の下調べと読み解きを、<b>1社3,000円から</b>代行します。
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ レポートの中身 */}
      <section className={s.contents} id="contents" aria-labelledby="contents-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <h2 id="contents-title" className={s.h2}>レポートの中身</h2>
            <p className={s.secLead}>
              食品メーカーを、低温物流の会社の目線で分析したサンプルです（表紙＋12ページ）。
              ページの構成は、対象企業とご依頼の目的に合わせて決めます。ページを押すと拡大できます。
            </p>
          </header>
          <ReportGallery />
          <p className={s.note}>モノを売る企業でなくても、サービスの種類や提供形態の単位で同じように整理します。</p>
        </div>
      </section>

      {/* ------------------------------------------------------------ 提案仮説の例 */}
      <section className={s.hypo} id="hypotheses" aria-labelledby="hypo-title">
        <div className={s.wrapMid}>
          <header className={s.secHead}>
            <h2 id="hypo-title" className={s.h2}>提案仮説の例</h2>
            <p className={s.secLead}>「伸びている事業に、自社の商材を提案する」だけなら、誰でも思いつきます。事実を組み合わせて、その会社ならではの筋を探します。</p>
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
          <header className={s.secHead}>
            <h2 id="effects-title" className={s.h2}>導入の効果</h2>
            <p className={s.secLead}>顧客を調べる作業を任せると、担当者は提案と商談に時間を使えます。業務の成果と、人・組織の両面で効果があります。</p>
          </header>
          <div className={s.fx}>
            {effects.map((g, gi) => (
              <div key={g.group} className={s.fxGroup}>
                <h3 className={s.fxGroupTitle}>{g.group}</h3>
                <ol className={s.fxList}>
                  {g.items.map((e, ei) => (
                    <li key={e.title}>
                      <span className={s.fxNo} aria-hidden="true">{`0${effects.slice(0, gi).reduce((n, x) => n + x.items.length, 0) + ei + 1}`}</span>
                      <h4 className={s.fxTitle}>{e.title}</h4>
                      <p>{e.body}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ 途中の相談 */}
      <section className={s.band} aria-labelledby="band-title">
        <div className={s.bandInner}>
          <div>
            <h2 id="band-title" className={s.bandTitle}>まずは数社から、御社の顧客でお試しください</h2>
            <p>対象の社名と御社の商材を伺い、観点とプランをご提案します。</p>
          </div>
          <Cta />
        </div>
      </section>

      {/* ------------------------------------------------------------ 選ばれる理由 */}
      <section className={s.reasons} id="reasons" aria-labelledby="reasons-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <h2 id="reasons-title" className={s.h2}>選ばれる理由</h2>
          </header>
          <ol className={s.reasonList}>
            <li>
              <div className={s.reasonText}>
                <p className={s.reasonNo}>01</p>
                <h3 className={s.h3}>御社の商材を起点に、観点を決めてから調べる</h3>
                <p>同じ顧客でも、売るものが違えば見るべき場所は変わります。ご依頼のたびに御社の商材を伺い、その商材が入り込める接点を中心に調べます。</p>
              </div>
              <div className={s.reasonEx}>
                <p className={s.exLabel}>同じ食品メーカーを分析する場合</p>
                <table className={s.exTable}>
                  <thead><tr><th scope="col">依頼元の商材</th><th scope="col">厚く見るところ</th></tr></thead>
                  <tbody>
                    {perspectives.map((p) => (
                      <tr key={p.seller}><th scope="row">{p.seller}</th><td>{p.looks}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </li>
            <li>
              <div className={s.reasonText}>
                <p className={s.reasonNo}>02</p>
                <h3 className={s.h3}>事実と推察を分けて書く</h3>
                <p>公開情報で確かめた事実と、そこから読み取れることを分けて示します。確認できなかった項目は「不明」と書くので、社内でそのまま使えます。</p>
              </div>
              <div className={s.reasonEx}>
                <p className={s.exLabel}>書き分けの例（サンプル食品のレポートより）</p>
                <ul className={s.exTags}>
                  {labelSample.map((l) => (
                    <li key={l.tag}><span data-tag={l.tag}>{l.tag}</span>{l.text}</li>
                  ))}
                </ul>
              </div>
            </li>
            <li>
              <div className={s.reasonText}>
                <p className={s.reasonNo}>03</p>
                <h3 className={s.h3}>1社3,000円から、数十社を同じ型で揃える</h3>
                <p>調査と資料作成は、定型の型に沿って学生チームが担います。納品の前に、経験のあるコンサルタントが内容を確認します。だからこの価格で、多くの取引先を同じ水準で並べられます。</p>
              </div>
              <div className={s.reasonEx}>
                <p className={s.exLabel}>作成の体制</p>
                <ol className={s.exFlow}>
                  <li><b>学生チーム</b>定型の型に沿って調査・作成</li>
                  <li><b>コンサルタント</b>納品前に内容を確認</li>
                  <li><b>納品</b>スライド形式。週10社が目安（Standard）</li>
                </ol>
              </div>
            </li>
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
              <h2 id="records-title" className={s.h2}>支援実績</h2>
              <p className={s.recordNum}>累計<b>数百</b>件</p>
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
          <header className={s.secHead}>
            <h2 id="price-title" className={s.h2}>料金</h2>
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
          <div className={s.custom}>
            <div>
              <h3 className={s.h3}>社数とご要望に合わせてお見積りします</h3>
              <p>プランは目安です。ページの構成と深さは、対象企業とご依頼の目的に合わせて決めます。数社からのお試しや、社内フォーマットでの納品もご相談ください。</p>
            </div>
            <Link href={CONTACT_ESTIMATE} className={s.btnPrimary}>見積もりを相談する<ArrowRight aria-hidden="true" size={18} strokeWidth={2.4} /></Link>
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
        <div className={s.wrapNarrow}>
          <header className={s.secHead}>
            <h2 id="faq-title" className={s.h2}>よくある質問</h2>
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
          <div className={s.finalCopy}>
            <h2 id="final-title" className={s.finalTitle}>まず数社、御社の顧客で試してみませんか</h2>
            <p className={s.finalLead}>分析したい顧客の社名と、御社の商材をお知らせください。観点とプランをご提案し、お見積りをお送りします。</p>
            <Cta />
            <p className={s.finalSub}>サービスについてのご質問は<Link href={CONTACT_GENERAL}>こちら</Link></p>
          </div>
          <div className={s.finalArt} aria-hidden="true">
            <img src={`${IMG}/summary-640.webp`} width={640} height={443} alt="" loading="lazy" decoding="async" />
            <img src={`${IMG}/cover-640.webp`} width={640} height={443} alt="" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      <StickyCta />
    </div>
  );
}
