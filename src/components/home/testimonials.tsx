import { TestimonialCard } from '@/components/home/testimonial-card';
import { HorizontalCarousel } from '@/components/shared/horizontal-carousel';
import { siteConfig } from '@/lib/site';

export function Testimonials() {
  return (
    <section className='bg-white py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <HorizontalCarousel
          headerNav
          prevLabel='Previous review'
          nextLabel='Next review'
          header={
            <h2 className='font-heading text-3xl tracking-tight text-navy sm:text-4xl'>
              Our customers say
            </h2>
          }
        >
          {siteConfig.testimonials.map((item) => (
            <TestimonialCard
              key={item.name}
              name={item.name}
              quote={item.quote}
            />
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}
