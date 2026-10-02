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
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('home', '/');

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Neunon Consulting',
  alternateName: '株式会社Neunon Consulting',
  url: new URL('/', site.url).href,
};

/**
 * トップページ。
 * 課題提起から提供形態、品質体制へと読み進められる順序で構成する。
 * 品質体制までをトップページで示し、具体的な相談へつなぐ。
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c') }}
      />
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
