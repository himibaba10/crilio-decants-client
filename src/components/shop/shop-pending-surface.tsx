'use client';

import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

import { useShopNavigation } from '@/components/shop/shop-navigation';
import { cn } from '@/lib/utils';

type ShopPendingSurfaceProps = {
  children: ReactNode;
};

export function ShopPendingSurface({ children }: ShopPendingSurfaceProps) {
  const { isPending } = useShopNavigation();

  return (
    <div className='relative' aria-busy={isPending}>
      <div
        className={cn(
          'transition-opacity duration-150',
          isPending && 'pointer-events-none opacity-45',
        )}
      >
        {children}
      </div>

      {isPending ? (
        <div className='pointer-events-none absolute inset-0 flex items-start justify-center pt-16'>
          <div className='inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/95 px-4 py-2 text-sm font-medium text-navy shadow-soft'>
            <Loader2 className='size-4 animate-spin' aria-hidden />
            Updating…
          </div>
        </div>
      ) : null}
    </div>
  );
}
