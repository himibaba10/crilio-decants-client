import { ProductCard } from '@/components/catalog/product-card';
import { HorizontalCarousel } from '@/components/shared/horizontal-carousel';
import type { HomeProduct } from '@/types/home';

type ProductRelatedProps = {
  products: HomeProduct[];
};

export function ProductRelated({ products }: ProductRelatedProps) {
  if (!products.length) return null;

  return (
    <HorizontalCarousel
      headerNav
      prevLabel='Prev'
      nextLabel='Next'
      header={
        <h2 className='text-2xl font-semibold tracking-tight text-navy'>
          Related products
        </h2>
      }
    >
      {products.map((product, index) => (
        <div
          key={product.databaseId}
          className='w-55 shrink-0 snap-start sm:w-60'
        >
          <ProductCard product={product} priority={index < 2} />
        </div>
      ))}
    </HorizontalCarousel>
  );
}
