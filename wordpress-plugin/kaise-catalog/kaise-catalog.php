<?php
/**
 * Plugin Name: Kaise Catalog
 * Plugin URI:  https://kaise.e
 * Description: Buscador de productos Kaise con IA y filtros avanzados.
 * Version:     1.0.0
 * Author:      Sergi Mallén
 * License:     GPL-2.0-or-later
 * Text Domain: kaise-catalog
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'KAISE_CATALOG_VERSION', '1.0.7' );

// Header requerido por localtunnel para saltar la pantalla de verificación
define( 'KAISE_LT_HEADERS', [ 'headers' => [ 'bypass-tunnel-reminder' => '1' ] ] );
define( 'KAISE_CATALOG_DIR', plugin_dir_path( __FILE__ ) );
define( 'KAISE_CATALOG_URL', plugin_dir_url( __FILE__ ) );

// ─── Settings ────────────────────────────────────────────────────────────────

add_action( 'admin_menu', function () {
    add_options_page(
        'Kaise Catalog',
        'Kaise Catalog',
        'manage_options',
        'kaise-catalog',
        'kaise_catalog_settings_page'
    );
} );

add_action( 'admin_init', function () {
    register_setting( 'kaise_catalog', 'kaise_catalog_api_url' );
    register_setting( 'kaise_catalog', 'kaise_catalog_gemini_key' );
    register_setting( 'kaise_catalog', 'kaise_catalog_results_per_page' );
    register_setting( 'kaise_catalog', 'kaise_catalog_contact_url' );
} );

function kaise_catalog_settings_page() {
    ?>
    <div class="wrap">
        <h1>Kaise Catalog — Configuración</h1>
        <form method="post" action="options.php">
            <?php settings_fields( 'kaise_catalog' ); ?>
            <table class="form-table">
                <tr>
                    <th>URL de la API</th>
                    <td>
                        <input type="url" name="kaise_catalog_api_url" class="regular-text"
                            value="<?php echo esc_attr( get_option( 'kaise_catalog_api_url', 'https://api.kaise.com/api/v1' ) ); ?>" />
                        <p class="description">Ej: <code>https://api.kaise.com/api/v1</code></p>
                    </td>
                </tr>
                <tr>
                    <th>Clave Google Gemini (IA gratuita)</th>
                    <td>
                        <input type="password" name="kaise_catalog_gemini_key" class="regular-text"
                            value="<?php echo esc_attr( get_option( 'kaise_catalog_gemini_key', '' ) ); ?>" />
                        <p class="description">Gratis. Obtén tu clave en <a href="https://aistudio.google.com/app/apikey" target="_blank">aistudio.google.com/app/apikey</a>. Modelo: gemini-2.0-flash (15 peticiones/min gratis).</p>
                    </td>
                </tr>
                <tr>
                    <th>Resultados por página</th>
                    <td>
                        <input type="number" name="kaise_catalog_results_per_page" min="5" max="100"
                            value="<?php echo esc_attr( get_option( 'kaise_catalog_results_per_page', 20 ) ); ?>" />
                    </td>
                </tr>
                <tr>
                    <th>URL de contacto</th>
                    <td>
                        <input type="url" name="kaise_catalog_contact_url" class="regular-text"
                            value="<?php echo esc_attr( get_option( 'kaise_catalog_contact_url', '' ) ); ?>" />
                        <p class="description">URL de la página de contacto. Si se rellena, aparecerá el botón "Solicitar información" en la ficha de cada producto.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
        <hr>
        <h2>Uso del shortcode</h2>
        <p>Inserta en cualquier página o entrada:</p>
        <code>[kaise_catalog]</code>
        <p>Con opciones:</p>
        <code>[kaise_catalog per_page="12" show_ai="true" show_filters="true"]</code>
    </div>
    <?php
}

// ─── Assets ──────────────────────────────────────────────────────────────────
// Siempre encolar + localizar en wp_enqueue_scripts para que KaiseCatalog
// esté definido antes de que el script se ejecute (fix: ReferenceError).

add_action( 'wp_enqueue_scripts', function () {
    $ai_key = get_option( 'kaise_catalog_gemini_key', '' );

    wp_enqueue_style(
        'kaise-catalog',
        KAISE_CATALOG_URL . 'assets/kaise-catalog.css',
        [],
        KAISE_CATALOG_VERSION
    );
    wp_enqueue_script(
        'kc-data',
        KAISE_CATALOG_URL . 'assets/kc-data.js',
        [],
        KAISE_CATALOG_VERSION,
        true
    );
    wp_enqueue_script(
        'kc-compat',
        KAISE_CATALOG_URL . 'assets/kc-compat.js',
        [ 'kc-data' ],
        KAISE_CATALOG_VERSION,
        true
    );
    wp_enqueue_script(
        'kc-wizard',
        KAISE_CATALOG_URL . 'assets/kc-wizard.js',
        [ 'jquery', 'kc-compat' ],
        KAISE_CATALOG_VERSION,
        true
    );
    wp_enqueue_script(
        'kaise-catalog',
        KAISE_CATALOG_URL . 'assets/kaise-catalog.js',
        [ 'jquery', 'kc-wizard' ],
        KAISE_CATALOG_VERSION,
        true
    );
    $api_url     = rtrim( get_option( 'kaise_catalog_api_url', '' ), '/' );
    $api_base    = preg_replace( '#/api/v\d+$#', '', $api_url );

    wp_localize_script( 'kaise-catalog', 'KaiseCatalog', [
        'ajaxUrl'     => admin_url( 'admin-ajax.php' ),
        'nonce'       => wp_create_nonce( 'kaise_catalog' ),
        'perPage'     => (int) get_option( 'kaise_catalog_results_per_page', 20 ),
        'hasAI'       => ! empty( $ai_key ),
        'showAI'      => true,
        'showFilters' => true,
        'apiBase'     => $api_base,
        'contactUrl'  => get_option( 'kaise_catalog_contact_url', '' ),
    ] );
} );

// ─── Shortcode ───────────────────────────────────────────────────────────────

add_shortcode( 'kaise_catalog', function ( $atts ) {
    $atts = shortcode_atts( [
        'per_page'     => get_option( 'kaise_catalog_results_per_page', 20 ),
        'show_ai'      => 'true',
        'show_filters' => 'true',
    ], $atts );

    // Los assets ya están encolados globalmente.
    // Solo sobreescribimos perPage/showAI/showFilters si el shortcode los cambia.
    $ai_key     = get_option( 'kaise_catalog_gemini_key', '' );
    $api_url_sc = rtrim( get_option( 'kaise_catalog_api_url', '' ), '/' );
    $api_base_sc = preg_replace( '#/api/v\d+$#', '', $api_url_sc );
    wp_localize_script( 'kaise-catalog', 'KaiseCatalog', [
        'ajaxUrl'     => admin_url( 'admin-ajax.php' ),
        'nonce'       => wp_create_nonce( 'kaise_catalog' ),
        'perPage'     => (int) $atts['per_page'],
        'hasAI'       => ! empty( $ai_key ),
        'showAI'      => $atts['show_ai'] === 'true',
        'showFilters' => $atts['show_filters'] === 'true',
        'apiBase'     => $api_base_sc,
        'contactUrl'  => get_option( 'kaise_catalog_contact_url', '' ),
    ] );

    ob_start();
    include KAISE_CATALOG_DIR . 'templates/catalog.php';
    return ob_get_clean();
} );

// ─── AJAX: búsqueda con IA ───────────────────────────────────────────────────

add_action( 'wp_ajax_kaise_ai_search',        'kaise_ajax_ai_search' );
add_action( 'wp_ajax_nopriv_kaise_ai_search', 'kaise_ajax_ai_search' );

function kaise_ajax_ai_search() {
    check_ajax_referer( 'kaise_catalog', 'nonce' );

    $query = sanitize_text_field( wp_unslash( $_POST['query'] ?? '' ) );
    if ( empty( $query ) ) wp_send_json_error( [ 'message' => 'Consulta vacía' ] );

    $api_key = get_option( 'kaise_catalog_gemini_key', '' );
    if ( empty( $api_key ) ) wp_send_json_error( [ 'message' => 'Clave Gemini no configurada en Ajustes → Kaise Catalog' ] );

    $prompt = 'Eres un asistente especializado en baterías del catálogo Kaise. ' .
        'Convierte la siguiente consulta en lenguaje natural en un objeto JSON con los parámetros de búsqueda de la API. ' .
        'Parámetros disponibles (todos opcionales): ' .
        'search (string, texto libre), voltage (number, V exactos: 2/6/12/12.8/24/25.6/48/51.2), ' .
        'capacity_min (number, Ah), capacity_max (number, Ah), ' .
        'technology (string: "VRLA-AGM"|"VRLA-GEL"|"LiFePO4"|"Lead Carbon"), ' .
        'plate_type (string: "Tubular"|"Flat"|"Prismática"), ' .
        'application (string: "Telecomunicaciones"|"Solar"|"SAI"|"UPS"|"Bicicletas"|"Vehículo eléctrico"|"Industrial"|"Náutico"|"Caravana"|"Alarma"|"Tracción"), ' .
        'eurobat (boolean). ' .
        'Incluye siempre status:"published". ' .
        'Responde SOLO con JSON válido, sin texto adicional. ' .
        'Ejemplo: {"voltage":12,"capacity_min":90,"capacity_max":110,"application":"Bicicletas","status":"published"}' .
        "\n\nConsulta del usuario: " . $query;

    $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' . rawurlencode( $api_key );

    $response = wp_remote_post( $endpoint, [
        'timeout' => 20,
        'headers' => [ 'Content-Type' => 'application/json' ],
        'body'    => wp_json_encode( [
            'contents' => [
                [ 'role' => 'user', 'parts' => [ [ 'text' => $prompt ] ] ],
            ],
            'generationConfig' => [
                'maxOutputTokens' => 512,
                'temperature'     => 0.1,
            ],
        ] ),
    ] );

    if ( is_wp_error( $response ) ) {
        wp_send_json_error( [ 'message' => $response->get_error_message() ] );
    }

    $http_code = wp_remote_retrieve_response_code( $response );
    $body      = json_decode( wp_remote_retrieve_body( $response ), true );

    if ( $http_code !== 200 ) {
        $err = $body['error']['message'] ?? 'Error de Gemini API (código ' . $http_code . ')';
        wp_send_json_error( [ 'message' => $err ] );
    }

    $text = $body['candidates'][0]['content']['parts'][0]['text'] ?? '';
    // Gemini a veces envuelve el JSON en ```json ... ``` — limpiar
    $text = preg_replace( '/^```(?:json)?\s*/i', '', trim( $text ) );
    $text = preg_replace( '/```\s*$/', '', $text );
    $text = trim( $text );

    $params = json_decode( $text, true );
    if ( ! is_array( $params ) ) {
        wp_send_json_error( [ 'message' => 'No se pudo interpretar la consulta. Prueba con más detalle.' ] );
    }

    wp_send_json_success( [ 'params' => $params, 'interpretation' => $text ] );
}

