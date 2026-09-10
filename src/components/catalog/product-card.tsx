'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

import { formatPriceRange } from '@/lib/catalog';
import {
  formatDecantSizeLabel,
  parsePriceAmount,
  sortVariationsBySize,
  variationSizeValue,
} from '@/lib/product/get-product';
import { useCart } from '@/context/cart-provider';
import { useToast } from '@/context/toast-provider';
import { cn } from '@/lib/utils';
import type { CatalogVariation, HomeProduct } from '@/types/home';
import type { ProductVariationNode } from '@/types/product';

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
            <AddToCartControl product={product} disabled={outOfStock} />
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
        <div className='relative mt-auto flex gap-2'>
          <BuyButton href={href} disabled={outOfStock} className='flex-1' />
          <AddToCartControl product={product} disabled={outOfStock} />
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

function AddToCartControl({
  product,
  disabled,
}: {
  product: HomeProduct;
  disabled?: boolean;
}) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const variations = sortVariationsBySize(
    (product.variations?.nodes ?? []) as ProductVariationNode[],
  ).filter((v) => v.stockStatus !== 'OUT_OF_STOCK');

  const add = (variation?: CatalogVariation | ProductVariationNode) => {
    const sizeLabel = variation
      ? formatDecantSizeLabel(
          variationSizeValue(variation as ProductVariationNode),
        )
      : null;
    addItem({
      productId: product.databaseId,
      variationId: variation?.databaseId ?? 0,
      quantity: 1,
      price: parsePriceAmount(variation?.price ?? product.price),
      name: product.name,
      slug: product.slug,
      imageUrl: product.image?.sourceUrl ?? null,
      sizeLabel,
    });
    toast({
      title: 'Added to cart',
      description: sizeLabel
        ? `${product.name} · ${sizeLabel}`
        : product.name,
      href: '/cart',
      hrefLabel: 'View cart',
    });
    setOpen(false);
  };

  const onCartClick = () => {
    if (disabled) return;
    if (variations.length === 0) {
      // Simple product (or variations not loaded) — add parent line.
      add();
      return;
    }
    if (variations.length === 1) {
      add(variations[0]);
      return;
    }
    setOpen((v) => !v);
  };

  return (
    <div className='relative shrink-0'>
      <button
        type='button'
        aria-label='Add to cart'
        aria-expanded={open}
        disabled={disabled}
        onClick={onCartClick}
        className={cn(
          'inline-flex size-9 items-center justify-center rounded-full border border-gold text-navy transition-colors hover:bg-gold/15',
          disabled && 'pointer-events-none opacity-40',
          open && 'bg-gold/15',
        )}
      >
        <ShoppingBag className='size-4' />
      </button>

      {open ? (
        <>
          <button
            type='button'
            aria-label='Close size picker'
            className='fixed inset-0 z-20 cursor-default'
            onClick={() => setOpen(false)}
          />
          <div className='absolute right-0 bottom-full z-30 mb-2 w-44 rounded-2xl border border-border bg-white p-2 shadow-soft-md'>
            <p className='px-2 pb-1.5 text-[10px] font-semibold tracking-[0.14em] text-ink/45 uppercase'>
              Select size
            </p>
            <ul className='space-y-1'>
              {variations.map((variation) => {
                const label = formatDecantSizeLabel(
                  variationSizeValue(variation),
                );
                return (
                  <li key={variation.databaseId}>
                    <button
                      type='button'
                      onClick={() => add(variation)}
                      className='flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs text-navy transition-colors hover:bg-gold/15'
                    >
                      <span className='font-medium'>{label}</span>
                      <span className='text-ink/55'>
                        {formatPriceRange(variation.price)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
