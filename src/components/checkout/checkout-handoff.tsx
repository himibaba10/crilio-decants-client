'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

import { useNavProgress } from '@/components/layout/navigation-progress';
import { useCart } from '@/context/cart-provider';
import { buildCheckoutHandoffUrl } from '@/lib/cart/handoff';

const HANDOFF_FLAG = 'crilio-checkout-handed-off';

/**
 * Next.js does not host the COD form — this route hands the cart off to WooCommerce.
 * Uses history.replace so browser Back from Woo returns to /cart, not this page.
 */
export function CheckoutHandoff() {
  const router = useRouter();
  const { items, hydrated } = useCart();
  const { start } = useNavProgress();
  const started = useRef(false);

  useEffect(() => {
    const returnToCart = () => {
      try {
        sessionStorage.removeItem(HANDOFF_FLAG);
      } catch {
        // ignore
      }
      router.replace('/cart');
    };

    // Back-forward cache: restored /checkout should not bounce to Woo again.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) returnToCart();
    };
    window.addEventListener('pageshow', onPageShow);

    if (!hydrated || started.current) {
      return () => window.removeEventListener('pageshow', onPageShow);
    }

    try {
      if (sessionStorage.getItem(HANDOFF_FLAG) === '1') {
        returnToCart();
        return () => window.removeEventListener('pageshow', onPageShow);
      }
    } catch {
      // ignore
    }

    if (!items.length) {
      router.replace('/cart');
      return () => window.removeEventListener('pageshow', onPageShow);
    }

    let url: string;
    try {
      url = buildCheckoutHandoffUrl(items);
    } catch {
      router.replace('/cart');
      return () => window.removeEventListener('pageshow', onPageShow);
    }

    started.current = true;
    try {
      sessionStorage.setItem(HANDOFF_FLAG, '1');
    } catch {
      // ignore
    }
    start();
    // Replace this history entry so Back from Woo skips /checkout.
    window.location.replace(url);

    return () => window.removeEventListener('pageshow', onPageShow);
  }, [hydrated, items, router, start]);

  if (hydrated && !items.length) {
    return (
      <div className='mx-auto max-w-lg rounded-2xl border border-border bg-white p-8 text-center shadow-soft'>
        <p className='text-base font-medium text-navy'>Your cart is empty</p>
        <p className='mt-2 text-sm text-ink/65'>
          Add a decant size before checking out.
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
    <div
      role='status'
      aria-live='polite'
      className='mx-auto flex max-w-lg flex-col items-center gap-3 rounded-2xl border border-border bg-white p-10 text-center shadow-soft'
    >
      <Loader2 className='size-7 animate-spin text-gold' aria-hidden />
      <p className='text-base font-medium text-navy'>Redirecting to checkout…</p>
      <p className='text-sm text-ink/60'>
        You are leaving the storefront for WooCommerce Cash on Delivery.
      </p>
      <p className='text-xs text-ink/45'>
        If nothing happens, confirm the cart-handoff plugin is active on WordPress.
      </p>
    </div>
  );
}
