'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

type ProductTabsProps = {
  descriptionHtml?: string | null;
};

export function ProductTabs({ descriptionHtml }: ProductTabsProps) {
  const [tab, setTab] = useState<'description' | 'reviews'>('description');
  const [expanded, setExpanded] = useState(false);

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
              <div
                className={cn(
                  'product-copy relative overflow-hidden text-sm leading-relaxed text-ink/80',
                  !expanded && 'max-h-72',
                )}
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
              {!expanded ? (
                <div className='pointer-events-none -mt-16 h-16 bg-gradient-to-t from-white to-transparent' />
              ) : null}
              <button
                type='button'
                onClick={() => setExpanded((v) => !v)}
                className='inline-flex h-9 items-center justify-center rounded-full border border-border px-4 text-xs font-semibold tracking-[0.14em] text-navy uppercase transition-colors hover:border-gold'
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            </div>
          ) : (
            <p className='text-sm text-ink/60'>No description available.</p>
          )
        ) : (
          <p className='text-sm text-ink/60'>
            Customer reviews will appear here once review sync is connected.
          </p>
        )}
      </div>
    </div>
  );
}
