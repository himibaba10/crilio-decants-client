'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

import {
  CART_STORAGE_KEY,
  mergeCartItem,
  parseCartState,
  writeCartState,
} from '@/lib/cart/storage';
import {
  cartItemCount,
  cartLineKey,
  cartSubtotal,
  type CartItem,
} from '@/lib/cart/types';

const CHECKOUT_HANDOFF_FLAG = 'crilio-checkout-handed-off';

const CART_CHANGE_EVENT = 'crilio-cart-change';
const EMPTY_SNAPSHOT = '{"items":[]}';

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, variationId: number) => void;
  setQuantity: (
    productId: number,
    variationId: number,
    quantity: number,
  ) => void;
  clearCart: () => void;
  checkout: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function subscribe(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener('storage', handler);
  window.addEventListener(CART_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(CART_CHANGE_EVENT, handler);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(CART_STORAGE_KEY) ?? EMPTY_SNAPSHOT;
  } catch {
    return EMPTY_SNAPSHOT;
  }
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

function notifyCartChange() {
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

function persistItems(items: CartItem[]) {
  writeCartState({ items });
  notifyCartChange();
}

export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const items = useMemo(
    () => (hydrated ? parseCartState(snapshot).items : []),
    [hydrated, snapshot],
  );

  const addItem = useCallback((item: CartItem) => {
    const current = parseCartState(getSnapshot()).items;
    persistItems(mergeCartItem(current, item));
  }, []);

  const removeItem = useCallback((productId: number, variationId: number) => {
    const key = cartLineKey({ productId, variationId });
    const current = parseCartState(getSnapshot()).items;
    persistItems(current.filter((item) => cartLineKey(item) !== key));
  }, []);

  const setQuantity = useCallback(
    (productId: number, variationId: number, quantity: number) => {
      const key = cartLineKey({ productId, variationId });
      const nextQty = Math.floor(quantity);
      const current = parseCartState(getSnapshot()).items;
      if (nextQty < 1) {
        persistItems(current.filter((item) => cartLineKey(item) !== key));
        return;
      }
      persistItems(
        current.map((item) =>
          cartLineKey(item) === key
            ? { ...item, quantity: Math.min(20, nextQty) }
            : item,
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => {
    persistItems([]);
  }, []);

  const checkout = useCallback(() => {
    const current = parseCartState(getSnapshot()).items;
    if (!current.length) return;
    try {
      // Allow a fresh handoff after returning from Woo via Back.
      sessionStorage.removeItem(CHECKOUT_HANDOFF_FLAG);
    } catch {
      // ignore
    }
    // replace so /checkout is not stacked under Woo in history.
    router.replace('/checkout');
  }, [router]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: cartItemCount(items),
      subtotal: cartSubtotal(items),
      hydrated,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      checkout,
    }),
    [
      items,
      hydrated,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      checkout,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
