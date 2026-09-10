import Link from 'next/link';
import { MapPin } from 'lucide-react';

import { siteConfig } from '@/lib/site';

export function StoreInfoCard() {
  return (
    <div className='flex min-h-72 flex-col justify-center rounded-2xl bg-gold p-8 text-navy shadow-soft-md sm:p-10'>
      <MapPin className='mb-4 size-8' aria-hidden />
      <p className='font-heading text-2xl'>Visit {siteConfig.name}</p>
      <p className='mt-3 max-w-md text-sm leading-relaxed text-navy/80'>
        {siteConfig.addressDetail}
      </p>
      <p className='mt-2 text-sm font-medium'>{siteConfig.address}</p>
      <p className='mt-1 text-sm'>{siteConfig.phone}</p>
      <Link
        href='/contact'
        className='mt-6 inline-flex w-fit items-center justify-center rounded-full border border-navy px-5 py-2 text-[11px] tracking-[0.16em] uppercase transition-colors hover:bg-navy hover:text-white'
      >
        View on map
      </Link>
    </div>
  );
}
