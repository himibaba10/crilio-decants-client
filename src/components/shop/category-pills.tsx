'use client';

import { useShopNavigation } from '@/components/shop/shop-navigation';
import { cn } from '@/lib/utils';
import type { HomeCategory } from '@/types/home';

type CategoryPillsProps = {
  categories: HomeCategory[];
  total: number;
};

export function CategoryPills({ categories, total }: CategoryPillsProps) {
  const { params, push, isPending } = useShopNavigation();

  const pills = [
    { slug: undefined as string | undefined, name: 'Shop', count: total },
    ...categories.map((c) => ({
      slug: c.slug as string | undefined,
      name: c.name,
      count: c.count ?? undefined,
    })),
  ];

  return (
    <div className='flex flex-wrap gap-2' aria-busy={isPending}>
      {pills.map((pill) => {
        const active =
          (!params.category && !pill.slug) || params.category === pill.slug;
        return (
          <button
            key={pill.slug ?? 'all'}
            type='button'
            onClick={() =>
              push({
                category: pill.slug,
                page: 1,
              })
            }
            disabled={isPending}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60',
              active
                ? 'border-gold bg-gold text-navy'
                : 'border-gold/50 bg-white text-navy hover:bg-gold/10',
            )}
          >
            <span>{pill.name}</span>
            {pill.count != null ? (
              <span className={active ? 'text-navy/70' : 'text-ink/45'}>
                {pill.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
