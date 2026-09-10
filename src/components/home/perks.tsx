import { PackageCheck, Truck, Wallet } from "lucide-react"

import { siteConfig } from "@/lib/site"

const icons = [PackageCheck, Truck, Wallet]

export function Perks() {
  return (
    <section className="border-y border-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
        {siteConfig.perks.map((perk, index) => {
          const Icon = icons[index] ?? PackageCheck
          return (
            <div
              key={perk.title}
              className="flex items-center gap-4 rounded-2xl border border-border/60 bg-[#fafafa] px-4 py-4 text-left shadow-soft sm:justify-center sm:text-center lg:justify-start lg:text-left"
            >
              <Icon className="size-8 shrink-0 text-gold" aria-hidden />
              <div>
                <p className="font-medium text-navy">{perk.title}</p>
                <p className="text-sm text-ink/70">{perk.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
