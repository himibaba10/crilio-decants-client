'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { formatPriceRange } from '@/lib/catalog';
import type { HomeProduct } from '@/types/home';

type BestsellersProps = {
  products: HomeProduct[];
};

export function Bestsellers({ products }: BestsellersProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;

    const update = () => {
      const cards = Array.from(node.children) as HTMLElement[];
      if (!cards.length) return;
      const center = node.scrollLeft + node.clientWidth / 2;
      let nearest = 0;
      let best = Number.POSITIVE_INFINITY;
      cards.forEach((card, index) => {
        const mid = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(mid - center);
        if (distance < best) {
          best = distance;
          nearest = index;
        }
      });
      setActive(nearest);
    };

    update();
    node.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      node.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [products]);

  const scrollByCard = (direction: -1 | 1) => {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.children[0] as HTMLElement | undefined;
    const amount = card ? card.offsetWidth + 16 : 280;
    node.scrollBy({ left: amount * direction, behavior: 'smooth' });
  };

  if (!products.length) {
    return (
      <section className='bg-white py-16'>
        <div className='mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='font-heading text-3xl text-navy sm:text-4xl'>
            Weekly bestsellers
          </h2>
          <p className='mt-4 text-sm text-ink/70'>
            Products will appear here once published in WooCommerce.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className='animate-fade-up bg-white py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h2 className='mb-10 text-center font-heading text-3xl tracking-tight text-navy sm:text-4xl'>
          Weekly bestsellers
        </h2>

        <div className='relative'>
          <button
            type='button'
            aria-label='Previous'
            onClick={() => scrollByCard(-1)}
            className='absolute top-1/2 left-0 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-white text-navy shadow-soft transition hover:border-gold hover:bg-gold/15 md:inline-flex'
          >
            <ChevronLeft className='size-5' />
          </button>
          <button
            type='button'
            aria-label='Next'
            onClick={() => scrollByCard(1)}
            className='absolute top-1/2 right-0 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-white text-navy shadow-soft transition hover:border-gold hover:bg-gold/15 md:inline-flex'
          >
            <ChevronRight className='size-5' />
          </button>

          <div
            ref={scrollerRef}
            className='flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 [-ms-overflow-style:none] scrollbar-none md:px-12 [&::-webkit-scrollbar]:hidden'
          >
            {products.map((product, index) => {
              const isActive = index === active;
              const imageUrl =
                product.image?.sourceUrl || '/images/home/perfume-1.jpg';

              return (
                <article
                  key={product.databaseId}
                  className={`w-[min(72vw,260px)] shrink-0 snap-center overflow-hidden rounded-2xl border border-border/70 bg-[#f7f7f7] transition-all duration-500 ${
                    isActive
                      ? 'scale-100 shadow-soft-lg md:scale-105'
                      : 'scale-95 opacity-80 shadow-soft'
                  }`}
                >
                  <Link
                    href={`/product/${product.slug}`}
                    className='relative block aspect-3/4 overflow-hidden'
                  >
                    <Image
                      src={imageUrl}
                      alt={product.image?.altText || product.name}
                      fill
                      sizes='260px'
                      className='object-cover'
                      priority={index < 2}
                    />
                  </Link>
                  <div className='space-y-2 bg-white p-4 text-center'>
                    <h3 className='font-heading text-lg text-navy'>
                      {product.name}
                    </h3>
                    <p className='text-sm font-medium text-navy'>
                      {formatPriceRange(product.price)}
                    </p>
                    <Link
                      href={`/product/${product.slug}`}
                      className='inline-flex h-9 w-full items-center justify-center rounded-full bg-gold text-[11px] font-semibold tracking-[0.16em] text-navy uppercase transition-colors hover:bg-gold-soft'
                    >
                      Buy now
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
