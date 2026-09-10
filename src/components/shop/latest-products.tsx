import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

import { formatPriceRange } from '@/lib/catalog';
import type { HomeProduct } from '@/types/home';

type LatestProductsProps = {
  products: HomeProduct[];
};

export function LatestProducts({ products }: LatestProductsProps) {
  if (!products.length) return null;

  return (
    <div className='space-y-3'>
      <h2 className='text-sm font-semibold tracking-wide text-navy uppercase'>
        Latest products
      </h2>
      <ul className='space-y-3'>
        {products.map((product) => (
          <li key={product.databaseId}>
            <Link
              href={`/product/${product.slug}`}
              className='flex gap-3 rounded-xl p-1 transition-colors hover:bg-gold/10'
            >
              <div className='relative size-14 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5]'>
                <Image
                  src={
                    product.image?.sourceUrl || '/images/home/perfume-1.jpg'
                  }
                  alt={product.image?.altText || product.name}
                  fill
                  sizes='56px'
                  className='object-cover'
                />
              </div>
              <div className='min-w-0'>
                <p className='truncate text-sm font-medium text-ink'>
                  {product.name}
                </p>
                <div className='mt-0.5 flex gap-0.5 text-ink/25'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className='size-3 fill-current' />
                  ))}
                </div>
                <p className='mt-1 text-xs font-medium text-navy'>
                  {formatPriceRange(product.price)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
