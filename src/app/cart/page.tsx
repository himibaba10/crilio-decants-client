import type { Metadata } from 'next';

import { CartView } from '@/components/cart/cart-view';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Cart',
  description: `Review your ${siteConfig.name} decants before checkout.`,
};

export default function CartPage() {
  return (
    <main className='flex-1 bg-[#fafafa]'>
      <div className='mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8 lg:py-12'>
        <h1 className='text-3xl font-semibold tracking-tight text-navy sm:text-4xl'>
          Cart
        </h1>
        <CartView />
      </div>
    </main>
  );
}
