import type { Metadata } from 'next';
import { AiProductsDetail } from '@/components/services/AiServiceDetail';
import { getService } from '@/lib/content';
import { createPageMetadata } from '@/lib/seo';
export const metadata: Metadata = createPageMetadata({ title: 'AIプロダクト', description: '調査・営業の実務から生まれたAIプロダクトの提供状況と用途をご紹介します。' }, '/services/ai/products/');
export default function Page() { const service = getService('ai'); return service ? <AiProductsDetail service={service} /> : null; }
