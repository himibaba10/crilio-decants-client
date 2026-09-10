import Link from 'next/link';

import { cn } from '@/lib/utils';

type Crumb = {
  label: string;
  href?: string;
};

type ProductBreadcrumbsProps = {
  items: Crumb[];
  className?: string;
};

export function ProductBreadcrumbs({
  items,
  className,
}: ProductBreadcrumbsProps) {
  return (
    <nav
      aria-label='Breadcrumb'
      className={cn('text-sm text-ink/55', className)}
    >
      <ol className='flex flex-wrap items-center gap-1.5'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className='flex items-center gap-1.5'>
              {index > 0 ? <span aria-hidden>/</span> : null}
              {item.href && !isLast ? (
                <Link href={item.href} className='hover:text-navy'>
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-medium text-navy' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
