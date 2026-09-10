import { Star } from 'lucide-react';

type TestimonialCardProps = {
  name: string;
  quote: string;
};

export function TestimonialCard({ name, quote }: TestimonialCardProps) {
  return (
    <figure className='w-[min(85vw,320px)] shrink-0 snap-start rounded-2xl bg-linear-to-br from-gold to-[#b8922c] p-6 text-navy shadow-soft-md'>
      <div className='mb-3 flex gap-0.5 text-navy/80'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className='size-3.5 fill-current' />
        ))}
      </div>
      <blockquote className='min-h-24 text-sm leading-relaxed'>
        “{quote}”
      </blockquote>
      <figcaption className='mt-5 border-t border-navy/15 pt-3 font-heading text-lg'>
        {name}
      </figcaption>
    </figure>
  );
}
