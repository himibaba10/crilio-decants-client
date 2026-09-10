<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Crilio Decants

Headless Next.js storefront for a perfume **decant** shop. Backend is WordPress + WooCommerce (WPGraphQL).

- Spec: `docs/technical-blueprint.md`
- Agent rules: `.cursor/rules/` (architecture, GraphQL, cart handoff, WordPress PHP, revalidation)

**WP note:** Do not use Headless Mode or WPGraphQL CORS plugins. Use custom PHP for traffic routing (`template_redirect`), GraphQL CORS whitelist, and cart handoff (`wp_loaded`).

## Quick start

```bash
bun install
cp .env.example .env.local
bun dev
```

## Next implementation slices (not done yet)

1. Catalog + filters (SSG/ISR) via WooGraphQL
2. PDP variation picker (3ml / 5ml / 10ml)
3. Cart Context + Sheet drawer + localStorage
4. Checkout handoff redirect
5. `/api/revalidate` + WooCommerce webhooks
6. WordPress `functions.php` snippets (§5 cart handoff, §6 traffic routing, §6a CORS) — delivered separately for Spaceship
