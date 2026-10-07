import content from '@/content/pages/extra-sections.json';
import type { LandingSection } from './landing';

export type ExtraSectionPage = keyof typeof content;

export function getExtraSections(page: ExtraSectionPage): LandingSection[] {
  return content[page].sections as LandingSection[];
}
