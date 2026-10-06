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
        <svg viewBox="0 0 440 230" role="img" aria-label={captions[item.no]}>
          <g className="ep-viz-grid"><path d="M35 35H415M35 88H415M35 141H415M35 194H415" /></g>
          <g className="ep-viz-bars"><rect x="57" y="145" width="34" height="49" /><rect x="112" y="126" width="34" height="68" /><rect x="167" y="136" width="34" height="58" /><rect x="222" y="101" width="34" height="93" /><rect x="277" y="86" width="34" height="108" /><rect x="332" y="61" width="34" height="133" /></g>
          <path className="ep-viz-line" d="M74 151C111 148 114 117 129 128S179 138 184 121 233 114 239 91 286 86 294 72 350 63 349 48" />
          <g className="ep-viz-points"><circle cx="74" cy="151" r="5" /><circle cx="129" cy="128" r="5" /><circle cx="184" cy="121" r="5" /><circle cx="239" cy="91" r="5" /><circle cx="294" cy="72" r="5" /><circle cx="349" cy="48" r="5" /></g>
        </svg>
      ) : item.no === '02' ? (
        <svg viewBox="0 0 440 230" role="img" aria-label={captions[item.no]}>
          <g className="ep-viz-matrix-labels"><text x="40" y="35">役割</text><text x="160" y="35">期待行動</text><text x="285" y="35">評価</text><text x="375" y="35">育成</text></g>
          <g className="ep-viz-grid"><path d="M34 52H415M34 104H415M34 156H415M34 208H415" /></g>
          <g className="ep-viz-matrix-row"><rect x="37" y="66" width="66" height="24" rx="6" /><rect x="155" y="66" width="73" height="24" rx="6" /><rect x="278" y="66" width="59" height="24" rx="6" /><circle cx="383" cy="78" r="12" /></g>
          <g className="ep-viz-matrix-row"><rect x="37" y="118" width="66" height="24" rx="6" /><rect x="155" y="118" width="73" height="24" rx="6" /><rect x="278" y="118" width="59" height="24" rx="6" /><circle cx="383" cy="130" r="12" /></g>
          <g className="ep-viz-matrix-row"><rect x="37" y="170" width="66" height="24" rx="6" /><rect x="155" y="170" width="73" height="24" rx="6" /><rect x="278" y="170" width="59" height="24" rx="6" /><circle cx="383" cy="182" r="12" /></g>
          <g className="ep-viz-matrix-links"><path d="M103 78H155M228 78H278M337 78H371M103 130H155M228 130H278M337 130H371M103 182H155M228 182H278M337 182H371" /></g>
        </svg>
      ) : (
        <svg viewBox="0 0 440 230" role="img" aria-label={captions[item.no] ?? '分析イメージ'}>
          <g className="ep-viz-grid"><path d="M50 25V205M50 205H414M50 115H414M232 25V205" /></g>
          <g className="ep-viz-scatter"><circle cx="90" cy="159" r="7" /><circle cx="127" cy="133" r="8" /><circle cx="161" cy="171" r="6" /><circle cx="208" cy="139" r="10" /><circle cx="248" cy="89" r="7" /><circle cx="288" cy="69" r="10" /><circle cx="330" cy="111" r="7" /><circle cx="365" cy="56" r="8" /></g>
          <circle className="ep-viz-focus" cx="288" cy="69" r="24" />
          <g className="ep-viz-axis-labels"><text x="55" y="20">収益性</text><text x="300" y="222">事業規模・領域</text></g>
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
      <div className="ep-price-composition-plot" role="img" aria-label="従来型ファームと当社の価格構造を比較した模式図。具体的な料金の比較ではありません。">
        {chart.columns.map((column, index) => (
          <div className="ep-price-composition-column" key={column.label}>
            <div className="ep-price-composition-bar">
              <div className="ep-price-composition-stack" style={{ height: `${(totals[index] / maximum) * 100}%` }}>
                {column.segments.map((segment) => <div className={`is-${segment.tone}`} key={segment.label} style={{ flex: segment.value }} />)}
              </div>
            </div>
            <strong>{column.label}</strong>
          </div>
        ))}
        <div className="ep-price-composition-guide"><span>比較イメージ</span></div>
      </div>
      <div className="ep-price-composition-legend">
        {Array.from(new Map(chart.columns.flatMap((column) => column.segments).map((segment) => [segment.label, segment])).values()).map((segment) => (
          <span key={segment.label}><i className={`is-${segment.tone}`} aria-hidden="true" />{segment.label}</span>
        ))}
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
        <h3>現在の業務</h3>
        <div><span>資料を探す</span><span>内容を整理する</span><span>下書きを作る</span><span>人が確認する</span></div>
      </div>
      <div className="ep-ai-workflow-arrow" aria-hidden="true">→</div>
      <div className="ep-ai-workflow-after">
        <h3>導入後の業務イメージ</h3>
        <div><span>対象を指定</span><span className="is-ai">AIが収集・整理を支援</span><span className="is-human">人が確認・判断</span><span>業務で利用</span></div>
      </div>
      <figcaption>業務フローの一例です。自動化できる範囲と確認工程は、対象業務に合わせて設計します。</figcaption>
    </figure>
  );
}
