import type { Metadata } from 'next';
import { AiDevelopmentDetail } from '@/components/services/AiServiceDetail';
import { getService } from '@/lib/content';
import { createPageMetadata } from '@/lib/seo';
export const metadata: Metadata = createPageMetadata({ title: 'AI開発・業務自動化', description: '業務・課題整理からPoC、本開発、運用改善まで支援します。' }, '/services/ai/development/');
export default function Page() { const service = getService('ai'); return service ? <AiDevelopmentDetail service={service} /> : null; }
