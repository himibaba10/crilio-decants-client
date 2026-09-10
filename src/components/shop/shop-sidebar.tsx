import { CategoryNav } from '@/components/shop/category-nav';
import { LatestProducts } from '@/components/shop/latest-products';
import { PriceFilter } from '@/components/shop/price-filter';
import type { HomeCategory, HomeProduct } from '@/types/home';

type ShopSidebarProps = {
  categories: HomeCategory[];
  latest: HomeProduct[];
};

export function ShopSidebar({ categories, latest }: ShopSidebarProps) {
  return (
    <aside className='space-y-8 rounded-2xl border border-border/70 bg-white p-5 shadow-soft'>
      <CategoryNav categories={categories} />
      <PriceFilter />
      <LatestProducts products={latest} />
    </aside>
  );
}
