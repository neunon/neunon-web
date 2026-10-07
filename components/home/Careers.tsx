import { InteractiveHoverLink } from '@/components/ui/interactive-hover-button';
import home from '@/content/pages/home.json';

/**
 * トップページ セクション7: 学生の方へ（要件定義書 6.1）
 * 採用サイトへの導線ブロック。デザイン案 v2 の 06 CAREERS をそのまま踏襲。
 */

export function Careers() {
  if (!home.careersSection.visible) return null;
  const section = home.careersSection;
  return (
    <section className="section nc-home-wide" aria-labelledby="careers-heading">
      <div className="wrap nc-stu-sec">
        <div className="nc-stu-copy">
          <h2 id="careers-heading">
            {section.titleLine1}
            <br />
            <span className="nc-sub">{section.titleLine2}</span>
          </h2>
          <p>{section.intro}</p>
          <div className="nc-acts nc-stu-acts">
            <InteractiveHoverLink href="/recruit" text={section.recruitLabel} />
            <InteractiveHoverLink href="/entry" text={section.entryLabel} className="is-outline" />
          </div>
        </div>

        <div>
          <p className="nc-glabel">{section.experiencesTitle}</p>
          <ul className="nc-gakuchika">
            {section.experiences.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <InteractiveHoverLink href="/recruit/voice/" text={section.voiceLabel} className="is-outline nc-voice-button" />
        </div>
      </div>
    </section>
  );
}
