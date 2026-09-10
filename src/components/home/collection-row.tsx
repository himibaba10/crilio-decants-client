import { ProductCard } from '@/components/catalog/product-card';
import { CollectionBanner } from '@/components/home/collection-banner';
import { getCollectionProducts } from '@/lib/catalog';
import type { HomeProduct } from '@/types/home';

const FALLBACK_IMAGES = [
  '/images/home/perfume-1.jpg',
  '/images/home/perfume-2.jpg',
  '/images/home/perfume-3.jpg',
  '/images/home/category-fresh.jpg',
] as const;

type CollectionRowProps = {
  name: string;
  slug: string;
  banner: string;
  products: HomeProduct[];
};

export function CollectionRow({
  name,
  slug,
  banner,
  products,
}: CollectionRowProps) {
  const items = getCollectionProducts(products, slug);

  return (
    <div className='grid gap-4 lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr]'>
      <CollectionBanner name={name} slug={slug} banner={banner} />
      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        {items.length > 0 ? (
          items.map((product, index) => (
            <ProductCard
              key={`${slug}-${product.databaseId}`}
              product={product}
              fallbackImage={FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
            />
          ))
        ) : (
          <p className='col-span-full self-center text-sm text-ink/70'>
            Products for {name} will appear here soon.
          </p>
        )}
      </div>
    </div>
  );
}
