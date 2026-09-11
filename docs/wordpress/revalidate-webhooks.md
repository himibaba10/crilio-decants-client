# WooCommerce → Next.js cache revalidation

Blueprint §7. Busts Next.js ISR / `unstable_cache` when products or stock change.

## Endpoint

`POST /api/revalidate`

Auth (pick one):

- Query: `?secret=<REVALIDATE_SECRET>`
- Header: `x-revalidate-secret: <REVALIDATE_SECRET>`
- Header: `Authorization: Bearer <REVALIDATE_SECRET>`

Set `REVALIDATE_SECRET` in Vercel (and `.env.local` for local tests). Use a long random string.

## WooCommerce webhooks

**WooCommerce → Settings → Advanced → Webhooks → Add webhook**

Create **two** (or more) webhooks:

### 1. Product changes

| Field | Value |
| --- | --- |
| Name | Next.js revalidate — product |
| Status | Active |
| Topic | Product updated *(also add Product created / Product deleted if offered)* |
| Delivery URL | `https://YOUR-VERCEL-DOMAIN/api/revalidate?secret=YOUR_SECRET` |
| Secret | optional (auth is via the URL query) |
| API Version | WP REST API Integration v3 |

Repeat for **Product created** and **Product deleted** if you want new/removed products to clear instantly (recommended).

### 2. Orders (stock)

| Field | Value |
| --- | --- |
| Name | Next.js revalidate — order |
| Status | Active |
| Topic | Order created |
| Delivery URL | same URL as above |

Optional: also **Order updated** if you restock / cancel often.

When a product payload includes `slug`, Next clears `product:{slug}` plus the shared `catalog` / `shop` tags. Orders clear catalog/shop (all stock-sensitive lists).

## Manual test

```bash
curl -X POST "http://localhost:3000/api/revalidate?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"slug\":\"vampire-blood-perfume-oil\"}"
```

Or bust the whole catalog:

```bash
curl -X POST "http://localhost:3000/api/revalidate?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d "{}"
```

Expect `{ "revalidated": true, "tags": ["catalog","shop",...], ... }`.

## Notes

- Delivery URL must be publicly reachable from Spaceship (use the Vercel URL, not localhost).
- For local webhook testing, use a tunnel (ngrok / Cloudflare Tunnel) pointed at `localhost:3000`.
- Time-based ISR (`revalidate = 60`) remains a safety net if a webhook fails.
