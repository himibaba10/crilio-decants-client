import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"

import { siteConfig } from "@/lib/site"

export function StoreLocation() {
  return (
    <section id="store-location" className="bg-[#fafafa] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-heading text-3xl tracking-tight text-navy sm:text-4xl">
          Find our stores
        </h2>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex min-h-72 flex-col justify-center rounded-2xl bg-gold p-8 text-navy shadow-soft-md sm:p-10">
            <MapPin className="mb-4 size-8" aria-hidden />
            <p className="font-heading text-2xl">Visit Crilio</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-navy/80">
              {siteConfig.addressDetail}
            </p>
            <p className="mt-2 text-sm font-medium">{siteConfig.address}</p>
            <p className="mt-1 text-sm">{siteConfig.phone}</p>
            <Link
              href="/contact"
              className="mt-6 inline-flex w-fit items-center justify-center rounded-full border border-navy px-5 py-2 text-[11px] tracking-[0.16em] uppercase transition-colors hover:bg-navy hover:text-white"
            >
              View on map
            </Link>
          </div>

          <div className="relative min-h-72 overflow-hidden rounded-2xl shadow-soft-md">
            <Image
              src={siteConfig.images.store}
              alt="Crilio storefront"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
