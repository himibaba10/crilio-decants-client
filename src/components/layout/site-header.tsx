import Link from "next/link"
import { Search, ShoppingBag, UserRound } from "lucide-react"

import { accountUrl } from "@/lib/catalog"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

type SiteHeaderProps = {
  cartCount?: number
  className?: string
}

export function SiteHeader({ cartCount = 0, className }: SiteHeaderProps) {
  const accountHref = accountUrl()

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-gold/40 bg-navy text-white",
        className
      )}
    >
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
        <nav className="flex items-center gap-4 text-[11px] font-medium tracking-[0.18em] uppercase text-white/80 sm:gap-6">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden transition-colors hover:text-gold sm:inline-flex first:inline-flex"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="text-center">
          <span className="font-heading text-2xl tracking-[0.28em] text-gold uppercase sm:text-3xl">
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <Link
            href="/shop"
            aria-label="Search shop"
            className="inline-flex size-9 items-center justify-center text-white/85 transition-colors hover:text-gold"
          >
            <Search className="size-4" />
          </Link>
          <Link
            href={accountHref}
            aria-label="Account"
            className="inline-flex size-9 items-center justify-center text-white/85 transition-colors hover:text-gold"
          >
            <UserRound className="size-4" />
          </Link>
          <Link
            href="#cart"
            aria-label={`Cart, ${cartCount} items`}
            className="relative inline-flex size-9 items-center justify-center text-white/85 transition-colors hover:text-gold"
          >
            <ShoppingBag className="size-4" />
            <span className="absolute top-1 right-0.5 flex size-4 items-center justify-center rounded-full bg-gold text-[9px] font-semibold text-navy">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
