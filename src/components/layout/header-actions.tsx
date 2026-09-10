'use client';

import Link from 'next/link';
import { Search, ShoppingBag, UserRound } from 'lucide-react';

import { useCart } from '@/context/cart-provider';
import { accountUrl } from '@/lib/catalog';

export function HeaderActions() {
  const { itemCount, hydrated } = useCart();
  const accountHref = accountUrl();
  const count = hydrated ? itemCount : 0;

  return (
    <div className='flex items-center justify-end gap-2 sm:gap-3'>
      <Link
        href='/shop'
        aria-label='Search shop'
        className='inline-flex size-9 items-center justify-center text-white/85 transition-colors hover:text-gold'
      >
        <Search className='size-4' />
      </Link>
      <Link
        href={accountHref}
        aria-label='Account'
        className='inline-flex size-9 items-center justify-center text-white/85 transition-colors hover:text-gold'
      >
        <UserRound className='size-4' />
      </Link>
      <Link
        href='/cart'
        aria-label={`Cart, ${count} items`}
        className='relative inline-flex size-9 items-center justify-center text-white/85 transition-colors hover:text-gold'
      >
        <ShoppingBag className='size-4' />
        <span className='absolute top-1 right-0.5 flex size-4 items-center justify-center rounded-full bg-gold text-[9px] font-semibold text-navy'>
          {count > 99 ? '99+' : count}
        </span>
      </Link>
    </div>
  );
}
