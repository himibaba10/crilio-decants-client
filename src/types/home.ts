export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER" | string | null

export type CatalogImage = {
  sourceUrl: string
  altText?: string | null
} | null

export type HomeProduct = {
  __typename: string
  databaseId: number
  name: string
  slug: string
  price?: string | null
  regularPrice?: string | null
  stockStatus?: StockStatus
  image?: CatalogImage
  productCategories?: {
    nodes: Array<{ slug: string; name: string }>
  }
}

export type HomeCategory = {
  databaseId: number
  name: string
  slug: string
  count?: number | null
  image?: CatalogImage
}

export type HomeCatalogData = {
  products: { nodes: HomeProduct[] }
  productCategories: { nodes: HomeCategory[] }
}
