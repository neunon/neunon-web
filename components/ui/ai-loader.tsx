/** ヒーロー内で使う、画像に依存しない小さなモーション・ビジュアル。 */
export function AiLoader({ text = 'NEUNON' }: { text?: string }) {
  return <div className="ep-ai-loader" role="img" aria-label="AI開発・プロダクトを表す回転する光のリング"><div className="ep-ai-loader-ring" aria-hidden="true" /><div className="ep-ai-loader-core" aria-hidden="true">{text}</div></div>;
}
