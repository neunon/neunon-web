import Link from 'next/link';
import type { ComponentType, ReactNode } from 'react';
import {
  CONTACT_ESTIMATE, CONTACT_GENERAL,
  comparison, effects, faq, flow, hypotheses, plans, records,
} from './data';
import { LensSwitcher } from './LensSwitcher';
import { VisChannels, VisHero, VisHypothesis, VisPerformance, VisProducts, VisSignals } from './Visuals';
import s from './lp.module.css';

/**
 * 既存顧客企業クローズアップ LP。
 *
 * 構成は購買検討の順:
 *   何をしてくれるか（ヒーロー）→ どう読み解くか（5段）→ 提案仮説の質 → 効果 → 自社向けに変わるか
 *   → 他の手段との違い → 実績 → いくらで・どう頼むか → 疑問 → 相談
 * 図は Visuals.tsx の抽象図。レポートの紙面は見せず、何をどう見るかのイメージだけを伝える。
 * 赤は「示唆」だけに使う。実際のレポートで赤字が提案につながる発見を示すのと同じ規則。
 */

type Step = {
  no: string;
  title: string;
  body: ReactNode;
  looks: string[];
  Vis: ComponentType;
};

const steps: Step[] = [
  {
    no: '01',
    title: '業績と事業構成を、分解する',
    body: <p>決算公告・会社案内などから事業別の売上と利益を並べ直し、どの事業が伸びていて、どこに資金と人が向かっているかを特定します。</p>,
    looks: ['売上・利益の推移', '事業別の構成', '伸びている事業'],
    Vis: VisPerformance,
  },
  {
    no: '02',
    title: '強みと、顧客・販売チャネルを押さえる',
    body: <p>誰に、どの経路で売っているか。販路の構成が変わると、必要になる物流・資材・設備も変わります。強みや特徴とあわせて、需要が生まれる場所を探します。</p>,
    looks: ['特徴・強み', '主な販売先', '販路の構成と変化'],
    Vis: VisChannels,
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
    looks: ['カテゴリ別の主力', '価格帯・販路', '商材との接点'],
    Vis: VisProducts,
  },
  {
    no: '04',
    title: '変化のシグナルを拾う',
    body: (
      <>
        <p>組織の新設、拠点や工場の増設、新しい販路への参入、求人の記載。直近の出来事を時系列に並べ、提案のタイミングを示す変化を拾います。</p>
        <p>現在の取引状況を伺える場合は、取引中と未取引の区画まで整理します（任意）。</p>
      </>
    ),
    looks: ['組織・体制', '投資・拠点', '新規参入', '求人'],
    Vis: VisSignals,
  },
  {
    no: '05',
    title: '筋のよい提案仮説にする',
    body: <p>集めた事実を「根拠 → 読み → 提案」の順に組み立て、初回にどこへ何を持ち込むかまで書きます。確度と規模も添えて、どれから動くかを決めやすくします。</p>,
    looks: ['根拠となる事実', '読み', '初回の打ち手', '確度・規模'],
    Vis: VisHypothesis,
  },
];

const markLabel: Record<string, string> = { '◎': 'よく合う', '○': '対応できる', '△': '限られる', '×': '向かない' };

