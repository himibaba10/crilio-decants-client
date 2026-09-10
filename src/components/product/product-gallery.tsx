'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import type { CatalogImage } from '@/types/home';

type ProductGalleryProps = {
  images: Array<NonNullable<CatalogImage>>;
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const list =
    images.length > 0
      ? images
      : [
          {
            sourceUrl: '/images/home/perfume-1.jpg',
            altText: productName,
          },
        ];
  const current = list[Math.min(index, list.length - 1)]!;

  const go = (next: number) => {
    setIndex((next + list.length) % list.length);
  };

  return (
    <div className='space-y-3'>
      <div className='relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-[#f5f5f5]'>
        <Image
          src={current.sourceUrl}
          alt={current.altText || productName}
          fill
          priority
          sizes='(max-width: 1024px) 100vw, 480px'
          className='object-cover'
        />
        {list.length > 1 ? (
          <>
            <button
              type='button'
              aria-label='Previous image'
              onClick={() => go(index - 1)}
              className='absolute top-1/2 left-3 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/95 text-navy shadow-soft transition-colors hover:border-gold'
            >
              <ChevronLeft className='size-4' />
            </button>
            <button
              type='button'
              aria-label='Next image'
              onClick={() => go(index + 1)}
              className='absolute top-1/2 right-3 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/95 text-navy shadow-soft transition-colors hover:border-gold'
            >
              <ChevronRight className='size-4' />
            </button>
          </>
        ) : null}
      </div>

      {list.length > 1 ? (
        <div className='flex gap-2 overflow-x-auto pb-1'>
          {list.map((image, i) => (
            <button
              key={`${image.sourceUrl}-${i}`}
              type='button'
              aria-label={`View image ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                'relative size-16 shrink-0 overflow-hidden rounded-xl border bg-[#f5f5f5] transition-colors',
                i === index
                  ? 'border-gold ring-1 ring-gold'
                  : 'border-border hover:border-gold/60',
              )}
            >
              <Image
                src={image.sourceUrl}
                alt={image.altText || `${productName} ${i + 1}`}
                fill
                sizes='64px'
                className='object-cover'
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
