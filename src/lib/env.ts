/**
 * Typed accessors for public env. Server-only secrets stay on process.env.
 * Replace placeholder URLs in `.env.local` before wiring GraphQL or checkout.
 */

function requiredPublic(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required env: ${name}`)
  }
  return value
}

export const env = {
  get wordpressApiUrl() {
    return requiredPublic(
      "NEXT_PUBLIC_WORDPRESS_API_URL",
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL
    )
  },
  get checkoutUrl() {
    return requiredPublic(
      "NEXT_PUBLIC_CHECKOUT_URL",
      process.env.NEXT_PUBLIC_CHECKOUT_URL
    )
  },
  get revalidateSecret() {
    return process.env.REVALIDATE_SECRET
  },
} as const
