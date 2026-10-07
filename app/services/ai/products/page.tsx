import type { Metadata } from 'next';
import { AiProductsDetail } from '@/components/services/AiServiceDetail';
import { getService } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
export const metadata: Metadata = pageMetadata('aiProducts', '/services/ai/products/');
export default function Page() { const service = getService('ai'); return service ? <AiProductsDetail service={service} /> : null; }
