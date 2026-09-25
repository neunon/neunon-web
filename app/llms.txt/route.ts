import { getServices } from '@/lib/content';
import { getPageSeo } from '@/lib/seo';
import { absoluteUrl } from '@/lib/schema';
import { site } from '@/lib/site';

/**
 * /llms.txt（https://llmstxt.org/ の提案形式）。
 *
 * ChatGPT・Perplexity などの AI 検索が、サイトの概要と主要ページを
 * 短時間で把握できるようにするための Markdown。
 * 内容は content/ と lib/site.ts から生成するので、個別の更新は不要。
 * 検索順位には影響しない。index 対象のページだけを載せる（noindex のページは含めない）。
 */
export const dynamic = 'force-static';

export function GET() {
  const link = (label: string, pathname: string, note: string) => `- [${label}](${absoluteUrl(pathname)}): ${note}`;
  const services = getServices();

  const body = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.founded}設立、${site.address.head}。${site.representative}。`,
    '企業調査・競合分析・市場調査、経営コンサルティング、調査業務を効率化する AI プロダクトを法人向けに提供しています。',
    'お問い合わせはフォームを推奨しています（お電話でのご相談も承っています）。',
    '',
    '## 事業',
    '',
    ...services.map((service) => link(service.title, `/services/${service.id}/`, service.seoDescription?.trim() || service.summary)),
    '',
    '## 会社',
    '',
    link('企業情報', '/about/', getPageSeo('about').description),
    link('会社情報', '/about/company/', '社名、設立、代表者、所在地、事業内容、従業員数、連絡先'),
    link('支援実績', '/works/', getPageSeo('works').description),
    link('人材パネル', '/talent/', getPageSeo('talent').description),
    link('お知らせ', '/news/', '会社・サービス・採用に関するお知らせ'),
    link('お問い合わせ', '/contact/', getPageSeo('contact').description),
    '',
    '## 採用（学生向け）',
    '',
    link('採用情報', '/recruit/', getPageSeo('recruit').description),
    link('選考フロー', '/recruit/flow/', '募集要項の送付から稼働開始までの7ステップと、よくある質問'),
    link('エントリー', '/entry/', '学生アソシエイトへの応募フォーム'),
    '',
    '## Optional',
    '',
    link('プライバシーポリシー', '/privacy/', '個人情報の取り扱い'),
    link('サイト利用規約', '/terms/', 'ウェブサイトの利用条件'),
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
