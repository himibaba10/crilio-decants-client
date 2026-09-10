import type { CatalogImage, HomeProduct, StockStatus } from '@/types/home';

export type ProductVariationNode = {
  databaseId: number;
  name: string;
  price?: string | null;
  regularPrice?: string | null;
  stockStatus?: StockStatus;
  attributes?: {
    nodes: Array<{ name?: string | null; value?: string | null }>;
  };
  image?: CatalogImage;
};

export type ProductDetail = {
  __typename: string;
  databaseId: number;
  name: string;
  slug: string;
  price?: string | null;
  regularPrice?: string | null;
  stockStatus?: StockStatus;
  shortDescription?: string | null;
  description?: string | null;
  image?: CatalogImage;
  galleryImages?: { nodes: Array<NonNullable<CatalogImage>> };
  productCategories?: {
    nodes: Array<{ name: string; slug: string }>;
  };
  attributes?: {
    nodes: Array<{ name?: string | null; options?: string[] | null }>;
  };
  variations?: { nodes: ProductVariationNode[] };
  related?: { nodes: HomeProduct[] };
};

export type ProductPageData = {
  product: ProductDetail;
  gallery: Array<NonNullable<CatalogImage>>;
  related: HomeProduct[];
};
