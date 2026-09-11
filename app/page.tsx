import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { Problem } from '@/components/home/Problem';
import { Structure } from '@/components/home/Structure';
import { Services } from '@/components/home/Services';
import { WhyThisPrice } from '@/components/home/WhyThisPrice';
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
 * セクション順は要件定義書 6.1 の表に従う（この順序に意味がある）。
 *   1 ヒーロー / 2 課題提起 / 3 提供価値 / 4 事業内容・実績 / 5 導入の流れ
 *   6 学生の方へ / 7 お知らせ / 8 CTA
 * 加えて 6.3.1 の指示により「なぜこの価格でできるのか」をトップにも配置している。
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Structure />
      <Services />
      <WhyThisPrice />
      <Process />
      <Careers />
      <News />
      <Cta />
    </>
  );
}
