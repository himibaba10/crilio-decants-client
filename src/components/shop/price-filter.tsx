'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { buildShopHref, type ShopParams } from '@/lib/shop/params';

type PriceFilterProps = {
  params: ShopParams;
  ceiling?: number;
};

export function PriceFilter({ params, ceiling = 5000 }: PriceFilterProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [min, setMin] = useState(String(params.minPrice ?? 0));
  const [max, setMax] = useState(String(params.maxPrice ?? ceiling));

  const apply = () => {
    const minPrice = Number(min);
    const maxPrice = Number(max);
    startTransition(() => {
      router.push(
        buildShopHref(params, {
          minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
          maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
          page: 1,
        }),
      );
    });
  };

  return (
    <div className='space-y-3'>
      <h2 className='text-sm font-semibold tracking-wide text-navy uppercase'>
        Filters
      </h2>
      <p className='text-xs font-medium text-ink/60 uppercase'>Price (৳)</p>
      <div className='flex items-center gap-2'>
        <input
          type='number'
          min={0}
          value={min}
          onChange={(e) => setMin(e.target.value)}
          aria-label='Minimum price'
          className='h-9 w-full rounded-lg border border-border bg-white px-2 text-sm outline-none focus:border-gold'
        />
        <span className='text-ink/40'>—</span>
        <input
          type='number'
          min={0}
          value={max}
          onChange={(e) => setMax(e.target.value)}
          aria-label='Maximum price'
          className='h-9 w-full rounded-lg border border-border bg-white px-2 text-sm outline-none focus:border-gold'
        />
      </div>
      <button
        type='button'
        onClick={apply}
        disabled={pending}
        className='inline-flex h-9 w-full items-center justify-center rounded-full bg-navy text-[11px] tracking-[0.16em] text-white uppercase transition-colors hover:bg-navy-deep disabled:opacity-60'
      >
        {pending ? 'Applying…' : 'Apply'}
      </button>
    </div>
  );
}
