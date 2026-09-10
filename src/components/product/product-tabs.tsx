'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

type ProductTabsProps = {
  descriptionHtml?: string | null;
};

const COLLAPSED_HEIGHT = 288; // max-h-72

export function ProductTabs({ descriptionHtml }: ProductTabsProps) {
  const [tab, setTab] = useState<'description' | 'reviews'>('description');
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState<number>(COLLAPSED_HEIGHT);
  const [needsToggle, setNeedsToggle] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const measure = () => {
      const full = node.scrollHeight;
      setNeedsToggle(full > COLLAPSED_HEIGHT + 24);
      setHeight(expanded ? full : Math.min(full, COLLAPSED_HEIGHT));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [descriptionHtml, expanded, tab]);

  return (
    <div className='rounded-2xl border border-border/70 bg-white p-5 shadow-soft sm:p-6'>
      <div className='flex gap-6 border-b border-border'>
        <button
          type='button'
          onClick={() => setTab('description')}
          className={cn(
            'pb-3 text-sm font-medium tracking-wide transition-colors',
            tab === 'description'
              ? 'border-b-2 border-gold text-navy'
              : 'text-ink/50 hover:text-navy',
          )}
        >
          Description
        </button>
        <button
          type='button'
          onClick={() => setTab('reviews')}
          className={cn(
            'pb-3 text-sm font-medium tracking-wide transition-colors',
            tab === 'reviews'
              ? 'border-b-2 border-gold text-navy'
              : 'text-ink/50 hover:text-navy',
          )}
        >
          Reviews
        </button>
      </div>

      <div className='pt-5'>
        {tab === 'description' ? (
          descriptionHtml ? (
            <div className='space-y-4'>
              <div className='relative'>
                <div
                  style={{ height }}
                  className='overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'
                >
                  <div
                    ref={contentRef}
                    className='product-copy text-sm leading-relaxed text-ink/80'
                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                  />
                </div>
                {!expanded && needsToggle ? (
                  <div className='pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white to-transparent transition-opacity duration-300' />
                ) : null}
              </div>
              {needsToggle ? (
                <button
                  type='button'
                  onClick={() => setExpanded((v) => !v)}
                  className='inline-flex h-9 items-center justify-center rounded-full border border-border px-4 text-xs font-semibold tracking-[0.14em] text-navy uppercase transition-colors hover:border-gold'
                >
                  {expanded ? 'Show less' : 'Show more'}
                </button>
              ) : null}
            </div>
          ) : (
            <p className='text-sm text-ink/60'>No description available.</p>
          )
        ) : (
          <p className='animate-page-enter text-sm text-ink/60'>
            Customer reviews will appear here once review sync is connected.
          </p>
        )}
      </div>
    </div>
  );
}
