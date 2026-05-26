/**
 * kc-wizard.js — Multi-step guided search wizard for Kaise Catalog.
 *
 * Dependencies (must load before):
 *   kc-data.js   → KC.GAMMA_DATA, KC.APP_COMPAT, KC.CHAR_TO_GAMMAS, KC.GAMMA_LABELS,
 *                   KC.GAMMA_VOLTAGES, KC.CHAR_LABELS, KC.APP_ICONS, KC.TECH_DISPLAY,
 *                   KC.escHtml
 *   kc-compat.js → KC.Compat.*
 *
 * Provides: KC.Wizard
 *
 * KC.Wizard.init($wrap) must be called after KC.Search is populated by kaise-catalog.js.
 *
 * Step flow:
 *   1 Aplicación → 2 Características → 3 Tecnología → 4 Gama → 5 Voltaje → 6 Capacidad → 7 Resumen
 *
 * Any step can be skipped (= "Cualquiera").
 * Navigating backwards preserves all selections; re-selecting in a step
 * clears downstream state to avoid stale combinations.
 */
(function ($) {
    'use strict';

    window.KC = window.KC || {};

    // ── Wizard state ─────────────────────────────────────────────────────────

    var s = {
        step:            1,
        app:             '',
        appLabel:        '',
        tech:            '',
        volt:            '',
        characteristics: [],
        gamma:           '',
        categoryId:      '',
        capMin:          '',
        capMax:          '',
    };

    var $wrap;

    // ── Public API ───────────────────────────────────────────────────────────

    var Wizard = {
        state: s,

        /** Bind all wizard events. Call once after DOM is ready. */
        init: function ($wrapEl) {
            $wrap = $wrapEl;
            _bindEvents();
        },

        goToStep: goToStep,

        /** Remove selection made in step `n` and all downstream steps, then navigate there. */
        clearFromStep: function (n) {
            _clearStateFrom(n);
            goToStep(n);
        },

        reset: function () {
            _clearStateFrom(1);
            goToStep(1);
        },
    };

    KC.Wizard = Wizard;

    // ── Event binding ────────────────────────────────────────────────────────

    function _bindEvents() {

        // ── Paso 1: Aplicación ──────────────────────────────────────────────
        $wrap.on('click', '.kc-app-tile', function () {
            s.app      = $(this).data('app')  || '';
            s.appLabel = $(this).find('.kc-app-name').text() || '';

            // Pre-selected tech from tile (e.g. Bicicletas → LiFePO4)
            var tiletech = $(this).data('tech') || '';
            s.tech = tiletech;

            // "Ver todo el catálogo" → buscar directamente sin wizard
            if (!s.app) {
                KC.Search.runWizardSearch();
                // scroll to results area (status div becomes visible after doSearch starts)
                var $scrollTarget = $('#kc-status, #kc-results').first();
                if ($scrollTarget.length) {
                    $('html, body').animate({ scrollTop: $scrollTarget.offset().top - 40 }, 400);
                }
                return;
            }
            _clearStateFrom(2); // reset downstream on new app selection
            s.app      = $(this).data('app');
            s.appLabel = $(this).find('.kc-app-name').text();
            s.tech     = tiletech;
            goToStep(2);
        });

        // ── Paso 2: Características (multi-select) ──────────────────────────
        $wrap.on('click', '.kc-char-pill', function () {
            var charId = $(this).data('char');
            $(this).toggleClass('is-active');
            var idx = s.characteristics.indexOf(charId);
            if (idx >= 0) s.characteristics.splice(idx, 1);
            else          s.characteristics.push(charId);
            _clearStateFrom(3); // characteristics changed → downstream invalid
        });

        $wrap.on('click', '#kc-step2-continue', function () { goToStep(3); });

        $wrap.on('click', '#kc-step2-skip', function () {
            s.characteristics = [];
            $('.kc-char-pill').removeClass('is-active');
            _clearStateFrom(3);
            goToStep(3);
        });

        // ── Paso 3: Tecnología ──────────────────────────────────────────────
        $wrap.on('click', '#kc-wizard-tech-pills .kc-tech-pill:not([disabled])', function () {
            var newTech = $(this).data('tech') || '';
            if (newTech !== s.tech) {
                s.tech = newTech;
                _clearStateFrom(4);
            }
            goToStep(4);
        });

        // ── Paso 4: Gama ────────────────────────────────────────────────────
        $wrap.on('click', '.kc-gamma-card:not([disabled])', function () {
            var newGamma = $(this).data('gamma') || '';
            if (newGamma !== s.gamma) {
                s.gamma = newGamma;
                if (s.gamma) {
                    var cat = (KC.Search && KC.Search.categories || [])
                        .find(function (c) {
                            // API slugs have "kaise-" prefix; strip for comparison
                            return (c.slug || '').replace(/^kaise-/, '') === s.gamma;
                        });
                    s.categoryId = cat ? String(cat.id) : '';
                } else {
                    s.categoryId = '';
                }
                _clearStateFrom(5);
            }
            goToStep(5);
        });

        $wrap.on('click', '#kc-step4-skip', function () {
            s.gamma      = '';
            s.categoryId = '';
            _clearStateFrom(5);
            goToStep(5);
        });

        // ── Paso 5: Voltaje ─────────────────────────────────────────────────
        $wrap.on('click', '#kc-wizard-volt-pills .kc-volt-pill:not([disabled])', function () {
            var newVolt = $(this).data('v') || '';
            $('#kc-wizard-volt-pills .kc-volt-pill').removeClass('is-active');
            $(this).addClass('is-active');
            s.volt = newVolt;
            goToStep(6);
        });

        // ── Paso 6: Capacidad ───────────────────────────────────────────────
        $wrap.on('click', '.kc-cap-btn', function () {
            $('.kc-cap-btn').removeClass('is-active');
            $(this).addClass('is-active');
            $('#kc-w-cap-min').val($(this).data('min') || '');
            $('#kc-w-cap-max').val($(this).data('max') || '');
        });

        $wrap.on('click', '#kc-step6-next', function () {
            _captureCapacity();
            goToStep(7);
        });

        $wrap.on('click', '#kc-step6-skip', function () {
            s.capMin = '';
            s.capMax = '';
            $('#kc-w-cap-min, #kc-w-cap-max').val('');
            $('.kc-cap-btn').removeClass('is-active');
            $('.kc-cap-btn[data-min=""]').addClass('is-active');
            goToStep(7);
        });

        // ── Paso 7: Resumen ─────────────────────────────────────────────────
        $wrap.on('click', '#kc-wizard-search', function () {
            KC.Search.runWizardSearch();
        });

        // "Editar" links inside summary table
        $wrap.on('click', '.kc-summary-edit', function () {
            goToStep(parseInt($(this).data('step'), 10));
        });

        // ── Breadcrumb chip removal ─────────────────────────────────────────
        $wrap.on('click', '.kc-wb-remove', function (e) {
            e.stopPropagation();
            var step = parseInt($(this).closest('[data-step]').data('step'), 10);
            Wizard.clearFromStep(step);
        });

        // ── Botones "← Volver" ──────────────────────────────────────────────
        $wrap.on('click', '.kc-step-back', function () {
            var target = parseInt($(this).data('back'), 10) || 1;
            goToStep(target); // back never clears state
        });

        // ── Reiniciar (delegated — button exists in step-6 and step-7) ────────
        $wrap.on('click', '#kc-wizard-reset', function () { Wizard.reset(); });
    }

    // ── Navigation ───────────────────────────────────────────────────────────

    function goToStep(n) {
        s.step = n;

        // Hide/show steps
        $('.kc-wizard-step').attr('hidden', '');
        $('#kc-step-' + n).removeAttr('hidden');

        // Progress bar
        _updateProgress(n);

        // Breadcrumb
        _updateBreadcrumb(n);

        // Step-specific preparation
        if (n === 2) _syncCharPills();
        if (n === 3) _prepareStep3();
        if (n === 4) _renderGammaGrid();
        if (n === 5) _prepareStep5();
        if (n === 6) _syncCapacityUI();
        if (n === 7) _renderSummary();
    }

    // ── Progress bar ─────────────────────────────────────────────────────────

    function _updateProgress(currentStep) {
        var $bar = $('#kc-wizard-progress');
        if (currentStep <= 1) {
            $bar.attr('hidden', '');
            return;
        }
        $bar.removeAttr('hidden');

        $bar.find('.kc-wp-dot').each(function () {
            var stepN = parseInt($(this).data('step'), 10);
            $(this).removeClass('is-done is-active');
            if (stepN < currentStep)       $(this).addClass('is-done');
            else if (stepN === currentStep) $(this).addClass('is-active');
        });

        $bar.find('.kc-wp-line').each(function (i) {
            // line i connects dot i+1 to dot i+2 (0-indexed)
            $(this).toggleClass('is-done', (i + 1) < currentStep);
        });
    }

    // ── Breadcrumb ───────────────────────────────────────────────────────────

    var STEP_LABELS = ['Aplicación', 'Características', 'Tecnología', 'Gama', 'Voltaje', 'Capacidad'];

    function _updateBreadcrumb(currentStep) {
        var $bc = $('#kc-wizard-breadcrumb');
        if (currentStep <= 1) {
            $bc.attr('hidden', '');
            return;
        }

        var chips = [];

        // Step 1 — app (always present if we're past step 1)
        if (s.app) {
            chips.push(_chip(1, (KC.APP_ICONS[s.app] || '🔋') + ' ' + s.app));
        }

        // Steps 2-6 — only show if past that step AND has a selection
        if (currentStep > 2 && s.characteristics.length > 0) {
            var charNames = s.characteristics.map(function (c) {
                return KC.CHAR_LABELS[c] || c;
            }).join(', ');
            chips.push(_chip(2, '⚙ ' + charNames));
        }

        if (currentStep > 3 && s.tech) {
            chips.push(_chip(3, '🔬 ' + (KC.TECH_DISPLAY[s.tech] || s.tech)));
        }

        if (currentStep > 4 && s.gamma) {
            var gl = KC.GAMMA_LABELS[s.gamma];
            chips.push(_chip(4, (gl ? gl.icon + ' ' + gl.name : s.gamma)));
        }

        if (currentStep > 5 && s.volt) {
            chips.push(_chip(5, '⚡ ' + s.volt + ' V'));
        }

        if (currentStep > 6 && (s.capMin || s.capMax)) {
            chips.push(_chip(6, '📊 ' + _capLabel(s.capMin, s.capMax)));
        }

        if (chips.length === 0) {
            $bc.attr('hidden', '');
        } else {
            $bc.html(chips.join('')).removeAttr('hidden');
        }
    }

    function _chip(step, text) {
        return '<span class="kc-wb-chip" data-step="' + step + '">' +
            KC.escHtml(text) +
            ' <button class="kc-wb-remove" aria-label="Eliminar ' + STEP_LABELS[step - 1] + '">✕</button>' +
            '</span>';
    }

    // ── Step preparation functions ────────────────────────────────────────────

    function _syncCharPills() {
        $('.kc-char-pill').each(function () {
            var charId = $(this).data('char');
            $(this).toggleClass('is-active', s.characteristics.indexOf(charId) >= 0);
        });
        // Update app badge
        $('#kc-step2-app-label').text(s.appLabel ? '— ' + s.appLabel : '');
    }

    function _prepareStep3() {
        var gammasAfterChars = _getFilteredGammas(s.app, s.characteristics, null);
        var availTechs = new Set(gammasAfterChars.map(function (g) {
            return g.isLeadCarbon ? 'Lead Carbon' : g.technology;
        }));

        KC.Compat.logCompatibility('Wizard paso 3', s.tech || null, null, s.app || null);

        $('#kc-wizard-tech-pills .kc-tech-pill').each(function () {
            var t = $(this).data('tech') || '';
            if (!t) {
                $(this).prop('disabled', false).removeClass('is-disabled').removeAttr('title');
                return;
            }
            var avail = availTechs.has(t);
            $(this).prop('disabled', !avail).toggleClass('is-disabled', !avail);
            $(this).attr('title', avail ? '' : 'No disponible con los filtros anteriores');
        });

        // Invalidate pre-selected tech if no longer compatible
        if (s.tech && !availTechs.has(s.tech)) {
            s.tech = '';
        }
    }

    function _renderGammaGrid() {
        var gammas = _getFilteredGammas(s.app, s.characteristics, s.tech);
        var $grid  = $('#kc-gamma-grid');
        $grid.empty();

        // Validate previously selected gamma
        if (s.gamma) {
            var stillValid = gammas.some(function (g) { return g.id === s.gamma; });
            if (!stillValid) {
                s.gamma      = '';
                s.categoryId = '';
            }
        }

        // "Cualquiera" card always first
        $grid.append(
            '<button class="kc-gamma-card kc-gamma-card-any" data-gamma="">' +
            '<span class="kc-gamma-icon">🔋</span>' +
            '<span class="kc-gamma-name">Cualquiera →</span>' +
            '<span class="kc-gamma-desc">Sin filtro de gama</span>' +
            '</button>'
        );

        if (gammas.length === 0) {
            $grid.append('<p class="kc-gamma-empty">⚠ Sin gamas compatibles. Vuelve atrás y modifica algún filtro.</p>');
            return;
        }

        gammas.forEach(function (g) {
            var lbl = KC.GAMMA_LABELS[g.id] || { name: g.id, desc: '', icon: '🔋' };
            var isActive = g.id === s.gamma;
            $grid.append(
                '<button class="kc-gamma-card' + (isActive ? ' is-active' : '') + '" data-gamma="' + KC.escHtml(g.id) + '">' +
                '<span class="kc-gamma-icon">' + lbl.icon + '</span>' +
                '<span class="kc-gamma-name">' + KC.escHtml(lbl.name) + '</span>' +
                '<span class="kc-gamma-desc">' + KC.escHtml(lbl.desc) + '</span>' +
                '</button>'
            );
        });
    }

    function _prepareStep5() {
        // Reset all pills first
        $('#kc-wizard-volt-pills .kc-volt-pill')
            .prop('disabled', false).removeClass('is-disabled').removeAttr('title');

        // Restore active state from saved selection
        $('#kc-wizard-volt-pills .kc-volt-pill').each(function () {
            $(this).toggleClass('is-active', String($(this).data('v') || '') === String(s.volt));
        });

        // Compute allowed voltages
        var allowed;

        if (s.gamma) {
            // Specific gamma: only its voltages
            allowed = KC.GAMMA_VOLTAGES[s.gamma];
        } else {
            // No gamma: union of voltages from all filtered gammas
            var filteredGammas = _getFilteredGammas(s.app, s.characteristics, s.tech);
            if (filteredGammas.length > 0) {
                var voltSet = new Set();
                filteredGammas.forEach(function (g) {
                    (KC.GAMMA_VOLTAGES[g.id] || []).forEach(function (v) { voltSet.add(v); });
                });
                allowed = Array.from(voltSet).sort(function (a, b) { return a - b; });
            }
        }

        if (!allowed || allowed.length === 0) return;

        KC.Compat.logCompatibility('Wizard paso 5 — voltajes disponibles', s.tech || null, null, s.app || null);
        console.log('⚡ Voltajes permitidos para selección actual:', allowed);

        $('#kc-wizard-volt-pills .kc-volt-pill').each(function () {
            var v = $(this).data('v');
            if (!v) return; // "Cualquiera" siempre disponible
            var avail = allowed.indexOf(parseFloat(v)) >= 0;
            $(this).prop('disabled', !avail).toggleClass('is-disabled', !avail);
            if (!avail) $(this).attr('title', 'No disponible con los filtros seleccionados');
        });

        // Invalidate previously selected volt if no longer available
        if (s.volt && allowed.indexOf(parseFloat(s.volt)) < 0) {
            s.volt = '';
            $('#kc-wizard-volt-pills .kc-volt-pill').removeClass('is-active');
        }
    }

    function _syncCapacityUI() {
        $('#kc-w-cap-min').val(s.capMin || '');
        $('#kc-w-cap-max').val(s.capMax || '');

        // Restore cap button active state
        $('.kc-cap-btn').removeClass('is-active');
        var matched = false;
        $('.kc-cap-btn').each(function () {
            var bMin = String($(this).data('min') || '');
            var bMax = String($(this).data('max') || '');
            if (bMin === String(s.capMin || '') && bMax === String(s.capMax || '')) {
                $(this).addClass('is-active');
                matched = true;
            }
        });
        if (!matched && !s.capMin && !s.capMax) {
            $('.kc-cap-btn[data-min=""]').addClass('is-active');
        }
    }

    // ── Summary (step 7) ─────────────────────────────────────────────────────

    function _renderSummary() {
        var rows = [
            { label: 'Aplicación',      step: 1, value: s.app      ? (KC.APP_ICONS[s.app] || '') + ' ' + s.app                           : null },
            { label: 'Características', step: 2, value: s.characteristics.length ? s.characteristics.map(function (c) { return KC.CHAR_LABELS[c] || c; }).join(', ') : null },
            { label: 'Tecnología',      step: 3, value: s.tech     ? (KC.TECH_DISPLAY[s.tech] || s.tech)                                  : null },
            { label: 'Gama',            step: 4, value: s.gamma    ? (KC.GAMMA_LABELS[s.gamma] ? KC.GAMMA_LABELS[s.gamma].icon + ' ' + KC.GAMMA_LABELS[s.gamma].name : s.gamma) : null },
            { label: 'Voltaje',         step: 5, value: s.volt     ? s.volt + ' V'                                                        : null },
            { label: 'Capacidad',       step: 6, value: _capLabel(s.capMin, s.capMax) },
        ];

        var html = '<div class="kc-summary-table">' +
            rows.map(function (row) {
                var valHtml = row.value
                    ? '<span class="kc-summary-val">' + KC.escHtml(row.value) + '</span>'
                    : '<span class="kc-summary-any">Cualquiera</span>';
                return '<div class="kc-summary-row">' +
                    '<span class="kc-summary-label">' + KC.escHtml(row.label) + '</span>' +
                    valHtml +
                    '<button class="kc-summary-edit kc-btn kc-btn-ghost" data-step="' + row.step + '">Editar</button>' +
                    '</div>';
            }).join('') +
            '</div>';

        $('#kc-wizard-summary-content').html(html);
    }

    // ── Filtering helpers ─────────────────────────────────────────────────────

    /**
     * Returns gamma objects compatible with app + characteristics + tech.
     * @param {string|null} app
     * @param {string[]}    chars
     * @param {string|null} tech
     */
    function _getFilteredGammas(app, chars, tech) {
        var gammas = KC.Compat.computeValidGammas(null, null, app || null);

        if (chars && chars.length > 0) {
            var charSet = new Set();
            chars.forEach(function (charId) {
                (KC.CHAR_TO_GAMMAS[charId] || []).forEach(function (gId) { charSet.add(gId); });
            });
            gammas = gammas.filter(function (g) { return charSet.has(g.id); });
        }

        if (tech) {
            gammas = gammas.filter(function (g) {
                return tech === 'Lead Carbon' ? !!g.isLeadCarbon : g.technology === tech && !g.isLeadCarbon;
            });
        }

        return gammas;
    }

    // ── State helpers ─────────────────────────────────────────────────────────

    /** Clear wizard state for step n and all downstream steps. */
    function _clearStateFrom(n) {
        if (n <= 2) { s.characteristics = []; }
        if (n <= 3) { s.tech = ''; }
        if (n <= 4) { s.gamma = ''; s.categoryId = ''; }
        if (n <= 5) { s.volt = ''; }
        if (n <= 6) { s.capMin = ''; s.capMax = ''; }
    }

    function _captureCapacity() {
        s.capMin = $('#kc-w-cap-min').val() || '';
        s.capMax = $('#kc-w-cap-max').val() || '';
    }

    function _capLabel(min, max) {
        if (!min && !max) return null;
        if (min && max) return min + ' – ' + max + ' Ah';
        if (min)        return '≥ ' + min + ' Ah';
        return '≤ ' + max + ' Ah';
    }

})(jQuery);
