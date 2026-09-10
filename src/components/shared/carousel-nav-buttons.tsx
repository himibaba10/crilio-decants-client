'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

type CarouselNavButtonsProps = {
  onPrev: () => void;
  onNext: () => void;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
  size?: 'sm' | 'md';
  overlay?: boolean;
};

export function CarouselNavButtons({
  onPrev,
  onNext,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  className,
  size = 'md',
  overlay = false,
}: CarouselNavButtonsProps) {
  const buttonClass = cn(
    'inline-flex items-center justify-center rounded-full border border-border/80 bg-white text-navy shadow-soft transition hover:border-gold hover:bg-gold/15',
    size === 'sm' ? 'size-9' : 'size-10',
    overlay &&
      'absolute top-1/2 z-10 hidden -translate-y-1/2 md:inline-flex',
  );

  return (
    <div className={cn(!overlay && 'flex gap-2', className)}>
      <button
        type='button'
        aria-label={prevLabel}
        onClick={onPrev}
        className={cn(buttonClass, overlay && 'left-0')}
      >
        <ChevronLeft className={size === 'sm' ? 'size-4' : 'size-5'} />
      </button>
      <button
        type='button'
        aria-label={nextLabel}
        onClick={onNext}
        className={cn(buttonClass, overlay && 'right-0')}
      >
        <ChevronRight className={size === 'sm' ? 'size-4' : 'size-5'} />
      </button>
    </div>
  );
}
