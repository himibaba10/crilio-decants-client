'use client';

import { LayoutGrid, List } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import {
  SHOP_PER_PAGE_OPTIONS,
  SHOP_SORT_OPTIONS,
  buildShopHref,
  type ShopParams,
  type ShopSort,
} from '@/lib/shop/params';
import { cn } from '@/lib/utils';

type ShopToolbarProps = {
  params: ShopParams;
};

export function ShopToolbar({ params }: ShopToolbarProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const push = (patch: Partial<ShopParams>) => {
    startTransition(() => {
      router.push(buildShopHref(params, { ...patch, page: 1 }));
    });
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        pending && 'opacity-70',
      )}
    >
      <div className='flex items-center gap-2'>
        <button
          type='button'
          aria-label='Grid view'
          onClick={() => push({ view: 'grid' })}
          className={cn(
            'inline-flex size-9 items-center justify-center rounded-lg border transition-colors',
            params.view === 'grid'
              ? 'border-gold bg-gold/15 text-navy'
              : 'border-border text-ink/50 hover:border-gold',
          )}
        >
          <LayoutGrid className='size-4' />
        </button>
        <button
          type='button'
          aria-label='List view'
          onClick={() => push({ view: 'list' })}
          className={cn(
            'inline-flex size-9 items-center justify-center rounded-lg border transition-colors',
            params.view === 'list'
              ? 'border-gold bg-gold/15 text-navy'
              : 'border-border text-ink/50 hover:border-gold',
          )}
        >
          <List className='size-4' />
        </button>
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <label className='flex items-center gap-2 text-sm text-ink/70'>
          <span className='whitespace-nowrap'>Sort by</span>
          <select
            value={params.sort}
            onChange={(e) => push({ sort: e.target.value as ShopSort })}
            className='h-9 rounded-lg border border-border bg-white px-2 text-sm text-navy outline-none focus:border-gold'
          >
            {SHOP_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className='flex items-center gap-2 text-sm text-ink/70'>
          <span className='whitespace-nowrap'>Per page</span>
          <select
            value={params.perPage}
            onChange={(e) => push({ perPage: Number(e.target.value) })}
            className='h-9 rounded-lg border border-border bg-white px-2 text-sm text-navy outline-none focus:border-gold'
          >
            {SHOP_PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