// ─── AJAX: buscar productos ───────────────────────────────────────────────────

add_action( 'wp_ajax_kaise_search_products',        'kaise_ajax_search_products' );
add_action( 'wp_ajax_nopriv_kaise_search_products', 'kaise_ajax_search_products' );

function kaise_ajax_search_products() {
    check_ajax_referer( 'kaise_catalog', 'nonce' );

    $api_url = rtrim( get_option( 'kaise_catalog_api_url', '' ), '/' );
    if ( empty( $api_url ) ) {
        wp_send_json_error( [ 'message' => 'URL de la API no configurada' ] );
    }

    $allowed = [
        'search', 'voltage', 'capacity_min', 'capacity_max',
        'technology', 'plate_type', 'application', 'eurobat',
        'status', 'page', 'per_page', 'category_id', 'product_type_id',
        'characteristics', 'capacity_range',
    ];

    $params = [ 'status' => 'published' ];
    foreach ( $allowed as $key ) {
        if ( isset( $_POST[ $key ] ) && $_POST[ $key ] !== '' ) {
            $params[ $key ] = sanitize_text_field( wp_unslash( $_POST[ $key ] ) );
        }
    }

    // filters[campo] — atributos dinámicos JSONB
    if ( isset( $_POST['filters'] ) && is_array( $_POST['filters'] ) ) {
        foreach ( $_POST['filters'] as $fkey => $fval ) {
            $params[ 'filters[' . sanitize_key( $fkey ) . ']' ] = sanitize_text_field( wp_unslash( $fval ) );
        }
    }

    $endpoint = $api_url . '/products?' . http_build_query( $params );

    $response = wp_remote_get( $endpoint, array_merge( [ 'timeout' => 15 ], KAISE_LT_HEADERS ) );

    if ( is_wp_error( $response ) ) {
        wp_send_json_error( [ 'message' => $response->get_error_message() ] );
    }

    $code = wp_remote_retrieve_response_code( $response );
    $body = json_decode( wp_remote_retrieve_body( $response ), true );

    if ( $code !== 200 ) {
        wp_send_json_error( [ 'message' => $body['message'] ?? 'Error de la API' ] );
    }

    wp_send_json_success( $body );
}

