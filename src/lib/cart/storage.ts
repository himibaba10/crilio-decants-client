import {
  cartLineKey,
  type CartItem,
  type CartState,
} from '@/lib/cart/types';

export const CART_STORAGE_KEY = 'crilio-cart';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value != null;
}

function normalizeItem(value: unknown): CartItem | null {
  if (!isRecord(value)) return null;
  const productId = Number(value.productId);
  const variationId = Number(value.variationId);
  const quantity = Number(value.quantity);
  const price = Number(value.price);
  if (
    !Number.isFinite(productId) ||
    !Number.isFinite(variationId) ||
    !Number.isFinite(quantity) ||
    quantity < 1 ||
    !Number.isFinite(price)
  ) {
    return null;
  }

  const name =
    typeof value.name === 'string' && value.name.trim()
      ? value.name
      : 'Product';
  const slug =
    typeof value.slug === 'string' && value.slug.trim() ? value.slug : '';

  return {
    productId,
    variationId,
    quantity: Math.min(20, Math.floor(quantity)),
    price,
    name,
    slug,
    imageUrl:
      typeof value.imageUrl === 'string' ? value.imageUrl : null,
    sizeLabel:
      typeof value.sizeLabel === 'string' ? value.sizeLabel : null,
  };
}

export function parseCartState(raw: string | null): CartState {
  if (!raw) return { items: [] };
  try {
    const parsed = JSON.parse(raw) as unknown;
    const itemsRaw = isRecord(parsed) ? parsed.items : null;
    if (!Array.isArray(itemsRaw)) return { items: [] };

    const map = new Map<string, CartItem>();
    for (const row of itemsRaw) {
      const item = normalizeItem(row);
      if (!item) continue;
      const key = cartLineKey(item);
      const existing = map.get(key);
      if (existing) {
        map.set(key, {
          ...existing,
          ...item,
          quantity: Math.min(20, existing.quantity + item.quantity),
        });
      } else {
        map.set(key, item);
      }
    }
    return { items: [...map.values()] };
  } catch {
    return { items: [] };
  }
}

export function readCartState(): CartState {
  if (typeof window === 'undefined') return { items: [] };
  try {
    return parseCartState(window.localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    return { items: [] };
  }
}

export function writeCartState(state: CartState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / private mode
  }
}

export function mergeCartItem(
  items: CartItem[],
  incoming: CartItem,
): CartItem[] {
  const key = cartLineKey(incoming);
  const index = items.findIndex((item) => cartLineKey(item) === key);
  if (index < 0) return [...items, incoming];

  const current = items[index]!;
  const next = [...items];
  next[index] = {
    ...current,
    ...incoming,
    quantity: Math.min(20, current.quantity + incoming.quantity),
    price: incoming.price,
  };
  return next;
}
