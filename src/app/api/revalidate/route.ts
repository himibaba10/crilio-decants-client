import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

/**
 * On-demand cache bust for WooCommerce → Next.js (blueprint §7).
 *
 * Auth (any one):
 * - `?secret=` matching REVALIDATE_SECRET
 * - Header `x-revalidate-secret: <secret>`
 * - Header `Authorization: Bearer <secret>`
 *
 * WooCommerce webhooks should POST to:
 *   https://<storefront>/api/revalidate?secret=<REVALIDATE_SECRET>
 *
 * Topics: Product created/updated/deleted, Order created/updated
 */

function getConfiguredSecret(): string | undefined {
  const secret = process.env.REVALIDATE_SECRET?.trim()
  return secret || undefined
}

function isAuthorized(request: NextRequest, secret: string): boolean {
  const query = request.nextUrl.searchParams.get("secret")
  if (query && query === secret) return true

  const headerSecret = request.headers.get("x-revalidate-secret")
  if (headerSecret && headerSecret === secret) return true

  const auth = request.headers.get("authorization")
  if (auth) {
    const match = /^Bearer\s+(.+)$/i.exec(auth.trim())
    if (match?.[1] === secret) return true
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

  if (!isAuthorized(request, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const topic = request.headers.get("x-wc-webhook-topic") ?? ""

  // WooCommerce sends this when you first save a webhook.
  if (topic === "action.woocommerce_webhook_ping") {
    return NextResponse.json({ ok: true, ping: true })
  }

  let body: Record<string, unknown> = {}
  try {
    const text = await request.text()
    if (text.trim()) {
      body = JSON.parse(text) as Record<string, unknown>
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
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