// ─── AJAX: cargar categorías para filtros ─────────────────────────────────────

add_action( 'wp_ajax_kaise_get_categories',        'kaise_ajax_get_categories' );
add_action( 'wp_ajax_nopriv_kaise_get_categories', 'kaise_ajax_get_categories' );

function kaise_ajax_get_categories() {
    check_ajax_referer( 'kaise_catalog', 'nonce' );

    $api_url = rtrim( get_option( 'kaise_catalog_api_url', '' ), '/' );
    $cached  = get_transient( 'kaise_catalog_categories' );

    if ( $cached !== false ) {
        wp_send_json_success( $cached );
    }

    $response = wp_remote_get( $api_url . '/categories/tree', array_merge( [ 'timeout' => 10 ], KAISE_LT_HEADERS ) );

    if ( is_wp_error( $response ) ) {
        wp_send_json_error( [ 'message' => $response->get_error_message() ] );
    }

    $code = wp_remote_retrieve_response_code( $response );
    $body = json_decode( wp_remote_retrieve_body( $response ), true );

    if ( $code !== 200 || empty( $body['data'] ) ) {
        wp_send_json_error( [ 'message' => 'No se pudieron cargar las gammas (API: ' . $code . ')' ] );
    }

    set_transient( 'kaise_catalog_categories', $body['data'], HOUR_IN_SECONDS * 6 );
    wp_send_json_success( $body['data'] );
}

