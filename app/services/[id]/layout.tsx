import { getService } from '@/lib/content';
import { displayedFaq, faqNode, jsonLd, serviceNode } from '@/lib/schema';

/**
 * 事業詳細ページ共通の構造化データ（Service ＋ FAQPage）。
 *
 * ページ本体（page.tsx や事業ごとの専用コンポーネント）とは分けてここで出力する。
 * 事業ごとにページの作りが変わっても、構造化データは同じ content JSON から
 * 揃って出るようにするため。
 */
export default async function ServiceLayout({ children, params }: LayoutProps<'/services/[id]'>) {
  const { id } = await params;
  const service = getService(id);
  if (!service) return children;

  const faq = displayedFaq(service);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          serviceNode(service, faq),
          ...(faq.length > 0 ? [faqNode(faq, `/services/${service.id}/`)] : []),
        )}
      />
      {children}
    </>
  );
}
