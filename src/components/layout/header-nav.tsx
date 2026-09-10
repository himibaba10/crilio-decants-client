import Link from 'next/link';

import { siteConfig } from '@/lib/site';

export function HeaderNav() {
  return (
    <nav className='flex items-center gap-4 text-[11px] font-medium tracking-[0.18em] uppercase text-white/80 sm:gap-6'>
      {siteConfig.nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className='hidden transition-colors hover:text-gold sm:inline-flex first:inline-flex'
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
