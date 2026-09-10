import Link from 'next/link';

import { buildShopHref, type ShopParams } from '@/lib/shop/params';
import { cn } from '@/lib/utils';
import type { HomeCategory } from '@/types/home';

type CategoryNavProps = {
  categories: HomeCategory[];
  params: ShopParams;
};

export function CategoryNav({ categories, params }: CategoryNavProps) {
  return (
    <nav className='space-y-3'>
      <h2 className='text-sm font-semibold tracking-wide text-navy uppercase'>
        Browse categories
      </h2>
      <ul className='space-y-1.5 text-sm'>
        <li>
          <Link
            href={buildShopHref(params, { category: undefined, page: 1 })}
            className={cn(
              'block rounded-lg px-2 py-1.5 transition-colors hover:bg-gold/10 hover:text-navy',
              !params.category ? 'bg-gold/15 font-medium text-navy' : 'text-ink/70',
            )}
          >
            All products
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={buildShopHref(params, {
                category: category.slug,
                page: 1,
              })}
              className={cn(
                'flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-gold/10 hover:text-navy',
                params.category === category.slug
                  ? 'bg-gold/15 font-medium text-navy'
                  : 'text-ink/70',
              )}
            >
              <span>{category.name}</span>
              {category.count != null ? (
                <span className='text-xs text-ink/45'>{category.count}</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
