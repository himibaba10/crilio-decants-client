/** Cart line shape persisted in React Context + localStorage (blueprint §3). */

export type CartItem = {
  productId: number;
  variationId: number;
  quantity: number;
  price: number;
  /** Display fields for the Next.js cart page (not sent in handoff). */
  name: string;
  slug: string;
  imageUrl?: string | null;
  sizeLabel?: string | null;
};

export type CartState = {
  items: CartItem[];
};

export function cartLineKey(
  item: Pick<CartItem, 'productId' | 'variationId'>,
): string {
  return `${item.productId}:${item.variationId}`;
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function formatCartMoney(amount: number): string {
  return `৳ ${amount.toLocaleString('en-BD', {
    maximumFractionDigits: 0,
  })}`;
}
