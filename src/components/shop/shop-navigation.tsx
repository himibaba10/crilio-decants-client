'use client';

import {
  createContext,
  useContext,
  useTransition,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

import { buildShopHref, type ShopParams } from '@/lib/shop/params';

type ShopNavigationContextValue = {
  isPending: boolean;
  params: ShopParams;
  navigate: (href: string) => void;
  push: (patch: Partial<ShopParams>) => void;
};

const ShopNavigationContext = createContext<ShopNavigationContextValue | null>(
  null,
);

type ShopNavigationProviderProps = {
  params: ShopParams;
  children: ReactNode;
};

export function ShopNavigationProvider({
  params,
  children,
}: ShopNavigationProviderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (href: string) => {
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  };

  const push = (patch: Partial<ShopParams>) => {
    navigate(buildShopHref(params, patch));
  };

  return (
    <ShopNavigationContext.Provider
      value={{ isPending, params, navigate, push }}
    >
      {children}
    </ShopNavigationContext.Provider>
  );
}

export function useShopNavigation() {
  const ctx = useContext(ShopNavigationContext);
  if (!ctx) {
    throw new Error('useShopNavigation must be used within ShopNavigationProvider');
  }
  return ctx;
}
