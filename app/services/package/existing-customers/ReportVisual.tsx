import styles from './page.module.css';

export type ReportKind = 'overview' | 'products' | 'changes' | 'hypothesis';

const headings: Record<ReportKind, string> = {
  overview: '事業構成を俯瞰する',
  products: '商品と販路の接点を整理する',
  changes: '変化の兆しを時系列で捉える',
  hypothesis: '提案の問いを組み立てる',
};

export function ReportVisual({ kind }: { kind: ReportKind }) {
  return (
    <div className={styles.reportPage}>
      <div className={styles.reportTop}><span>架空サンプル｜企業分析資料</span><span>Neunon Consulting</span></div>
      <div className={styles.reportTitle}><span>既存顧客企業クローズアップ</span><strong>{headings[kind]}</strong></div>
      {kind === 'overview' && <div className={styles.reportOverview}>
        <div className={styles.reportPanel}><span className={styles.reportPanelTitle}>事業ポートフォリオ</span>
          <div className={styles.reportStack}><div style={{ width: '50%' }}>50%</div><div style={{ width: '30%' }}>30%</div><div style={{ width: '20%' }}>20%</div></div>
          <div className={styles.reportLegend}><span>基幹事業</span><span>周辺事業</span><span>新領域</span></div>
        </div>
        <div className={styles.reportPanel}><span className={styles.reportPanelTitle}>対象領域の見取り図</span><div className={styles.reportOrbit}><span>既存取引</span><span>隣接事業</span><span>新領域</span></div></div>
      </div>}
      {kind === 'products' && <div className={styles.reportProducts}>
        <div className={styles.reportMatrixHead}><span>商品群</span><span>既存取引</span><span>接点を検討</span><span>要確認</span></div>
        {[['基幹商品', '●', '—', '—'], ['周辺商品', '—', '●', '—'], ['新商品', '—', '●', '●'], ['サービス', '—', '—', '●']].map((row) => <div className={styles.reportMatrixRow} key={row[0]}>{row.map((cell, i) => <span key={i}>{cell}</span>)}</div>)}
        <p>取引の有無と提案余地を混同せず、確認すべき領域を整理します。</p>
      </div>}
      {kind === 'changes' && <div className={styles.reportChanges}>
        <div><span>01</span><strong>事業の変化</strong><p>重点領域の見直し</p></div><div><span>02</span><strong>商品・サービス</strong><p>新たな提供領域</p></div><div><span>03</span><strong>販売体制</strong><p>販路・組織の変化</p></div>
        <aside>確認した情報源と時点を記録し、変化の解釈を分けて示します。</aside>
      </div>}
      {kind === 'hypothesis' && <div className={styles.reportHypothesis}>
        <div><span>確認できた事実</span><strong>商品領域の拡張</strong><p>公表情報に基づいて整理</p></div><b aria-hidden="true">→</b><div><span>提案仮説</span><strong>周辺商材との接点</strong><p>貴社商材との適合を検討</p></div><b aria-hidden="true">→</b><div><span>次に確かめること</span><strong>導入条件・担当部署</strong><p>商談で確認する問いに変換</p></div>
      </div>}
      <div className={styles.reportFoot}><span>図表・企業・構成比は説明用の架空サンプルです</span><span>{kind === 'overview' ? '01' : kind === 'products' ? '02' : kind === 'changes' ? '03' : '04'}</span></div>
    </div>
  );
}
