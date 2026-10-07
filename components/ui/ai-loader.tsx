/** ヒーロー内で使う、画像に依存しない小さなモーション・ビジュアル。 */
export function AiLoader({ text = 'Generating' }: { text?: string }) {
  return <div className="ep-ai-loader" role="img" aria-label="Generating と表示された回転する光のリング"><div className="ep-ai-loader-ring" aria-hidden="true" /><div className="ep-ai-loader-core" aria-hidden="true">{[...text].map((letter, index) => <span key={`${index}-${letter}`} style={{ animationDelay: `${index * 0.1}s` }}>{letter}</span>)}</div></div>;
}
