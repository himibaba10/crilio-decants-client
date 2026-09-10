'use client';

import { useShopNavigation } from '@/components/shop/shop-navigation';
import { cn } from '@/lib/utils';
import type { HomeCategory } from '@/types/home';

type CategoryNavProps = {
  categories: HomeCategory[];
};

export function CategoryNav({ categories }: CategoryNavProps) {
  const { params, push, isPending } = useShopNavigation();

  return (
    <nav className='space-y-3' aria-busy={isPending}>
      <h2 className='text-sm font-semibold tracking-wide text-navy uppercase'>
        Browse categories
      </h2>
      <ul className='space-y-1.5 text-sm'>
        <li>
          <button
            type='button'
            onClick={() => push({ category: undefined, page: 1 })}
            disabled={isPending}
            className={cn(
              'block w-full rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-gold/10 hover:text-navy disabled:opacity-60',
              !params.category ? 'bg-gold/15 font-medium text-navy' : 'text-ink/70',
            )}
          >
            All products
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <button
              type='button'
              onClick={() =>
                push({
                  category: category.slug,
                  page: 1,
                })
              }
              disabled={isPending}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-gold/10 hover:text-navy disabled:opacity-60',
                params.category === category.slug
                  ? 'bg-gold/15 font-medium text-navy'
                  : 'text-ink/70',
              )}
            >
              <span>{category.name}</span>
              {category.count != null ? (
                <span className='text-xs text-ink/45'>{category.count}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
