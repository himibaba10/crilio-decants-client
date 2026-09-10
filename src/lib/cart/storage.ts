import type { CartItem } from '@/lib/cart/types';

export const CART_STORAGE_KEY = 'crilio-cart';

/** Persist a line for the future CartProvider (localStorage contract). */
export function appendCartItemLocal(item: CartItem) {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as { items?: CartItem[] }) : null;
    const items = Array.isArray(parsed?.items) ? [...parsed.items] : [];
    const existing = items.findIndex(
      (row) => row.variationId === item.variationId,
    );
    if (existing >= 0) {
      const current = items[existing]!;
      items[existing] = {
        ...current,
        quantity: current.quantity + item.quantity,
        price: item.price,
      };
    } else {
      items.push(item);
    }
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }));
  } catch {
    // ignore quota / private mode
  }
}
