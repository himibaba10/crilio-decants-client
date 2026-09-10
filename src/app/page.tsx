import { Bestsellers } from '@/components/home/bestsellers';
import { CategoryShowcase } from '@/components/home/category-showcase';
import { Collections } from '@/components/home/collections';
import { Hero } from '@/components/home/hero';
import { Perks } from '@/components/home/perks';
import { Testimonials } from '@/components/home/testimonials';
import { WhyChoose } from '@/components/home/why-choose';
import { graphqlFetch } from '@/lib/graphql/client';
import { HOME_CATALOG_QUERY } from '@/lib/graphql/queries';
import type { HomeCatalogData } from '@/types/home';

export const revalidate = 60;

async function getHomeCatalog(): Promise<HomeCatalogData> {
  try {
    return await graphqlFetch<HomeCatalogData>(HOME_CATALOG_QUERY, undefined, {
      next: { revalidate: 60, tags: ['catalog'] },
    });
  } catch {
    return {
      products: { nodes: [] },
      productCategories: { nodes: [] },
    };
  }
}

export default async function HomePage() {
  const data = await getHomeCatalog();
  const products = data.products.nodes;

  return (
    <main className='flex-1'>
      <Hero />
      <CategoryShowcase />
      <Bestsellers products={products} />
      <Collections products={products} />
      <WhyChoose />
      <Testimonials />
      <Perks />
    </main>
  );
}
