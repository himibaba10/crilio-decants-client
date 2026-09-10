import type { HomeCategory, HomeProduct } from '@/types/home';

export type ShopSort =
  | 'date-desc'
  | 'date-asc'
  | 'price-asc'
  | 'price-desc'
  | 'title-asc';

export type ShopParams = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: ShopSort;
  page: number;
  perPage: number;
  view: 'grid' | 'list';
};

export type ShopCatalogData = {
  products: { nodes: HomeProduct[] };
  productCategories: { nodes: HomeCategory[] };
};

const SORT_MAP: Record<
  ShopSort,
  { field: 'DATE' | 'PRICE' | 'TITLE'; order: 'ASC' | 'DESC' }
> = {
  'date-desc': { field: 'DATE', order: 'DESC' },
  'date-asc': { field: 'DATE', order: 'ASC' },
  'price-asc': { field: 'PRICE', order: 'ASC' },
  'price-desc': { field: 'PRICE', order: 'DESC' },
  'title-asc': { field: 'TITLE', order: 'ASC' },
};

export const SHOP_SORT_OPTIONS: Array<{ value: ShopSort; label: string }> = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc', label: 'Oldest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'title-asc', label: 'Name A–Z' },
];

export const SHOP_PER_PAGE_OPTIONS = [12, 20, 40] as const;

function one(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function toInt(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function toFloat(value: string | undefined): number | undefined {
  if (value == null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function parseShopParams(
  raw: Record<string, string | string[] | undefined>,
): ShopParams {
  const sortRaw = one(raw.sort) as ShopSort | undefined;
  const sort =
    sortRaw && sortRaw in SORT_MAP ? sortRaw : ('date-desc' as ShopSort);
  const view = one(raw.view) === 'list' ? 'list' : 'grid';
  const perPageRaw = toInt(one(raw.perPage), 20);
  const perPage = (SHOP_PER_PAGE_OPTIONS as readonly number[]).includes(
    perPageRaw,
  )
    ? perPageRaw
    : 20;

  return {
    category: one(raw.category) || undefined,
    minPrice: toFloat(one(raw.min)),
    maxPrice: toFloat(one(raw.max)),
    sort,
    page: toInt(one(raw.page), 1),
    perPage,
    view,
  };
}

export function shopOrderby(sort: ShopSort) {
  return SORT_MAP[sort];
}

export function buildShopHref(
  current: ShopParams,
  patch: Partial<ShopParams> & { page?: number },
): string {
  const next = { ...current, ...patch };
  const qs = new URLSearchParams();

  if (next.category) qs.set('category', next.category);
  if (next.minPrice != null) qs.set('min', String(next.minPrice));
  if (next.maxPrice != null) qs.set('max', String(next.maxPrice));
  if (next.sort !== 'date-desc') qs.set('sort', next.sort);
  if (next.perPage !== 20) qs.set('perPage', String(next.perPage));
  if (next.view !== 'grid') qs.set('view', next.view);
  if (next.page > 1) qs.set('page', String(next.page));

  const query = qs.toString();
  return query ? `/shop?${query}` : '/shop';
}

/** Extract numeric amounts from Woo price strings like "300.00৳ - 700.00৳". */
export function parsePriceNumbers(price?: string | null): number[] {
  if (!price) return [];
  return [...price.matchAll(/(\d+(?:\.\d+)?)/g)]
    .map((m) => Number(m[1]))
    .filter((n) => Number.isFinite(n));
}

export function productMinPrice(price?: string | null): number | null {
  const nums = parsePriceNumbers(price);
  return nums.length ? Math.min(...nums) : null;
}

export function filterProductsByPrice(
  products: HomeProduct[],
  minPrice?: number,
  maxPrice?: number,
): HomeProduct[] {
  if (minPrice == null && maxPrice == null) return products;
  return products.filter((product) => {
    const value = productMinPrice(product.price);
    if (value == null) return true;
    if (minPrice != null && value < minPrice) return false;
    if (maxPrice != null && value > maxPrice) return false;
    return true;
  });
}

export function paginateProducts<T>(
  items: T[],
  page: number,
  perPage: number,
): { items: T[]; total: number; totalPages: number } {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    total,
    totalPages,
  };
}
