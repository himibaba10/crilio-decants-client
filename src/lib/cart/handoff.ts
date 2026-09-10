/**
 * Builds the WooCommerce cart-handoff URL (blueprint §5).
 * Format: ?add-to-cart-custom=parent_id:variation_id:quantity,...
 */

import type { CartItem } from "@/lib/cart/types"
import { env } from "@/lib/env"

export function buildCartHandoffPayload(items: CartItem[]): string {
  return items
    .filter((item) => item.productId > 0 && item.quantity > 0)
    .map((item) => `${item.productId}:${item.variationId}:${item.quantity}`)
    .join(",")
}

export function buildCheckoutHandoffUrl(items: CartItem[]): string {
  const payload = buildCartHandoffPayload(items)
  if (!payload) {
    throw new Error("Cannot checkout with an empty cart")
  }

  const base = env.checkoutUrl.replace(/\/$/, "")
  const url = new URL(base)
  url.searchParams.set("add-to-cart-custom", payload)
  return url.toString()
}

export function getCheckoutOrigin(): string {
  return env.checkoutUrl.replace(/\/$/, "")
}
