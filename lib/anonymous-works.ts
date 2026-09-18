export type AnonymousWork = {
  industry: string;
  title: string;
};

/**
 * 公開用の匿名化実績。
 * NDA に配慮し、顧客名・規模・成果・固有の課題は持たず、業界と支援テーマだけを掲載する。
 */
export const anonymousWorks: AnonymousWork[] = [
  { industry: '建設・インフラ', title: '新規事業候補領域における主要プレイヤー・競争構造分析' },
  { industry: '建設・インフラ', title: '新規事業における参入候補市場の需要規模・市場性評価' },
  { industry: '建設・インフラ', title: '投資・提携候補領域における市場構造・シナジー分析' },
  { industry: '建設・インフラ', title: '投資・提携候補企業の事業・競争力分析' },
  { industry: '建設・インフラ', title: '新規事業候補領域におけるセグメント別市場性評価' },
  { industry: 'メディア', title: '人事評価制度・スキル定義・評価運用プロセス設計' },
  { industry: 'AI', title: 'AI関連領域におけるSEOコンテンツ企画・制作' },
  { industry: 'AI', title: '営業メール・問い合わせ業務の自動化システム開発' },
  { industry: 'AI', title: 'SNSアカウントデータの自動収集・指標算出システム開発' },
  { industry: 'AI', title: '営業・顧客企業の調査レポート自動生成システム開発' },
  { industry: '食品・卸売', title: '卸売市場における市場規模・競争環境・事業構造分析' },
  { industry: '食品・卸売', title: '卸売領域における商流・バリューチェーン構造分析' },
  { industry: '物流', title: '新規事業におけるバリューチェーン・市場性・参入領域分析' },
  { industry: '物流', title: '新規事業における物流コスト・収益構造シミュレーション' },
  { industry: 'SNS', title: 'SNS関連サービスにおける販売戦略・事業戦略検討' },
  { industry: '小売', title: '新規参入市場における先行企業の成長プロセス・成功要因分析' },
  { industry: '小売', title: '競合企業における事業特性・戦略・競争優位性分析' },
  { industry: '小売', title: '新規参入市場における販売チャネル構造・チャネル特性分析' },
  { industry: '製造', title: '対象市場におけるブランド・営業候補企業の網羅的リストアップ' },
  { industry: '製造', title: '既存顧客企業における事業・商品・成長動向分析' },
  { industry: '製造', title: '新規営業候補企業における事業・提案機会分析' },
  { industry: '製造', title: '営業データに基づく収益性・活動量・生産性分析' },
  { industry: '製造', title: '顧客データに基づく継続率・離脱傾向分析' },
  { industry: '製造', title: '生産関連データに基づく稼働・コスト・効率性分析' },
  { industry: '製造', title: '知財情報に基づく技術・競争環境分析' },
  { industry: '製造', title: '大規模・複雑データの集計・可視化・意思決定資料化' },
  { industry: '製造', title: '中長期事業方針・戦略検討に向けた調査・資料作成支援' },
  { industry: '人材', title: '事業・サービス別の収益性・KPI構造分析' },
  { industry: '人材', title: '競合企業・競合サービスの事業モデル・戦略分析' },
  { industry: '人材', title: '市場特性・業界構造・関連指標の定量分析' },
  { industry: '人材', title: '新規参入市場における競合ビジネスモデル分析' },
  { industry: '人材', title: '対象市場の定期モニタリング・市場動向レポート作成' },
  { industry: '人材', title: '新規参入市場における主要企業・候補企業リストアップ' },
  { industry: '人材', title: 'ユーザーヒアリングに基づくニーズ分析・示唆整理' },
  { industry: '人材', title: '競合サービスにおけるUI・掲載情報・提供価値比較' },
  { industry: '人材', title: 'コンサルタント別の生産性・収益性・KPI分析' },
  { industry: 'その他', title: 'AIサービスにおける利用マニュアル・業務資料の再設計' },
  { industry: 'その他', title: '複雑な既存データ・資料の整理・可視化・再構成' },
  { industry: 'その他', title: '経理・管理業務における実務オペレーション支援' },
  { industry: 'その他', title: '事業評価・市場調査プロジェクトにおける分析・資料作成支援' },
  { industry: 'その他', title: 'ビジネスDD支援（3件）' },
];

export const publicIndustries = [
  '人材',
  '製造',
  '物流',
  '小売',
  '食品・卸売',
  'メディア',
  'SNS',
  '建設・インフラ',
  'AI',
  'その他',
] as const;
