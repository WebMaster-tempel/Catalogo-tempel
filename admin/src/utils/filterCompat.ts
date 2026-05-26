// Smart filter compatibility — derived from official Kaise catalog
// To extend: add tags/features to TAG_LABELS / FEATURE_LABELS, then assign to gammas below.

interface GammaDef {
  technology: 'LiFePO4' | 'VRLA-AGM' | 'VRLA-GEL';
  plate:      'Plana' | 'Tubular' | 'Prismática';
  voltages:   number[];   // exact nominal voltages available
  capMin:     number;     // Ah (C10 or equivalent)
  capMax:     number;
  tags:       string[];   // application tags
  features:   string[];   // technical characteristic tags
}

// ── Application tag vocabulary ────────────────────────────────────────────────
export const TAG_LABELS: Record<string, string> = {
  'telecomunicaciones':     'Telecomunicaciones',
  'sai-ups':                'SAI / UPS',
  'iluminacion-emergencia': 'Iluminación de emergencia',
  'centrales-electricas':   'Centrales eléctricas',
  'alarmas-seguridad':      'Alarmas y seguridad',
  'maritimo':               'Marítimo',
  'renovables':             'Energías renovables',
  'solar':                  'Solar',
  'eolica':                 'Eólica',
  'smart-grid':             'Red inteligente / Smart grid',
  'almacenamiento-hogar':   'Almacenamiento doméstico',
  'energia-hibrida':        'Energía híbrida',
  'ferroviario':            'Ferroviario',
  'movilidad-ligera':       'Movilidad ligera',
  'traccion-industrial':    'Tracción industrial',
  'tv-cable':               'TV por cable',
  'medico-sanitario':       'Médico / Sanitario',
  'autocaravanas':          'Autocaravanas / Camping',
};

// ── Characteristic (feature) tag vocabulary ───────────────────────────────────
export const FEATURE_LABELS: Record<string, string> = {
  'alta-temperatura':   'Alta temperatura (hasta +80°C)',
  'psoc':               'Optimizada PSoC',
  'carga-rapida':       'Carga rápida',
  'alta-ciclabilidad':  'Alta ciclabilidad (>2 000 ciclos)',
  'descarga-profunda':  'Descarga profunda (Deep Cycle)',
  'terminal-frontal':   'Terminal frontal (rack)',
  'alta-potencia-w':    'Alta potencia en vatios (W)',
  'larga-vida-diseno':  'Larga vida de diseño (≥15 años)',
};

export const ALL_TAGS     = Object.keys(TAG_LABELS);
export const ALL_FEATURES = Object.keys(FEATURE_LABELS);

// ── API search string mappings ────────────────────────────────────────────────
// Maps tag/feature slugs to ILIKE search strings sent to the backend.
// The API does: c.applications ILIKE '%<value>%' and c.characteristics ILIKE '%<value>%'
// These strings must match the actual text stored in the categories table.
export const TAG_SEARCH: Record<string, string> = {
  'telecomunicaciones':     'telecomunicacion',
  'sai-ups':                'SAI',
  'iluminacion-emergencia': 'emergencia',
  'centrales-electricas':   'central',
  'alarmas-seguridad':      'alarma',
  'maritimo':               'mar',
  'renovables':             'renovable',
  'solar':                  'solar',
  'eolica':                 'eólica',
  'smart-grid':             'red inteligente',
  'almacenamiento-hogar':   'almacenamiento',
  'energia-hibrida':        'híbrido',
  'ferroviario':            'ferroviari',
  'movilidad-ligera':       'bicicleta',
  'traccion-industrial':    'tracción',
  'tv-cable':               'cable',
  'medico-sanitario':       'sanitario',
  'autocaravanas':          'autocaravana',
};

export const FEATURE_SEARCH: Record<string, string> = {
  'alta-temperatura':   'temperatura',
  'psoc':               'PSoC',
  'carga-rapida':       'carga rápida',
  'alta-ciclabilidad':  'ciclos',
  'descarga-profunda':  'profunda',
  'terminal-frontal':   'frontal',
  'alta-potencia-w':    'potencia',
  'larga-vida-diseno':  'vida de diseño',
};

