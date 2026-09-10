import { CategoryNav } from '@/components/shop/category-nav';
import { LatestProducts } from '@/components/shop/latest-products';
import { PriceFilter } from '@/components/shop/price-filter';
import type { ShopParams } from '@/lib/shop/params';
import type { HomeCategory, HomeProduct } from '@/types/home';

type ShopSidebarProps = {
  categories: HomeCategory[];
  latest: HomeProduct[];
  params: ShopParams;
};

export function ShopSidebar({ categories, latest, params }: ShopSidebarProps) {
  return (
    <aside className='space-y-8 rounded-2xl border border-border/70 bg-white p-5 shadow-soft'>
      <CategoryNav categories={categories} params={params} />
      <PriceFilter params={params} />
      <LatestProducts products={latest} />
    </aside>
  );
}
