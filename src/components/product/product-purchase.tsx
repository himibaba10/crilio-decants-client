'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

import { buildCheckoutHandoffUrl } from '@/lib/cart/handoff';
import { useCart } from '@/context/cart-provider';
import { formatPriceRange } from '@/lib/catalog';
import {
  formatDecantSizeLabel,
  parsePriceAmount,
  sortVariationsBySize,
  variationSizeValue,
} from '@/lib/product/get-product';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';
import type { ProductDetail } from '@/types/product';

type ProductPurchaseProps = {
  product: ProductDetail;
};

export function ProductPurchase({ product }: ProductPurchaseProps) {
  const { addItem } = useCart();
  const variations = useMemo(
    () => sortVariationsBySize(product.variations?.nodes ?? []),
    [product.variations?.nodes],
  );
  const isVariable = variations.length > 0;
  const [selectedId, setSelectedId] = useState<number | null>(
    variations[0]?.databaseId ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = variations.find((v) => v.databaseId === selectedId) ?? null;
  const displayPrice = selected?.price ?? product.price;
  const sizeLabel = selected
    ? formatDecantSizeLabel(variationSizeValue(selected))
    : null;
  const outOfStock =
    (selected?.stockStatus ?? product.stockStatus) === 'OUT_OF_STOCK';
  const imageUrl =
    selected?.image?.sourceUrl || product.image?.sourceUrl || null;

  const whatsappHref = (() => {
    const digits = siteConfig.phone.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hi ${siteConfig.name}, I'm interested in ${product.name}${sizeLabel ? ` (${sizeLabel})` : ''} × ${quantity}.`,
    );
    if (!digits || digits.includes('X')) {
      return `https://wa.me/?text=${text}`;
    }
    return `https://wa.me/88${digits}?text=${text}`;
  })();

  const lineItem = () => {
    const variationId = isVariable ? (selected?.databaseId ?? 0) : 0;
    return {
      productId: product.databaseId,
      variationId,
      quantity,
      price: parsePriceAmount(displayPrice),
      name: product.name,
      slug: product.slug,
      imageUrl,
      sizeLabel,
    };
  };

  const onBuyNow = () => {
    if (isVariable && !selected) return;
    if (outOfStock) return;
    window.location.href = buildCheckoutHandoffUrl([lineItem()]);
  };

  const onAddToCart = () => {
    if (isVariable && !selected) return;
    if (outOfStock) return;
    addItem(lineItem());
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className='space-y-5'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-semibold tracking-tight text-navy sm:text-4xl'>
          {product.name}
        </h1>
        <p className='text-xl font-medium text-navy'>
          {formatPriceRange(displayPrice)}
        </p>
      </div>

      {product.shortDescription ? (
        <div
          className='product-copy space-y-2 text-sm leading-relaxed text-ink/80'
          dangerouslySetInnerHTML={{ __html: product.shortDescription }}
        />
      ) : null}

      {isVariable ? (
        <div className='space-y-2'>
          <p className='text-sm font-medium text-navy'>
            Please select a product size
          </p>
          <div className='flex flex-wrap gap-2'>
            {variations.map((variation) => {
              const label = formatDecantSizeLabel(
                variationSizeValue(variation),
              );
              const active = variation.databaseId === selectedId;
              const disabled = variation.stockStatus === 'OUT_OF_STOCK';
              return (
                <button
                  key={variation.databaseId}
                  type='button'
                  disabled={disabled}
                  onClick={() => setSelectedId(variation.databaseId)}
                  className={cn(
                    'inline-flex h-10 min-w-16 items-center justify-center rounded-full border px-4 text-xs font-semibold tracking-[0.12em] uppercase transition-colors disabled:opacity-40',
                    active
                      ? 'border-navy bg-navy text-white'
                      : 'border-border bg-white text-navy hover:border-gold',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className='flex items-center gap-3'>
        <div className='inline-flex h-11 items-center rounded-full border border-border bg-white'>
          <button
            type='button'
            aria-label='Decrease quantity'
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className='inline-flex size-11 items-center justify-center text-navy hover:text-gold'
          >
            <Minus className='size-4' />
          </button>
          <span className='min-w-8 text-center text-sm font-medium text-navy'>
            {quantity}
          </span>
          <button
            type='button'
            aria-label='Increase quantity'
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className='inline-flex size-11 items-center justify-center text-navy hover:text-gold'
          >
            <Plus className='size-4' />
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-2 sm:flex-row sm:flex-wrap'>
        <button
          type='button'
          onClick={onBuyNow}
          disabled={outOfStock || (isVariable && !selected)}
          className='inline-flex h-11 flex-1 items-center justify-center rounded-full bg-gold px-6 text-xs font-semibold tracking-[0.16em] text-navy uppercase transition-colors hover:bg-gold-soft disabled:opacity-40 sm:min-w-40'
        >
          Buy now
        </button>
        <button
          type='button'
          onClick={onAddToCart}
          disabled={outOfStock || (isVariable && !selected)}
          className='inline-flex h-11 flex-1 items-center justify-center rounded-full border border-border bg-[#f3efe6] px-6 text-xs font-semibold tracking-[0.16em] text-navy uppercase transition-colors hover:border-gold disabled:opacity-40 sm:min-w-36'
        >
          {added ? 'Added' : 'Add to cart'}
        </button>
        <a
          href={whatsappHref}
          target='_blank'
          rel='noreferrer'
          className='inline-flex h-11 flex-1 items-center justify-center rounded-full bg-[#25D366] px-6 text-xs font-semibold tracking-[0.16em] text-white uppercase transition-opacity hover:opacity-90 sm:min-w-32'
        >
          WhatsApp
        </a>
      </div>

      {added ? (
        <p className='text-sm text-navy'>
          Added to cart.{' '}
          <Link href='/cart' className='font-medium underline'>
            View cart
          </Link>
        </p>
      ) : null}

      {outOfStock ? (
        <p className='text-sm font-medium text-red-700'>Out of stock</p>
      ) : null}

      {product.productCategories?.nodes?.length ? (
        <p className='text-sm text-ink/60'>
          Categories:{' '}
          {product.productCategories.nodes.map((category, index) => (
            <span key={category.slug}>
              {index > 0 ? ', ' : null}
              <Link
                href={`/shop?category=${category.slug}`}
                className='text-navy hover:underline'
              >
                {category.name}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}
