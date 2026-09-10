import Image from "next/image"
import Link from "next/link"

import { ProductCard } from "@/components/catalog/product-card"
import { productsInCategory } from "@/lib/catalog"
import { siteConfig } from "@/lib/site"
import type { HomeProduct } from "@/types/home"

type CollectionsProps = {
  products: HomeProduct[]
}

export function Collections({ products }: CollectionsProps) {
  return (
    <section className="bg-[#fafafa] py-16">
      <div className="mx-auto max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl tracking-tight text-navy sm:text-4xl">
            Our perfume collections
          </h2>
        </div>

        {siteConfig.collectionBanners.map((collection) => {
          const categoryProducts = productsInCategory(products, collection.slug).slice(
            0,
            4
          )
          const fallback =
            categoryProducts.length > 0
              ? categoryProducts
              : products.slice(0, 4)

          return (
            <div
              key={collection.slug}
              className="grid gap-4 lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr]"
            >
              <Link
                href={`/shop?category=${collection.slug}`}
                className="relative min-h-72 overflow-hidden rounded-2xl bg-navy shadow-soft lg:min-h-full"
              >
                <Image
                  src={collection.banner}
                  alt={collection.name}
                  fill
                  sizes="260px"
                  className="object-cover opacity-80 transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-heading text-2xl tracking-[0.12em] text-gold uppercase">
                    {collection.name}
                  </p>
                  <p className="mt-1 text-[11px] tracking-[0.18em] text-white/75 uppercase">
                    View collection
                  </p>
                </div>
              </Link>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {fallback.length > 0 ? (
                  fallback.map((product, index) => (
                    <ProductCard
                      key={`${collection.slug}-${product.databaseId}`}
                      product={product}
                      fallbackImage={
                        [
                          "/images/home/perfume-1.jpg",
                          "/images/home/perfume-2.jpg",
                          "/images/home/perfume-3.jpg",
                          "/images/home/category-fresh.jpg",
                        ][index % 4]
                      }
                    />
                  ))
                ) : (
                  <p className="col-span-full self-center text-sm text-ink/70">
                    Products for {collection.name} will appear here soon.
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