// ─── AJAX: detalle de categoría (specs + features) ────────────────────────────

add_action( 'wp_ajax_kaise_get_category_detail',        'kaise_ajax_get_category_detail' );
add_action( 'wp_ajax_nopriv_kaise_get_category_detail', 'kaise_ajax_get_category_detail' );

function kaise_ajax_get_category_detail() {
    check_ajax_referer( 'kaise_catalog', 'nonce' );

    $cat_id  = sanitize_text_field( wp_unslash( $_POST['category_id'] ?? '' ) );
    if ( empty( $cat_id ) ) wp_send_json_error( [ 'message' => 'ID de categoría requerido' ] );

    $api_url = rtrim( get_option( 'kaise_catalog_api_url', '' ), '/' );
    $cache_key = 'kaise_cat_' . md5( $cat_id );
    $cached    = get_transient( $cache_key );

    if ( $cached !== false ) {
        wp_send_json_success( $cached );
    }

    $lt         = array_merge( [ 'timeout' => 15 ], KAISE_LT_HEADERS );
    $r_cat      = wp_remote_get( $api_url . '/categories/' . rawurlencode( $cat_id ), $lt );
    $r_features = wp_remote_get( $api_url . '/categories/' . rawurlencode( $cat_id ) . '/features', $lt );

    if ( is_wp_error( $r_cat ) ) {
        wp_send_json_error( [ 'message' => 'Error categoría: ' . $r_cat->get_error_message() ] );
    }
    if ( is_wp_error( $r_features ) ) {
        wp_send_json_error( [ 'message' => 'Error features: ' . $r_features->get_error_message() ] );
    }

    $cat_body  = json_decode( wp_remote_retrieve_body( $r_cat ), true );
    $feat_body = json_decode( wp_remote_retrieve_body( $r_features ), true );

    $cat      = $cat_body['data']  ?? [];
    $features = $feat_body['data'] ?? [];

    // No cachear si cat está vacío (posible fallo de red)
    $result = [ 'category' => $cat, 'features' => $features ];
    if ( ! empty( $cat ) ) {
        set_transient( $cache_key, $result, HOUR_IN_SECONDS * 6 );
    }

    wp_send_json_success( $result );
}
