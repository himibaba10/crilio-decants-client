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

Create **four** webhooks (same URL + Secret, different Topic):

| Field | Value |
| --- | --- |
| Name | `Next.js revalidate — product created` (etc.) |
| Status | **Active** |
| Topic | Product created / Product updated / Product deleted / Order created |
| Delivery URL | `https://crilio-decants-client.vercel.app/api/revalidate` |
| Secret | **exactly** your `REVALIDATE_SECRET` (replace Woo’s auto-generated value) |
| API Version | WP REST API Integration v3 |

Woo always auto-fills Secret if you leave it blank — that’s normal. **Overwrite it** with the same string you set in Vercel / `.env.local`.

Do **not** put `?secret=` in the Delivery URL when using the Secret field (HMAC). Query-string auth still works for manual `curl` tests.


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

- Delivery URL must be publicly reachable from Spaceship
  (`https://crilio-decants-client.vercel.app/...`, not localhost).
- For local webhook testing, use a tunnel (ngrok / Cloudflare Tunnel) pointed at `localhost:3000`.
- Time-based ISR (`revalidate = 60`) remains a safety net if a webhook fails.

## Production storefront

- Storefront: `https://crilio-decants-client.vercel.app`
- Set Vercel env `REVALIDATE_SECRET` to the same value used in the webhook URL.
- On WordPress (`wp-config.php`):

```php
define( 'CRILIO_STOREFRONT_URL', 'https://crilio-decants-client.vercel.app' );
```
