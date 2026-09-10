import { CategoryCard } from '@/components/home/category-card';
import { siteConfig } from '@/lib/site';

export function CategoryShowcase() {
  return (
    <section className='bg-white py-14 sm:py-16'>
      <div className='mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-3 sm:px-6 lg:px-8'>
        {siteConfig.categoryShowcase.map((category) => (
          <CategoryCard key={category.slug} {...category} />
        ))}
      </div>
    </section>
  );
}
