import Link from 'next/link';

import { siteConfig } from '@/lib/site';

export function BrandLogo({
  href = '/',
  className = 'text-center',
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={className}>
      <span className='font-heading text-2xl tracking-[0.28em] text-gold uppercase sm:text-3xl'>
        {siteConfig.name}
      </span>
    </Link>
  );
}
