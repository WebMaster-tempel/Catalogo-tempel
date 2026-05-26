/**
 * kc-compat.js — Battery compatibility algorithm for Kaise Catalog.
 * Depends on: kc-data.js (KC.GAMMA_DATA, KC.APP_COMPAT, KC.APP_TO_COMPAT)
 */
(function () {
    'use strict';

    window.KC = window.KC || {};

    var Compat = {};

    Compat.matchesTech = function (gamma, tech) {
        if (!tech) return true;
        if (tech === 'Lead Carbon') return gamma.isLeadCarbon === true;
        if (tech === 'VRLA-AGM')   return gamma.technology === 'VRLA-AGM';
        return gamma.technology === tech;
    };

    /**
     * Returns array of gamma objects that match all active filters.
     * Any parameter can be null/undefined to skip that filter.
     */
    Compat.computeValidGammas = function (tech, plate, app) {
        var compatKey = null;
        if (app && Object.prototype.hasOwnProperty.call(KC.APP_TO_COMPAT, app)) {
            compatKey = KC.APP_TO_COMPAT[app]; // may be null (no restriction)
        }

        return KC.GAMMA_DATA.filter(function (g) {
            if (!Compat.matchesTech(g, tech))      return false;
            if (plate && g.plate !== plate)         return false;
            if (compatKey) {
                var row = KC.APP_COMPAT[compatKey];
                var c   = row ? row[g.id] : null;
                if (!c || c === '-') return false;
            }
            return true;
        });
    };

    /** Technologies that produce ≥1 valid gamma given plate + app constraints. */
    Compat.getAvailableTechs = function (plate, app) {
        var available = new Set();
        ['LiFePO4', 'VRLA-AGM', 'VRLA-GEL', 'Lead Carbon'].forEach(function (t) {
            if (Compat.computeValidGammas(t, plate, app).length > 0) available.add(t);
        });
        return available;
    };

    /** Plate types that produce ≥1 valid gamma given tech + app constraints. */
    Compat.getAvailablePlates = function (tech, app) {
        var available = new Set();
        ['Plana', 'Tubular', 'Prismática'].forEach(function (p) {
            if (Compat.computeValidGammas(tech, p, app).length > 0) available.add(p);
        });
        return available;
    };

    /** Application values that produce ≥1 valid gamma given tech + plate constraints. */
    Compat.getAvailableApps = function (tech, plate) {
        var available = new Set();
        Object.keys(KC.APP_TO_COMPAT).forEach(function (appVal) {
            if (Compat.computeValidGammas(tech, plate, appVal).length > 0) available.add(appVal);
        });
        return available;
    };

    /** Apps compatible with a specific gamma (has non-'-' entry in APP_COMPAT). */
    Compat.getAvailableAppsForGamma = function (gammaId) {
        var available = new Set();
        Object.keys(KC.APP_TO_COMPAT).forEach(function (appVal) {
            var compatKey = KC.APP_TO_COMPAT[appVal];
            if (compatKey === null) { available.add(appVal); return; } // null = no restriction
            var row = KC.APP_COMPAT[compatKey];
            var c   = row ? row[gammaId] : null;
            if (c && c !== '-') available.add(appVal);
        });
        return available;
    };

    Compat.logCompatibility = function (context, tech, plate, app, gamma) {
        var validGammas = Compat.computeValidGammas(tech, plate, app);
        var compatKey   = app ? (KC.APP_TO_COMPAT[app] || null) : null;
        console.group('🔋 Kaise Algorithm — ' + context);
        if (gamma) {
            console.log('Gamma seleccionada →', gamma, '| tech derivada:', tech, '| plate derivada:', plate);
        }
        console.log('Filtros activos →  tech:', tech, '| plate:', plate, '| app:', app);
        console.log('APP_TO_COMPAT key:', compatKey);
        console.log('Gammas válidas (' + validGammas.length + '):', validGammas.map(function (g) { return g.id; }));
        console.log('Techs disponibles:', Array.from(Compat.getAvailableTechs(plate, app)));
        console.log('Placas disponibles:', Array.from(Compat.getAvailablePlates(tech, app)));
        console.groupEnd();
    };

    KC.Compat = Compat;

})();
