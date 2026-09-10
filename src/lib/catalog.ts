import { env } from '@/lib/env';
import type { HomeProduct } from '@/types/home';

export function formatPriceRange(price?: string | null): string {
  if (!price) return 'Price on request';
  return price.replace(/\u00a0/g, ' ').trim();
}

export function accountUrl(): string {
  try {
    return `${env.checkoutUrl.replace(/\/$/, '')}/my-account/`;
  } catch {
    return '#account';
  }
}

export function productsInCategory(
  products: HomeProduct[],
  slug: string,
): HomeProduct[] {
  return products.filter((product) =>
    product.productCategories?.nodes.some((category) => category.slug === slug),
  );
}

export function getCollectionProducts(
  products: HomeProduct[],
  slug: string,
  limit = 4,
): HomeProduct[] {
  const categoryProducts = productsInCategory(products, slug).slice(0, limit);
  return categoryProducts.length > 0
    ? categoryProducts
    : products.slice(0, limit);
}
