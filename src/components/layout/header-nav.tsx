'use client';

import Link from 'next/link';

import { useFindUs } from '@/context/find-us-provider';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';

const linkClass =
  'hidden transition-colors hover:text-gold sm:inline-flex first:inline-flex';

export function HeaderNav() {
  const { openFindUs } = useFindUs();

  return (
    <nav className='flex items-center gap-4 text-[11px] font-medium tracking-[0.18em] uppercase text-white/80 sm:gap-6'>
      {siteConfig.nav.map((item) => {
        if ('action' in item && item.action === 'find-us') {
          return (
            <button
              key={item.label}
              type='button'
              onClick={openFindUs}
              className={cn(linkClass, 'cursor-pointer')}
            >
              {item.label}
            </button>
          );
        }

        if (!('href' in item)) return null;

        return (
          <Link key={item.href} href={item.href} className={linkClass}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
