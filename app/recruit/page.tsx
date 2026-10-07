import type { Metadata } from 'next';
import Link from 'next/link';
import { InteractiveHoverLink } from '@/components/ui/interactive-hover-button';
import { pageMetadata } from '@/lib/seo';
import { conditions, gakuchika, idealCandidate, recruitHero, selectionSteps, termsPendingNote } from '@/lib/recruit';

export const metadata: Metadata = pageMetadata('recruit', '/recruit/');

export default function RecruitPage() {
  return (
    <div className="ep ep-recruit">
      <section className="ep-r-hero" aria-labelledby="ep-r-title">
        <div className="ep-wrap ep-r-hero-inner">
          <div className="ep-r-hero-copy">
            <span className="ep-overline">採用情報</span>
            <h1 id="ep-r-title">{recruitHero.lines[0]}<br /><em>{recruitHero.lines[1]}</em></h1>
            <p className="ep-r-hero-sub">{recruitHero.sub}</p>
            <p className="ep-r-hero-lead">{recruitHero.lead}</p>
            <InteractiveHoverLink href="/entry/" text="エントリーする" />
          </div>
          <div className="ep-r-hero-image" role="img" aria-label="街を見つめる学生の後ろ姿">
            <span>可能性を、実務へ。</span>
          </div>
        </div>
      </section>

      <section className="ep-r-claim" aria-label="ここで得られる経験">
        <div className="ep-wrap"><span>学生の時間を、<br />企業の現場へ。</span><p>自分の手で調べ、考え、届ける。企業が実際に使う成果物をつくります。</p></div>
      </section>

      <section className="ep-section ep-r-experience" aria-labelledby="ep-r-experience-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <div><span className="ep-overline">ここでできること</span><h2 id="ep-r-experience-title">練習ではなく、<br />企業の仕事を。</h2></div>
            <p>調査、分析、資料作成。経験のあるコンサルタントの監修のもとで、実案件に取り組みます。</p>
          </header>
          <div className="ep-r-experience-grid">
            <div className="ep-r-experience-feature">
              <span>取り組む仕事</span>
              <h3>企業の判断に使われる、<br />成果物をつくる。</h3>
              <p>市場規模の推定、競合分析、収益性分析、事業デューデリジェンス、提案資料の作成。実際の案件を通じて学びます。</p>
            </div>
            <div className="ep-r-experience-skills">
              <span>身につける力</span>
              <ol><li>調べる</li><li>構造化する</li><li>示唆を出す</li><li>資料にする</li></ol>
              <p>知識ゼロから始められます。成果物はリード学生とコンサルタントが確認します。</p>
            </div>
          </div>
          <div className="ep-r-stories">
            <p>ここで経験できること</p>
            <ul>{gakuchika.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="ep-section ep-r-path" aria-labelledby="ep-r-path-title">
        <div className="ep-wrap">
          <header className="ep-split-head">
            <div><span className="ep-overline">成長の道筋</span><h2 id="ep-r-path-title">アソシエイトから、<br />チームを率いる側へ。</h2></div>
            <p>実務を重ね、任される範囲を広げていきます。一人で抱え込ませず、各段階で監修と支援があります。</p>
          </header>
          <ol className="ep-r-path-steps">
            <li><span>01</span><h3>アソシエイト学生</h3><p>調査・データ分析・資料作成を担当。リード学生の指導のもとで、実務の基礎を身につけます。</p></li>
            <li><span>02</span><h3>リード学生</h3><p>案件実務に加え、ディレクション、進捗管理、企業との窓口を担います。</p></li>
            <li><span>03</span><h3>新しいチームへ</h3><p>自分のチームを組成し、新規サービスの企画や顧客開拓にも挑戦できます。</p></li>
          </ol>
          <p className="ep-r-path-foot">どの段階でも、成果物は経験のあるコンサルタントが監修します。</p>
        </div>
      </section>

      <section className="ep-section ep-r-challenge" aria-labelledby="ep-r-challenge-title">
        <div className="ep-wrap ep-r-challenge-inner">
          <div><span className="ep-overline">挑戦する領域</span><h2 id="ep-r-challenge-title">仕事の枠も、<br />決め切らない。</h2></div>
          <p>コンサルティングだけをする学生組織ではありません。企業支援に役立つ提案なら、新規サービスの立ち上げや営業、Webサイト制作にも挑戦できます。</p>
        </div>
      </section>

      <section className="ep-section ep-r-fit" aria-labelledby="ep-r-fit-title">
        <div className="ep-wrap">
          <header className="ep-split-head"><div><span className="ep-overline">求める人物像</span><h2 id="ep-r-fit-title">見るのは、<br />これからの姿勢。</h2></div><p>学部・学科、スキル、成績は問いません。</p></header>
          <div className="ep-r-fit-list">{idealCandidate.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
        </div>
      </section>

      <section className="ep-section ep-r-conditions" aria-labelledby="ep-r-conditions-title">
        <div className="ep-wrap ep-r-conditions-inner">
          <div><span className="ep-overline">募集について</span><h2 id="ep-r-conditions-title">まずは、<br />話してみませんか。</h2><Link href="/entry/" className="ep-text-link">エントリーフォームへ <span aria-hidden="true">↗</span></Link></div>
          <div><dl>{conditions.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl><p className="ep-r-terms">{termsPendingNote}</p></div>
        </div>
      </section>

      <section className="ep-section ep-r-selection" aria-labelledby="ep-r-selection-title">
        <div className="ep-wrap">
          <header className="ep-split-head"><div><span className="ep-overline">選考フロー</span><h2 id="ep-r-selection-title">エントリーから、<br />案件参加まで。</h2></div><p>各段階で、仕事の内容や条件もご説明します。内容を確認したうえで進むか判断できます。</p></header>
          <ol>{selectionSteps.map((step) => <li key={step.no}><span>{step.no}</span><h3>{step.title}</h3><p>{step.span}</p></li>)}</ol>
          <Link href="/recruit/flow/" className="ep-text-link">選考フローの詳細 <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="ep-r-cta" aria-labelledby="ep-r-cta-title"><div className="ep-wrap"><span className="ep-overline">あなたの次の一歩</span><h2 id="ep-r-cta-title">使い道は、<br />ここからつくれる。</h2><p>志望動機をきれいにまとめる必要はありません。まずは、話を聞くところから。</p><InteractiveHoverLink href="/entry/" text="エントリーする" /></div></section>
    </div>
  );
}
