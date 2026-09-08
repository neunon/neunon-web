import { site } from '@/lib/site';

/**
 * 沿革（要件定義書 6.2）。
 *
 * 【要確認】「沿革に載せる出来事」は要件定義書 14. で未解決。
 * 現在は確認済みの事実（設立日）のみを載せている。
 * 発注者から出来事の一覧を受領したら entries に追記すること。
 */
const entries: { date: string; body: string }[] = [
  { date: site.founded, body: `${site.name} を設立` },
];

export function History() {
  return (
    <>
      <ol className="nc-history">
        {entries.map((entry) => (
          <li key={entry.date}>
            <span className="nc-history-date">{entry.date}</span>
            <span>{entry.body}</span>
          </li>
        ))}
      </ol>
      <p className="nc-pending">
        設立以降の出来事は準備中です。
        <br />
        <span>
          実装メモ: 要件定義書 14. の未解決事項。発注者から出来事の一覧を受領後、
          <code>components/about/History.tsx</code> の entries に追記してください。
        </span>
      </p>
    </>
  );
}
