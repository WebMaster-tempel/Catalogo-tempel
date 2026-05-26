/**
 * kc-data.js — Static compatibility data for Kaise Catalog wizard.
 * No dependencies. Must load before kc-compat.js and kc-wizard.js.
 */
(function () {
    'use strict';

    window.KC = window.KC || {};

    // ── Gamma definitions ──────────────────────────────────────────────────────

    KC.GAMMA_DATA = [
        { id: 'litio',             technology: 'LiFePO4',  plate: 'Prismática' },
        { id: 'standard',          technology: 'VRLA-AGM', plate: 'Plana' },
        { id: 'long-life',         technology: 'VRLA-AGM', plate: 'Plana' },
        { id: 'ultra-long-life',   technology: 'VRLA-AGM', plate: 'Plana' },
        { id: 'high-rate',         technology: 'VRLA-AGM', plate: 'Plana' },
        { id: 'solar-agm',         technology: 'VRLA-AGM', plate: 'Plana' },
        { id: 'deep-cycle',        technology: 'VRLA-AGM', plate: 'Plana' },
        { id: 'frontal-terminal',  technology: 'VRLA-AGM', plate: 'Plana' },
        { id: 'high-temperature',  technology: 'VRLA-AGM', plate: 'Plana' },
        { id: 'lead-carbon',       technology: 'VRLA-AGM', plate: 'Plana', isLeadCarbon: true },
        { id: 'wind-power',        technology: 'VRLA-AGM', plate: 'Plana' },
        { id: 'solar-gel',         technology: 'VRLA-GEL', plate: 'Plana' },
        { id: 'deep-cycle-gel',    technology: 'VRLA-GEL', plate: 'Plana' },
        { id: 'opzv',              technology: 'VRLA-GEL', plate: 'Tubular' },
        { id: 'electric-vehicle',  technology: 'VRLA-AGM', plate: 'Plana' },
        { id: 'traccion',          technology: 'VRLA-AGM', plate: 'Plana' },
    ];

    // ── Application compatibility matrix ──────────────────────────────────────

    KC.APP_COMPAT = {
        'Telecomunicaciones': {
            'litio': 'XX', 'standard': 'X',  'long-life': '-',  'ultra-long-life': 'X',
            'high-rate': 'XX', 'solar-agm': 'X', 'deep-cycle': 'X',
            'frontal-terminal': 'XX', 'high-temperature': 'XX', 'lead-carbon': '-',
            'wind-power': 'X', 'solar-gel': 'X', 'deep-cycle-gel': '-', 'opzv': 'XX',
            'electric-vehicle': '-', 'traccion': '-',
        },
        'UPS': {
            'litio': 'X',  'standard': 'X',  'long-life': 'XX', 'ultra-long-life': 'X',
            'high-rate': 'XX', 'solar-agm': '-', 'deep-cycle': '-',
            'frontal-terminal': 'X', 'high-temperature': 'X', 'lead-carbon': '-',
            'wind-power': 'X', 'solar-gel': '-', 'deep-cycle-gel': '-', 'opzv': 'XX',
            'electric-vehicle': '-', 'traccion': '-',
        },
        'Iluminación Emergencia': {
            'litio': '-',  'standard': 'X',  'long-life': 'X',  'ultra-long-life': 'X',
            'high-rate': 'X', 'solar-agm': 'X', 'deep-cycle': 'X',
            'frontal-terminal': '-', 'high-temperature': 'X', 'lead-carbon': 'X',
            'wind-power': 'X', 'solar-gel': 'X', 'deep-cycle-gel': '-', 'opzv': 'X',
            'electric-vehicle': '-', 'traccion': '-',
        },
        'TV por Cable': {
            'litio': 'X',  'standard': 'X',  'long-life': '-',  'ultra-long-life': '-',
            'high-rate': '-', 'solar-agm': '-', 'deep-cycle': 'X',
            'frontal-terminal': '-', 'high-temperature': 'X', 'lead-carbon': '-',
            'wind-power': '-', 'solar-gel': '-', 'deep-cycle-gel': '-', 'opzv': '-',
            'electric-vehicle': '-', 'traccion': '-',
        },
        'Centrales Eléctricas': {
            'litio': '-',  'standard': 'X',  'long-life': '-',  'ultra-long-life': 'X',
            'high-rate': 'XX', 'solar-agm': 'XX', 'deep-cycle': '-',
            'frontal-terminal': '-', 'high-temperature': '-', 'lead-carbon': 'X',
            'wind-power': '-', 'solar-gel': '-', 'deep-cycle-gel': '-', 'opzv': 'X',
            'electric-vehicle': '-', 'traccion': '-',
        },
        'Electrónica General': {
            'litio': '-',  'standard': 'XX', 'long-life': 'X',  'ultra-long-life': '-',
            'high-rate': '-', 'solar-agm': '-', 'deep-cycle': 'X',
            'frontal-terminal': '-', 'high-temperature': '-', 'lead-carbon': '-',
            'wind-power': '-', 'solar-gel': '-', 'deep-cycle-gel': '-', 'opzv': '-',
            'electric-vehicle': '-', 'traccion': '-',
        },
        'Red Ferroviaria': {
            'litio': '-',  'standard': 'X',  'long-life': 'X',  'ultra-long-life': '-',
            'high-rate': '-', 'solar-agm': 'X', 'deep-cycle': 'X',
            'frontal-terminal': 'X', 'high-temperature': 'X', 'lead-carbon': '-',
            'wind-power': '-', 'solar-gel': 'X', 'deep-cycle-gel': 'X', 'opzv': 'X',
            'electric-vehicle': '-', 'traccion': '-',
        },
        'Energías Renovables': {
            'litio': 'XX', 'standard': '-',  'long-life': '-',  'ultra-long-life': 'X',
            'high-rate': '-', 'solar-agm': 'XX', 'deep-cycle': 'X',
            'frontal-terminal': 'X', 'high-temperature': 'X', 'lead-carbon': 'XX',
            'wind-power': 'XX', 'solar-gel': 'XX', 'deep-cycle-gel': 'X', 'opzv': 'X',
            'electric-vehicle': 'X', 'traccion': 'X',
        },
        'Movilidad': {
            'litio': '-',  'standard': '-',  'long-life': '-',  'ultra-long-life': '-',
            'high-rate': '-', 'solar-agm': '-', 'deep-cycle': 'XX',
            'frontal-terminal': '-', 'high-temperature': '-', 'lead-carbon': '-',
            'wind-power': '-', 'solar-gel': 'XX', 'deep-cycle-gel': 'X', 'opzv': 'X',
            'electric-vehicle': 'X', 'traccion': 'X',
        },
        'Sanitario': {
            'litio': 'X',  'standard': '-',  'long-life': '-',  'ultra-long-life': '-',
            'high-rate': '-', 'solar-agm': '-', 'deep-cycle': 'X',
            'frontal-terminal': '-', 'high-temperature': 'X', 'lead-carbon': '-',
            'wind-power': '-', 'solar-gel': 'XX', 'deep-cycle-gel': '-', 'opzv': 'X',
            'electric-vehicle': 'X', 'traccion': 'X',
        },
        'Universal': {
            'litio': '-',  'standard': 'XX', 'long-life': 'X',  'ultra-long-life': '-',
            'high-rate': '-', 'solar-agm': '-', 'deep-cycle': '-',
            'frontal-terminal': '-', 'high-temperature': '-', 'lead-carbon': '-',
            'wind-power': '-', 'solar-gel': '-', 'deep-cycle-gel': '-', 'opzv': '-',
            'electric-vehicle': '-', 'traccion': '-',
        },
    };

    // Maps plugin/API application values → APP_COMPAT keys
    KC.APP_TO_COMPAT = {
        'Solar':              'Energías Renovables',
        'SAI':                'UPS',
        'UPS':                'UPS',
        'Telecomunicaciones': 'Telecomunicaciones',
        'Bicicletas':         null,
        'Vehículo eléctrico': 'Movilidad',
        'Caravana':           'Energías Renovables',
        'Náutico':            'Movilidad',
        'Industrial':         'Universal',
        'Alarma':             'Universal',
        'Tracción':           'Movilidad',
    };

    // ── Wizard-specific data ───────────────────────────────────────────────────

    KC.CHAR_TO_GAMMAS = {
        'alta-potencia-w':   ['high-rate', 'frontal-terminal'],
        'descarga-profunda': ['solar-agm', 'deep-cycle', 'solar-gel', 'deep-cycle-gel', 'opzv', 'electric-vehicle', 'traccion', 'litio'],
        'larga-vida-diseno': ['ultra-long-life', 'lead-carbon', 'deep-cycle-gel', 'opzv'],
        'alta-temperatura':  ['high-temperature'],
        'psoc':              ['litio', 'lead-carbon'],
        'carga-rapida':      ['litio', 'lead-carbon'],
        'alta-ciclabilidad': ['solar-agm', 'deep-cycle', 'solar-gel', 'deep-cycle-gel', 'opzv', 'litio'],
        'terminal-frontal':  ['frontal-terminal'],
    };

    KC.CHAR_LABELS = {
        'alta-potencia-w':   'Alta potencia',
        'descarga-profunda': 'Descarga profunda',
        'larga-vida-diseno': 'Larga vida',
        'alta-temperatura':  'Alta temperatura',
        'psoc':              'PSoC',
        'carga-rapida':      'Carga rápida',
        'alta-ciclabilidad': 'Alta ciclabilidad',
        'terminal-frontal':  'Terminal frontal',
    };

    KC.GAMMA_LABELS = {
        'litio':             { name: 'Litio KAISE STANDARD', desc: 'LiFePO4',                 icon: '⚡' },
        'standard':          { name: 'Standard',             desc: 'VRLA-AGM, uso general',   icon: '🔋' },
        'long-life':         { name: 'Long Life',            desc: 'VRLA-AGM',                icon: '⏳' },
        'ultra-long-life':   { name: 'Ultra Long Life',      desc: 'VRLA-AGM 2V, ≥15 años',  icon: '⏳' },
        'high-rate':         { name: 'High Rate',            desc: 'VRLA-AGM, alta potencia', icon: '⚡' },
        'solar-agm':         { name: 'Solar AGM',            desc: 'VRLA-AGM, solar/ciclo',   icon: '☀️' },
        'deep-cycle':        { name: 'Deep Cycle AGM',       desc: 'VRLA-AGM',                icon: '🔄' },
        'frontal-terminal':  { name: 'Frontal Terminal',     desc: 'VRLA-AGM, rack',          icon: '📡' },
        'high-temperature':  { name: 'High Temperature',     desc: 'VRLA-AGM, hasta +80°C',  icon: '🌡️' },
        'lead-carbon':       { name: 'Lead Carbon',          desc: 'C+Pb, PSoC',              icon: '⚗️' },
        'wind-power':        { name: 'Wind Power',           desc: 'VRLA-AGM, eólica',        icon: '💨' },
        'solar-gel':         { name: 'Solar GEL',            desc: 'VRLA-GEL, solar/ciclo',   icon: '☀️' },
        'deep-cycle-gel':    { name: 'Deep Cycle GEL',       desc: 'VRLA-GEL',                icon: '🔄' },
        'opzv':              { name: 'OPzV',                 desc: 'VRLA-GEL Tubular',        icon: '🏆' },
        'electric-vehicle':  { name: 'Vehículo Eléctrico',  desc: 'VRLA-AGM, tracción',      icon: '🚗' },
        'traccion':          { name: 'Tracción',             desc: 'VRLA-AGM, industrial',    icon: '🏭' },
    };

    KC.GAMMA_VOLTAGES = {
        'litio':             [12.8, 25.6, 51.2],
        'standard':          [6, 12],
        'long-life':         [12],
        'ultra-long-life':   [2],
        'high-rate':         [6, 12],
        'solar-agm':         [12],
        'deep-cycle':        [12],
        'frontal-terminal':  [12],
        'high-temperature':  [2, 12],
        'lead-carbon':       [12],
        'wind-power':        [12],
        'solar-gel':         [12],
        'deep-cycle-gel':    [12],
        'opzv':              [2, 12],
        'electric-vehicle':  [6, 8, 12],
        'traccion':          [6, 8, 12],
    };

    KC.APP_ICONS = {
        'Solar':              '☀️',
        'SAI':                '🔌',
        'Telecomunicaciones': '📡',
        'Bicicletas':         '🚲',
        'Vehículo eléctrico': '🚗',
        'Caravana':           '🏕️',
        'Industrial':         '🏭',
        'Alarma':             '🔒',
    };

    KC.TECH_DISPLAY = {
        'VRLA-AGM':    'AGM (VRLA-AGM)',
        'VRLA-GEL':    'GEL (VRLA-GEL)',
        'LiFePO4':     'LiFePO4 (Litio Ferrofosfato)',
        'Lead Carbon': 'Lead Carbon (C+Pb)',
    };

    // ── Hardcoded category IDs (fallback when API unreachable) ────────────────
    // UUIDs match the database migrations exactly.

    KC.GAMMA_CATEGORIES = [
        { id: 'a11c1e00-1000-4000-8000-000000000001', name: 'KAISE LITIO',                       slug: 'kaise-litio' },
        { id: 'a11c1e00-1000-4000-8000-000000000002', name: 'KAISE STANDARD',                    slug: 'kaise-standard' },
        { id: 'a11c1e00-1000-4000-8000-000000000003', name: 'KAISE LONG LIFE',                   slug: 'kaise-long-life' },
        { id: 'a11c1e00-1000-4000-8000-000000000004', name: 'KAISE ULTRA LONG LIFE',             slug: 'kaise-ultra-long-life' },
        { id: 'a11c1e00-1000-4000-8000-000000000005', name: 'KAISE HIGH RATE',                   slug: 'kaise-high-rate' },
        { id: 'a11c1e00-1000-4000-8000-000000000006', name: 'KAISE SOLAR AGM',                   slug: 'kaise-solar-agm' },
        { id: 'a11c1e00-1000-4000-8000-000000000007', name: 'KAISE DEEP CYCLE AGM',              slug: 'kaise-deep-cycle' },
        { id: 'a11c1e00-1000-4000-8000-000000000008', name: 'KAISE FRONT TERMINAL',              slug: 'kaise-front-terminal' },
        { id: 'a11c1e00-1000-4000-8000-000000000009', name: 'KAISE HIGH TEMPERATURE',            slug: 'kaise-high-temperature' },
        { id: 'a13c1e00-1000-4000-8000-000000000001', name: 'KAISE ELECTRIC VEHICLE',            slug: 'kaise-electric-vehicle' },
        { id: 'a13c1e00-1000-4000-8000-000000000002', name: 'KAISE ELECTRIC VEHICLE TRACCIÓN',   slug: 'kaise-electric-vehicle-traccion' },
        { id: 'a13c1e00-1000-4000-8000-000000000003', name: 'KAISE LEAD CARBON',                 slug: 'kaise-lead-carbon' },
        { id: 'a13c1e00-1000-4000-8000-000000000004', name: 'KAISE SOLAR GEL',                   slug: 'kaise-solar-gel' },
        { id: 'a13c1e00-1000-4000-8000-000000000005', name: 'KAISE DEEP CYCLE GEL',              slug: 'kaise-deep-cycle-gel' },
        { id: 'a13c1e00-1000-4000-8000-000000000006', name: 'KAISE WIND POWER',                  slug: 'kaise-wind-power' },
        { id: 'a15c1e00-1000-4000-8000-00000000000b', name: 'KAISE OPzV',                        slug: 'kaise-opzv' },
    ];

    // ── Shared utility ─────────────────────────────────────────────────────────

    KC.escHtml = function (str) {
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    };

})();
