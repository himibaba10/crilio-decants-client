import { env } from "@/lib/env"

export function formatPriceRange(price?: string | null): string {
  if (!price) return "Price on request"
  return price.replace(/\u00a0/g, " ").trim()
}

export function accountUrl(): string {
  try {
    return `${env.checkoutUrl.replace(/\/$/, "")}/my-account/`
  } catch {
    return "#account"
  }
}

export function productsInCategory<
  T extends { productCategories?: { nodes: Array<{ slug: string }> } },
>(products: T[], slug: string): T[] {
  return products.filter((product) =>
    product.productCategories?.nodes.some((category) => category.slug === slug)
  )
}
