import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

import { formatPriceRange } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import type { HomeProduct } from '@/types/home';

type ProductCardProps = {
  product: HomeProduct;
  className?: string;
  priority?: boolean;
  fallbackImage?: string;
  layout?: 'grid' | 'list';
};

export function ProductCard({
  product,
  className,
  priority,
  fallbackImage = '/images/home/perfume-1.jpg',
  layout = 'grid',
}: ProductCardProps) {
  const href = `/product/${product.slug}`;
  const outOfStock = product.stockStatus === 'OUT_OF_STOCK';
  const imageUrl = product.image?.sourceUrl || fallbackImage;

  if (layout === 'list') {
    return (
      <article
        className={cn(
          'flex gap-4 overflow-hidden rounded-2xl border border-border/70 bg-white p-3 shadow-soft',
          className,
        )}
      >
        <Link
          href={href}
          className='relative size-28 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f5]'
        >
          <Image
            src={imageUrl}
            alt={product.image?.altText || product.name}
            fill
            sizes='112px'
            className='object-cover'
          />
        </Link>
        <div className='flex min-w-0 flex-1 flex-col justify-center gap-2'>
          <h3 className='truncate text-sm font-medium text-ink'>
            <Link href={href}>{product.name}</Link>
          </h3>
          <p className='text-sm font-medium text-navy'>
            {formatPriceRange(product.price)}
          </p>
          <div className='flex gap-2'>
            <BuyButton href={href} disabled={outOfStock} />
            <CartIconButton href={href} disabled={outOfStock} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-white shadow-soft transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-soft-md',
        className,
      )}
    >
      <Link
        href={href}
        className='relative block aspect-square overflow-hidden bg-[#f5f5f5]'
      >
        <Image
          src={imageUrl}
          alt={product.image?.altText || product.name}
          fill
          priority={priority}
          sizes='(max-width: 640px) 50vw, 220px'
          className='object-cover transition-transform duration-500 hover:scale-105'
        />
        {outOfStock ? (
          <span className='absolute top-2 left-2 rounded-full bg-navy/90 px-2.5 py-1 text-[10px] tracking-[0.14em] text-white uppercase'>
            Out of stock
          </span>
        ) : null}
      </Link>

      <div className='flex flex-1 flex-col gap-2 px-3 pt-3 pb-4 text-center'>
        <h3 className='line-clamp-2 text-sm font-medium text-ink'>
          <Link href={href} className='hover:text-navy'>
            {product.name}
          </Link>
        </h3>
        <p className='text-sm font-medium text-navy'>
          {formatPriceRange(product.price)}
        </p>
        <div className='mt-auto flex gap-2'>
          <BuyButton href={href} disabled={outOfStock} className='flex-1' />
          <CartIconButton href={href} disabled={outOfStock} />
        </div>
      </div>
    </article>
  );
}

function BuyButton({
  href,
  disabled,
  className,
}: {
  href: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-full bg-gold px-3 text-[11px] font-semibold tracking-[0.16em] text-navy uppercase transition-colors hover:bg-gold-soft',
        disabled && 'pointer-events-none opacity-40',
        className,
      )}
    >
      Buy now
    </Link>
  );
}

function CartIconButton({
  href,
  disabled,
}: {
  href: string;
  disabled?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label='View product'
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-gold text-navy transition-colors hover:bg-gold/15',
        disabled && 'pointer-events-none opacity-40',
      )}
    >
      <ShoppingBag className='size-4' />
    </Link>
  );
}
