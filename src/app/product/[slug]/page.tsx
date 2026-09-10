import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProductView } from '@/components/product/product-view';
import {
  getProductPageData,
  getProductSlugs,
} from '@/lib/product/get-product';
import { siteConfig } from '@/lib/site';

export const revalidate = 60;

type ProductPageProps = PageProps<'/product/[slug]'>;

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductPageData(slug);
  if (!data) {
    return { title: 'Product not found' };
  }

  const description =
    data.product.shortDescription?.replace(/<[^>]+>/g, '').slice(0, 160) ||
    siteConfig.description;

  return {
    title: data.product.name,
    description,
    openGraph: {
      title: data.product.name,
      description,
      images: data.product.image?.sourceUrl
        ? [{ url: data.product.image.sourceUrl }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getProductPageData(slug);

  if (!data) notFound();

  return (
    <main className='flex-1 bg-[#fafafa]'>
      <ProductView data={data} />
    </main>
  );
}
