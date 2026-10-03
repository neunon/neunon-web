import fs from 'node:fs';
import path from 'node:path';

export type LandingCard = { title: string; body: string; visible: boolean; href?: string };
export type LandingFaq = { question: string; answer: string; visible: boolean };

export type LandingSection =
  | { type: 'text'; visible: boolean; eyebrow?: string; title: string; paragraphs: string[]; tone: 'white' | 'soft' | 'dark' }
  | { type: 'cards'; visible: boolean; eyebrow?: string; title: string; lead?: string; cards: LandingCard[]; tone: 'white' | 'soft' | 'dark' }
  | { type: 'imageText'; visible: boolean; eyebrow?: string; title: string; paragraphs: string[]; image: string; imageAlt: string; imageSide: 'left' | 'right'; tone: 'white' | 'soft' | 'dark' }
  | { type: 'faq'; visible: boolean; eyebrow?: string; title: string; questions: LandingFaq[]; tone: 'white' | 'soft' | 'dark' }
  | { type: 'cta'; visible: boolean; eyebrow?: string; title: string; body: string; label: string; href: string; tone: 'white' | 'soft' | 'dark' }
  | { type: 'steps'; visible: boolean; eyebrow?: string; title: string; lead?: string; steps: { visible: boolean; title: string; body: string }[]; tone: 'white' | 'soft' | 'dark' }
  | { type: 'stats'; visible: boolean; eyebrow?: string; title: string; lead?: string; items: { visible: boolean; value: string; label: string }[]; tone: 'white' | 'soft' | 'dark' };

export type LandingPage = {
  slug: string;
  title: string;
  lead: string;
  eyebrow?: string;
  seoTitle: string;
  seoDescription: string;
  updatedAt?: string;
  published: boolean;
  sections: LandingSection[];
};

/** CMSの下書きはビルド対象・sitemap・サイト内一覧のいずれにも出さない。 */
export function getLandingPages(): LandingPage[] {
  const dir = path.join(process.cwd(), 'content', 'landing');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')) as LandingPage)
    .filter((page) => page.published);
}

export function getLandingPage(slug: string): LandingPage | undefined {
  return getLandingPages().find((page) => page.slug === slug);
}
