import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { ContactCta } from '@/components/shared/ContactCta';
import { getWork, getWorks } from '@/lib/content';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getWorks().map((work) => ({ slug: work.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const archiveIndex = getWorks().findIndex((work) => work.slug === slug) + 1;
  const archiveNo = String(Math.max(archiveIndex, 0)).padStart(2, '0');

  return {
    title: `支援実績（非公開）｜${archiveNo}`,
    description: `守秘義務に配慮し、匿名化一覧へ統合した旧実績ページです（管理番号${archiveNo}）。`,
    alternates: { canonical: '/works' },
    robots: { index: false, follow: false },
  };
}

/** 旧実績URLの互換用。案件単位の詳細は公開せず、匿名化した一覧へ誘導する。 */
export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!getWork(slug)) notFound();

  return (
    <>
      <PageHero
        eyebrow="Case archive"
        title="支援実績は、匿名化して公開しています。"
        lead="顧客の機密情報を保護するため、案件ごとの背景・数値・成果の詳細公開は終了しました。"
        crumbs={[{ label: '支援実績', href: '/works' }, { label: '非公開' }]}
      />
      <ContactCta
        title="公開可能な実績テーマは、一覧でご覧いただけます。"
        primary={{ label: '支援実績一覧へ', href: '/works' }}
        secondary={{ label: '相談する', href: '/contact' }}
      />
    </>
  );
}
