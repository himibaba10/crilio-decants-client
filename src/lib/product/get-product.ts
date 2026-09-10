import { unstable_cache } from 'next/cache';

import { parsePriceNumbers } from '@/lib/shop/params';
import { graphqlFetch } from '@/lib/graphql/client';
import {
  PRODUCT_BY_SLUG_QUERY,
  PRODUCT_SLUGS_QUERY,
} from '@/lib/graphql/queries';
import type { ProductDetail, ProductPageData, ProductVariationNode } from '@/types/product';

type ProductBySlugResponse = {
  product: ProductDetail | null;
};

type ProductSlugsResponse = {
  products: { nodes: Array<{ slug: string }> };
};

export async function getProductSlugs(): Promise<string[]> {
  try {
    const data = await graphqlFetch<ProductSlugsResponse>(
      PRODUCT_SLUGS_QUERY,
      undefined,
      { next: { revalidate: 60, tags: ['catalog'] } },
    );
    return data.products.nodes.map((p) => p.slug).filter(Boolean);
  } catch {
    return [];
  }
}

function buildGallery(product: ProductDetail): ProductPageData['gallery'] {
  const images: ProductPageData['gallery'] = [];
  if (product.image?.sourceUrl) {
    images.push(product.image);
  }
  for (const image of product.galleryImages?.nodes ?? []) {
    if (
      image?.sourceUrl &&
      !images.some((existing) => existing.sourceUrl === image.sourceUrl)
    ) {
      images.push(image);
    }
  }
  return images;
}

async function fetchProductBySlug(slug: string): Promise<ProductPageData | null> {
  const data = await graphqlFetch<ProductBySlugResponse>(
    PRODUCT_BY_SLUG_QUERY,
    { slug },
  );
  if (!data.product) return null;

  const related = (data.product.related?.nodes ?? []).filter(
    (item) => item.slug !== slug,
  );

  return {
    product: data.product,
    gallery: buildGallery(data.product),
    related,
  };
}

export function getProductPageData(slug: string) {
  return unstable_cache(
    () => fetchProductBySlug(slug),
    ['product', slug],
    { revalidate: 60, tags: ['catalog', `product:${slug}`] },
  )();
}

/** Format Woo attribute values like `3-ml` / `10-ml` → `3 ML`. */
export function formatDecantSizeLabel(value?: string | null): string {
  if (!value) return 'Size';
  const match = value.match(/(\d+)\s*-?\s*ml/i);
  if (match) return `${match[1]} ML`;
  return value.replace(/-/g, ' ').toUpperCase();
}

export function variationSizeValue(
  variation: ProductVariationNode,
): string | null {
  const attrs = variation.attributes?.nodes ?? [];
  const sizeAttr =
    attrs.find((a) => /size|ml|decant/i.test(a.name ?? '')) ?? attrs[0];
  return sizeAttr?.value ?? null;
}

export function sortVariationsBySize(
  variations: ProductVariationNode[],
): ProductVariationNode[] {
  return [...variations].sort((a, b) => {
    const av = Number(variationSizeValue(a)?.match(/\d+/)?.[0] ?? 0);
    const bv = Number(variationSizeValue(b)?.match(/\d+/)?.[0] ?? 0);
    return av - bv;
  });
}

export function parsePriceAmount(price?: string | null): number {
  const nums = parsePriceNumbers(price);
  return nums[0] ?? 0;
}