const filled = (v: string) => v.trim() !== '';
const hot = (v: string) => v === '高' || v === '大';

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
              顧客の業績・顧客と販売チャネル・商品・変化のシグナルを公開情報から調べ、御社の商材との接点を整理します。
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
              <Link href={CONTACT_ESTIMATE} className={s.btnPrimaryInverse}>見積もりを相談する</Link>
              <a href="#reading" className={s.btnGhostInverse}>読み解き方を見る</a>
            </div>
            <p className={s.heroNote}>数社からのお試しも承ります</p>
          </div>

          <div className={s.heroArt}>
            <VisHero />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- 読み解きの5段 */}
      <section className={s.reading} id="reading" aria-labelledby="reading-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <h2 id="reading-title" className={s.h2}>1社を、こう読み解きます</h2>
            <p className={s.secLead}>
              企業情報を集めて並べるだけでは、営業の次の一手にはなりません。
              御社の商材を起点に4つの面から事実を集め、最後に提案仮説へまとめます。
            </p>
          </header>

          <ol className={s.steps}>
            {steps.map(({ no, title, body, looks, Vis }, i) => (
              <li key={no} className={i % 2 === 0 ? s.stepSplit : s.stepSplitReverse}>
                <div className={s.stepText}>
                  <p className={s.stepNo}>{no}</p>
                  <h3 className={s.h3}>{title}</h3>
                  {body}
                  <ul className={s.looks} aria-label="主に見るもの">
                    {looks.map((l) => <li key={l}>{l}</li>)}
                  </ul>
                </div>
                <div className={s.stepVis}>
                  <Vis />
                </div>
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
              「伸びている事業に、自社の商材を提案する」だけでは、誰でも思いつく仮説です。
              時期の兆し、競合が持たない切り口、小さく入る入口。事実を組み合わせて、その会社ならではの筋を探します。
            </p>
          </header>
          <ol className={s.hypoList}>
            {hypotheses.map((h, i) =>
              filled(h.title) ? (
                <li key={i} className={s.hypoCard}>
                  <div className={s.hypoHead}>
                    <p className={s.hypoNo}>仮説{i + 1}</p>
                    <h3 className={s.hypoTitle}>{h.title}</h3>
                    {(filled(h.confidence) || filled(h.scale)) && (
                      <p className={s.hypoTags}>
                        {filled(h.confidence) && <span data-hot={hot(h.confidence) ? 'true' : undefined}>確度 {h.confidence}</span>}
                        {filled(h.scale) && <span data-hot={hot(h.scale) ? 'true' : undefined}>規模 {h.scale}</span>}
                      </p>
                    )}
                  </div>
                  <dl className={s.hypoChain}>
                    <div>
                      <dt>根拠（事実）</dt>
                      <dd><ul>{h.facts.filter(filled).map((f) => <li key={f}>{f}</li>)}</ul></dd>
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
              ) : (
                <li key={i} className={s.hypoDraft}>
                  <p className={s.hypoNo}>仮説{i + 1}</p>
                  <p className={s.hypoDraftTitle}>記入待ち</p>
                  <ul>
                    <li>タイトル・確度・規模</li>
                    <li>根拠（事実）</li>
                    <li>読み（推察）</li>
                    <li>提案・初回の打ち手</li>
                  </ul>
                  <p className={s.hypoDraftNote}>content/pages/existing-customers.json に記入すると、ここに表示されます</p>
                </li>
              ),
            )}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------------- 効果 */}
      <section className={s.effects} id="effects" aria-labelledby="effects-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <h2 id="effects-title" className={s.h2}>営業の時間を、調べることから提案することへ</h2>
            <p className={s.secLead}>
              顧客を調べる作業を任せることで、担当者は提案と商談に時間を使えます。
              既存顧客の深耕で期待できる効果です。
            </p>
          </header>
          <div className={s.fx} role="table" aria-label="これまでと、企業クローズアップを使った場合の比較">
            <div className={s.fxHead} role="row">
              <span role="columnheader"><span className={s.srOnly}>観点</span></span>
              <span role="columnheader">これまで</span>
              <span role="columnheader">企業クローズアップを使うと</span>
            </div>
            {effects.map((e, i) => (
              <div key={e.topic} className={s.fxRow} role="row">
                <span role="rowheader" className={s.fxTopic}><b>{`0${i + 1}`}</b>{e.topic}</span>
                <span role="cell" className={s.fxBefore}>{e.before}</span>
                <span role="cell" className={s.fxAfter}>{e.after}</span>
              </div>
            ))}
          </div>
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
              <p className={s.prepareNote}>ご依頼の前に、秘密保持契約を締結します。</p>
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
