import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
  href?: string;
  className?: string;
  /** header = compact; footer = larger */
  size?: 'header' | 'footer';
};

const sizes = {
  header: { width: 120, height: 120, className: 'h-12 w-auto sm:h-14' },
  footer: { width: 160, height: 160, className: 'h-20 w-auto' },
} as const;

export function BrandLogo({
  href = '/',
  className,
  size = 'header',
}: BrandLogoProps) {
  const dims = sizes[size];

  return (
    <Link
      href={href}
      className={cn('inline-flex items-center justify-center', className)}
      aria-label={siteConfig.name}
    >
      <Image
        src={siteConfig.images.logo}
        alt={siteConfig.name}
        width={dims.width}
        height={dims.height}
        priority={size === 'header'}
        className={cn('object-contain', dims.className)}
      />
    </Link>
  );
}
