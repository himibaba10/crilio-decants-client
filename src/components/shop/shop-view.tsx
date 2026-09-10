import { CategoryPills } from '@/components/shop/category-pills';
import { ProductGrid } from '@/components/shop/product-grid';
import { ShopNavigationProvider } from '@/components/shop/shop-navigation';
import { ShopPagination } from '@/components/shop/shop-pagination';
import { ShopPendingSurface } from '@/components/shop/shop-pending-surface';
import { ShopSidebar } from '@/components/shop/shop-sidebar';
import { ShopToolbar } from '@/components/shop/shop-toolbar';
import type { ShopPageData } from '@/lib/shop/get-shop-data';
import type { ShopParams } from '@/lib/shop/params';

type ShopViewProps = {
  params: ShopParams;
  data: ShopPageData;
};

export function ShopView({ params, data }: ShopViewProps) {
  return (
    <ShopNavigationProvider params={params}>
      <div className='mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8 lg:py-12'>
        <ShopSidebar categories={data.categories} latest={data.latest} />

        <section className='min-w-0 space-y-6'>
          <div className='space-y-4'>
            <h1 className='text-3xl font-semibold tracking-tight text-navy sm:text-4xl'>
              Shop
            </h1>
            <ShopToolbar />
            <CategoryPills categories={data.categories} total={data.total} />
          </div>

          <ShopPendingSurface>
            <ProductGrid
              products={data.products}
              view={params.view}
              error={data.error}
            />
          </ShopPendingSurface>

          <ShopPagination
            page={data.page}
            total={data.total}
            totalPages={data.totalPages}
          />
        </section>
      </div>
    </ShopNavigationProvider>
  );
}
