"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

import { siteConfig } from "@/lib/site"

export function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollByCard = (direction: -1 | 1) => {
    const node = scrollerRef.current
    if (!node) return
    const amount = Math.min(node.clientWidth * 0.85, 340)
    node.scrollBy({ left: amount * direction, behavior: "smooth" })
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-heading text-3xl tracking-tight text-navy sm:text-4xl">
            Our customers say
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous review"
              onClick={() => scrollByCard(-1)}
              className="inline-flex size-9 items-center justify-center rounded-full border border-border/80 bg-white text-navy shadow-soft hover:border-gold hover:bg-gold/15"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next review"
              onClick={() => scrollByCard(1)}
              className="inline-flex size-9 items-center justify-center rounded-full border border-border/80 bg-white text-navy shadow-soft hover:border-gold hover:bg-gold/15"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {siteConfig.testimonials.map((item) => (
            <figure
              key={item.name}
              className="w-[min(85vw,320px)] shrink-0 snap-start rounded-2xl bg-gradient-to-br from-gold to-[#b8922c] p-6 text-navy shadow-soft-md"
            >
              <div className="mb-3 flex gap-0.5 text-navy/80">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="min-h-24 text-sm leading-relaxed">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-5 border-t border-navy/15 pt-3 font-heading text-lg">
                {item.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