// ── Gamma definitions ─────────────────────────────────────────────────────────
export const GAMMA_DATA: Record<string, GammaDef> = {
  'litio': {
    technology: 'LiFePO4', plate: 'Prismática',
    voltages: [12.8, 25.6, 51.2], capMin: 7, capMax: 300,
    tags:     ['telecomunicaciones', 'sai-ups', 'renovables', 'solar', 'eolica', 'maritimo', 'movilidad-ligera', 'autocaravanas'],
    features: ['psoc', 'carga-rapida', 'alta-ciclabilidad', 'descarga-profunda'],
  },
  'standard': {
    technology: 'VRLA-AGM', plate: 'Plana',
    voltages: [6, 12], capMin: 1.2, capMax: 28,
    tags:     ['telecomunicaciones', 'alarmas-seguridad', 'iluminacion-emergencia', 'tv-cable', 'maritimo', 'medico-sanitario', 'movilidad-ligera'],
    features: [],
  },
  'long-life': {
    technology: 'VRLA-AGM', plate: 'Plana',
    voltages: [12], capMin: 7.2, capMax: 250,
    tags:     ['sai-ups', 'telecomunicaciones', 'tv-cable', 'centrales-electricas', 'maritimo', 'ferroviario', 'iluminacion-emergencia'],
    features: [],
  },
  'ultra-long-life': {
    technology: 'VRLA-AGM', plate: 'Plana',
    voltages: [2], capMin: 200, capMax: 3000,
    tags:     ['telecomunicaciones', 'iluminacion-emergencia', 'centrales-electricas', 'maritimo', 'alarmas-seguridad', 'sai-ups'],
    features: ['larga-vida-diseno'],
  },
  'high-rate': {
    technology: 'VRLA-AGM', plate: 'Plana',
    voltages: [6, 12], capMin: 5.4, capMax: 250,
    tags:     ['telecomunicaciones', 'sai-ups', 'centrales-electricas', 'iluminacion-emergencia'],
    features: ['alta-potencia-w'],
  },
  'solar-agm': {
    technology: 'VRLA-AGM', plate: 'Plana',
    voltages: [12], capMin: 80, capMax: 250,
    tags:     ['renovables', 'solar', 'iluminacion-emergencia', 'maritimo', 'telecomunicaciones', 'autocaravanas'],
    features: ['descarga-profunda', 'alta-ciclabilidad'],
  },
  'deep-cycle': {
    technology: 'VRLA-AGM', plate: 'Plana',
    voltages: [12], capMin: 26, capMax: 230,
    tags:     ['solar', 'renovables', 'movilidad-ligera', 'maritimo', 'centrales-electricas', 'ferroviario', 'telecomunicaciones', 'tv-cable', 'iluminacion-emergencia', 'autocaravanas'],
    features: ['descarga-profunda', 'alta-ciclabilidad'],
  },
  'frontal-terminal': {
    technology: 'VRLA-AGM', plate: 'Plana',
    voltages: [12], capMin: 100, capMax: 200,
    tags:     ['telecomunicaciones', 'sai-ups', 'centrales-electricas', 'iluminacion-emergencia'],
    features: ['terminal-frontal'],
  },
  'high-temperature': {
    technology: 'VRLA-AGM', plate: 'Plana',
    voltages: [2, 12], capMin: 100, capMax: 1000,
    tags:     ['telecomunicaciones', 'renovables', 'solar', 'eolica', 'smart-grid', 'energia-hibrida'],
    features: ['alta-temperatura'],
  },
  'lead-carbon': {
    technology: 'VRLA-AGM', plate: 'Plana',
    voltages: [12], capMin: 75, capMax: 250,
    tags:     ['smart-grid', 'almacenamiento-hogar', 'energia-hibrida', 'renovables', 'solar', 'eolica'],
    features: ['psoc', 'carga-rapida', 'alta-ciclabilidad', 'descarga-profunda', 'larga-vida-diseno'],
  },
  'wind-power': {
    technology: 'VRLA-AGM', plate: 'Plana',
    voltages: [12], capMin: 7.2, capMax: 12,
    tags:     ['eolica', 'renovables', 'sai-ups', 'iluminacion-emergencia', 'ferroviario', 'maritimo', 'telecomunicaciones'],
    features: [],
  },
  'solar-gel': {
    technology: 'VRLA-GEL', plate: 'Plana',
    voltages: [12], capMin: 80, capMax: 250,
    tags:     ['renovables', 'solar', 'iluminacion-emergencia', 'maritimo', 'telecomunicaciones', 'autocaravanas'],
    features: ['descarga-profunda', 'alta-ciclabilidad'],
  },
  'deep-cycle-gel': {
    technology: 'VRLA-GEL', plate: 'Plana',
    voltages: [12], capMin: 33, capMax: 250,
    tags:     ['renovables', 'solar', 'eolica', 'tv-cable', 'telecomunicaciones', 'movilidad-ligera', 'maritimo', 'medico-sanitario', 'iluminacion-emergencia', 'centrales-electricas', 'ferroviario', 'autocaravanas'],
    features: ['descarga-profunda', 'alta-ciclabilidad', 'larga-vida-diseno'],
  },
  'opzv': {
    technology: 'VRLA-GEL', plate: 'Tubular',
    voltages: [2, 12], capMin: 60, capMax: 3000,
    tags:     ['telecomunicaciones', 'iluminacion-emergencia', 'centrales-electricas', 'renovables', 'sai-ups', 'ferroviario', 'maritimo'],
    features: ['alta-ciclabilidad', 'descarga-profunda', 'larga-vida-diseno'],
  },
  'electric-vehicle': {
    technology: 'VRLA-AGM', plate: 'Plana',
    voltages: [6, 8, 12], capMin: 17, capMax: 250,
    tags:     ['movilidad-ligera', 'traccion-industrial', 'renovables'],
    features: ['descarga-profunda'],
  },
  'traccion': {
    technology: 'VRLA-AGM', plate: 'Plana',
    voltages: [6, 8, 12], capMin: 120, capMax: 420,
    tags:     ['movilidad-ligera', 'traccion-industrial', 'renovables'],
    features: ['descarga-profunda'],
  },
};

