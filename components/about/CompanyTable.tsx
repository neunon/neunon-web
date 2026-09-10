import { site } from '@/lib/site';

/**
 * 会社情報テーブル（要件定義書 2. の表）。
 *
 * 掲載範囲は 12.1 の発注者判断に従う:
 * 本店所在地の番地・部屋番号、代表者の電話番号ともに掲載する。
 * ただし問い合わせの主導線はフォームとする。
 */
export function CompanyTable() {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: '社名', value: site.name },
    { label: '設立', value: site.founded },
    { label: '代表者', value: site.representative },
    {
      label: '所在地',
      value: site.address.head,
    },
    { label: '事業内容', value: '経営コンサルティング／戦略コンサルティング' },
    { label: '従業員数', value: site.employees },
    {
      label: '電話',
      value: (
        <a href={`tel:${site.tel.replace(/-/g, '')}`} className="nc-inline-link">
          {site.tel}
        </a>
      ),
    },
    {
      label: 'メール',
      value: (
        <a href={`mailto:${site.email}`} className="nc-inline-link">
          {site.email}
        </a>
      ),
    },
  ];

  return (
    <dl className="nc-deflist nc-company">
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
