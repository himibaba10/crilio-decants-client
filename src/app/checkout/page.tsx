import type { Metadata } from 'next';

import { CheckoutHandoff } from '@/components/checkout/checkout-handoff';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Checkout',
  description: `Secure Cash on Delivery checkout for ${siteConfig.name}.`,
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main className='flex flex-1 items-center justify-center bg-[#fafafa] px-4 py-16'>
      <CheckoutHandoff />
    </main>
  );
}
