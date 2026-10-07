import Link from 'next/link';
import type { LandingSection } from '@/lib/landing';

/** CMSで追加された汎用セクション。LPと既存ページで同じ表示を使う。 */
export function EditorialSections({ sections }: { sections: LandingSection[] }) {
  return <>{sections.map((section, index) => {
    if (!section.visible) return null;
    return (
      <section className={`nc-landing-section is-${section.tone}`} key={`${section.type}-${index}`}>
        <div className="wrap nc-landing-inner">
          <div className="nc-landing-section-head">
            {section.eyebrow ? <span>{section.eyebrow}</span> : null}
            <h2>{section.title}</h2>
          </div>
          {section.type === 'text' ? <div className="nc-landing-prose">{section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div> : null}
          {section.type === 'cards' ? <>
            {section.lead ? <p className="nc-landing-lead">{section.lead}</p> : null}
            <div className="nc-landing-cards">{section.cards.filter(card => card.visible).map((card, i) => <article key={i}>
              <h3>{card.title}</h3><p>{card.body}</p>
              {card.href ? <Link href={card.href}>詳しく見る <span aria-hidden="true">↗</span></Link> : null}
            </article>)}</div>
          </> : null}
          {section.type === 'imageText' ? <div className={`nc-landing-image-text is-${section.imageSide}`}>
            <div className="nc-landing-prose">{section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
            {/* 画像パスは公開前のコンテンツ監査で /uploads/ に制限する。 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={section.image} alt={section.imageAlt} loading="lazy" />
          </div> : null}
          {section.type === 'faq' ? <div className="nc-landing-faq">{section.questions.filter(item => item.visible).map((item, i) => <div key={i}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</div> : null}
          {section.type === 'cta' ? <div className="nc-landing-cta"><p>{section.body}</p><Link href={section.href}>{section.label}<span aria-hidden="true"> ↗</span></Link></div> : null}
        </div>
      </section>
    );
  })}</>;
}
