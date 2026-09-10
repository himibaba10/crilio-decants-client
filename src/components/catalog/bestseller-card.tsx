import Image from 'next/image';
import Link from 'next/link';

import { formatPriceRange } from '@/lib/catalog';
import type { HomeProduct } from '@/types/home';

type BestsellerCardProps = {
  product: HomeProduct;
  priority?: boolean;
  fallbackImage?: string;
};

export function BestsellerCard({
  product,
  priority = false,
  fallbackImage = '/images/home/perfume-1.jpg',
}: BestsellerCardProps) {
  const href = `/product/${product.slug}`;
  const imageUrl = product.image?.sourceUrl || fallbackImage;

  return (
    <article className='w-[min(72vw,260px)] shrink-0 snap-center overflow-hidden rounded-2xl border border-border/70 bg-[#f7f7f7] shadow-soft'>
      <Link href={href} className='relative block aspect-3/4 overflow-hidden'>
        <Image
          src={imageUrl}
          alt={product.image?.altText || product.name}
          fill
          sizes='260px'
          className='object-cover'
          priority={priority}
        />
      </Link>
      <div className='space-y-2 bg-white p-4 text-center'>
        <h3 className='font-heading text-lg text-navy'>{product.name}</h3>
        <p className='text-sm font-medium text-navy'>
          {formatPriceRange(product.price)}
        </p>
        <Link
          href={href}
          className='inline-flex h-9 w-full items-center justify-center rounded-full bg-gold text-[11px] font-semibold tracking-[0.16em] text-navy uppercase transition-colors hover:bg-gold-soft'
        >
          Buy now
        </Link>
      </div>
    </article>
  );
}
