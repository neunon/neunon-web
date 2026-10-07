import { ContactCta } from '@/components/shared/ContactCta';
import home from '@/content/pages/home.json';

/**
 * トップページ セクション9: CTA（要件定義書 6.1）
 * 問い合わせフォームへの最終導線。
 */
export function Cta() {
  return (
    <ContactCta
      title={home.bottomCta.title}
      body={home.bottomCta.body}
      primary={{ href: '/contact/', label: home.bottomCta.primaryLabel }}
      secondary={{ href: '/works/', label: home.bottomCta.secondaryLabel }}
    />
  );
}
