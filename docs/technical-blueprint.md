# Technical Blueprint: Headless Perfume Decant Store

**Project Lead:** Ferdous Ahmed

This document serves as the official technical specification for the headless e-commerce build. The system utilizes Next.js for a high-performance frontend storefront and WordPress/WooCommerce as the backend data engine and checkout processor.

## 1. Technology Stack & Hosting

* **Frontend Framework:** Next.js (App Router for SSR/ISR), deployed to Vercel.
* **Styling & UI Components:** Tailwind CSS and shadcn/ui.
* **Backend CMS & E-commerce:** WordPress with WooCommerce, hosted on a Spaceship shared server subdomain.
* **API Layer:** WPGraphQL.
* **Payment Gateway:** Cash on Delivery (COD) configured natively in WooCommerce.

## 2. Essential WordPress Plugins

Install this lean stack on the Spaceship WordPress installation to enable the headless architecture. *(Notes: The "Headless Mode" plugin is intentionally excluded to prevent routing conflicts with native WooCommerce checkout pages. **WPGraphQL CORS is also excluded** — whitelist the Vercel production domain and `localhost:3000` with a small custom PHP snippet instead; see §6a.)*

* **WooCommerce:** The core e-commerce engine.
* **WPGraphQL:** Converts the WordPress database into a modern GraphQL server.
* **WPGraphQL WooCommerce (WooGraphQL):** Exposes variable products (decants), prices, categories, and stock statuses to the GraphQL schema.

## 3. Data Fetching & State Management

* **API Client:** Use the native Next.js `fetch` API for all GraphQL queries. Do not install heavy clients like Apollo. Leverage Next.js App Router caching for optimal performance.
* **Cart State:** Implement React Context to manage the cart globally. The Context must track an array of objects containing the `productId`, `variationId`, `quantity`, and `price`.
* **Hydration:** The Context Provider must use a `useEffect` hook to sync the cart state with the browser's `localStorage` so items persist across page refreshes.

## 4. Page Responsibility Matrix

| Page / Feature | Platform | Technical Details |
| --- | --- | --- |
| **Homepage & Catalog** | Next.js | Static generation (SSG). Implements UI for **Price** and **Category** filters using native WooCommerce taxonomy data fetched via GraphQL. |
| **Product Details (PDP)** | Next.js | Client-side state for 3ml, 5ml, 10ml variant selection. Updates displayed price dynamically based on selected variation. |
| **Cart Drawer** | Next.js | Reads from React Context. Stores specific Variation IDs and quantities. |
| **Checkout & Payments** | WooCommerce | Hosted on Spaceship secure subdomain; styled with custom CSS to match Next.js. Processes Cash on Delivery (COD). |
| **My Account** | WooCommerce | Native session handling for login, orders, and addresses. |

## 5. Cart Handoff Protocol: Custom PHP Execution

**Instructions for AI Agent:** To transition the user from Next.js to WooCommerce with multiple decants (Variable Products) in their cart, implement the following custom PHP logic in the WordPress theme's `functions.php` file. Do not use standard multi-cart plugins, as they fail to process WooCommerce variation IDs.

* **URL Structure:** The Next.js frontend will construct a redirect URL containing a custom parameter with a comma-separated list of items formatted as `parent_id:variation_id:quantity`. Example: `https://checkout.yourperfume.com/?add-to-cart-custom=100:102:1,200:205:2`
* **The PHP Hook:** Write a function hooked to `wp_loaded` that listens for the `$_GET['add-to-cart-custom']` parameter.
* **The Logic:**
  1. Verify the parameter exists and clear the existing server-side cart using `WC()->cart->empty_cart();` to prevent duplicate entries from previous abandoned sessions.
  2. Explode the string by commas to get individual items.
  3. Loop through the items, exploding each by the colon to extract the `$product_id`, `$variation_id`, and `$quantity`.
  4. Invoke the native WooCommerce function: `WC()->cart->add_to_cart( $product_id, $quantity, $variation_id );`
* **The Redirect:** Once the loop concludes, execute a `wp_safe_redirect( wc_get_checkout_url() );` followed by `exit;` to send the user directly to the COD payment form.

## 6. Headless Traffic Routing: Custom PHP Execution

**Instructions for AI Agent:** To ensure search engines and users do not see the default WordPress theme, but can still access secure WooCommerce transactional pages, implement this smart redirect in `functions.php`.

* **The PHP Hook:** Write a function hooked to `template_redirect`.
* **The Logic:** Write a conditional statement that checks the current page request.
* If the request is for the WordPress Admin (`is_admin()`), the Cart (`is_cart()`), Checkout (`is_checkout()`), My Account (`is_account_page()`), an AJAX request (`wp_doing_ajax()`), or a GraphQL API endpoint, **do nothing** (allow the page to load natively).
* For all other frontend requests (like the blog, homepage, or standard product URLs), execute a 301 redirect to the main Vercel Next.js domain (`wp_redirect('https://yourperfume.com', 301); exit;`).

## 6a. GraphQL CORS: Custom PHP Execution

**Instructions for AI Agent:** Do **not** install WPGraphQL CORS. Add a small whitelist in `functions.php` (or an mu-plugin) so browser-origin requests from the Vercel storefront and local dev can hit `/graphql`.

* **Allowed origins:** production Vercel domain (e.g. `https://yourperfume.com`) and `http://localhost:3000`.
* **Hook:** Prefer WPGraphQL’s `graphql_response_headers_to_send` filter when available; otherwise send `Access-Control-Allow-Origin` / related headers on GraphQL requests only (including OPTIONS preflight).
* **Do not** use `Access-Control-Allow-Origin: *` in production. Reflect only whitelisted origins.
* **Note:** Next.js Server Component / Route Handler `fetch` to WPGraphQL is server-to-server and does not require CORS; this snippet covers browser-side GraphQL (devtools, future client fetches, etc.).

## 7. Inventory Sync & Cache Revalidation

**Instructions for AI Agent:** Because Next.js statically caches product pages, the system requires a webhook to ensure stock statuses (especially for low-inventory decants) remain accurate without manual rebuilds.

* **Next.js API Route:** Create a Next.js Route Handler (e.g., `/api/revalidate`) that accepts a POST request and utilizes `revalidatePath` or `revalidateTag` for the specific product slug or global catalog. Secure this endpoint with a secret token.
* **WordPress Webhook:** Configure a native WooCommerce Webhook (found under WooCommerce > Settings > Advanced > Webhooks).
* **Trigger:** Set the webhook to fire on "Product updated" and "Order created" events, pointing the payload to the Next.js `/api/revalidate` URL to instantly bust the cache whenever a decant size is purchased or edited.
