<?php
/**
 * Plugin Name: Crilio Headless Bridge
 * Description: Brands WooCommerce checkout/account to match Crilio, routes stray WP traffic to the Next.js storefront, and whitelists GraphQL CORS.
 * Version: 1.0.0
 *
 * Install: copy to wp-content/mu-plugins/crilio-headless-bridge.php
 *
 * Configure (wp-config.php or here):
 *   define( 'CRILIO_STOREFRONT_URL', 'https://yourperfume.com' );
 * Local default is http://localhost:3000
 */

if (!defined('ABSPATH')) {
	exit;
}

if (!defined('CRILIO_STOREFRONT_URL')) {
	define('CRILIO_STOREFRONT_URL', 'http://localhost:3000');
}

/**
 * Storefront origin helper (no trailing slash).
 */
function crilio_storefront_url($path = '')
{
	$base = untrailingslashit(CRILIO_STOREFRONT_URL);
	$path = ltrim((string) $path, '/');
	return $path ? $base . '/' . $path : $base;
}

/**
 * Checkout / cart / my-account surfaces we keep on WordPress.
 */
function crilio_is_commerce_surface()
{
	if (!function_exists('is_woocommerce')) {
		return false;
	}

	return is_checkout() || is_cart() || is_account_page();
}

/**
 * Blueprint §6 — send non-commerce WP frontend traffic to Next.js.
 */
add_action(
	'template_redirect',
	function () {
		if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
			return;
		}

		$request_uri = isset($_SERVER['REQUEST_URI']) ? (string) wp_unslash($_SERVER['REQUEST_URI']) : '';

		// Allow GraphQL, login, and core WP entry points.
		$passthrough = array('/graphql', 'wp-login.php', 'wp-admin', 'wp-cron.php', 'xmlrpc.php');
		foreach ($passthrough as $needle) {
			if (false !== strpos($request_uri, $needle)) {
				return;
			}
		}

		if (function_exists('is_checkout') && (is_checkout() || is_cart() || is_account_page())) {
			return;
		}

		// Keep REST + WC API available.
		if (defined('REST_REQUEST') && REST_REQUEST) {
			return;
		}

		if (is_preview()) {
			return;
		}

		// Allow handoff query (cart handoff runs on wp_loaded, then redirects to checkout).
		if (!empty($_GET['add-to-cart-custom'])) {
			return;
		}

		wp_redirect(crilio_storefront_url(), 301);
		exit;
	},
	1
);

/**
 * Allowed browser origins for GraphQL CORS.
 *
 * @return string[]
 */
function crilio_allowed_origins()
{
	return array_values(
		array_filter(
			array_unique(
				array(
					untrailingslashit(CRILIO_STOREFRONT_URL),
					'http://localhost:3000',
					'http://127.0.0.1:3000',
				)
			)
		)
	);
}

/**
 * Blueprint §6a — GraphQL CORS whitelist (no WPGraphQL CORS plugin).
 */
add_filter(
	'graphql_response_headers_to_send',
	function ($headers) {
		$origin = isset($_SERVER['HTTP_ORIGIN']) ? esc_url_raw(wp_unslash($_SERVER['HTTP_ORIGIN'])) : '';

		if ($origin && in_array(untrailingslashit($origin), crilio_allowed_origins(), true)) {
			$headers['Access-Control-Allow-Origin'] = $origin;
			$headers['Access-Control-Allow-Credentials'] = 'true';
			$headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
			$headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type, X-WP-Nonce';
			$headers['Vary'] = 'Origin';
		}

		return $headers;
	}
);

/**
 * Answer GraphQL OPTIONS preflight for whitelisted origins.
 */
add_action(
	'init',
	function () {
		$request_uri = isset($_SERVER['REQUEST_URI']) ? (string) wp_unslash($_SERVER['REQUEST_URI']) : '';
		$method = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string) $_SERVER['REQUEST_METHOD']) : '';

		if ('OPTIONS' !== $method || false === strpos($request_uri, '/graphql')) {
			return;
		}

		$origin = isset($_SERVER['HTTP_ORIGIN']) ? esc_url_raw(wp_unslash($_SERVER['HTTP_ORIGIN'])) : '';
		if (!$origin || !in_array(untrailingslashit($origin), crilio_allowed_origins(), true)) {
			status_header(403);
			exit;
		}

		header('Access-Control-Allow-Origin: ' . $origin);
		header('Access-Control-Allow-Credentials: true');
		header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
		header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
		header('Vary: Origin');
		status_header(204);
		exit;
	},
	1
);

/**
 * Enqueue Crilio commerce skin + hide default theme chrome.
 */
