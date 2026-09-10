import Image from 'next/image';
import Link from 'next/link';

type CategoryCardProps = {
  name: string;
  slug: string;
  image: string;
  tone: string;
};

export function CategoryCard({ name, slug, image, tone }: CategoryCardProps) {
  return (
    <Link href={`/shop?category=${slug}`} className='group block'>
      <div
        className={`relative aspect-4/5 overflow-hidden rounded-2xl bg-linear-to-b shadow-soft ${tone}`}
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes='(max-width: 640px) 100vw, 33vw'
          className='object-cover transition-transform duration-700 group-hover:scale-105'
        />
        <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-navy/70 to-transparent p-4 pt-16'>
          <span className='inline-flex min-w-28 items-center justify-center rounded-full border border-gold/50 bg-navy/90 px-4 py-2 text-[11px] tracking-[0.22em] text-white uppercase shadow-soft'>
            {name}
          </span>
        </div>
      </div>
    </Link>
  );
}
