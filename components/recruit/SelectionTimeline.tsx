import {
  BookOpenCheck,
  CalendarCheck,
  ClipboardCheck,
  FileCheck2,
  FileText,
  MessageCircle,
  Rocket,
} from 'lucide-react';
import { selectionSteps } from '@/lib/recruit';

const icons = [FileText, CalendarCheck, MessageCircle, ClipboardCheck, FileCheck2, BookOpenCheck, Rocket];

export function SelectionTimeline({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  return (
    <ol className="nc-steps nc-selection-steps">
      {selectionSteps.map((step, index) => {
        const Icon = icons[index];
        return (
          <li className="nc-step" key={step.no}>
            <div className="nc-step-n">
              <Icon aria-hidden="true" size={22} strokeWidth={1.6} />
              <span className="sr-only-text">Step {step.no}</span>
            </div>
            <div className="nc-step-c">
              {headingLevel === 2 ? <h2>{step.title}</h2> : <h3>{step.title}</h3>}
              <p>{step.body}</p>
            </div>
            <div className="nc-step-s">{step.span}</div>
          </li>
        );
      })}
    </ol>
  );
}
