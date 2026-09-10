import { CategoryPills } from '@/components/shop/category-pills';
import { ProductGrid } from '@/components/shop/product-grid';
import { ShopPagination } from '@/components/shop/shop-pagination';
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
    <div className='mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8 lg:py-12'>
      <ShopSidebar
        categories={data.categories}
        latest={data.latest}
        params={params}
      />

      <section className='min-w-0 space-y-6'>
        <div className='space-y-4'>
          <h1 className='text-3xl font-semibold tracking-tight text-navy sm:text-4xl'>
            Shop
          </h1>
          <ShopToolbar params={params} />
          <CategoryPills
            categories={data.categories}
            params={params}
            total={data.total}
          />
        </div>

        <ProductGrid
          products={data.products}
          view={params.view}
          error={data.error}
        />

        <ShopPagination
          params={params}
          page={data.page}
          total={data.total}
          totalPages={data.totalPages}
        />
      </section>
    </div>
  );
}
