import { createHmac, timingSafeEqual } from "crypto"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

/**
 * On-demand cache bust for WooCommerce → Next.js (blueprint §7).
 *
 * Auth (any one):
 * - WooCommerce webhook HMAC: header `X-WC-Webhook-Signature`
 *   (Delivery URL without query; Secret field = REVALIDATE_SECRET)
 * - `?secret=` matching REVALIDATE_SECRET
 * - Header `x-revalidate-secret: <secret>`
 * - Header `Authorization: Bearer <secret>`
 *
 * Recommended WooCommerce setup:
 *   Delivery URL: https://crilio-decants-client.vercel.app/api/revalidate
 *   Secret:       same value as REVALIDATE_SECRET on Vercel
 *   Topics:       Product created/updated/deleted, Order created
 */

function getConfiguredSecret(): string | undefined {
  const secret = process.env.REVALIDATE_SECRET?.trim()
  return secret || undefined
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

function isAuthorized(
  request: NextRequest,
  secret: string,
  rawBody: string,
): boolean {
  const query = request.nextUrl.searchParams.get("secret")
  if (query && safeEqual(query, secret)) return true

  const headerSecret = request.headers.get("x-revalidate-secret")
  if (headerSecret && safeEqual(headerSecret, secret)) return true

  const auth = request.headers.get("authorization")
  if (auth) {
    const match = /^Bearer\s+(.+)$/i.exec(auth.trim())
    if (match?.[1] && safeEqual(match[1], secret)) return true
  }

  // Native WooCommerce webhook signature (HMAC-SHA256, base64).
  const signature = request.headers.get("x-wc-webhook-signature")
  if (signature) {
    const expected = createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("base64")
    if (safeEqual(signature, expected)) return true
  }

  return false
}

function expireTag(tag: string) {
  // Immediate expire — required for external webhooks (Next.js 16+)
  revalidateTag(tag, { expire: 0 })
}

function readSlug(body: Record<string, unknown>): string | null {
  if (typeof body.slug === "string" && body.slug.trim()) {
    return body.slug.trim()
  }

  const nested = body.product
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    const slug = (nested as Record<string, unknown>).slug
    if (typeof slug === "string" && slug.trim()) return slug.trim()
  }

  return null
}

export async function POST(request: NextRequest) {
  const secret = getConfiguredSecret()
  if (!secret) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET is not configured" },
      { status: 500 },
    )
  }

  const rawBody = await request.text()

  if (!isAuthorized(request, secret, rawBody)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const topic = request.headers.get("x-wc-webhook-topic") ?? ""

  // WooCommerce sends this when you first save a webhook.
  if (topic === "action.woocommerce_webhook_ping") {
    return NextResponse.json({ ok: true, ping: true })
  }

  let body: Record<string, unknown> = {}
  if (rawBody.trim()) {
    try {
      body = JSON.parse(rawBody) as Record<string, unknown>
    } catch {
      body = {}
    }
  }

  const tags = new Set<string>(["catalog", "shop"])
  const paths = new Set<string>(["/", "/shop"])

  const slug = readSlug(body)
  if (slug) {
    tags.add(`product:${slug}`)
    paths.add(`/product/${slug}`)
  }

  if (Array.isArray(body.tags)) {
    for (const tag of body.tags) {
      if (typeof tag === "string" && tag.trim()) {
        tags.add(tag.trim())
      }
    }
  }

  for (const tag of tags) {
    expireTag(tag)
  }
  for (const path of paths) {
    revalidatePath(path)
  }

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    topic: topic || undefined,
    slug: slug || undefined,
    tags: [...tags],
    paths: [...paths],
  })
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405, headers: { Allow: "POST" } },
  )
}
