import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { Problem } from '@/components/home/Problem';
import { Structure } from '@/components/home/Structure';
import { Services } from '@/components/home/Services';
import { Process } from '@/components/home/Process';
import { Careers } from '@/components/home/Careers';
import { News } from '@/components/home/News';
import { Cta } from '@/components/home/Cta';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  // ルートは layout の default タイトルを使うため title は上書きしない
  description: site.description,
  alternates: { canonical: '/' },
};

/**
 * トップページ。
 * 課題提起から提供形態、品質体制へと読み進められる順序で構成する。
 * 参考価格は提供形態と分離せず、同じセクション内で続けて提示する。
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Services />
      <Structure />
      <Process />
      <Careers />
      <News />
      <Cta />
    </>
  );
}
