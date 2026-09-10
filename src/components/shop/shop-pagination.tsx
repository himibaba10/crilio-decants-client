'use client';

import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useShopNavigation } from '@/components/shop/shop-navigation';
import { cn } from '@/lib/utils';

type ShopPaginationProps = {
  page: number;
  total: number;
  totalPages: number;
};

export function ShopPagination({
  page,
  total,
  totalPages,
}: ShopPaginationProps) {
  const { params, push, isPending } = useShopNavigation();

  if (total === 0) return null;

  const start = (page - 1) * params.perPage + 1;
  const end = Math.min(page * params.perPage, total);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    0,
    7,
  );

  return (
    <div
      className='flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between'
      aria-busy={isPending}
    >
      <p className='text-sm text-ink/70'>
        Showing {start}–{end} of {total} results
      </p>

      <div className='flex items-center gap-1'>
        <PageButton
          disabled={isPending || page <= 1}
          label='Previous page'
          onClick={() => push({ page: Math.max(1, page - 1) })}
        >
          <ChevronLeft className='size-4' />
        </PageButton>

        {pages.map((n) => (
          <button
            key={n}
            type='button'
            disabled={isPending}
            onClick={() => push({ page: n })}
            className={cn(
              'inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:opacity-60',
              n === page
                ? 'bg-gold text-navy'
                : 'border border-border text-navy hover:border-gold',
            )}
          >
            {n}
          </button>
        ))}

        <PageButton
          disabled={isPending || page >= totalPages}
          label='Next page'
          onClick={() => push({ page: Math.min(totalPages, page + 1) })}
        >
          <ChevronRight className='size-4' />
        </PageButton>
      </div>
    </div>
  );
}

function PageButton({
  disabled,
  label,
  onClick,
  children,
}: {
  disabled?: boolean;
  label: string;
  onClick: () => void;
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
    <button
      type='button'
      aria-label={label}
      onClick={onClick}
      className='inline-flex size-9 items-center justify-center rounded-lg border border-border text-navy transition-colors hover:border-gold'
    >
      {children}
    </button>
  );
}
