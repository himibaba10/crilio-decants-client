import { ProductCard } from '@/components/catalog/product-card';
import { cn } from '@/lib/utils';
import type { HomeProduct } from '@/types/home';

type ProductGridProps = {
  products: HomeProduct[];
  view: 'grid' | 'list';
  error?: string;
};

export function ProductGrid({ products, view, error }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className='rounded-2xl border border-dashed border-border bg-white p-10 text-center text-sm text-ink/70'>
        {error ? (
          <>
            <p className='font-medium text-navy'>Couldn’t load products from WordPress</p>
            <p className='mt-2'>{error}</p>
            <p className='mt-3 text-xs'>
              Check that Local (Flywheel) is running and{' '}
              <code className='rounded bg-muted px-1'>NEXT_PUBLIC_WORDPRESS_API_URL</code>{' '}
              points to your GraphQL endpoint.
            </p>
          </>
        ) : (
          <p>
            No products match your filters. Try another category or price range.
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        view === 'list'
          ? 'flex flex-col gap-3'
          : 'grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4',
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.databaseId}
          product={product}
          layout={view}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
