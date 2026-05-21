/* global KaiseCatalog, jQuery, KC */
/**
 * kaise-catalog.js — Main plugin logic: search, results, modal, AI, filter tab.
 *
 * Dependencies (loaded before this file):
 *   kc-data.js   → KC.GAMMA_DATA, KC.GAMMA_LABELS, KC.escHtml, …
 *   kc-compat.js → KC.Compat.*
 *   kc-wizard.js → KC.Wizard (bound in init via KC.Wizard.init($wrap))
 *
 * Exposes KC.Search so kc-wizard.js can call doSearch and runWizardSearch.
 */
(function ($) {
    'use strict';

    // ── State ─────────────────────────────────────────────────────────────────

    const state = {
        page:    1,
        total:   0,
        pages:   0,
        params:  {},
        loading: false,
        sort:    '',
        currentPageProducts: [],
        currentProductIdx:   0,
    };

    // ── DOM refs ─────────────────────────────────────────────────────────────

    const $wrap          = $('#kaise-catalog');
    const $aiInput       = $('#kc-ai-input');
    const $aiBtn         = $('#kc-ai-btn');
    const $aiInterp      = $('#kc-ai-interpretation');
    const $status        = $('#kc-status');
    const $results       = $('#kc-results');
    const $grid          = $('#kc-grid');
    const $pagination    = $('#kc-pagination');
    const $resultCount   = $('#kc-results-count');
    const $modal         = $('#kc-modal');
    const $modalContent  = $('#kc-modal-content');
    const $sort          = $('#kc-sort');
    const $activeFilters = $('#kc-active-filters');

    // Advanced filter inputs (tab 3)
    const filters = {
        search:      $('#kc-search'),
        voltage:     $('#kc-voltage'),
        cap_min:     $('#kc-cap-min'),
        cap_max:     $('#kc-cap-max'),
        technology:  $('#kc-technology'),
        plate_type:  $('#kc-plate-type'),
        application: $('#kc-application'),
        category:    $('#kc-category'),
        eurobat:     $('#kc-eurobat'),
    };

    // catId (string) → slug (string). Populated by loadCategories().
    const _catSlugMap = {};

    // ── KC.Search bridge (consumed by kc-wizard.js) ──────────────────────────
    // Function references are hoisted, so this object is always valid.

    window.KC = window.KC || {};
    KC.Search = {
        categories:          [],    // populated by loadCategories()
        doSearch:            doSearch,
        renderActiveFilters: renderActiveFilters,
        runWizardSearch:     runWizardSearch,
    };

    // ── Init ─────────────────────────────────────────────────────────────────

    function init() {
        loadCategories();
        KC.Wizard.init($wrap);      // wizard reads KC.Search.*
        bindEvents();
        doSearch({ status: 'published' });
    }

    // ── Tabs ──────────────────────────────────────────────────────────────────

    function bindTabs() {
        $wrap.find('.kc-tab').on('click', function () {
            const tab = $(this).data('tab');
            $wrap.find('.kc-tab').removeClass('is-active');
            $(this).addClass('is-active');
            $wrap.find('.kc-tab-panel').attr('hidden', '');
            $('#kc-tab-' + tab).removeAttr('hidden');
        });
    }

    // ── Event bindings ────────────────────────────────────────────────────────

    function bindEvents() {
        bindTabs();
        bindFilterTab();

        // AI search
        $aiBtn.on('click', handleAISearch);
        $aiInput.on('keypress', function (e) { if (e.which === 13) handleAISearch(); });

        // AI example chips
        $wrap.on('click', '.kc-ai-example', function () {
            $aiInput.val($(this).data('q'));
            handleAISearch();
        });

        // Advanced filters
        $('#kc-apply-btn').on('click', handleFilterSearch);
        $('#kc-reset-btn').on('click', handleReset);
        $wrap.find('.kc-filters-flat input').on('keypress', function (e) {
            if (e.which === 13) handleFilterSearch();
        });

        // Sort
        $sort.on('change', function () {
            state.sort = $(this).val();
            state.page = 1;
            renderCurrentResults();
        });

        // Active filter chips — remove chip
        $activeFilters.on('click', '.kc-chip-remove', function () {
            const key = $(this).data('key');
            removeActiveFilter(key);
        });

        // Modal close
        $('#kc-modal .kc-modal-backdrop, #kc-modal .kc-modal-close').on('click', closeModal);
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape') closeModal();
            if ($modal.attr('hidden') === undefined) {
                if (e.key === 'ArrowLeft')  navigateModal(-1);
                if (e.key === 'ArrowRight') navigateModal(1);
            }
        });

        // Modal prev/next
        $('#kc-modal-prev').on('click', function () { navigateModal(-1); });
        $('#kc-modal-next').on('click', function () { navigateModal(1); });
    }

    // ── Filter tab (tab 3) — algorithm integration ────────────────────────────

    function bindFilterTab() {
        filters.technology.on('change', onFilterCompatChange);
        filters.plate_type.on('change', onFilterCompatChange);
        filters.application.on('change', onFilterCompatChange);
        filters.category.on('change', onFilterCompatChange);
    }

    /** Returns slug for currently selected category option, or '' if none. */
    function _selectedGammaSlug() {
        var catId = filters.category.val() || '';
        return catId ? (_catSlugMap[catId] || '') : '';
    }

    /** Returns slug for a given category option element (by its value). */
    function _slugForCatId(catId) {
        return catId ? (_catSlugMap[String(catId)] || '') : '';
    }

    function onFilterCompatChange() {
        var tech  = filters.technology.val() || null;
        var plate = filters.plate_type.val() || null;
        var app   = filters.application.val() || null;

        // ── Gamma → tech/plate derivation ────────────────────────────────────
        var selSlug    = _selectedGammaSlug();
        var gammaEntry = selSlug
            ? KC.GAMMA_DATA.find(function (g) { return g.id === selSlug; })
            : null;

        var gammaTech  = gammaEntry ? (gammaEntry.isLeadCarbon ? 'Lead Carbon' : gammaEntry.technology) : null;
        var gammaPlate = gammaEntry ? gammaEntry.plate : null;

        // Effective tech/plate: manual selection takes priority, gamma-derived as fallback
        var effTech  = tech  || gammaTech;
        var effPlate = plate || gammaPlate;

        // ── Compute compatible sets ───────────────────────────────────────────
        // For tech/plate/app dropdowns: use effective constraints
        var availTechs  = gammaEntry ? new Set([gammaTech])  : KC.Compat.getAvailableTechs(effPlate, app);
        var availPlates = gammaEntry ? new Set([gammaPlate]) : KC.Compat.getAvailablePlates(effTech, app);
        // When gamma selected: only show apps compatible with THAT gamma specifically.
        // When no gamma: show apps compatible with current tech+plate.
        var availApps = gammaEntry
            ? KC.Compat.getAvailableAppsForGamma(gammaEntry.id)
            : KC.Compat.getAvailableApps(effTech, effPlate);

        // For gamma dropdown: only use manual tech+plate+app (no circular dependency)
        var gammasForCat   = KC.Compat.computeValidGammas(tech, plate, app);
        var validForCatIds = new Set(gammasForCat.map(function (g) { return g.id; }));

        // Valid gammas for counter and voltage: full effective constraints
        var validGammas = KC.Compat.computeValidGammas(effTech, effPlate, app);

        KC.Compat.logCompatibility('Filtros Técnicos', effTech, effPlate, app, selSlug || null);

        // ── Tecnología ───────────────────────────────────────────────────────
        filters.technology.find('option').each(function () {
            var v = $(this).val();
            if (!v) { $(this).prop('disabled', false); return; }
            $(this).prop('disabled', !availTechs.has(v));
        });
        if (tech && !availTechs.has(tech)) { filters.technology.val(''); tech = null; }

        // ── Tipo de placa ────────────────────────────────────────────────────
        filters.plate_type.find('option').each(function () {
            var v = $(this).val();
            if (!v) { $(this).prop('disabled', false); return; }
            $(this).prop('disabled', !availPlates.has(v));
        });
        if (plate && !availPlates.has(plate)) { filters.plate_type.val(''); plate = null; }

        // ── Aplicación ───────────────────────────────────────────────────────
        filters.application.find('option').each(function () {
            var v = $(this).val();
            if (!v) { $(this).prop('disabled', false); return; }
            $(this).prop('disabled', !availApps.has(v));
        });
        if (app && !availApps.has(app)) { filters.application.val(''); app = null; }

        // ── Gamma / category ─────────────────────────────────────────────────
        filters.category.find('option').each(function () {
            var optId = $(this).val();
            if (!optId) { $(this).prop('disabled', false); return; }
            var slug  = _slugForCatId(optId);
            $(this).prop('disabled', slug ? !validForCatIds.has(slug) : false);
        });
        // Auto-deselect if now incompatible
        if (selSlug && !validForCatIds.has(selSlug)) {
            filters.category.val('');
            selSlug    = '';
            gammaEntry = null;
        }

        // ── Voltaje ───────────────────────────────────────────────────────────
        var activeSlug = _selectedGammaSlug(); // may have been cleared above
        var allowedVolt;

        if (activeSlug && KC.GAMMA_VOLTAGES[activeSlug]) {
            // Specific gamma selected → only its voltages
            allowedVolt = new Set(KC.GAMMA_VOLTAGES[activeSlug].map(String));
        } else if (validGammas.length > 0) {
            // Union of voltages from all compatible gammas
            allowedVolt = new Set();
            validGammas.forEach(function (g) {
                (KC.GAMMA_VOLTAGES[g.id] || []).forEach(function (v) { allowedVolt.add(String(v)); });
            });
        } else {
            allowedVolt = null; // no compat restriction
        }

        var curVolt = filters.voltage.val();
        filters.voltage.find('option').each(function () {
            var v = $(this).val();
            if (!v) { $(this).prop('disabled', false); return; }
            $(this).prop('disabled', allowedVolt ? !allowedVolt.has(v) : false);
        });
        if (curVolt && allowedVolt && !allowedVolt.has(curVolt)) {
            filters.voltage.val('');
        }

        // ── Indicator ────────────────────────────────────────────────────────
        var $ind = $('#kc-filter-gamma-indicator');
        if (!$ind.length) {
            $ind = $('<div id="kc-filter-gamma-indicator" class="kc-gamma-counter"></div>');
            $('#kc-filter-actions-row').prepend($ind);
        }

        var anyActive = filters.technology.val() || filters.plate_type.val() ||
                        filters.application.val() || filters.category.val();
        if (anyActive) {
            var count = activeSlug ? 1 : validGammas.length;
            $ind.html(count > 0
                    ? '<span class="kc-gc-icon">🔋</span> ' + count + (count === 1 ? ' tipo compatible' : ' tipos compatibles')
                    : '⚠ Sin combinación válida — cambia algún filtro')
                .toggleClass('is-zero', count === 0)
                .show();
        } else {
            $ind.hide();
        }
    }

    // ── Active filter chips ───────────────────────────────────────────────────

    const PARAM_LABELS = {
        application:  'Aplicación',
        technology:   'Tecnología',
        voltage:      'Tensión',
        capacity_min: 'Cap. mín.',
        capacity_max: 'Cap. máx.',
        plate_type:   'Placa',
        eurobat:      'Eurobat',
        search:       'Búsqueda',
        category_id:  'Gama',
    };

    function renderActiveFilters(params) {
        const chips = Object.entries(params)
            .filter(([k]) => k !== 'status' && PARAM_LABELS[k])
            .map(function ([k, v]) {
                const label = PARAM_LABELS[k] || k;
                let display = v === 'true' ? '✓' : v;
                if (k === 'category_id') {
                    const text = filters.category.find('option[value="' + v + '"]').text();
                    if (text) display = text;
                }
                return `<span class="kc-chip">${label}: <strong>${escHtml(String(display))}</strong><button class="kc-chip-remove" data-key="${escHtml(k)}" aria-label="Eliminar filtro">✕</button></span>`;
            });

        if (chips.length) {
            $activeFilters.html(chips.join('')).removeAttr('hidden');
        } else {
            $activeFilters.attr('hidden', '').empty();
        }
    }

    function removeActiveFilter(key) {
        delete state.params[key];
        state.page = 1;
        renderActiveFilters(state.params);
        doSearch(state.params);
    }

    // ── Wizard search (called from KC.Wizard via KC.Search.runWizardSearch) ───

    function runWizardSearch() {
        const ws = KC.Wizard.state;

        const params = { status: 'published' };
        if (ws.app)        params.application  = ws.app;
        if (ws.tech)       params.technology    = ws.tech;
        if (ws.volt)       params.voltage       = ws.volt;
        if (ws.categoryId) params.category_id   = ws.categoryId;
        if (ws.capMin)     params.capacity_min  = ws.capMin;
        if (ws.capMax)     params.capacity_max  = ws.capMax;

        // Display version: show human-readable gamma name instead of numeric ID
        const displayParams = Object.assign({}, params);
        if (ws.gamma && ws.categoryId) {
            const lbl = KC.GAMMA_LABELS[ws.gamma];
            if (lbl) displayParams.category_id = lbl.name;
        }

        state.page = 1;
        renderActiveFilters(displayParams);
        doSearch(params);
    }

    // ── AI Search ─────────────────────────────────────────────────────────────

    function handleAISearch() {
        const query = $aiInput.val().trim();
        if (!query) return;

        setAILoading(true);
        $aiInterp.hide();

        $.ajax({
            url:    KaiseCatalog.ajaxUrl,
            method: 'POST',
            data: { action: 'kaise_ai_search', nonce: KaiseCatalog.nonce, query: query },
            success: function (res) {
                if (res.success) {
                    const params = res.data.params;
                    showAIInterpretation(params);
                    renderActiveFilters(params);
                    state.page = 1;
                    doSearch(params);
                } else {
                    showStatus('error', res.data.message || 'Error al interpretar la consulta.');
                }
            },
            error: function () {
                showStatus('error', 'Error de conexión con la IA.');
            },
            complete: function () { setAILoading(false); },
        });
    }

    function setAILoading(on) {
        $aiBtn.prop('disabled', on);
        $aiBtn.find('.kc-btn-text').text(on ? 'Analizando…' : 'Buscar con IA');
        if (on) $aiBtn.append('<span class="kc-spin-icon"></span>');
        else    $aiBtn.find('.kc-spin-icon').remove();
    }

    function showAIInterpretation(params) {
        const parts = [];
        Object.entries(params).forEach(([k, v]) => {
            if (k === 'status') return;
            const label = PARAM_LABELS[k] || k;
            parts.push(`<strong>${label}:</strong> ${escHtml(String(v))}`);
        });
        if (parts.length) $aiInterp.html('🔍 Interpretado como: ' + parts.join(' · ')).show();
    }

    // ── Advanced filter search ────────────────────────────────────────────────

    function handleFilterSearch() {
        const params = collectFilterParams();
        state.page = 1;
        renderActiveFilters(params);
        doSearch(params);
    }

    function handleReset() {
        Object.values(filters).forEach(function ($el) {
            if ($el.is(':checkbox')) $el.prop('checked', false);
            else $el.val('');
        });
        $aiInput.val('');
        $aiInterp.hide();
        $activeFilters.attr('hidden', '').empty();
        $('#kc-filter-gamma-indicator').hide();
        filters.technology.find('option').prop('disabled', false);
        filters.plate_type.find('option').prop('disabled', false);
        filters.application.find('option').prop('disabled', false);
        filters.category.find('option').prop('disabled', false);
        filters.voltage.find('option').prop('disabled', false);
        state.page = 1;
        doSearch({ status: 'published' });
    }

    function collectFilterParams() {
        const p = { status: 'published' };
        const add = function (key, val) {
            if (val !== '' && val !== null && val !== undefined) p[key] = val;
        };
        add('search',       filters.search.val().trim());
        add('voltage',      filters.voltage.val());
        add('capacity_min', filters.cap_min.val());
        add('capacity_max', filters.cap_max.val());
        add('technology',   filters.technology.val());
        add('plate_type',   filters.plate_type.val());
        add('category_id',  filters.category.val());
        add('application',  filters.application.val());
        if (filters.eurobat.is(':checked')) p.eurobat = 'true';

        return p;
    }

    // ── Search ────────────────────────────────────────────────────────────────

    let allResults = [];

    function doSearch(params) {
        state.params = Object.assign({}, params);
        state.page   = 1;

        showStatus('loading', '⏳ Buscando productos…');
        $results.hide();

        const fetchParams = Object.assign({}, state.params, { page: 1, per_page: 100 });

        $.ajax({
            url:    KaiseCatalog.ajaxUrl,
            method: 'POST',
            data:   Object.assign({ action: 'kaise_search_products', nonce: KaiseCatalog.nonce }, fetchParams),
            success: function (res) {
                if (!res.success) {
                    showStatus('error', res.data?.message || 'Error al obtener productos.');
                    return;
                }
                if (!res.data) {
                    showStatus('error', 'La API no responde. Comprueba que el servidor está activo y la URL configurada es correcta.');
                    return;
                }
                const meta  = res.data.meta?.pagination || {};
                const total = meta.total || 0;
                const pages = meta.total_pages || 1;
                allResults  = res.data.data || [];

                if (total > 100 && pages > 1) {
                    fetchRemainingPages(fetchParams, pages, total);
                } else {
                    renderLocalResults();
                }
            },
            error: function () {
                showStatus('error', 'No se pudo conectar con la API del catálogo.');
            },
        });
    }

    function fetchRemainingPages(baseParams, totalPages, total) {
        showStatus('loading', `⏳ Cargando ${total} productos…`);
        const promises = [];

        for (let p = 2; p <= Math.min(totalPages, 10); p++) {
            const pageParams = Object.assign({}, baseParams, { page: p });
            promises.push(
                $.ajax({
                    url:    KaiseCatalog.ajaxUrl,
                    method: 'POST',
                    data:   Object.assign({ action: 'kaise_search_products', nonce: KaiseCatalog.nonce }, pageParams),
                })
            );
        }

        Promise.all(promises.map(p => p.catch(() => null))).then(function (responses) {
            responses.forEach(function (res) {
                if (res && res.success) {
                    allResults = allResults.concat(res.data.data || []);
                }
            });
            renderLocalResults();
        });
    }

    function renderLocalResults() {
        state.total = allResults.length;
        state.pages = Math.ceil(state.total / KaiseCatalog.perPage);
        const start = (state.page - 1) * KaiseCatalog.perPage;
        const slice = allResults.slice(start, start + KaiseCatalog.perPage);
        renderResults(slice, state.total, state.pages);
    }

    // ── Rendering ─────────────────────────────────────────────────────────────

    function renderCurrentResults() {
        renderLocalResults();
    }

    function renderResults(products, total, pages) {
        $status.hide().removeClass('is-loading is-error is-empty');

        if (!products.length) {
            showStatus('empty', '🔍 Sin resultados. Prueba con otros filtros o amplía el rango de capacidad.');
            return;
        }

        $resultCount.html(`<strong>${total}</strong> producto${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`);

        const sorted = sortProducts([...products]);
        state.currentPageProducts = sorted;

        $grid.html(sorted.map(renderCard).join(''));
        renderPagination(pages);
        $results.show();

        $grid.find('.kc-card').on('click', function () {
            const id  = $(this).data('id');
            const idx = sorted.findIndex(p => String(p.id) === String(id));
            if (idx !== -1) openModal(sorted[idx], idx);
        });
    }

    function sortProducts(list) {
        switch (state.sort) {
            case 'name_asc':  return list.sort((a, b) => a.name.localeCompare(b.name));
            case 'name_desc': return list.sort((a, b) => b.name.localeCompare(a.name));
            case 'cap_asc':   return list.sort((a, b) => (a.attributes_json?.capacity || 0) - (b.attributes_json?.capacity || 0));
            case 'cap_desc':  return list.sort((a, b) => (b.attributes_json?.capacity || 0) - (a.attributes_json?.capacity || 0));
            default:          return list;
        }
    }

    function fixImgUrl(url) {
        if (!url) return url;
        const base = (KaiseCatalog.apiBase || '').replace(/\/$/, '');
        if (base && url.match(/^https?:\/\/localhost(:\d+)?/)) {
            return url.replace(/^https?:\/\/localhost(:\d+)?/, base);
        }
        return url;
    }

    function getMainImage(p) {
        if (p.main_image_url) return fixImgUrl(p.main_image_url);
        const media = p.media || [];
        const img   = media.find(m => m.type === 'image');
        return img ? fixImgUrl(img.url) : null;
    }

    function renderCard(p) {
        const gamma   = p.categories?.[0]?.name || '';
        const attrs   = p.attributes_json || {};
        const pills   = buildPills(attrs);
        const mainImg = getMainImage(p);
        const imgTag  = mainImg
            ? `<div class="kc-card-img-wrap"><img class="kc-card-img" src="${escHtml(mainImg)}" alt="${escHtml(p.name)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=kc-card-img-placeholder>⚡</div>'"></div>`
            : `<div class="kc-card-img-placeholder">⚡</div>`;

        return `
        <div class="kc-card" data-id="${escHtml(p.id)}" tabindex="0" role="button" aria-label="Ver ${escHtml(p.name)}">
            ${imgTag}
            <div class="kc-card-body">
                ${gamma ? `<div class="kc-card-gamma">${escHtml(gamma)}</div>` : ''}
                <div class="kc-card-name">${escHtml(p.name)}</div>
                ${p.description ? `<div class="kc-card-desc">${escHtml(truncate(p.description, 80))}</div>` : ''}
                ${pills.length ? `<div class="kc-card-attrs">${pills.join('')}</div>` : ''}
            </div>
        </div>`;
    }

    function buildPills(attrs) {
        const pills = [];
        if (attrs.voltage) pills.push(pill(`${attrs.voltage} V`));
        const cap = attrs.capacity || attrs.capacity_nominal_10h || attrs.capacity_nominal_c100;
        if (cap) pills.push(pill(`${cap} Ah`));
        if (attrs.weight) pills.push(pill(`${attrs.weight} kg`));
        if (attrs.terminal_type) pills.push(pill(attrs.terminal_type));
        return pills;
    }

    function pill(text) {
        return `<span class="kc-attr-pill">${escHtml(String(text))}</span>`;
    }

    // ── Pagination ────────────────────────────────────────────────────────────

    function renderPagination(pages) {
        if (pages <= 1) { $pagination.empty(); return; }

        let html = '';
        const cur = state.page;
        html += `<button class="kc-page-btn" data-page="${cur - 1}" ${cur === 1 ? 'disabled' : ''}>‹ Ant.</button>`;

        const range = pageRange(cur, pages);
        let prev = null;
        range.forEach(function (p) {
            if (prev !== null && p - prev > 1) html += `<span class="kc-page-btn" style="border:none;cursor:default">…</span>`;
            html += `<button class="kc-page-btn ${p === cur ? 'is-active' : ''}" data-page="${p}">${p}</button>`;
            prev = p;
        });
        html += `<button class="kc-page-btn" data-page="${cur + 1}" ${cur === pages ? 'disabled' : ''}>Sig. ›</button>`;

        $pagination.html(html);
        $pagination.find('.kc-page-btn[data-page]').on('click', function () {
            const p = parseInt($(this).data('page'), 10);
            if (p < 1 || p > pages || p === cur) return;
            state.page = p;
            renderLocalResults();
            $wrap[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    function pageRange(cur, total) {
        const delta = 2;
        const range = [];
        for (let i = Math.max(1, cur - delta); i <= Math.min(total, cur + delta); i++) range.push(i);
        if (range[0] > 1) range.unshift(1);
        if (range[range.length - 1] < total) range.push(total);
        return range;
    }

    // ── Modal ─────────────────────────────────────────────────────────────────

    function openModal(p, idx) {
        state.currentProductIdx = idx != null ? idx : 0;
        const products = state.currentPageProducts;
        const total    = products.length;

        const $prev = $('#kc-modal-prev');
        const $next = $('#kc-modal-next');
        const $pos  = $('#kc-modal-pos');

        $prev.prop('disabled', state.currentProductIdx <= 0);
        $next.prop('disabled', state.currentProductIdx >= total - 1);
        $pos.text((state.currentProductIdx + 1) + ' / ' + total);

        const gamma  = p.categories?.[0]?.name || '';
        const catId  = p.categories?.[0]?.id   || '';
        const attrs  = p.attributes_json || {};
        const pdfUrl = getPdfUrl(p);

        $modalContent.html(renderModalSkeleton(p, gamma, attrs, pdfUrl));
        $modal.removeAttr('hidden');
        $modal.find('.kc-modal-close').focus();
        $('body').css('overflow', 'hidden');

        if (!catId) return;

        $.ajax({
            url:    KaiseCatalog.ajaxUrl,
            method: 'POST',
            data: { action: 'kaise_get_category_detail', nonce: KaiseCatalog.nonce, category_id: catId },
            success: function (res) {
                if (!res.success) {
                    $('#kc-cat-section').removeAttr('hidden');
                    $('#kc-cat-specs').html(`<p class="kc-no-data kc-error-msg">⚠ ${escHtml(res.data?.message || 'Error cargando gamma')}</p>`);
                    return;
                }
                const cat      = res.data.category || {};
                const features = res.data.features || [];
                $('#kc-cat-specs').html(renderCatSpecs(cat));
                $('#kc-cat-features').html(renderFeatures(features));
                $('#kc-cat-section').removeAttr('hidden');
            },
            error: function (xhr) {
                $('#kc-cat-section').removeAttr('hidden');
                $('#kc-cat-specs').html(`<p class="kc-no-data kc-error-msg">⚠ Error de conexión (${xhr.status}).</p>`);
            },
        });
    }

    function navigateModal(dir) {
        const products = state.currentPageProducts;
        const newIdx   = state.currentProductIdx + dir;
        if (newIdx < 0 || newIdx >= products.length) return;
        openModal(products[newIdx], newIdx);
    }

    function getPdfUrl(p) {
        const media = p.media || [];
        const pdf   = media.find(m => m.type === 'pdf');
        return pdf ? fixImgUrl(pdf.url) : null;
    }

    function renderModalSkeleton(p, gamma, attrs, pdfUrl) {
        const mainImg  = getMainImage(p);
        const attrRows = buildAttrRows(attrs);

        const imgHtml = mainImg
            ? `<div class="kc-modal-img-wrap"><img class="kc-modal-img" src="${escHtml(mainImg)}" alt="${escHtml(p.name)}" onerror="this.parentElement.innerHTML='<div class=kc-modal-img-placeholder>⚡</div>'"></div>`
            : '';

        const contactUrl = (KaiseCatalog.contactUrl || '') + '?producto=' + encodeURIComponent(p.name);
        const actionsPdf = pdfUrl
            ? `<a href="${escHtml(pdfUrl)}" class="kc-btn kc-btn-primary" target="_blank" rel="noopener">📄 Ficha técnica</a>`
            : '';
        const actionsContact = KaiseCatalog.contactUrl
            ? `<a href="${escHtml(contactUrl)}" class="kc-btn kc-btn-ghost">✉ Solicitar información</a>`
            : '';

        return `
        ${imgHtml}
        <div class="kc-modal-header-info">
            ${gamma ? `<div class="kc-detail-gamma">${escHtml(gamma)}</div>` : ''}
            <div class="kc-detail-name">${escHtml(p.name)}</div>
            ${p.description ? `<p class="kc-detail-desc">${escHtml(p.description)}</p>` : ''}
        </div>

        ${attrRows.length
            ? `<details class="kc-modal-section" open>
                <summary>Especificaciones del producto</summary>
                <div class="kc-detail-attrs">${attrRows.join('')}</div>
               </details>`
            : ''}

        ${(actionsPdf || actionsContact)
            ? `<div class="kc-modal-actions">${actionsPdf}${actionsContact}</div>`
            : ''}

        <div id="kc-cat-section" hidden>
            <details class="kc-modal-section" open>
                <summary>Especificaciones técnicas de la gamma</summary>
                <div id="kc-cat-specs"><p class="kc-no-data">Cargando…</p></div>
            </details>
            <details class="kc-modal-section">
                <summary>Aplicaciones y compatibilidad</summary>
                <div id="kc-cat-features"><p class="kc-no-data">Cargando…</p></div>
            </details>
        </div>`;
    }

    function renderCatSpecs(cat) {
        const rows = [
            [ 'Tecnología',      cat.technology       ],
            [ 'Tipo de placa',   cat.plate_type        ],
            [ 'Vida de diseño',  cat.design_life_years ],
            [ 'Nº de ciclos',    cat.cycles            ],
            [ 'Capacidad',       cat.capacity_range    ],
            [ 'Clasif. Eurobat', cat.eurobat ? '✓ Certificada' : null ],
        ].filter(r => r[1]);

        if (!rows.length) return '<p class="kc-no-data">Sin datos de gamma.</p>';

        return `<div class="kc-detail-attrs">` +
            rows.map(function ([label, value]) {
                const cls = label === 'Clasif. Eurobat' ? 'kc-detail-attr-value kc-eurobat' : 'kc-detail-attr-value';
                return `<div class="kc-detail-attr">
                    <span class="kc-detail-attr-label">${escHtml(label)}</span>
                    <span class="${cls}">${escHtml(String(value))}</span>
                </div>`;
            }).join('') + `</div>`;
    }

    function renderFeatures(features) {
        const videos = features.filter(f => f.type === 'video');
        const compat = features.filter(f => f.type === 'compatibility');
        const apps   = features.filter(f => f.type === 'application');
        const chars  = features.filter(f => f.type === 'characteristic');
        let html = '';

        if (videos.length) {
            html += `<div class="kc-feat-section">
                <h4 class="kc-feat-title">Videos</h4>
                <div class="kc-video-grid">` +
                videos.map(function (f) {
                    let title = '', url = '';
                    try {
                        const parsed = JSON.parse(f.label);
                        title = parsed.title || '';
                        url   = parsed.url   || '';
                    } catch (e) {
                        url = f.label;
                    }
                    const vid = extractYouTubeId(url);
                    if (!vid) return '';
                    const isShort  = url.includes('/shorts/');
                    const thumb    = `https://img.youtube.com/vi/${vid}/mqdefault.jpg`;
                    const embedUrl = `https://www.youtube.com/embed/${vid}`;
                    const badge    = isShort ? '<span class="kc-video-badge">Short</span>' : '';
                    return `<div class="kc-video-card" data-embed="${escHtml(embedUrl)}" data-title="${escHtml(title)}">
                        <div class="kc-video-thumb">
                            <img src="${escHtml(thumb)}" alt="${escHtml(title)}" loading="lazy">
                            <div class="kc-video-play">▶</div>
                            ${badge}
                        </div>
                        ${title ? `<div class="kc-video-title">${escHtml(title)}</div>` : ''}
                    </div>`;
                }).join('') +
                `</div></div>`;
        }

        if (compat.length) {
            html += `<div class="kc-feat-section">
                <h4 class="kc-feat-title">Compatibilidad de aplicaciones</h4>
                <div class="kc-compat-grid">` +
                compat.map(function (f) {
                    const isBest = f.suitability === 'best';
                    const isGood = f.suitability === 'good';
                    const badge  = isBest
                        ? '<span class="kc-suit kc-suit-best" title="Aplicación óptima">★★</span>'
                        : isGood
                        ? '<span class="kc-suit kc-suit-good" title="Compatible">★</span>'
                        : '<span class="kc-suit kc-suit-neutral" title="Posible">·</span>';
                    return `<div class="kc-compat-row">${badge}<span>${escHtml(f.label)}</span></div>`;
                }).join('') + `</div></div>`;
        }

        if (apps.length) {
            html += `<div class="kc-feat-section">
                <h4 class="kc-feat-title">Aplicaciones</h4>
                <ol class="kc-feat-list">` +
                apps.map(f => `<li>${escHtml(f.label)}</li>`).join('') +
                `</ol></div>`;
        }

        if (chars.length) {
            html += `<div class="kc-feat-section">
                <h4 class="kc-feat-title">Características técnicas</h4>
                <ul class="kc-feat-list kc-feat-checks">` +
                chars.map(f => `<li><span class="kc-check">✓</span>${escHtml(f.label)}</li>`).join('') +
                `</ul></div>`;
        }

        return html || '<p class="kc-no-data">Sin datos de aplicaciones.</p>';
    }

    function extractYouTubeId(url) {
        if (!url) return null;
        let m = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
        if (m) return m[1];
        m = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);
        if (m) return m[1];
        m = url.match(/[?&]v=([A-Za-z0-9_-]{11})/);
        if (m) return m[1];
        return null;
    }

    function closeModal() {
        $modal.attr('hidden', '');
        $('body').css('overflow', '');
    }

    // ── Product attribute rows ────────────────────────────────────────────────

    const ATTR_LABELS = {
        voltage:               { label: 'Tensión',              unit: 'V'     },
        capacity:              { label: 'Capacidad C100',       unit: 'Ah'    },
        capacity_nominal_10h:  { label: 'Capacidad C10',        unit: 'Ah'    },
        capacity_nominal_c100: { label: 'Capacidad C100',       unit: 'Ah'    },
        capacity_nominal_c20:  { label: 'Capacidad C20',        unit: 'Ah'    },
        capacity_rate:         { label: 'Régimen',              unit: ''      },
        weight:                { label: 'Peso',                 unit: 'kg'    },
        length:                { label: 'Largo',                unit: 'mm'    },
        width:                 { label: 'Ancho',                unit: 'mm'    },
        height:                { label: 'Alto',                 unit: 'mm'    },
        total_height:          { label: 'Alto total',           unit: 'mm'    },
        terminal_type:         { label: 'Terminal',             unit: ''      },
        model_code:            { label: 'Código modelo',        unit: ''      },
        self_discharge:        { label: 'Autodescarga',         unit: '%/mes' },
        design_life:           { label: 'Vida de diseño',       unit: 'años'  },
        cycles:                { label: 'Ciclos',               unit: ''      },
        short_circuit_current: { label: 'Corriente CC',         unit: 'A'     },
        internal_resistance:   { label: 'Resistencia interna',  unit: 'mΩ'    },
        charge_voltage_float:  { label: 'Tensión flotación',    unit: 'V'     },
        charge_voltage_cycle:  { label: 'Tensión ciclo',        unit: 'V'     },
        max_charge_current:    { label: 'Corriente carga máx.', unit: 'A'     },
    };

    const ATTR_SKIP  = new Set(['model_code']);
    const ATTR_ORDER = ['voltage','capacity','capacity_nominal_10h','capacity_nominal_c100',
        'capacity_rate','weight','length','width','height','total_height','terminal_type'];

    function buildAttrRows(attrs) {
        const entries = Object.entries(attrs);
        entries.sort(function ([a], [b]) {
            const ia = ATTR_ORDER.indexOf(a);
            const ib = ATTR_ORDER.indexOf(b);
            if (ia === -1 && ib === -1) return 0;
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
        });
        return entries
            .filter(([k]) => !ATTR_SKIP.has(k))
            .map(function ([k, v]) {
                const def   = ATTR_LABELS[k] || { label: k.replace(/_/g, ' '), unit: '' };
                const value = def.unit ? `${v} ${def.unit}` : v;
                return `<div class="kc-detail-attr">
                    <span class="kc-detail-attr-label">${escHtml(def.label)}</span>
                    <span class="kc-detail-attr-value">${escHtml(String(value))}</span>
                </div>`;
            });
    }

    // ── Categories ────────────────────────────────────────────────────────────

    function loadCategories() {
        $.ajax({
            url:    KaiseCatalog.ajaxUrl,
            method: 'POST',
            data: { action: 'kaise_get_categories', nonce: KaiseCatalog.nonce },
            success: function (res) {
                if (!res.success || !res.data) return;
                const gammas = res.data.filter(c => c.level >= 3);
                KC.Search.categories = gammas;  // wizard paso 4 reads this for category_id lookup
                // Debug: log first category to verify slug field name
                if (gammas.length > 0) {
                    console.log('📦 Kaise categories — primer objeto:', gammas[0]);
                    console.log('📦 Slug field check → id:', gammas[0].id, '| slug:', gammas[0].slug, '| name:', gammas[0].name);
                }
                gammas.forEach(function (c) {
                    // API slugs use "kaise-" prefix (e.g. "kaise-opzv") but
                    // KC.GAMMA_DATA uses bare IDs ("opzv"). Strip prefix here
                    // so all compat lookups work without changes elsewhere.
                    _catSlugMap[String(c.id)] = (c.slug || '').replace(/^kaise-/, '');
                    filters.category.append(`<option value="${escHtml(c.id)}">${escHtml(c.name)}</option>`);
                });
                console.log('📦 _catSlugMap:', _catSlugMap);
            },
        });
    }

    // ── Status ────────────────────────────────────────────────────────────────

    function showStatus(type, msg) {
        $results.hide();
        $status.removeClass('is-loading is-error is-empty').addClass('is-' + type).text(msg).show();
    }

    // ── Utilities ─────────────────────────────────────────────────────────────

    function escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    function truncate(str, len) {
        return str.length > len ? str.slice(0, len) + '…' : str;
    }

    // Video cards — click thumbnail → swap with iframe
    $(document).on('click', '.kc-video-card', function () {
        const $card    = $(this);
        const embedUrl = $card.data('embed');
        const title    = $card.data('title') || 'Video';
        if (!embedUrl) return;
        $card.find('.kc-video-thumb').replaceWith(
            `<div class="kc-video-embed">
                <iframe src="${embedUrl}?autoplay=1&rel=0" title="${escHtml(title)}"
                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen loading="lazy"></iframe>
            </div>`
        );
        $card.off('click');
    });

    $(document).on('keypress', '.kc-card', function (e) {
        if (e.which === 13 || e.which === 32) $(this).trigger('click');
    });

    $(document).ready(function () {
        if ($('#kaise-catalog').length) init();
    });

}(jQuery));