add_action(
	'wp_enqueue_scripts',
	function () {
		if (!crilio_is_commerce_surface()) {
			return;
		}

		$css = <<<'CSS'
:root {
  --crilio-navy: #0a1d37;
  --crilio-navy-deep: #061326;
  --crilio-gold: #d4af37;
  --crilio-gold-soft: #e6c96a;
  --crilio-ink: #1a1a1a;
}

/* Hide default block/classic theme header & footer on commerce pages */
body.crilio-commerce .wp-site-blocks > header,
body.crilio-commerce .wp-site-blocks > footer,
body.crilio-commerce header.wp-block-template-part,
body.crilio-commerce footer.wp-block-template-part,
body.crilio-commerce .site-header,
body.crilio-commerce .site-footer,
body.crilio-commerce #masthead,
body.crilio-commerce #colophon,
body.crilio-commerce nav.woocommerce-breadcrumb {
  display: none !important;
}

body.crilio-commerce {
  background: #fafafa !important;
  color: var(--crilio-ink);
  font-family: Poppins, ui-sans-serif, system-ui, sans-serif !important;
  padding-top: 5.5rem;
  padding-bottom: 4rem;
}

.crilio-topbar {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--crilio-navy);
  border-bottom: 1px solid rgba(212, 175, 55, 0.4);
  box-shadow: 0 8px 30px rgb(10 29 55 / 12%);
}

.crilio-topbar a {
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 500;
}

.crilio-topbar a:hover {
  color: var(--crilio-gold);
}

.crilio-topbar__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: #fff !important;
  letter-spacing: 0.2em;
  font-weight: 600;
}

.crilio-topbar__brand img {
  height: 36px;
  width: auto;
  display: block;
}

.crilio-topbar__nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.85rem 1.25rem;
}

.crilio-topbar__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.25rem;
  padding: 0 1rem;
  border-radius: 999px;
  background: var(--crilio-gold);
  color: var(--crilio-navy) !important;
  font-weight: 600;
}

.crilio-topbar__cta:hover {
  background: var(--crilio-gold-soft);
  color: var(--crilio-navy) !important;
}

.crilio-footerbar {
  margin: 3rem auto 0;
  max-width: 960px;
  padding: 1.25rem 1rem 0;
  text-align: center;
  color: #667085;
  font-size: 0.85rem;
}

.crilio-footerbar a {
  color: var(--crilio-navy);
  font-weight: 600;
  text-decoration: none;
}

body.crilio-commerce .woocommerce,
body.crilio-commerce .woocommerce-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem 1rem 0;
}

body.crilio-commerce h1,
body.crilio-commerce h2,
body.crilio-commerce .woocommerce-MyAccount-navigation,
body.crilio-commerce .woocommerce-account .woocommerce h2 {
  color: var(--crilio-navy);
}

/* Woo still uses float:left 30% / float:right 68% — kill that or pills look crushed */
body.crilio-commerce .woocommerce-account .woocommerce::before,
body.crilio-commerce .woocommerce-account .woocommerce::after {
  content: none !important;
  display: none !important;
}

body.crilio-commerce .woocommerce-MyAccount-navigation,
body.crilio-commerce .woocommerce-MyAccount-content {
  float: none !important;
  width: 100% !important;
}

body.crilio-commerce .woocommerce-MyAccount-navigation {
  margin: 0 0 1.25rem !important;
}

body.crilio-commerce .woocommerce-MyAccount-navigation ul {
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: wrap !important;
  gap: 0.5rem !important;
}

body.crilio-commerce .woocommerce-MyAccount-navigation li {
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
  display: block !important;
  float: none !important;
  width: auto !important;
}

body.crilio-commerce .woocommerce-MyAccount-navigation a {
  display: inline-flex !important;
  align-items: center;
  padding: 0.55rem 0.9rem !important;
  border-radius: 999px !important;
  border: 1px solid #e5e7eb !important;
  background: #fff !important;
  color: var(--crilio-navy) !important;
  text-decoration: none !important;
  font-size: 0.85rem !important;
  line-height: 1.2 !important;
}

body.crilio-commerce .woocommerce-MyAccount-navigation .is-active a,
body.crilio-commerce .woocommerce-MyAccount-navigation a:hover {
  border-color: var(--crilio-gold) !important;
  background: rgba(212, 175, 55, 0.12) !important;
  color: var(--crilio-navy) !important;
}

body.crilio-commerce form.woocommerce-form-login,
body.crilio-commerce form.woocommerce-form-register,
body.crilio-commerce .woocommerce-checkout,
body.crilio-commerce .woocommerce-cart-form,
body.crilio-commerce .cart-collaterals,
body.crilio-commerce .woocommerce-MyAccount-content {
  background: #fff;
  border: 1px solid rgba(10, 29, 55, 0.08);
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 8px 30px rgb(10 29 55 / 6%);
}

