import Image from 'next/image';
import Link from 'next/link';

type CollectionBannerProps = {
  name: string;
  slug: string;
  banner: string;
};

export function CollectionBanner({
  name,
  slug,
  banner,
}: CollectionBannerProps) {
  return (
    <Link
      href={`/shop?category=${slug}`}
      className='relative min-h-72 overflow-hidden rounded-2xl bg-navy shadow-soft lg:min-h-full'
    >
      <Image
        src={banner}
        alt={name}
        fill
        sizes='260px'
        className='object-cover opacity-80 transition-transform duration-700 hover:scale-105'
      />
      <div className='absolute inset-0 bg-linear-to-t from-navy/80 via-navy/20 to-transparent' />
      <div className='absolute inset-x-0 bottom-0 p-5'>
        <p className='font-heading text-2xl tracking-[0.12em] text-gold uppercase'>
          {name}
        </p>
        <p className='mt-1 text-[11px] tracking-[0.18em] text-white/75 uppercase'>
          View collection
        </p>
      </div>
    </Link>
  );
}
