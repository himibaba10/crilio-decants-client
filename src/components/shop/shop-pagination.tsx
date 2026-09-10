import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { buildShopHref, type ShopParams } from '@/lib/shop/params';
import { cn } from '@/lib/utils';

type ShopPaginationProps = {
  params: ShopParams;
  page: number;
  total: number;
  totalPages: number;
};

export function ShopPagination({
  params,
  page,
  total,
  totalPages,
}: ShopPaginationProps) {
  if (total === 0) return null;

  const start = (page - 1) * params.perPage + 1;
  const end = Math.min(page * params.perPage, total);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    0,
    7,
  );

  return (
    <div className='flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between'>
      <p className='text-sm text-ink/70'>
        Showing {start}–{end} of {total} results
      </p>

      <div className='flex items-center gap-1'>
        <PageLink
          href={buildShopHref(params, { page: Math.max(1, page - 1) })}
          disabled={page <= 1}
          label='Previous page'
        >
          <ChevronLeft className='size-4' />
        </PageLink>

        {pages.map((n) => (
          <Link
            key={n}
            href={buildShopHref(params, { page: n })}
            className={cn(
              'inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
              n === page
                ? 'bg-gold text-navy'
                : 'border border-border text-navy hover:border-gold',
            )}
          >
            {n}
          </Link>
        ))}

        <PageLink
          href={buildShopHref(params, { page: Math.min(totalPages, page + 1) })}
          disabled={page >= totalPages}
          label='Next page'
        >
          <ChevronRight className='size-4' />
        </PageLink>
      </div>
    </div>
  );
}

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled?: boolean;
  label: string;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled
        className='inline-flex size-9 items-center justify-center rounded-lg border border-border text-ink/30'
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className='inline-flex size-9 items-center justify-center rounded-lg border border-border text-navy transition-colors hover:border-gold'
    >
      {children}
    </Link>
  );
}
