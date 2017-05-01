<?php
/**
 * Plugin Name:       Admin Starred Posts
 * Version:           2.0.0
 * Description: 			This plugin allows the administrators/editors/authors to mark posts with different star styles
 * Author: 						Luis Orozco
 * Author URI: 				http://innocuo.com
 * License: 					GPL2
 */

// If this file is called directly, abort.
defined( 'ABSPATH' ) or die( '' );

if(!defined('INO_STARRED_POSTS_VERSION')){
	define('INO_STARRED_POSTS_VERSION', '2.0.0');
}

//required classes
require plugin_dir_path( __FILE__ ) . 'includes/class-ino-starred-stars.php';
require plugin_dir_path( __FILE__ ) . 'includes/class-ino-starred-posts.php';
require plugin_dir_path( __FILE__ ) . 'includes/class-ino-starred-settings.php';

//set default options
function ino_stars_install(){

	$default_opt = array(
		'enabled_stars' => '1,2,7,8',
		'post_types' => array( 'post', 'page'),
		'save_type' => 'user',
		'opt_version' => 1

	);
	$opt_name = 'ino_starred_common';

	//check to see if present already
  if( !get_option( $opt_name ) ) {
        //option not found, add new
        add_option($opt_name, $default_opt );
  }
}


function ino_stars_init() {

	if(is_admin()){
		$plugin = new Ino_Starred_Posts();
		$plugin->run();

		$settings_page = new Ino_Starred_Settings();
		$settings_page->run();
	}

	register_activation_hook( __FILE__, 'ino_stars_install' );

	add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'ino_stars_plugin_list_links' );
}


function ino_stars_plugin_list_links( $links ) {
	$link = '<a href="%s">%s</a>';
	return array_merge( array(
		sprintf( $link, admin_url( 'options-general.php?page=ino-starred-settings' ) , __( 'Settings' ) )
	), $links );
}


//start the magic
ino_stars_init();
