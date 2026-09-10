'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';

import { useCart } from '@/context/cart-provider';
import { formatCartMoney, type CartItem } from '@/lib/cart/types';

type CartLineItemProps = {
  item: CartItem;
};

export function CartLineItem({ item }: CartLineItemProps) {
  const { setQuantity, removeItem } = useCart();
  const href = item.slug ? `/product/${item.slug}` : '/shop';

  return (
    <article className='flex gap-4 rounded-2xl border border-border/70 bg-white p-3 shadow-soft sm:p-4'>
      <Link
        href={href}
        className='relative size-24 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f5] sm:size-28'
      >
        <Image
          src={item.imageUrl || '/images/home/perfume-1.jpg'}
          alt={item.name}
          fill
          sizes='112px'
          className='object-cover'
        />
      </Link>

      <div className='flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='min-w-0 space-y-1'>
          <h2 className='truncate text-sm font-medium text-navy sm:text-base'>
            <Link href={href} className='hover:underline'>
              {item.name}
            </Link>
          </h2>
          {item.sizeLabel ? (
            <p className='text-xs text-ink/55'>Size: {item.sizeLabel}</p>
          ) : null}
          <p className='text-sm font-medium text-navy'>
            {formatCartMoney(item.price)}
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          <div className='inline-flex h-10 items-center rounded-full border border-border bg-white'>
            <button
              type='button'
              aria-label='Decrease quantity'
              onClick={() =>
                setQuantity(item.productId, item.variationId, item.quantity - 1)
              }
              className='inline-flex size-10 items-center justify-center text-navy hover:text-gold'
            >
              <Minus className='size-4' />
            </button>
            <span className='min-w-8 text-center text-sm font-medium text-navy'>
              {item.quantity}
            </span>
            <button
              type='button'
              aria-label='Increase quantity'
              onClick={() =>
                setQuantity(item.productId, item.variationId, item.quantity + 1)
              }
              className='inline-flex size-10 items-center justify-center text-navy hover:text-gold'
            >
              <Plus className='size-4' />
            </button>
          </div>

          <p className='min-w-20 text-sm font-semibold text-navy sm:text-right'>
            {formatCartMoney(item.price * item.quantity)}
          </p>

          <button
            type='button'
            aria-label={`Remove ${item.name}`}
            onClick={() => removeItem(item.productId, item.variationId)}
            className='inline-flex size-10 items-center justify-center rounded-full border border-border text-ink/50 transition-colors hover:border-red-300 hover:text-red-700'
          >
            <Trash2 className='size-4' />
          </button>
        </div>
      </div>
    </article>
  );
}
