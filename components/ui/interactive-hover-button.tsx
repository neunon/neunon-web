'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

type InteractiveHoverLinkProps = Omit<React.ComponentProps<typeof Link>, 'children'> & {
  text: string;
};

function ButtonContent({ text }: { text: string }) {
  return (
    <>
      <span className="nc-interactive-label">{text}</span>
      <span className="nc-interactive-swap" aria-hidden="true">
        <span>{text}</span>
        <ArrowRight size={16} strokeWidth={1.8} />
      </span>
      <span className="nc-interactive-dot" aria-hidden="true" />
    </>
  );
}

const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(
  ({ text = 'Button', className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn('nc-interactive-hover', className)}
      {...props}
    >
      <ButtonContent text={text} />
    </button>
  ),
);

InteractiveHoverButton.displayName = 'InteractiveHoverButton';

function InteractiveHoverLink({ text, className, ...props }: InteractiveHoverLinkProps) {
  return (
    <Link className={cn('nc-interactive-hover', className)} {...props}>
      <ButtonContent text={text} />
    </Link>
  );
}

export { InteractiveHoverButton, InteractiveHoverLink };
