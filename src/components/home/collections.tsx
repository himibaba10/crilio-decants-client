import { CollectionRow } from '@/components/home/collection-row';
import { siteConfig } from '@/lib/site';
import type { HomeProduct } from '@/types/home';

type CollectionsProps = {
  products: HomeProduct[];
};

export function Collections({ products }: CollectionsProps) {
  return (
    <section className='bg-[#fafafa] py-16'>
      <div className='mx-auto max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h2 className='font-heading text-3xl tracking-tight text-navy sm:text-4xl'>
            Our perfume collections
          </h2>
        </div>

        {siteConfig.collectionBanners.map((collection) => (
          <CollectionRow
            key={collection.slug}
            name={collection.name}
            slug={collection.slug}
            banner={collection.banner}
            products={products}
          />
        ))}
      </div>
    </section>
  );
}
