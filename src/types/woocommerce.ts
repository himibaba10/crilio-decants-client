/** Shared WooCommerce / WooGraphQL types — expand as queries land. */

export type ProductVariation = {
  databaseId: number
  name: string
  price: string | null
  stockStatus: string | null
  attributes?: Array<{ name: string; value: string }>
}


export type CatalogProduct = {
  databaseId: number
  name: string
  slug: string
  image?: { sourceUrl: string; altText?: string | null } | null
  productCategories?: { nodes: Array<{ name: string; slug: string }> }
}
