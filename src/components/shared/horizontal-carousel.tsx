'use client';

import { Children, type ReactNode } from 'react';

import { CarouselNavButtons } from '@/components/shared/carousel-nav-buttons';
import { useHorizontalScroller } from '@/hooks/use-horizontal-scroller';
import { cn } from '@/lib/utils';

type HorizontalCarouselProps = {
  children: ReactNode;
  /** Optional server-rendered heading/actions row. */
  header?: ReactNode;
  /** Show prev/next beside the header. */
  headerNav?: boolean;
  /** Show prev/next overlaid on the track (bestsellers). */
  overlayNav?: boolean;
  trackActive?: boolean;
  scrollByCardWidth?: boolean;
  navSize?: 'sm' | 'md';
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
  scrollerClassName?: string;
};

export function HorizontalCarousel({
  children,
  header,
  headerNav = false,
  overlayNav = false,
  trackActive = false,
  scrollByCardWidth = false,
  navSize = 'md',
  prevLabel,
  nextLabel,
  className,
  scrollerClassName,
}: HorizontalCarouselProps) {
  const items = Children.toArray(children);
  const { scrollerRef, activeIndex, scrollByCard } = useHorizontalScroller({
    deps: items.length,
    scrollByCardWidth,
    trackActive,
  });

  return (
    <div className={cn(className)}>
      {header || headerNav ? (
        <div className='mb-8 flex items-end justify-between gap-4'>
          {header}
          {headerNav ? (
            <CarouselNavButtons
              size='sm'
              prevLabel={prevLabel}
              nextLabel={nextLabel}
              onPrev={() => scrollByCard(-1)}
              onNext={() => scrollByCard(1)}
            />
          ) : null}
        </div>
      ) : null}

      <div className='relative'>
        {overlayNav ? (
          <CarouselNavButtons
            overlay
            size={navSize}
            prevLabel={prevLabel}
            nextLabel={nextLabel}
            onPrev={() => scrollByCard(-1)}
            onNext={() => scrollByCard(1)}
          />
        ) : null}

        <div
          ref={scrollerRef}
          className={cn(
            'flex snap-x snap-mandatory gap-4 overflow-x-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden',
            overlayNav && 'px-1 pb-4 md:px-12',
            !overlayNav && 'pb-2',
            scrollerClassName,
          )}
        >
          {items.map((child, index) => (
            <div
              key={index}
              className={cn(
                trackActive && 'transition-all duration-500',
                trackActive &&
                  (index === activeIndex
                    ? 'scale-100 md:scale-105'
                    : 'scale-95 opacity-80'),
              )}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
