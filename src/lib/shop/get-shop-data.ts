import { unstable_cache } from 'next/cache';

import { productsInCategory } from '@/lib/catalog';
import { graphqlFetch } from '@/lib/graphql/client';
import { SHOP_CATALOG_QUERY } from '@/lib/graphql/queries';
import {
  filterProductsByPrice,
  paginateProducts,
  productMinPrice,
  type ShopParams,
} from '@/lib/shop/params';
import type { HomeCategory, HomeProduct } from '@/types/home';

type ShopCatalogResponse = {
  products: { nodes: HomeProduct[] };
  productCategories: { nodes: HomeCategory[] };
};

const EMPTY: ShopCatalogResponse = {
  products: { nodes: [] },
  productCategories: { nodes: [] },
};

/** Same WP payload for every filter — cache once, filter in-app. */
const getShopCatalog = unstable_cache(
  async (): Promise<ShopCatalogResponse> => {
    return graphqlFetch<ShopCatalogResponse>(SHOP_CATALOG_QUERY);
  },
  ['shop-catalog'],
  { revalidate: 60, tags: ['catalog', 'shop'] },
);

export type ShopPageData = {
  products: HomeProduct[];
  categories: HomeCategory[];
  latest: HomeProduct[];
  total: number;
  totalPages: number;
  page: number;
  error?: string;
};

function sortProducts(
  products: HomeProduct[],
  sort: ShopParams['sort'],
): HomeProduct[] {
  const copy = [...products];
  copy.sort((a, b) => {
    switch (sort) {
      case 'date-asc':
        return a.databaseId - b.databaseId;
      case 'date-desc':
        return b.databaseId - a.databaseId;
      case 'title-asc':
        return a.name.localeCompare(b.name);
      case 'price-asc':
      case 'price-desc': {
        const pa = productMinPrice(a.price) ?? Number.POSITIVE_INFINITY;
        const pb = productMinPrice(b.price) ?? Number.POSITIVE_INFINITY;
        return sort === 'price-asc' ? pa - pb : pb - pa;
      }
      default:
        return 0;
    }
  });
  return copy;
}

export async function getShopPageData(
  params: ShopParams,
): Promise<ShopPageData> {
  let data: ShopCatalogResponse = EMPTY;
  let error: string | undefined;

  try {
    data = await getShopCatalog();
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : 'Unable to load products from WordPress';
    if (process.env.NODE_ENV === 'development') {
      console.error('[shop] GraphQL failed:', error);
    }
    data = EMPTY;
  }

  const categorized = params.category
    ? productsInCategory(data.products.nodes, params.category)
    : data.products.nodes;
  const priced = filterProductsByPrice(
    categorized,
    params.minPrice,
    params.maxPrice,
  );
  const sorted = sortProducts(priced, params.sort);
  const { items, total, totalPages } = paginateProducts(
    sorted,
    params.page,
    params.perPage,
  );

  return {
    products: items,
    categories: data.productCategories.nodes.filter(
      (c) => c.slug !== 'uncategorized',
    ),
    latest: data.products.nodes.slice(0, 5),
    total,
    totalPages,
    page: Math.min(Math.max(1, params.page), totalPages),
    error,
  };
}
