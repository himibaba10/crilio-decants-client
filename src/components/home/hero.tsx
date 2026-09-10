import Image from "next/image"

import { siteConfig } from "@/lib/site"

/** Full-viewport hero — background image only (no overlays). */
export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-navy" aria-label="Hero">
      <Image
        src={siteConfig.images.hero}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
    </section>
  )
}
