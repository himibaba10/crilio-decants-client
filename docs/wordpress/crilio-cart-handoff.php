<?php
/**
 * Plugin Name: Crilio Cart Handoff
 * Description: Accepts ?add-to-cart-custom=parent:variation:qty,... from the Next.js storefront and redirects to WooCommerce checkout (COD).
 * Version: 1.0.0
 *
 * Install: copy to wp-content/mu-plugins/crilio-cart-handoff.php
 * (Create the mu-plugins folder if it does not exist.)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Blueprint §5 — Cart handoff from headless Next.js.
 *
 * Example:
 *   https://crilio-decants.local/?add-to-cart-custom=15:19:1,15:20:2
 */
add_action(
	'wp_loaded',
	function () {
		if ( empty( $_GET['add-to-cart-custom'] ) || ! function_exists( 'WC' ) ) {
			return;
		}

		$raw = wp_unslash( $_GET['add-to-cart-custom'] );
		if ( ! is_string( $raw ) || $raw === '' ) {
			return;
		}

		if ( null === WC()->cart ) {
			wc_load_cart();
		}

		WC()->cart->empty_cart();

		$chunks = array_filter( array_map( 'trim', explode( ',', $raw ) ) );

		foreach ( $chunks as $chunk ) {
			$parts = array_map( 'trim', explode( ':', $chunk ) );
			if ( count( $parts ) < 3 ) {
				continue;
			}

			$product_id   = absint( $parts[0] );
			$variation_id = absint( $parts[1] );
			$quantity     = max( 1, absint( $parts[2] ) );

			if ( $product_id <= 0 ) {
				continue;
			}

			if ( $variation_id > 0 ) {
				$variation = wc_get_product( $variation_id );
				$attrs     = ( $variation && $variation->is_type( 'variation' ) )
					? $variation->get_variation_attributes()
					: array();
				WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $attrs );
			} else {
				WC()->cart->add_to_cart( $product_id, $quantity );
			}
		}

		wp_safe_redirect( wc_get_checkout_url() );
		exit;
	},
	20
);
