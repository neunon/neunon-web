import { OrganizationDiagram } from '@/components/about/OrganizationDiagram';

/** 会社概要・トップ・事業内容で共通利用する学生組織の実行基盤。 */
export function StructureDiagram({ headingLevel: _headingLevel = 3 }: { headingLevel?: 3 | 4 }) {
  void _headingLevel;
  return <OrganizationDiagram />;
}
