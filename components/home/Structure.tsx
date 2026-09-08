import { StructureDiagram } from '@/components/shared/StructureDiagram';

/**
 * トップページ セクション3: 提供価値（要件定義書 6.1）
 *
 * 「セクション3の図解が本サイトの核心」と明記されている箇所。
 * 図そのものは会社概要の組織体制でも再掲するため StructureDiagram に切り出している。
 */
export function Structure() {
  return (
    <section className="section section-alt" aria-labelledby="structure-heading">
      <div className="wrap">
        <div className="shead">
          <h2 id="structure-heading">実行は学生チーム、品質は経験者が担保する。</h2>
          <p>
            役割を分けることで、品質を落とさずにコストを下げています。この構造そのものが当社の提供価値です。
          </p>
        </div>
        <StructureDiagram />
      </div>
    </section>
  );
}
