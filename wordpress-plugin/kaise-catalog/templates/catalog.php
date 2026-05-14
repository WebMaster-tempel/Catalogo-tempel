<div id="kaise-catalog" class="kc-wrap">

    <!-- ── Tabs de modo de búsqueda ─────────────────────────────── -->
    <div class="kc-search-tabs">
        <button class="kc-tab is-active" data-tab="guided">🔍 Búsqueda guiada</button>
        <button class="kc-tab" data-tab="ai"><?php echo empty( get_option( 'kaise_catalog_gemini_key', '' ) ) ? '🤖 Búsqueda con IA' : '✦ Búsqueda con IA'; ?></button>
        <button class="kc-tab" data-tab="filters">⚙ Filtros técnicos</button>
    </div>

    <!-- ══════════════════════════════════════════════════════════ -->
    <!-- TAB 1: Búsqueda guiada (wizard estilo Yuasa)              -->
    <!-- ══════════════════════════════════════════════════════════ -->
    <div id="kc-tab-guided" class="kc-tab-panel">

        <!-- Paso 1: Aplicación -->
        <div class="kc-wizard-step" id="kc-step-1">
            <div class="kc-wizard-header">
                <span class="kc-step-num">1</span>
                <div>
                    <div class="kc-step-title">¿Para qué necesitas la batería?</div>
                    <div class="kc-step-sub">Selecciona la aplicación principal</div>
                </div>
            </div>
            <div class="kc-app-grid">
                <button class="kc-app-tile" data-app="Solar" data-tech="">
                    <span class="kc-app-icon">☀️</span>
                    <span class="kc-app-name">Energía solar</span>
                    <span class="kc-app-desc">Fotovoltaica, placas solares</span>
                </button>
                <button class="kc-app-tile" data-app="SAI" data-tech="">
                    <span class="kc-app-icon">🔌</span>
                    <span class="kc-app-name">SAI / UPS</span>
                    <span class="kc-app-desc">Sistemas ininterrumpibles</span>
                </button>
                <button class="kc-app-tile" data-app="Telecomunicaciones" data-tech="">
                    <span class="kc-app-icon">📡</span>
                    <span class="kc-app-name">Telecomunicaciones</span>
                    <span class="kc-app-desc">Redes, estaciones base, CPD</span>
                </button>
                <button class="kc-app-tile" data-app="Bicicletas" data-tech="LiFePO4">
                    <span class="kc-app-icon">🚲</span>
                    <span class="kc-app-name">Bicicleta eléctrica</span>
                    <span class="kc-app-desc">E-bike, patinete, scooter</span>
                </button>
                <button class="kc-app-tile" data-app="Vehículo eléctrico" data-tech="">
                    <span class="kc-app-icon">🚗</span>
                    <span class="kc-app-name">Vehículo eléctrico</span>
                    <span class="kc-app-desc">Carretilla, golf, industrial</span>
                </button>
                <button class="kc-app-tile" data-app="Caravana" data-tech="">
                    <span class="kc-app-icon">🏕️</span>
                    <span class="kc-app-name">Caravana / Náutico</span>
                    <span class="kc-app-desc">Autocaravana, barco, marina</span>
                </button>
                <button class="kc-app-tile" data-app="Industrial" data-tech="">
                    <span class="kc-app-icon">🏭</span>
                    <span class="kc-app-name">Industrial</span>
                    <span class="kc-app-desc">Tracción, maquinaria pesada</span>
                </button>
                <button class="kc-app-tile" data-app="Alarma" data-tech="">
                    <span class="kc-app-icon">🔒</span>
                    <span class="kc-app-name">Alarma / Seguridad</span>
                    <span class="kc-app-desc">CCTV, control de acceso</span>
                </button>
                <button class="kc-app-tile kc-app-tile-all" data-app="" data-tech="">
                    <span class="kc-app-icon">🔋</span>
                    <span class="kc-app-name">Ver todo el catálogo</span>
                    <span class="kc-app-desc">Sin filtro de aplicación</span>
                </button>
            </div>
        </div>

        <!-- Paso 2: Especificaciones (visible tras seleccionar aplicación) -->
        <div class="kc-wizard-step" id="kc-step-2" hidden>
            <div class="kc-wizard-header">
                <span class="kc-step-num">2</span>
                <div>
                    <div class="kc-step-title">Especificaciones técnicas <span id="kc-step2-app-label" class="kc-step-app-badge"></span></div>
                    <div class="kc-step-sub">Afina la búsqueda con tus requisitos (opcional)</div>
                </div>
                <button class="kc-step-back" id="kc-step2-back">← Cambiar aplicación</button>
            </div>

            <div class="kc-spec-grid">

                <!-- Tensión -->
                <div class="kc-spec-block">
                    <div class="kc-spec-label">Tensión nominal</div>
                    <div class="kc-volt-pills" id="kc-volt-pills">
                        <button class="kc-volt-pill is-active" data-v="">Cualquiera</button>
                        <button class="kc-volt-pill" data-v="2">2 V</button>
                        <button class="kc-volt-pill" data-v="6">6 V</button>
                        <button class="kc-volt-pill" data-v="12">12 V</button>
                        <button class="kc-volt-pill" data-v="12.8">12.8 V<small>Litio</small></button>
                        <button class="kc-volt-pill" data-v="24">24 V</button>
                        <button class="kc-volt-pill" data-v="25.6">25.6 V<small>Litio</small></button>
                        <button class="kc-volt-pill" data-v="48">48 V</button>
                        <button class="kc-volt-pill" data-v="51.2">51.2 V<small>Litio</small></button>
                    </div>
                </div>

                <!-- Capacidad -->
                <div class="kc-spec-block">
                    <div class="kc-spec-label">Capacidad (Ah)</div>
                    <div class="kc-cap-row">
                        <div class="kc-cap-field">
                            <label>Mínimo</label>
                            <input type="number" id="kc-w-cap-min" placeholder="Ej: 50" min="0" step="1" />
                        </div>
                        <span class="kc-cap-sep">—</span>
                        <div class="kc-cap-field">
                            <label>Máximo</label>
                            <input type="number" id="kc-w-cap-max" placeholder="Ej: 200" min="0" step="1" />
                        </div>
                    </div>
                    <div class="kc-cap-quick">
                        <button class="kc-cap-btn" data-min="" data-max="">Cualquiera</button>
                        <button class="kc-cap-btn" data-min="1" data-max="30">&lt; 30 Ah</button>
                        <button class="kc-cap-btn" data-min="30" data-max="100">30 – 100 Ah</button>
                        <button class="kc-cap-btn" data-min="100" data-max="300">100 – 300 Ah</button>
                        <button class="kc-cap-btn" data-min="300" data-max="">300+ Ah</button>
                    </div>
                </div>

                <!-- Tecnología -->
                <div class="kc-spec-block">
                    <div class="kc-spec-label">Tecnología</div>
                    <div class="kc-tech-pills" id="kc-tech-pills">
                        <button class="kc-tech-pill is-active" data-tech="">Cualquiera</button>
                        <button class="kc-tech-pill" data-tech="VRLA-AGM">
                            <strong>AGM</strong><small>VRLA-AGM</small>
                        </button>
                        <button class="kc-tech-pill" data-tech="VRLA-GEL">
                            <strong>GEL</strong><small>VRLA-GEL</small>
                        </button>
                        <button class="kc-tech-pill" data-tech="LiFePO4">
                            <strong>Litio</strong><small>LiFePO4</small>
                        </button>
                        <button class="kc-tech-pill" data-tech="Lead Carbon">
                            <strong>Lead Carbon</strong><small>C+Pb</small>
                        </button>
                    </div>
                </div>

                <!-- Tipo placa + Eurobat -->
                <div class="kc-spec-block">
                    <div class="kc-spec-label">Opciones adicionales</div>
                    <div class="kc-extra-opts">
                        <label class="kc-toggle-opt">
                            <input type="checkbox" id="kc-w-eurobat" />
                            <span>Solo certificadas <strong>Eurobat</strong></span>
                        </label>
                        <div class="kc-plate-select">
                            <label>Tipo de placa</label>
                            <select id="kc-w-plate">
                                <option value="">Cualquiera</option>
                                <option value="Flat">Flat</option>
                                <option value="Tubular">Tubular</option>
                                <option value="Prismática">Prismática</option>
                            </select>
                        </div>
                    </div>
                </div>

            </div>

            <div class="kc-wizard-actions">
                <button id="kc-wizard-search" class="kc-btn kc-btn-primary kc-btn-lg">
                    Ver resultados
                </button>
                <button id="kc-wizard-reset" class="kc-btn kc-btn-ghost">Limpiar filtros</button>
            </div>
        </div>

    </div>

    <!-- ══════════════════════════════════════════════════════════ -->
    <!-- TAB 2: Búsqueda con IA                                    -->
    <!-- ══════════════════════════════════════════════════════════ -->
    <?php if ( $atts['show_ai'] === 'true' ) : ?>
    <div id="kc-tab-ai" class="kc-tab-panel" hidden>
        <div class="kc-ai-search">
            <div class="kc-ai-header">
                <span class="kc-ai-badge">✦ IA</span>
                <span class="kc-ai-label">Describe la batería que necesitas en lenguaje natural</span>
            </div>
            <div class="kc-ai-examples">
                <span class="kc-ai-ex-label">Ejemplos:</span>
                <button class="kc-ai-example" data-q="Necesito una batería de 12V 100Ah para instalación solar">☀️ Batería solar 12V 100Ah</button>
                <button class="kc-ai-example" data-q="Batería para SAI de 12V entre 7 y 18Ah certificada Eurobat">🔌 SAI 12V pequeña Eurobat</button>
                <button class="kc-ai-example" data-q="Batería de litio LiFePO4 para bicicleta eléctrica 48V">🚲 Litio 48V e-bike</button>
                <button class="kc-ai-example" data-q="Batería AGM de alta tasa de descarga para telecomunicaciones 2V">📡 AGM 2V telecomunicaciones</button>
            </div>
            <div class="kc-ai-input-row">
                <input type="text" id="kc-ai-input" class="kc-ai-input"
                    placeholder="Ej: necesito una batería de 12V 100Ah especial para bicicletas eléctricas"
                    <?php if ( empty( get_option( 'kaise_catalog_gemini_key', '' ) ) ) echo 'disabled title="Configura la clave Gemini en Ajustes > Kaise Catalog"'; ?>
                />
                <button id="kc-ai-btn" class="kc-btn kc-btn-primary" <?php if ( empty( get_option( 'kaise_catalog_gemini_key', '' ) ) ) echo 'disabled'; ?>>
                    <span class="kc-btn-text">Buscar con IA</span>
                </button>
            </div>
            <div id="kc-ai-interpretation" class="kc-ai-interpretation" hidden></div>
            <?php if ( empty( get_option( 'kaise_catalog_gemini_key', '' ) ) ) : ?>
            <p class="kc-notice">⚠️ Configura la clave Gemini en <strong>Ajustes → Kaise Catalog</strong> para activar la búsqueda con IA.</p>
            <?php endif; ?>
        </div>
    </div>
    <?php endif; ?>

    <!-- ══════════════════════════════════════════════════════════ -->
    <!-- TAB 3: Filtros técnicos avanzados                         -->
    <!-- ══════════════════════════════════════════════════════════ -->
    <?php if ( $atts['show_filters'] === 'true' ) : ?>
    <div id="kc-tab-filters" class="kc-tab-panel" hidden>
        <div class="kc-filters-body kc-filters-flat">

            <div class="kc-filter-group kc-filter-full">
                <label for="kc-search">Búsqueda libre (nombre, código, descripción, categoría)</label>
                <input type="text" id="kc-search" placeholder="Ej: KBSG12100, Solar GEL, alta temperatura…" />
            </div>

            <div class="kc-filter-group">
                <label for="kc-voltage">Tensión (V)</label>
                <select id="kc-voltage">
                    <option value="">Cualquiera</option>
                    <option value="2">2 V</option>
                    <option value="6">6 V</option>
                    <option value="12">12 V</option>
                    <option value="12.8">12.8 V (Litio)</option>
                    <option value="24">24 V</option>
                    <option value="25.6">25.6 V (Litio)</option>
                    <option value="48">48 V</option>
                    <option value="51.2">51.2 V (Litio)</option>
                </select>
            </div>

            <div class="kc-filter-group">
                <label for="kc-cap-min">Capacidad mínima (Ah)</label>
                <input type="number" id="kc-cap-min" placeholder="Ej: 50" min="0" step="1" />
            </div>

            <div class="kc-filter-group">
                <label for="kc-cap-max">Capacidad máxima (Ah)</label>
                <input type="number" id="kc-cap-max" placeholder="Ej: 200" min="0" step="1" />
            </div>

            <div class="kc-filter-group">
                <label for="kc-technology">Tecnología</label>
                <select id="kc-technology">
                    <option value="">Cualquiera</option>
                    <option value="VRLA-AGM">VRLA-AGM</option>
                    <option value="VRLA-GEL">VRLA-GEL</option>
                    <option value="LiFePO4">LiFePO4 (Litio)</option>
                    <option value="Lead Carbon">Lead Carbon</option>
                </select>
            </div>

            <div class="kc-filter-group">
                <label for="kc-plate-type">Tipo de placa</label>
                <select id="kc-plate-type">
                    <option value="">Cualquiera</option>
                    <option value="Flat">Flat</option>
                    <option value="Tubular">Tubular</option>
                    <option value="Prismática">Prismática</option>
                </select>
            </div>

            <div class="kc-filter-group">
                <label for="kc-application">Aplicación</label>
                <select id="kc-application">
                    <option value="">Cualquiera</option>
                    <option value="Solar">Energía solar</option>
                    <option value="SAI">SAI / UPS</option>
                    <option value="Telecomunicaciones">Telecomunicaciones</option>
                    <option value="Bicicletas">Bicicleta eléctrica</option>
                    <option value="Vehículo eléctrico">Vehículo eléctrico</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Náutico">Náutico / Marina</option>
                    <option value="Caravana">Caravana / Autocaravana</option>
                    <option value="Alarma">Alarma / Seguridad</option>
                    <option value="Tracción">Tracción</option>
                </select>
            </div>

            <div class="kc-filter-group">
                <label for="kc-category">Gamma</label>
                <select id="kc-category">
                    <option value="">Todas las gammas</option>
                </select>
            </div>

            <div class="kc-filter-group kc-filter-check">
                <label>
                    <input type="checkbox" id="kc-eurobat" />
                    Solo certificadas Eurobat
                </label>
            </div>

            <div class="kc-filter-group kc-filter-actions">
                <button id="kc-apply-btn" class="kc-btn kc-btn-primary">Buscar</button>
                <button id="kc-reset-btn" class="kc-btn kc-btn-ghost">Limpiar todo</button>
            </div>

        </div>
    </div>
    <?php endif; ?>

    <!-- ── Filtros activos (chips) ────────────────────────────── -->
    <div id="kc-active-filters" class="kc-active-filters" hidden></div>

    <!-- ── Estado y resultados ───────────────────────────────── -->
    <div id="kc-status" class="kc-status" hidden></div>

    <div id="kc-results" class="kc-results" hidden>
        <div class="kc-results-meta">
            <span id="kc-results-count"></span>
            <div class="kc-results-sort">
                <select id="kc-sort">
                    <option value="">Orden por defecto</option>
                    <option value="name_asc">Nombre A-Z</option>
                    <option value="name_desc">Nombre Z-A</option>
                    <option value="cap_asc">Capacidad ↑</option>
                    <option value="cap_desc">Capacidad ↓</option>
                </select>
            </div>
        </div>
        <div id="kc-grid" class="kc-grid"></div>
        <div id="kc-pagination" class="kc-pagination"></div>
    </div>

    <!-- ── Modal detalle ─────────────────────────────────────── -->
    <div id="kc-modal" class="kc-modal" hidden role="dialog" aria-modal="true">
        <div class="kc-modal-backdrop"></div>
        <div class="kc-modal-box">
            <button class="kc-modal-close" aria-label="Cerrar">✕</button>
            <div id="kc-modal-content"></div>
        </div>
    </div>

</div>
