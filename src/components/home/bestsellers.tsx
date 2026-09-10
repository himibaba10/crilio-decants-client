import { BestsellerCard } from '@/components/catalog/bestseller-card';
import { HorizontalCarousel } from '@/components/shared/horizontal-carousel';
import type { HomeProduct } from '@/types/home';

type BestsellersProps = {
  products: HomeProduct[];
};

export function Bestsellers({ products }: BestsellersProps) {
  if (!products.length) {
    return (
      <section className='bg-white py-16'>
        <div className='mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='font-heading text-3xl text-navy sm:text-4xl'>
            Weekly bestsellers
          </h2>
          <p className='mt-4 text-sm text-ink/70'>
            Products will appear here once published in WooCommerce.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className='animate-fade-up bg-white py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h2 className='mb-10 text-center font-heading text-3xl tracking-tight text-navy sm:text-4xl'>
          Weekly bestsellers
        </h2>

        <HorizontalCarousel
          overlayNav
          trackActive
          scrollByCardWidth
        >
          {products.map((product, index) => (
            <BestsellerCard
              key={product.databaseId}
              product={product}
              priority={index < 2}
            />
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}
