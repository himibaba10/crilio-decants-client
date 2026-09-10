<?php
/**
 * Crilio My Account dashboard override.
 *
 * Installed at: wp-content/mu-plugins/crilio-templates/myaccount/dashboard.php
 *
 * @package Crilio
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$current_user = wp_get_current_user();
$name         = $current_user->display_name ? $current_user->display_name : $current_user->user_login;
$shop_url     = function_exists( 'crilio_storefront_url' )
	? crilio_storefront_url( 'shop' )
	: home_url( '/' );
?>

<p>
	<?php
	printf(
		/* translators: 1: customer name 2: logout link */
		wp_kses_post( __( 'Welcome back, %1$s. Not you? %2$s', 'crilio' ) ),
		esc_html( $name ),
		'<a href="' . esc_url( wc_logout_url() ) . '">' . esc_html__( 'Log out', 'crilio' ) . '</a>'
	);
	?>
</p>

<p>
	<?php
	printf(
		/* translators: 1: orders url 2: addresses url 3: account details url */
		wp_kses_post( __( 'View your <a href="%1$s">orders</a>, manage <a href="%2$s">addresses</a>, or update <a href="%3$s">account details</a>.', 'crilio' ) ),
		esc_url( wc_get_account_endpoint_url( 'orders' ) ),
		esc_url( wc_get_account_endpoint_url( 'edit-address' ) ),
		esc_url( wc_get_account_endpoint_url( 'edit-account' ) )
	);
	?>
</p>

<p>
	<a class="button" href="<?php echo esc_url( $shop_url ); ?>">
		<?php esc_html_e( 'Continue shopping', 'crilio' ); ?>
	</a>
</p>

<?php
do_action( 'woocommerce_account_dashboard' );
do_action( 'woocommerce_before_my_account' );
do_action( 'woocommerce_after_my_account' );
