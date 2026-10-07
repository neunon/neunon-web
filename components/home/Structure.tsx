import { StructureDiagram } from '@/components/shared/StructureDiagram';
import home from '@/content/pages/home.json';

/**
 * トップページ セクション3: 提供価値（要件定義書 6.1）
 *
 * 「セクション3の図解が本サイトの核心」と明記されている箇所。
 * 図そのものは会社概要の組織体制でも再掲するため StructureDiagram に切り出している。
 */
export function Structure() {
  if (!home.structureSection.visible) return null;
  return (
    <section className="section section-alt nc-structure-section nc-home-wide" aria-labelledby="structure-heading">
      <div className="wrap">
        <div className="shead">
          <h2 id="structure-heading">{home.structureSection.title}</h2>
          <p>{home.structureSection.intro.split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</p>
        </div>
        <StructureDiagram />
      </div>
    </section>
  );
}
