import type { ConsultingCase, ConsultingFormat, ConsultingPriceChart } from '@/lib/content';

/** 守秘対象の実測値を使わず、分析の形だけを示す模式図。 */
export function CaseIllustration({ item }: { item: ConsultingCase }) {
  const captions: Record<string, string> = {
    '01': '応募と求人の関係を検証する分析イメージ',
    '02': '役割・評価・育成をつなぐ設計イメージ',
    '03': '市場内のポジションを比較する分析イメージ',
  };

  return (
    <figure className="ep-case-viz">
      {item.no === '01' ? (
        <svg viewBox="0 0 620 360" role="img" aria-label={captions[item.no]}>
          <path className="ep-viz-axis" d="M55 24V318H590" />
          <text className="ep-viz-axis-title" transform="translate(24 206) rotate(-90)">応募密度 →</text><text className="ep-viz-axis-title" x="472" y="349">求人密度 →</text>
          {[[72,294],[91,280],[108,269],[118,262],[135,252],[154,232],[180,214],[252,174],[455,82],[544,50]].map(([x,y], index) => <circle className="ep-viz-point" cx={x} cy={y} r="7" key={index} />)}
        </svg>
      ) : item.no === '02' ? (
        <div className="ep-viz-evaluation">
          <div className="ep-viz-eval-phases"><div><strong>準備（期初）</strong><span>評価基準の周知／目標設定</span></div><div><strong>運用（期中）</strong><span>業務遂行／進捗確認</span></div><div><strong>評価・反映（期末）</strong><span>評価／調整／処遇反映</span></div></div>
          <div className="ep-viz-eval-roles"><span>人事・事務局</span><span>評価者</span><span>被評価者</span></div>
          <div className="ep-viz-eval-grid"><span>スキル定義・評価基準</span><span>運用状況を確認</span><span>評価集計・調整</span><span>等級・報酬へ反映</span><span>目標設定面談</span><span>月次1on1</span><span>一次評価</span><span>フィードバック</span><span>自己診断・目標案</span><span>業務遂行・成果記録</span><span>自己評価</span><span>次期目標を設定</span></div>
          <div className="ep-viz-skill-matrix" role="img" aria-label="11のスキル項目を4段階の基準で定義した評価マトリクスの模式図">
            <div className="ep-viz-skill-head"><span>評価</span>{['対人・行動','専門業務','業務基盤'].map((heading) => <strong key={heading}>{heading}</strong>)}</div>
            <div className="ep-viz-skill-columns"><span />{['対話','業務姿勢','マナー','気配り','提案','自己管理','専門技術','成果品質','IT活用','事務処理','業界知識'].map((skill) => <span key={skill}>{skill}</span>)}</div>
            {['高','やや高','やや低','低'].map((level, row) => <div className="ep-viz-skill-row" key={level}><strong>{level}</strong>{Array.from({ length: 11 }, (_, column) => <span key={column}><i style={{ width: `${68 + ((column * 7 + row * 11) % 23)}%` }} /><i style={{ width: `${41 + ((column * 13 + row * 5) % 39)}%` }} /><i style={{ width: `${55 + ((column * 3 + row * 17) % 30)}%` }} /></span>)}</div>)}
          </div>
        </div>
      ) : (
        <svg viewBox="0 0 620 360" role="img" aria-label={captions[item.no] ?? '分析イメージ'}>
          <path className="ep-viz-axis" d="M58 20V315H590" />
          <text className="ep-viz-axis-title" x="5" y="25">営業利益率</text><text className="ep-viz-axis-title" x="474" y="348">純売上 →</text>
          <path className="ep-viz-v-guide" d="M95 55L335 264L552 83" />
          <g className="ep-viz-scatter">{[[101,46],[145,96],[189,137],[229,169],[258,177],[291,188],[326,244],[375,226],[416,215],[454,151],[497,119],[545,108]].map(([x,y], index) => <circle key={index} cx={x} cy={y} r="6" />)}</g>
        </svg>
      )}
      <figcaption>{captions[item.no] ?? '分析イメージ'} <span>模式図・実データではありません</span></figcaption>
    </figure>
  );
}

export function FormatFlow({ items }: { items: ConsultingFormat[] }) {
  return (
    <figure className="ep-format-flow">
      <div className="ep-format-flow-rows">
        {items.map((item) => (
          <div className="ep-format-flow-row" key={item.no}>
            <strong>{item.title}</strong>
            <div className="ep-format-flow-nodes">
              {item.chain.map((node, index) => (
                <span className="ep-format-flow-node" key={`${item.no}-${node}`}>
                  {index > 0 ? <i aria-hidden="true">→</i> : null}<b>{node}</b>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <figcaption>案件に合わせて、実務の担当と品質管理の位置を組み替えます。</figcaption>
    </figure>
  );
}

export function PriceComposition({ chart }: { chart: ConsultingPriceChart }) {
  const totals = chart.columns.map((column) => column.segments.reduce((sum, segment) => sum + segment.value, 0));
  const maximum = Math.max(...totals);
  return (
    <figure className="ep-price-composition">
      <div className="ep-price-composition-plot" role="img" aria-label="業界の戦略コンサル上場企業と当社の価格構造を比較した模式図。具体的な料金の比較ではありません。">
        {chart.columns.map((column, index) => (
          <div className="ep-price-composition-column" key={column.label}>
            <div className="ep-price-composition-bar">
              <div className="ep-price-composition-stack" style={{ height: `${(totals[index] / maximum) * 100}%` }}>
                {column.segments.map((segment) => <div className={`is-${segment.tone}`} key={segment.label} style={{ flex: segment.value }}><span>{segment.label}</span></div>)}
              </div>
            </div>
            <strong>{column.label}</strong>
          </div>
        ))}
        <div className="ep-price-composition-delta" aria-hidden="true"><i /><i /><span>{chart.annotation}</span></div>
      </div>
      <figcaption>価格構造の模式図です。実際の料金や見積額を示すものではありません。{chart.note}</figcaption>
    </figure>
  );
}

export function PackagePreviewVisual({ index }: { index: number }) {
  const variant = index % 4;
  const descriptions = [
    '市場を複数の領域に分けて比較した模式図',
    '顧客の変化と提案余地を整理した模式図',
    '複数の競合を共通の軸で比較した模式図',
    '候補企業の絞り込み工程を表した模式図',
  ];
  return (
    <div className="ep-package-preview-visual" role="img" aria-label={`${descriptions[variant]}。実データではありません。`}>
      {variant === 0 ? <div className="ep-pv-market"><i /><i /><i /><i /><i /></div> : null}
      {variant === 1 ? <div className="ep-pv-account"><i /><i /><i /><i /></div> : null}
      {variant === 2 ? <div className="ep-pv-compare"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div> : null}
      {variant === 3 ? <div className="ep-pv-funnel"><i /><i /><i /><i /></div> : null}
      <span className="ep-package-preview-key">資料構成イメージ</span>
    </div>
  );
}

export function AiWorkflowDiagram() {
  return (
    <figure className="ep-ai-workflow">
      <div className="ep-ai-workflow-before">
        <h3>AIが支援する工程</h3>
        <div><span>資料・データの収集</span><span>分類と要点整理</span><span>下書き・候補の作成</span></div>
      </div>
      <div className="ep-ai-workflow-after">
        <h3>人が担う工程</h3>
        <div><span>目的と確認基準を決める</span><span>事実と出力を検証する</span><span>判断して業務に適用する</span></div>
      </div>
      <figcaption>役割分担の例です。自動化する範囲と確認工程は、対象業務に合わせて設計します。</figcaption>
    </figure>
  );
}
