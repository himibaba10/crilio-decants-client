import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '@/lib/site';

export function WhyChoose() {
  const { whyChoose } = siteConfig;

  return (
    <section className='bg-[#f3eadc] py-16 sm:py-20'>
      <div className='mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8'>
        <div className='space-y-5'>
          <h2 className='font-heading text-3xl tracking-tight text-navy uppercase sm:text-5xl'>
            {whyChoose.title}
          </h2>
          <p className='max-w-xl text-base leading-relaxed text-navy/75'>
            {whyChoose.body}
          </p>
          <Link
            href='/shop'
            className='inline-flex h-11 items-center justify-center rounded-full bg-navy px-6 text-[11px] tracking-[0.2em] text-white uppercase shadow-soft transition-colors hover:bg-navy-deep'
          >
            Shop decants
          </Link>
        </div>

        <div className='relative min-h-80 overflow-hidden rounded-2xl shadow-soft-md lg:min-h-104'>
          <Image
            src={siteConfig.images.whyChoose}
            alt={`${siteConfig.name} perfume arrangement`}
            fill
            sizes='(max-width: 1024px) 100vw, 50vw'
            className='object-cover'
          />
        </div>
      </div>
    </section>
  );
}