export const ALL_TECHNOLOGIES = ['LiFePO4', 'VRLA-AGM', 'VRLA-GEL'] as const;
export const ALL_PLATE_TYPES  = ['Plana', 'Tubular', 'Prismática'] as const;
export const ALL_VOLTAGES     = [2, 6, 8, 12, 12.8, 25.6, 51.2] as const;

// ── Filter logic ──────────────────────────────────────────────────────────────

export interface ActiveFilters {
  technology?:   string;
  plate_type?:   string;
  tag?:          string;
  feature?:      string;
  voltage?:      number;
  capacity_min?: number;
  capacity_max?: number;
}

function gammaMatches(gammaId: string, filters: ActiveFilters): boolean {
  const g = GAMMA_DATA[gammaId];
  if (!g) return false;

  if (filters.technology && g.technology !== filters.technology)  return false;
  if (filters.plate_type  && g.plate      !== filters.plate_type) return false;
  if (filters.tag         && !g.tags.includes(filters.tag))       return false;
  if (filters.feature     && !g.features.includes(filters.feature)) return false;

  if (filters.voltage !== undefined && !g.voltages.includes(filters.voltage)) return false;

  if (filters.capacity_min !== undefined && g.capMax < filters.capacity_min) return false;
  if (filters.capacity_max !== undefined && g.capMin > filters.capacity_max) return false;

  return true;
}

export function computeValidGammas(filters: ActiveFilters): string[] {
  return Object.keys(GAMMA_DATA).filter((id) => gammaMatches(id, filters));
}

export interface AvailableOptions {
  technologies: Set<string>;
  platTypes:    Set<string>;
  tags:         Set<string>;
  features:     Set<string>;
  voltages:     Set<number>;
  count:        number;
}

export function computeAvailableOptions(active: ActiveFilters): AvailableOptions {
  const validNow = computeValidGammas(active);

  const technologies = new Set<string>();
  for (const tech of ALL_TECHNOLOGIES) {
    if (computeValidGammas({ ...active, technology: tech }).length > 0) technologies.add(tech);
  }

  const platTypes = new Set<string>();
  for (const pt of ALL_PLATE_TYPES) {
    if (computeValidGammas({ ...active, plate_type: pt }).length > 0) platTypes.add(pt);
  }

  const tags = new Set<string>();
  for (const tag of ALL_TAGS) {
    if (computeValidGammas({ ...active, tag }).length > 0) tags.add(tag);
  }

  const features = new Set<string>();
  for (const feature of ALL_FEATURES) {
    if (computeValidGammas({ ...active, feature }).length > 0) features.add(feature);
  }

  const voltages = new Set<number>();
  for (const v of ALL_VOLTAGES) {
    if (computeValidGammas({ ...active, voltage: v }).length > 0) voltages.add(v);
  }

  return { technologies, platTypes, tags, features, voltages, count: validNow.length };
}
