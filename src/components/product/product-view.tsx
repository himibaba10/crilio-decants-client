import { ProductAlsoLike } from '@/components/product/product-also-like';
import { ProductBreadcrumbs } from '@/components/product/product-breadcrumbs';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductPurchase } from '@/components/product/product-purchase';
import { ProductRelated } from '@/components/product/product-related';
import { ProductTabs } from '@/components/product/product-tabs';
import { ProductTrust } from '@/components/product/product-trust';
import type { ProductPageData } from '@/types/product';

type ProductViewProps = {
  data: ProductPageData;
};

export function ProductView({ data }: ProductViewProps) {
  const { product, gallery, related } = data;
  const primaryCategory = product.productCategories?.nodes?.[0];

  return (
    <div className='mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-10'>
      <ProductBreadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          ...(primaryCategory
            ? [
                {
                  label: primaryCategory.name,
                  href: `/shop?category=${primaryCategory.slug}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
      />

      <section className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_220px]'>
        <ProductGallery images={gallery} productName={product.name} />
        <ProductPurchase product={product} />
        <div className='lg:pt-1'>
          <ProductTrust />
        </div>
      </section>

      <section className='grid gap-8 lg:grid-cols-[260px_1fr]'>
        <ProductAlsoLike products={related} />
        <ProductTabs descriptionHtml={product.description} />
      </section>

      <ProductRelated products={related} />
    </div>
  );
}
