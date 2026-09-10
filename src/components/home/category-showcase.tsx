import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/lib/site"

export function CategoryShowcase() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
        {siteConfig.categoryShowcase.map((category) => (
          <Link
            key={category.slug}
            href={`/shop?category=${category.slug}`}
            className="group block"
          >
            <div
              className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-b shadow-soft ${category.tone}`}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/70 to-transparent p-4 pt-16">
                <span className="inline-flex min-w-28 items-center justify-center rounded-full border border-gold/50 bg-navy/90 px-4 py-2 text-[11px] tracking-[0.22em] text-white uppercase shadow-soft">
                  {category.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
