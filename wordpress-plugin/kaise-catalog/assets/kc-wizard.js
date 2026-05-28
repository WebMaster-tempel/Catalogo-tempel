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
 * Step flow:
 *   1 Aplicación → 2 Características → 3 Tecnología → 4 Placa* → 5 Gama → 6 Voltaje → 7 Capacidad → 8 Resumen
 *   (* Paso 4 se auto-salta cuando la tecnología tiene un único tipo de placa disponible)
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
        plate:           '',
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
            var tiletech = $(this).data('tech') || '';

            // Sin aplicación (Ver todo / continuar sin filtro) → paso 2 sin app
            _clearStateFrom(2);
            s.app      = $(this).data('app') || '';
            s.appLabel = s.app ? ($(this).find('.kc-app-name').text() || '') : '';
            s.tech     = tiletech;
            goToStep(2);
        });

        // ── Paso 1: buscador de aplicación ─────────────────────────────────
        $wrap.on('input', '#kc-app-search', function () {
            var q = $(this).val().toLowerCase().trim();
            $wrap.find('.kc-app-tile').each(function () {
                var text = $(this).text().toLowerCase();
                $(this).toggle(!q || text.indexOf(q) !== -1);
            });
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
            // Auto-skip plate step when tech not selected or only one plate type available
            var availPlates = KC.Compat.getAvailablePlates(s.tech || null, s.app || null);
            if (!s.tech || availPlates.size <= 1) {
                s.plate = availPlates.size === 1 ? Array.from(availPlates)[0] : '';
                goToStep(5);
            } else {
                goToStep(4);
            }
        });

        // ── Paso 4: Tipo de placa ───────────────────────────────────────────
        $wrap.on('click', '#kc-plate-grid .kc-plate-pill', function () {
            var newPlate = $(this).data('plate') || '';
            if (newPlate !== s.plate) {
                s.plate = newPlate;
                _clearStateFrom(5);
            }
            goToStep(5);
        });

        $wrap.on('click', '#kc-step4-plate-skip', function () {
            s.plate = '';
            _clearStateFrom(5);
            goToStep(5);
        });

        // ── Paso 5: Gama ────────────────────────────────────────────────────
        $wrap.on('click', '.kc-gamma-card:not([disabled])', function () {
            var newGamma = $(this).data('gamma') || '';
            if (newGamma !== s.gamma) {
                s.gamma = newGamma;
                if (s.gamma) {
                    var cat = (KC.Search && KC.Search.categories || [])
                        .find(function (c) {
                            return (c.slug || '').replace(/^kaise-/, '') === s.gamma;
                        });
                    s.categoryId = cat ? String(cat.id) : '';
                } else {
                    s.categoryId = '';
                }
                _clearStateFrom(6);
            }
            goToStep(6);
        });

        $wrap.on('click', '#kc-step5-skip', function () {
            s.gamma      = '';
            s.categoryId = '';
            _clearStateFrom(6);
            goToStep(6);
        });

        // ── Paso 6: Voltaje ─────────────────────────────────────────────────
        $wrap.on('click', '#kc-wizard-volt-pills .kc-volt-pill:not([disabled])', function () {
            var newVolt = $(this).data('v') || '';
            $('#kc-wizard-volt-pills .kc-volt-pill').removeClass('is-active');
            $(this).addClass('is-active');
            s.volt = newVolt;
            goToStep(7);
        });

        // ── Paso 7: Capacidad ───────────────────────────────────────────────
        $wrap.on('click', '.kc-cap-btn', function () {
            $('.kc-cap-btn').removeClass('is-active');
            $(this).addClass('is-active');
            $('#kc-w-cap-min').val($(this).data('min') || '');
            $('#kc-w-cap-max').val($(this).data('max') || '');
        });

        $wrap.on('click', '#kc-step7-next', function () {
            _captureCapacity();
            goToStep(8);
        });

        $wrap.on('click', '#kc-step7-skip', function () {
            s.capMin = '';
            s.capMax = '';
            $('#kc-w-cap-min, #kc-w-cap-max').val('');
            $('.kc-cap-btn').removeClass('is-active');
            $('.kc-cap-btn[data-min=""]').addClass('is-active');
            goToStep(8);
        });

        // ── Paso 8: Resumen ─────────────────────────────────────────────────
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

        // ── Reiniciar (delegated — button exists in step-7 and step-8) ────────
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
        if (n === 4) _prepareStep4();
        if (n === 5) _renderGammaGrid();
        if (n === 6) _prepareStep6();
        if (n === 7) _syncCapacityUI();
        if (n === 8) _renderSummary();
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
            $(this).toggleClass('is-done', (i + 1) < currentStep);
        });
    }

    // ── Breadcrumb ───────────────────────────────────────────────────────────

    var STEP_LABELS = ['Aplicación', 'Características', 'Tecnología', 'Placa', 'Gama', 'Voltaje', 'Capacidad'];

    function _updateBreadcrumb(currentStep) {
        var $bc = $('#kc-wizard-breadcrumb');
        if (currentStep <= 1) {
            $bc.attr('hidden', '');
            return;
        }

        var chips = [];

        if (s.app) {
            chips.push(_chip(1, (KC.APP_ICONS[s.app] || '🔋') + ' ' + s.app));
        }

        if (currentStep > 2 && s.characteristics.length > 0) {
            var charNames = s.characteristics.map(function (c) {
                return KC.CHAR_LABELS[c] || c;
            }).join(', ');
            chips.push(_chip(2, '⚙ ' + charNames));
        }

        if (currentStep > 3 && s.tech) {
            chips.push(_chip(3, '🔬 ' + (KC.TECH_DISPLAY[s.tech] || s.tech)));
        }

        if (currentStep > 4 && s.plate) {
            chips.push(_chip(4, '▬ ' + s.plate));
        }

        if (currentStep > 5 && s.gamma) {
            var gl = KC.GAMMA_LABELS[s.gamma];
            chips.push(_chip(5, (gl ? gl.icon + ' ' + gl.name : s.gamma)));
        }

        if (currentStep > 6 && s.volt) {
            chips.push(_chip(6, '⚡ ' + s.volt + ' V'));
        }

        if (currentStep > 7 && (s.capMin || s.capMax)) {
            chips.push(_chip(7, '📊 ' + _capLabel(s.capMin, s.capMax)));
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
        $('#kc-step2-app-label').text(s.appLabel ? '— ' + s.appLabel : '');
    }

    function _prepareStep3() {
        var gammasAfterChars = _getFilteredGammas(s.app, s.characteristics, null, null);
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

        if (s.tech && !availTechs.has(s.tech)) {
            s.tech = '';
        }
    }

    function _prepareStep4() {
        var availPlates = KC.Compat.getAvailablePlates(s.tech || null, s.app || null);
        var $grid = $('#kc-plate-grid');
        $grid.empty();

        var plateInfo = {
            'Plana':      { icon: '▬', desc: 'Construcción de placa plana' },
            'Tubular':    { icon: '⬭', desc: 'Placas tubulares — OPzV/OPzS' },
            'Prismática': { icon: '▮', desc: 'Celdas prismáticas LiFePO4' },
        };

        availPlates.forEach(function (plate) {
            var info = plateInfo[plate] || { icon: '▪', desc: '' };
            var isActive = plate === s.plate;
            $grid.append(
                '<button class="kc-plate-pill' + (isActive ? ' is-active' : '') + '" data-plate="' + KC.escHtml(plate) + '">' +
                '<span class="kc-plate-icon">' + info.icon + '</span>' +
                '<span class="kc-plate-name">' + KC.escHtml(plate) + '</span>' +
                '<span class="kc-plate-desc">' + KC.escHtml(info.desc) + '</span>' +
                '</button>'
            );
        });
    }

    function _renderGammaGrid() {
        var gammas = _getFilteredGammas(s.app, s.characteristics, s.tech, s.plate);
        var $grid  = $('#kc-gamma-grid');
        $grid.empty();

        // Update step-5 back button: go to plate step only if it was shown
        var availPlates = KC.Compat.getAvailablePlates(s.tech || null, s.app || null);
        var backStep = (s.tech && availPlates.size > 1) ? 4 : 3;
        $('#kc-step-5 .kc-step-back').data('back', backStep).attr('data-back', backStep);

        if (s.gamma) {
            var stillValid = gammas.some(function (g) { return g.id === s.gamma; });
            if (!stillValid) {
                s.gamma      = '';
                s.categoryId = '';
            }
        }

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

    function _prepareStep6() {
        $('#kc-wizard-volt-pills .kc-volt-pill')
            .prop('disabled', false).removeClass('is-disabled').removeAttr('title');

        $('#kc-wizard-volt-pills .kc-volt-pill').each(function () {
            $(this).toggleClass('is-active', String($(this).data('v') || '') === String(s.volt));
        });

        var allowed;

        if (s.gamma) {
            allowed = KC.GAMMA_VOLTAGES[s.gamma];
        } else {
            var filteredGammas = _getFilteredGammas(s.app, s.characteristics, s.tech, s.plate);
            if (filteredGammas.length > 0) {
                var voltSet = new Set();
                filteredGammas.forEach(function (g) {
                    (KC.GAMMA_VOLTAGES[g.id] || []).forEach(function (v) { voltSet.add(v); });
                });
                allowed = Array.from(voltSet).sort(function (a, b) { return a - b; });
            }
        }

        if (!allowed || allowed.length === 0) return;

        KC.Compat.logCompatibility('Wizard paso 6 — voltajes disponibles', s.tech || null, null, s.app || null);
        console.log('⚡ Voltajes permitidos para selección actual:', allowed);
        console.log('   Estado wizard actual:', {
            app: s.app || null, tech: s.tech || null, plate: s.plate || null,
            gamma: s.gamma || null, volt: s.volt || null,
            capMin: s.capMin || null, capMax: s.capMax || null,
            categoryId: s.categoryId || null,
        });

        $('#kc-wizard-volt-pills .kc-volt-pill').each(function () {
            var v = $(this).data('v');
            if (!v) return;
            var avail = allowed.indexOf(parseFloat(v)) >= 0;
            $(this).prop('disabled', !avail).toggleClass('is-disabled', !avail);
            if (!avail) $(this).attr('title', 'No disponible con los filtros seleccionados');
        });

        if (s.volt && allowed.indexOf(parseFloat(s.volt)) < 0) {
            s.volt = '';
            $('#kc-wizard-volt-pills .kc-volt-pill').removeClass('is-active');
        }
    }

    function _syncCapacityUI() {
        $('#kc-w-cap-min').val(s.capMin || '');
        $('#kc-w-cap-max').val(s.capMax || '');

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

    // ── Summary (step 8) ─────────────────────────────────────────────────────

    function _renderSummary() {
        var rows = [
            { label: 'Aplicación',      step: 1, value: s.app   ? (KC.APP_ICONS[s.app] || '') + ' ' + s.app : null },
            { label: 'Características', step: 2, value: s.characteristics.length ? s.characteristics.map(function (c) { return KC.CHAR_LABELS[c] || c; }).join(', ') : null },
            { label: 'Tecnología',      step: 3, value: s.tech  ? (KC.TECH_DISPLAY[s.tech] || s.tech) : null },
            { label: 'Placa',           step: 4, value: s.plate || null },
            { label: 'Gama',            step: 5, value: s.gamma ? (KC.GAMMA_LABELS[s.gamma] ? KC.GAMMA_LABELS[s.gamma].icon + ' ' + KC.GAMMA_LABELS[s.gamma].name : s.gamma) : null },
            { label: 'Voltaje',         step: 6, value: s.volt  ? s.volt + ' V' : null },
            { label: 'Capacidad',       step: 7, value: _capLabel(s.capMin, s.capMax) },
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
     * Returns gamma objects compatible with app + characteristics + tech + plate.
     */
    function _getFilteredGammas(app, chars, tech, plate) {
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

        if (plate) {
            gammas = gammas.filter(function (g) { return g.plate === plate; });
        }

        return gammas;
    }

    // ── State helpers ─────────────────────────────────────────────────────────

    function _clearStateFrom(n) {
        if (n <= 2) { s.characteristics = []; }
        if (n <= 3) { s.tech = ''; }
        if (n <= 4) { s.plate = ''; }
        if (n <= 5) { s.gamma = ''; s.categoryId = ''; }
        if (n <= 6) { s.volt = ''; }
        if (n <= 7) { s.capMin = ''; s.capMax = ''; }
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
