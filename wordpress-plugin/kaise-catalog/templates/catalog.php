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
            <div class="kc-app-search-wrap">
                <input type="search" id="kc-app-search" class="kc-app-search" placeholder="🔍 Buscar aplicación…" autocomplete="off">
            </div>
            <div class="kc-app-grid">
                <button class="kc-app-tile" data-app="Telecomunicaciones" data-tech="">
                    <span class="kc-app-icon">📡</span>
                    <span class="kc-app-name">Telecomunicaciones</span>
                    <span class="kc-app-desc">Redes, estaciones base, CPD</span>
                </button>
                <button class="kc-app-tile" data-app="SAI" data-tech="">
                    <span class="kc-app-icon">🔌</span>
                    <span class="kc-app-name">SAI / UPS</span>
                    <span class="kc-app-desc">Sistemas ininterrumpibles</span>
                </button>
                <button class="kc-app-tile" data-app="Iluminación" data-tech="">
                    <span class="kc-app-icon">💡</span>
                    <span class="kc-app-name">Iluminación emergencia</span>
                    <span class="kc-app-desc">Alumbrado público, señalización</span>
                </button>
                <button class="kc-app-tile" data-app="Centrales" data-tech="">
                    <span class="kc-app-icon">⚡</span>
                    <span class="kc-app-name">Centrales eléctricas</span>
                    <span class="kc-app-desc">Generación, subestaciones</span>
                </button>
                <button class="kc-app-tile" data-app="Alarma" data-tech="">
                    <span class="kc-app-icon">🔒</span>
                    <span class="kc-app-name">Alarmas y seguridad</span>
                    <span class="kc-app-desc">CCTV, control de acceso</span>
                </button>
                <button class="kc-app-tile" data-app="Náutico" data-tech="">
                    <span class="kc-app-icon">⛵</span>
                    <span class="kc-app-name">Marítimo</span>
                    <span class="kc-app-desc">Barco, marina, yate</span>
                </button>
                <button class="kc-app-tile" data-app="Energías Renovables" data-tech="">
                    <span class="kc-app-icon">🌱</span>
                    <span class="kc-app-name">Energías renovables</span>
                    <span class="kc-app-desc">Almacenamiento ciclo completo</span>
                </button>
                <button class="kc-app-tile" data-app="Solar" data-tech="">
                    <span class="kc-app-icon">☀️</span>
                    <span class="kc-app-name">Solar</span>
                    <span class="kc-app-desc">Fotovoltaica, placas solares</span>
                </button>
                <button class="kc-app-tile" data-app="Eólica" data-tech="">
                    <span class="kc-app-icon">💨</span>
                    <span class="kc-app-name">Eólica</span>
                    <span class="kc-app-desc">Aerogeneradores, parques</span>
                </button>
                <button class="kc-app-tile" data-app="SmartGrid" data-tech="">
                    <span class="kc-app-icon">🔗</span>
                    <span class="kc-app-name">Red inteligente</span>
                    <span class="kc-app-desc">Smart grid, gestión de red</span>
                </button>
                <button class="kc-app-tile" data-app="Almacenamiento" data-tech="">
                    <span class="kc-app-icon">🏠</span>
                    <span class="kc-app-name">Almacenamiento doméstico</span>
                    <span class="kc-app-desc">Home energy, autoconsumo</span>
                </button>
                <button class="kc-app-tile" data-app="Híbrida" data-tech="">
                    <span class="kc-app-icon">⚡</span>
                    <span class="kc-app-name">Energía híbrida</span>
                    <span class="kc-app-desc">Sistemas híbridos solar+red</span>
                </button>
                <button class="kc-app-tile" data-app="Ferroviario" data-tech="">
                    <span class="kc-app-icon">🚂</span>
                    <span class="kc-app-name">Ferroviario</span>
                    <span class="kc-app-desc">Trenes, metro, tranvía</span>
                </button>
                <button class="kc-app-tile" data-app="Bicicletas" data-tech="LiFePO4">
                    <span class="kc-app-icon">🚲</span>
                    <span class="kc-app-name">Movilidad ligera</span>
                    <span class="kc-app-desc">E-bike, patinete, scooter</span>
                </button>
                <button class="kc-app-tile" data-app="Tracción" data-tech="">
                    <span class="kc-app-icon">🚜</span>
                    <span class="kc-app-name">Tracción industrial</span>
                    <span class="kc-app-desc">Carretillas, AGV, golf</span>
                </button>
                <button class="kc-app-tile" data-app="TV Cable" data-tech="">
                    <span class="kc-app-icon">📺</span>
                    <span class="kc-app-name">TV por cable</span>
                    <span class="kc-app-desc">CATV, distribución de señal</span>
                </button>
                <button class="kc-app-tile" data-app="Sanitario" data-tech="">
                    <span class="kc-app-icon">🏥</span>
                    <span class="kc-app-name">Médico / Sanitario</span>
                    <span class="kc-app-desc">Equipos médicos, sillas de ruedas</span>
                </button>
                <button class="kc-app-tile" data-app="Caravana" data-tech="">
                    <span class="kc-app-icon">🏕️</span>
                    <span class="kc-app-name">Autocaravanas / Camping</span>
                    <span class="kc-app-desc">Caravanas, motorhomes</span>
                </button>
                <button class="kc-app-tile kc-app-tile-all" data-app="" data-tech="">
                    <span class="kc-app-icon">🔋</span>
                    <span class="kc-app-name">Sin filtro de aplicación</span>
                    <span class="kc-app-desc">Continuar sin seleccionar</span>
                </button>
            </div>
        </div>

        <!-- Barra de progreso del wizard (compartida, visible en pasos 2-8) -->
        <div id="kc-wizard-progress" class="kc-wizard-progress" hidden>
            <span class="kc-wp-dot" data-step="1" title="Aplicación"></span>
            <span class="kc-wp-line"></span>
            <span class="kc-wp-dot" data-step="2" title="Características"></span>
            <span class="kc-wp-line"></span>
            <span class="kc-wp-dot" data-step="3" title="Tecnología"></span>
            <span class="kc-wp-line"></span>
            <span class="kc-wp-dot" data-step="4" title="Placa"></span>
            <span class="kc-wp-line"></span>
            <span class="kc-wp-dot" data-step="5" title="Gama"></span>
            <span class="kc-wp-line"></span>
            <span class="kc-wp-dot" data-step="6" title="Voltaje"></span>
            <span class="kc-wp-line"></span>
            <span class="kc-wp-dot" data-step="7" title="Capacidad"></span>
            <span class="kc-wp-line"></span>
            <span class="kc-wp-dot" data-step="8" title="Resumen"></span>
        </div>

        <!-- Breadcrumb de selecciones activas -->
        <div id="kc-wizard-breadcrumb" class="kc-wizard-breadcrumb" hidden></div>

        <!-- Paso 2: Características -->
        <div class="kc-wizard-step" id="kc-step-2" hidden>
            <div class="kc-wizard-header">
                <span class="kc-step-num">2</span>
                <div>
                    <div class="kc-step-title">¿Qué características necesitas? <span id="kc-step2-app-label" class="kc-step-app-badge"></span></div>
                    <div class="kc-step-sub">Selecciona una o más — o salta para ver todo</div>
                </div>
                <button class="kc-step-back" data-back="1">← Cambiar aplicación</button>
            </div>
            <div class="kc-char-grid">
                <button class="kc-char-pill" data-char="alta-potencia-w">
                    <span class="kc-char-icon">⚡</span>
                    <span class="kc-char-name">Alta potencia (W)</span>
                    <span class="kc-char-desc">Máxima entrega de potencia puntual</span>
                </button>
                <button class="kc-char-pill" data-char="descarga-profunda">
                    <span class="kc-char-icon">🔄</span>
                    <span class="kc-char-name">Descarga profunda</span>
                    <span class="kc-char-desc">Ciclos de descarga al 80 %+</span>
                </button>
                <button class="kc-char-pill" data-char="larga-vida-diseno">
                    <span class="kc-char-icon">⏳</span>
                    <span class="kc-char-name">Larga vida de diseño</span>
                    <span class="kc-char-desc">≥ 15 años en condiciones estándar</span>
                </button>
                <button class="kc-char-pill" data-char="alta-temperatura">
                    <span class="kc-char-icon">🌡️</span>
                    <span class="kc-char-name">Alta temperatura</span>
                    <span class="kc-char-desc">Funciona hasta +80 °C</span>
                </button>
                <button class="kc-char-pill" data-char="psoc">
                    <span class="kc-char-icon">🔬</span>
                    <span class="kc-char-name">PSoC optimizado</span>
                    <span class="kc-char-desc">Carga parcial de estado de carga</span>
                </button>
                <button class="kc-char-pill" data-char="carga-rapida">
                    <span class="kc-char-icon">⚡</span>
                    <span class="kc-char-name">Carga rápida</span>
                    <span class="kc-char-desc">Reducción del tiempo de carga</span>
                </button>
                <button class="kc-char-pill" data-char="alta-ciclabilidad">
                    <span class="kc-char-icon">♻️</span>
                    <span class="kc-char-name">Alta ciclabilidad</span>
                    <span class="kc-char-desc">&gt; 2.000 ciclos de vida útil</span>
                </button>
                <button class="kc-char-pill" data-char="terminal-frontal">
                    <span class="kc-char-icon">📡</span>
                    <span class="kc-char-name">Terminal frontal</span>
                    <span class="kc-char-desc">Acceso frontal, instalación rack</span>
                </button>
            </div>
            <div class="kc-wizard-nav">
                <button class="kc-btn kc-btn-primary" id="kc-step2-continue">Continuar →</button>
                <button class="kc-btn kc-btn-ghost" id="kc-step2-skip">Saltar (cualquier característica)</button>
            </div>
        </div>

        <!-- Paso 3: Tecnología -->
        <div class="kc-wizard-step" id="kc-step-3" hidden>
            <div class="kc-wizard-header">
                <span class="kc-step-num">3</span>
                <div>
                    <div class="kc-step-title">¿Qué tecnología?</div>
                    <div class="kc-step-sub">Haz clic para seleccionar — «Cualquiera» salta este paso</div>
                </div>
                <button class="kc-step-back" data-back="2">← Volver</button>
            </div>
            <div class="kc-tech-pills" id="kc-wizard-tech-pills">
                <button class="kc-tech-pill kc-pill-any" data-tech="">Cualquiera →</button>
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

        <!-- Paso 4: Tipo de placa (solo visible si hay >1 opción para la tecnología elegida) -->
        <div class="kc-wizard-step" id="kc-step-4" hidden>
            <div class="kc-wizard-header">
                <span class="kc-step-num">4</span>
                <div>
                    <div class="kc-step-title">¿Qué tipo de placa?</div>
                    <div class="kc-step-sub">Elige la construcción — o salta para ver todas</div>
                </div>
                <button class="kc-step-back" data-back="3">← Volver</button>
            </div>
            <div id="kc-plate-grid" class="kc-plate-grid">
                <!-- renderizado dinámicamente por JS -->
            </div>
            <div class="kc-wizard-nav">
                <button class="kc-btn kc-btn-ghost" id="kc-step4-plate-skip">Saltar (cualquier placa)</button>
            </div>
        </div>

        <!-- Paso 5: Gama -->
        <div class="kc-wizard-step" id="kc-step-5" hidden>
            <div class="kc-wizard-header">
                <span class="kc-step-num">5</span>
                <div>
                    <div class="kc-step-title">¿Qué gama de batería?</div>
                    <div class="kc-step-sub">Elige la familia específica — o salta para ver todas</div>
                </div>
                <button class="kc-step-back" data-back="4">← Volver</button>
            </div>
            <div id="kc-gamma-grid" class="kc-gamma-grid">
                <!-- renderizado dinámicamente por JS -->
            </div>
            <div class="kc-wizard-nav">
                <button class="kc-btn kc-btn-ghost" id="kc-step5-skip">Saltar (cualquier gama)</button>
            </div>
        </div>

        <!-- Paso 6: Voltaje -->
        <div class="kc-wizard-step" id="kc-step-6" hidden>
            <div class="kc-wizard-header">
                <span class="kc-step-num">6</span>
                <div>
                    <div class="kc-step-title">¿Qué voltaje nominal?</div>
                    <div class="kc-step-sub">Haz clic para seleccionar — «Cualquiera» salta este paso</div>
                </div>
                <button class="kc-step-back" data-back="5">← Volver</button>
            </div>
            <div class="kc-volt-pills" id="kc-wizard-volt-pills">
                <button class="kc-volt-pill kc-pill-any" data-v="">Cualquiera →</button>
                <button class="kc-volt-pill" data-v="2">2 V</button>
                <button class="kc-volt-pill" data-v="6">6 V</button>
                <button class="kc-volt-pill" data-v="8">8 V</button>
                <button class="kc-volt-pill" data-v="12">12 V</button>
                <button class="kc-volt-pill" data-v="12.8">12.8 V<small>LFP</small></button>
                <button class="kc-volt-pill" data-v="24">24 V</button>
                <button class="kc-volt-pill" data-v="25.6">25.6 V<small>LFP</small></button>
                <button class="kc-volt-pill" data-v="48">48 V</button>
                <button class="kc-volt-pill" data-v="51.2">51.2 V<small>LFP</small></button>
            </div>
        </div>

        <!-- Paso 7: Capacidad -->
        <div class="kc-wizard-step" id="kc-step-7" hidden>
            <div class="kc-wizard-header">
                <span class="kc-step-num">7</span>
                <div>
                    <div class="kc-step-title">¿Qué capacidad necesitas?</div>
                    <div class="kc-step-sub">Opcional — en amperios-hora (Ah)</div>
                </div>
                <button class="kc-step-back" data-back="6">← Volver</button>
            </div>
            <div class="kc-spec-block">
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
                    <button class="kc-cap-btn is-active" data-min="" data-max="">Cualquiera</button>
                    <button class="kc-cap-btn" data-min="1" data-max="30">&lt; 30 Ah</button>
                    <button class="kc-cap-btn" data-min="30" data-max="100">30 – 100 Ah</button>
                    <button class="kc-cap-btn" data-min="100" data-max="300">100 – 300 Ah</button>
                    <button class="kc-cap-btn" data-min="300" data-max="">300+ Ah</button>
                </div>
            </div>
            <div class="kc-wizard-actions">
                <button id="kc-step7-next" class="kc-btn kc-btn-primary kc-btn-lg">
                    Siguiente: Ver resumen →
                </button>
                <button id="kc-step7-skip" class="kc-btn kc-btn-ghost">Sin filtro de capacidad</button>
                <button id="kc-wizard-reset" class="kc-btn kc-btn-ghost">Empezar de nuevo</button>
            </div>
        </div>

        <!-- Paso 8: Resumen y confirmación -->
        <div class="kc-wizard-step" id="kc-step-8" hidden>
            <div class="kc-wizard-header">
                <span class="kc-step-num kc-step-done">✓</span>
                <div>
                    <div class="kc-step-title">Resumen de tu búsqueda</div>
                    <div class="kc-step-sub">Revisa los filtros seleccionados antes de buscar</div>
                </div>
                <button class="kc-step-back" data-back="7">← Volver</button>
            </div>
            <div id="kc-wizard-summary-content" class="kc-summary-table">
                <!-- renderizado dinámicamente por JS -->
            </div>
            <div class="kc-wizard-actions">
                <button id="kc-wizard-search" class="kc-btn kc-btn-primary kc-btn-lg">
                    Ver resultados
                </button>
                <button id="kc-wizard-reset" class="kc-btn kc-btn-ghost">Empezar de nuevo</button>
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
        <div class="kc-filters-flat">

            <!-- ── Búsqueda libre ─────────────────────────────────────── -->
            <div class="kc-filter-row">
                <label class="kc-filter-label" for="kc-search">Búsqueda libre</label>
                <input type="text" id="kc-search"
                    class="kc-filter-input kc-filter-input--full"
                    placeholder="Nombre, código, descripción… Ej: KBSG12100, Solar GEL" />
            </div>

            <!-- ── Filtros principales ────────────────────────────────── -->
            <div class="kc-filter-section-title">Filtros principales</div>

            <div class="kc-filter-row">
                <label class="kc-filter-label" for="kc-category">Gamma</label>
                <select id="kc-category" class="kc-filter-input">
                    <option value="">Todas las gammas</option>
                </select>
            </div>

            <div class="kc-filter-row">
                <label class="kc-filter-label" for="kc-technology">Tecnología</label>
                <select id="kc-technology" class="kc-filter-input">
                    <option value="">Cualquiera</option>
                    <option value="VRLA-AGM">VRLA-AGM</option>
                    <option value="VRLA-GEL">VRLA-GEL</option>
                    <option value="LiFePO4">LiFePO4 (Litio Ferrofosfato)</option>
                    <option value="Lead Carbon">Lead Carbon</option>
                </select>
            </div>

            <div class="kc-filter-row">
                <label class="kc-filter-label" for="kc-voltage">Tensión (V)</label>
                <select id="kc-voltage" class="kc-filter-input">
                    <option value="">Cualquiera</option>
                    <option value="2">2 V</option>
                    <option value="6">6 V</option>
                    <option value="12">12 V</option>
                    <option value="12.8">12.8 V (LFP)</option>
                    <option value="24">24 V</option>
                    <option value="25.6">25.6 V (LFP)</option>
                    <option value="48">48 V</option>
                    <option value="51.2">51.2 V (LFP)</option>
                </select>
            </div>

            <div class="kc-filter-row">
                <label class="kc-filter-label" for="kc-plate-type">Tipo de placa</label>
                <select id="kc-plate-type" class="kc-filter-input">
                    <option value="">Cualquiera</option>
                    <option value="Plana">Plana</option>
                    <option value="Tubular">Tubular</option>
                    <option value="Prismática">Prismática</option>
                </select>
            </div>

            <!-- ── Separador ──────────────────────────────────────────── -->
            <div class="kc-filter-divider"></div>

            <!-- ── Filtros secundarios ────────────────────────────────── -->
            <div class="kc-filter-section-title">Más filtros</div>

            <div class="kc-filter-row">
                <label class="kc-filter-label" for="kc-application">Aplicación</label>
                <select id="kc-application" class="kc-filter-input">
                    <option value="">Cualquiera</option>
                    <option value="Telecomunicaciones">Telecomunicaciones</option>
                    <option value="SAI">SAI / UPS</option>
                    <option value="Iluminación">Iluminación emergencia</option>
                    <option value="Centrales">Centrales eléctricas</option>
                    <option value="Alarma">Alarmas y seguridad</option>
                    <option value="Náutico">Marítimo</option>
                    <option value="Energías Renovables">Energías renovables</option>
                    <option value="Solar">Solar</option>
                    <option value="Eólica">Eólica</option>
                    <option value="SmartGrid">Red inteligente / Smart grid</option>
                    <option value="Almacenamiento">Almacenamiento doméstico</option>
                    <option value="Híbrida">Energía híbrida</option>
                    <option value="Ferroviario">Ferroviario</option>
                    <option value="Bicicletas">Movilidad ligera</option>
                    <option value="Tracción">Tracción industrial</option>
                    <option value="TV Cable">TV por cable</option>
                    <option value="Sanitario">Médico / Sanitario</option>
                    <option value="Caravana">Autocaravanas / Camping</option>
                </select>
            </div>

            <div class="kc-filter-row kc-filter-row--2col">
                <div>
                    <label class="kc-filter-label" for="kc-cap-min">Cap. mínima (Ah)</label>
                    <input type="number" id="kc-cap-min" class="kc-filter-input" placeholder="Ej: 50" min="0" step="1" />
                </div>
                <div>
                    <label class="kc-filter-label" for="kc-cap-max">Cap. máxima (Ah)</label>
                    <input type="number" id="kc-cap-max" class="kc-filter-input" placeholder="Ej: 200" min="0" step="1" />
                </div>
            </div>

            <div class="kc-filter-row">
                <label class="kc-filter-check-label">
                    <input type="checkbox" id="kc-eurobat" />
                    Solo certificadas <strong>Eurobat</strong>
                </label>
            </div>

            <!-- ── Acciones ───────────────────────────────────────────── -->
            <div class="kc-filter-row kc-filter-actions" id="kc-filter-actions-row">
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
    <div id="kc-modal" class="kc-modal" hidden role="dialog" aria-modal="true" aria-labelledby="kc-modal-title">
        <div class="kc-modal-backdrop"></div>
        <div class="kc-modal-box">
            <div class="kc-modal-topbar">
                <div class="kc-modal-nav">
                    <button id="kc-modal-prev" class="kc-modal-navbtn" aria-label="Producto anterior" disabled>‹</button>
                    <span id="kc-modal-pos" class="kc-modal-pos-label"></span>
                    <button id="kc-modal-next" class="kc-modal-navbtn" aria-label="Producto siguiente" disabled>›</button>
                </div>
                <button class="kc-modal-close" aria-label="Cerrar">✕</button>
            </div>
            <div id="kc-modal-content"></div>
        </div>
    </div>

</div>
