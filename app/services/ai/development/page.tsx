import type { Metadata } from 'next';
import { AiDevelopmentDetail } from '@/components/services/AiServiceDetail';
import { getService } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
export const metadata: Metadata = pageMetadata('aiDevelopment', '/services/ai/development/');
export default function Page() { const service = getService('ai'); return service ? <AiDevelopmentDetail service={service} /> : null; }