body.crilio-commerce .woocommerce form .form-row input.input-text,
body.crilio-commerce .woocommerce form .form-row textarea,
body.crilio-commerce .woocommerce form .form-row select,
body.crilio-commerce #account_email,
body.crilio-commerce #username,
body.crilio-commerce #password {
  border-radius: 0.65rem;
  border: 1px solid #d0d5dd;
  min-height: 2.6rem;
  padding: 0.55rem 0.75rem;
}

body.crilio-commerce .woocommerce button.button,
body.crilio-commerce .woocommerce a.button,
body.crilio-commerce .woocommerce #place_order,
body.crilio-commerce .woocommerce input.button {
  background: var(--crilio-gold) !important;
  color: var(--crilio-navy) !important;
  border: 0 !important;
  border-radius: 999px !important;
  font-weight: 600 !important;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.8rem 1.25rem !important;
}

body.crilio-commerce .woocommerce button.button:hover,
body.crilio-commerce .woocommerce a.button:hover,
body.crilio-commerce .woocommerce #place_order:hover {
  background: var(--crilio-gold-soft) !important;
}

body.crilio-commerce .woocommerce-info,
body.crilio-commerce .woocommerce-message,
body.crilio-commerce .woocommerce-error {
  border-radius: 0.75rem;
  border-top: 0;
  border-left: 3px solid var(--crilio-gold);
  background: #fff;
  box-shadow: 0 4px 16px rgb(10 29 55 / 6%);
}

@media (max-width: 640px) {
  .crilio-topbar {
    flex-direction: column;
    align-items: flex-start;
    min-height: auto;
    padding: 0.85rem 1rem;
  }
  body.crilio-commerce {
    padding-top: 7.5rem;
  }
}
CSS;

		wp_register_style('crilio-commerce-skin', false, array(), '1.0.0');
		wp_enqueue_style('crilio-commerce-skin');
		wp_add_inline_style('crilio-commerce-skin', $css);

		wp_enqueue_style(
			'crilio-poppins',
			'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
			array(),
			null
		);
	},
	40
);

add_filter(
	'body_class',
	function ($classes) {
		if (crilio_is_commerce_surface()) {
			$classes[] = 'crilio-commerce';
		}
		return $classes;
	}
);

/**
 * Inject branded top bar on commerce pages.
 */
function crilio_render_topbar()
{
	static $done = false;

	if ($done || !crilio_is_commerce_surface()) {
		return;
	}
	$done = true;

	$home = esc_url(crilio_storefront_url());
	$shop = esc_url(crilio_storefront_url('shop'));
	$cart = esc_url(crilio_storefront_url('cart'));
	$logo = esc_url(crilio_storefront_url('images/brand/crilio-logo.png'));
	$account = esc_url(wc_get_page_permalink('myaccount'));
	?>
	<header class="crilio-topbar" role="banner">
		<a class="crilio-topbar__brand" href="<?php echo $home; ?>">
			<img src="<?php echo $logo; ?>" alt="Crilio Scents" width="120" height="36" />
			<span>Crilio Scents</span>
		</a>
		<nav class="crilio-topbar__nav" aria-label="Storefront">
			<a href="<?php echo $home; ?>">Home</a>
			<a href="<?php echo $shop; ?>">Shop</a>
			<a href="<?php echo $cart; ?>">Cart</a>
			<a href="<?php echo $account; ?>">Account</a>
			<a class="crilio-topbar__cta" href="<?php echo $shop; ?>">Continue shopping</a>
		</nav>
	</header>
	<?php
}

add_action('wp_body_open', 'crilio_render_topbar', 5);
// Fallback if the active theme never calls wp_body_open().
add_action('wp_footer', 'crilio_render_topbar', 1);

add_action(
	'wp_footer',
	function () {
		if (!crilio_is_commerce_surface()) {
			return;
		}
		$home = esc_url(crilio_storefront_url());
		?>
	<div class="crilio-footerbar">
		<p>Secure WooCommerce checkout for <strong>Crilio Scents</strong> · Cash on Delivery</p>
		<p><a href="<?php echo $home; ?>">← Back to storefront</a></p>
	</div>
	<?php
	},
	5
);

/**
 * After register, send customers back to the Next.js shop — not the WP dashboard.
 * They can open Account anytime from the header icon.
 */
add_filter(
	'woocommerce_registration_redirect',
	function () {
		return crilio_storefront_url('shop');
	}
);

/**
 * Decant shop has no downloadable products — hide the empty menu item.
 */
add_filter(
	'woocommerce_account_menu_items',
	function ($items) {
		unset($items['downloads']);
		return $items;
	}
);

/**
 * Friendlier My Account dashboard (overrides Woo's default template).
 */
add_filter(
	'woocommerce_locate_template',
	function ($template, $template_name) {
		if ('myaccount/dashboard.php' !== $template_name) {
			return $template;
		}

		$custom = WP_CONTENT_DIR . '/mu-plugins/crilio-templates/myaccount/dashboard.php';
		return file_exists($custom) ? $custom : $template;
	},
	20,
	2
);
