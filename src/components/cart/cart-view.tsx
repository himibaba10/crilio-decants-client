'use client';

import Link from 'next/link';

import { CartLineItem } from '@/components/cart/cart-line-item';
import { useCart } from '@/context/cart-provider';
import { formatCartMoney } from '@/lib/cart/types';

export function CartView() {
  const { items, itemCount, subtotal, hydrated, clearCart, checkout } =
    useCart();

  if (!hydrated) {
    return (
      <div className='rounded-2xl border border-dashed border-border bg-white p-10 text-center text-sm text-ink/60'>
        Loading cart…
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className='rounded-2xl border border-dashed border-border bg-white p-10 text-center shadow-soft'>
        <p className='text-base font-medium text-navy'>Your cart is empty</p>
        <p className='mt-2 text-sm text-ink/60'>
          Browse the shop and add a decant size to get started.
        </p>
        <Link
          href='/shop'
          className='mt-6 inline-flex h-11 items-center justify-center rounded-full bg-gold px-6 text-xs font-semibold tracking-[0.16em] text-navy uppercase transition-colors hover:bg-gold-soft'
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]'>
      <section className='space-y-4'>
        <div className='flex items-center justify-between gap-3'>
          <p className='text-sm text-ink/60'>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
          <button
            type='button'
            onClick={clearCart}
            className='text-xs font-medium tracking-wide text-ink/50 uppercase transition-colors hover:text-navy'
          >
            Clear cart
          </button>
        </div>
        <div className='space-y-3'>
          {items.map((item) => (
            <CartLineItem
              key={`${item.productId}:${item.variationId}`}
              item={item}
            />
          ))}
        </div>
      </section>

      <aside className='h-fit space-y-4 rounded-2xl border border-border/70 bg-white p-5 shadow-soft lg:sticky lg:top-28'>
        <h2 className='text-sm font-semibold tracking-wide text-navy uppercase'>
          Order summary
        </h2>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-ink/60'>Subtotal</span>
          <span className='font-semibold text-navy'>
            {formatCartMoney(subtotal)}
          </span>
        </div>
        <p className='text-xs leading-relaxed text-ink/55'>
          You will continue to WooCommerce for Cash on Delivery — shipping and
          address details are collected there.
        </p>
        <button
          type='button'
          onClick={checkout}
          className='inline-flex h-11 w-full items-center justify-center rounded-full bg-gold text-xs font-semibold tracking-[0.16em] text-navy uppercase transition-colors hover:bg-gold-soft'
        >
          Proceed to checkout
        </button>
        <Link
          href='/shop'
          className='inline-flex h-10 w-full items-center justify-center rounded-full border border-border text-xs font-semibold tracking-[0.14em] text-navy uppercase transition-colors hover:border-gold'
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
