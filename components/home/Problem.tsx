import { getHomeProblem } from '@/lib/page-content';
import { ProblemTrace } from './ProblemTrace';

export function Problem() {
  const content = getHomeProblem();
  if (!content.visible) return null;
  return <ProblemTrace content={content} />;
}
