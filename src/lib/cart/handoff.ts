/**
 * Builds the WooCommerce cart-handoff URL (blueprint §5).
 * Format: ?add-to-cart-custom=parent_id:variation_id:quantity,...
 */

import type { CartItem } from "@/lib/cart/types"
import { env } from "@/lib/env"

export function buildCartHandoffPayload(items: CartItem[]): string {
  return items
    .map((item) => `${item.productId}:${item.variationId}:${item.quantity}`)
    .join(",")
}

export function buildCheckoutHandoffUrl(items: CartItem[]): string {
  const base = env.checkoutUrl.replace(/\/$/, "")
  const payload = buildCartHandoffPayload(items)
  const url = new URL(base)
  url.searchParams.set("add-to-cart-custom", payload)
  return url.toString()
}
