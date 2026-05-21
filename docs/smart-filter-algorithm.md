# Algoritmo de Filtrado Inteligente — Kaise Catalog

## 1. El problema

Los filtros actuales son independientes. El usuario puede combinar:
- Tecnología → **Lead Carbon**
- Tipo de placa → **Tubular**
- Aplicación → **Solar**

Esa combinación no existe en ningún producto del catálogo. El resultado es 0 productos y confusión.

**Objetivo:** cuando el usuario selecciona un valor, desactivar/ocultar automáticamente los valores incompatibles en los demás filtros.

---

## 2. Modelo de datos: Gammas

Cada gamma es una línea de producto con atributos fijos:

| Gamma | Tecnología | Tipo placa | Familia |
|---|---|---|---|
| Litio | LiFePO4 | Prismática | Litio |
| Standard | VRLA-AGM | Flat | VRLA/AGM |
| Long Life | VRLA-AGM | Flat | VRLA/AGM |
| Ultra Long Life | VRLA-AGM | Flat | VRLA/AGM |
| High Rate | VRLA-AGM | Flat | VRLA/AGM |
| Solar AGM | VRLA-AGM | Flat | VRLA/AGM |
| Deep Cycle | VRLA-AGM | Flat | VRLA/AGM |
| Frontal Terminal | VRLA-AGM | Flat | VRLA/AGM |
| High Temperature | VRLA-AGM | Flat | VRLA/AGM |
| Lead Carbon | VRLA-AGM | Flat | VRLA/AGM |
| Wind Power | VRLA-AGM | Flat | VRLA/AGM |
| Solar Gel | VRLA-GEL | Flat | Gel |
| Deep Cycle Gel | VRLA-GEL | Flat | Gel |
| OPzV | VRLA-GEL | Tubular | Gel |
| Electric Vehicle | VRLA-AGM | Flat | Movilidad |
| Tracción | VRLA-AGM | Flat | Movilidad |

**Reglas derivadas inmediatas:**
- `Tecnología = LiFePO4` → única gamma válida es **Litio** → `Placa = Prismática` obligatorio
- `Placa = Tubular` → única gamma válida es **OPzV** → `Tecnología = VRLA-GEL` obligatorio
- `Placa = Prismática` → única gamma válida es **Litio** → `Tecnología = LiFePO4` obligatorio
- `Tecnología = VRLA-GEL` → gammas válidas: Solar Gel, Deep Cycle Gel, OPzV → `Placa ∈ {Flat, Tubular}`
- `Tecnología = VRLA-AGM` → `Placa = Flat` siempre (todas las AGM son Flat)

---

## 3. Matriz de compatibilidad Aplicación × Gamma

**Leyenda:** `XX` = mejor opción, `X` = compatible, `-` = no compatible

### Tabla completa

| Aplicación | litio | std | long | ultra | high-rate | solar-agm | deep-cyc | frontal | high-temp | lead-c | wind | solar-gel | dc-gel | opzv | ev | trac |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Telecomunicaciones | XX | X | - | X | XX | X | X | XX | XX | - | X | X | - | XX | - | - |
| UPS | X | X | XX | X | XX | - | - | X | X | - | X | - | - | XX | - | - |
| Iluminación Emergencia | - | X | X | X | X | X | X | - | X | X | X | X | - | X | - | - |
| TV por Cable | X | X | - | - | - | - | X | - | X | - | - | - | - | - | - | - |
| Centrales Eléctricas | - | X | - | X | XX | XX | - | - | - | X | - | - | - | X | - | - |
| Electrónica General | - | XX | X | - | - | - | X | - | - | - | - | - | - | - | - | - |
| Red Ferroviaria | - | X | X | - | - | X | X | X | X | - | - | X | X | X | - | - |
| Energías Renovables | XX | - | - | X | - | XX | X | X | X | XX | XX | XX | X | X | X | X |
| Movilidad | - | - | - | - | - | - | XX | - | - | - | - | XX | X | X | X | X |
| Sanitario | X | - | - | - | - | - | X | - | X | - | - | XX | - | X | X | X |
| Universal | - | XX | X | - | - | - | - | - | - | - | - | - | - | - | - | - |

### Casos imposibles concretos (ejemplos)

| Tecnología | Aplicación | ¿Por qué es imposible? |
|---|---|---|
| Lead Carbon | Solar | Lead Carbon no tiene compatibilidad con Energías Renovables |
| Lead Carbon | Tubular | Lead Carbon = Flat siempre |
| LiFePO4 | Iluminación Emergencia | Litio no compatible con esa app |
| LiFePO4 | Universal | Litio no compatible con Universal |
| VRLA-GEL + Tubular | UPS | OPzV sí es compatible con UPS (XX) → este caso SÍ es válido |
| VRLA-GEL + Flat | Movilidad | Solar Gel y Deep Cycle Gel → Sí compatibles → válido |
| VRLA-AGM | Movilidad | Solo Deep Cycle, Electric Vehicle, Tracción → válido pero limitado |

---

## 4. El algoritmo

### Principio central

```
filtros activos → lista de gammas válidas → 
  valores posibles = unión de atributos de gammas válidas
  valores imposibles = opciones que vaciarían la lista de gammas válidas
```

### Pseudocódigo

```javascript
// Estado de filtros activos
const activeFilters = {
  technology: null,    // 'LiFePO4' | 'VRLA-AGM' | 'VRLA-GEL' | 'Lead Carbon'
  plate_type: null,    // 'Flat' | 'Tubular' | 'Prismática'
  application: null,   // 'Telecomunicaciones' | 'UPS' | etc.
  // (voltage y capacity son rangos numéricos, no afectan compatibilidad gamma)
}

function computeValidGammas(filters) {
  return ALL_GAMMAS.filter(gamma => {
    if (filters.technology && gamma.technology !== filters.technology) return false;
    if (filters.plate_type && gamma.plate_type !== filters.plate_type) return false;
    if (filters.application) {
      const compat = COMPATIBILITY[filters.application][gamma.id];
      if (compat === '-' || compat == null) return false;
    }
    return true;
  });
}

function computeAvailableOptions(activeFilters) {
  const validGammas = computeValidGammas(activeFilters);
  
  // Para cada dimensión de filtro, qué opciones siguen siendo válidas
  const availableTechs = new Set(validGammas.map(g => g.technology));
  const availablePlates = new Set(validGammas.map(g => g.plate_type));
  
  // Para aplicaciones: qué apps tienen al menos una gamma válida
  const availableApps = new Set();
  for (const app of ALL_APPLICATIONS) {
    const testFilters = { ...activeFilters, application: app };
    if (computeValidGammas(testFilters).length > 0) {
      availableApps.add(app);
    }
  }
  
  // Para tecnologías: qué techs tienen al menos una gamma que cumple los otros filtros
  const availableTechsWithCurrentApp = new Set();
  for (const tech of ALL_TECHNOLOGIES) {
    const testFilters = { ...activeFilters, technology: tech };
    if (computeValidGammas(testFilters).length > 0) {
      availableTechsWithCurrentApp.add(tech);
    }
  }
  
  return {
    technologies: availableTechsWithCurrentApp,
    plate_types: availablePlates,
    applications: availableApps,
    gamma_count: validGammas.length,
  };
}
```

### Flujo de actualización UI

```
usuario cambia filtro X
  → recalcular validGammas con todos los filtros activos
  → recalcular availableOptions
  → para cada opción de filtro Y (Y ≠ X):
      si opción ∉ availableOptions[Y] → marcar disabled + tooltip explicativo
      si opción ∈ availableOptions[Y] → marcar enabled
  → mostrar contador "N gammas disponibles"
  → si validGammas.length === 0 → mostrar error "Combinación sin resultados"
```

---

## 5. Reglas de cascada entre filtros

Las reglas siguientes derivan directamente de la estructura de gammas:

### Regla 1: Tecnología → Placa (determinístico)
```
LiFePO4   → placa DEBE ser Prismática  (solo 1 gamma)
VRLA-AGM  → placa DEBE ser Flat        (todas las AGM son Flat)
VRLA-GEL  → placa puede ser Flat o Tubular
Lead Carbon → placa DEBE ser Flat      (Lead Carbon es subtipo de AGM)
```

> **Nota:** Lead Carbon en el catálogo es una tecnología propia (VRLA-AGM mejorada con carbono). En la UI es un valor separado en el filtro tecnología.

### Regla 2: Placa → Tecnología (determinístico)
```
Prismática → tecnología DEBE ser LiFePO4
Tubular    → tecnología DEBE ser VRLA-GEL (solo OPzV es Tubular)
Flat       → tecnología puede ser cualquiera
```

### Regla 3: Aplicación + Tecnología (restricciones cruzadas)
```
Movilidad + LiFePO4    → 0 gammas → IMPOSIBLE
Universal + VRLA-GEL   → 0 gammas → IMPOSIBLE
Universal + LiFePO4    → 0 gammas → IMPOSIBLE
TV Cable  + VRLA-GEL   → 0 gammas → IMPOSIBLE
TV Cable  + Lead Carbon → 0 gammas → IMPOSIBLE
Red Ferroviaria + LiFePO4 → 0 gammas → IMPOSIBLE
Energías Renovables + Lead Carbon → 0 gammas → IMPOSIBLE
```

### Regla 4: Aplicación + Placa
```
Movilidad + Prismática → IMPOSIBLE (Litio no compatible con Movilidad)
Universal + Tubular    → IMPOSIBLE (OPzV no compatible con Universal)
TV Cable  + Tubular    → IMPOSIBLE
```

---

## 6. Datos de implementación

### Objeto `GAMMA_DATA` (JavaScript)
```javascript
const GAMMA_DATA = {
  'litio':           { technology: 'LiFePO4',   plate: 'Prismática' },
  'standard':        { technology: 'VRLA-AGM',  plate: 'Flat' },
  'long-life':       { technology: 'VRLA-AGM',  plate: 'Flat' },
  'ultra-long-life': { technology: 'VRLA-AGM',  plate: 'Flat' },
  'high-rate':       { technology: 'VRLA-AGM',  plate: 'Flat' },
  'solar-agm':       { technology: 'VRLA-AGM',  plate: 'Flat' },
  'deep-cycle':      { technology: 'VRLA-AGM',  plate: 'Flat' },
  'frontal-terminal':{ technology: 'VRLA-AGM',  plate: 'Flat' },
  'high-temperature':{ technology: 'VRLA-AGM',  plate: 'Flat' },
  'lead-carbon':     { technology: 'VRLA-AGM',  plate: 'Flat' },
  'wind-power':      { technology: 'VRLA-AGM',  plate: 'Flat' },
  'solar-gel':       { technology: 'VRLA-GEL',  plate: 'Flat' },
  'deep-cycle-gel':  { technology: 'VRLA-GEL',  plate: 'Flat' },
  'opzv':            { technology: 'VRLA-GEL',  plate: 'Tubular' },
  'electric-vehicle':{ technology: 'VRLA-AGM',  plate: 'Flat' },
  'traccion':        { technology: 'VRLA-AGM',  plate: 'Flat' },
};
```

### Objeto `APP_COMPAT` (JavaScript)
```javascript
// Valores: 'XX' = mejor, 'X' = compatible, '-' = no compatible
const APP_COMPAT = {
  'Telecomunicaciones': {
    'litio': 'XX', 'standard': 'X', 'long-life': '-', 'ultra-long-life': 'X',
    'high-rate': 'XX', 'solar-agm': 'X', 'deep-cycle': 'X',
    'frontal-terminal': 'XX', 'high-temperature': 'XX', 'lead-carbon': '-',
    'wind-power': 'X', 'solar-gel': 'X', 'deep-cycle-gel': '-', 'opzv': 'XX',
    'electric-vehicle': '-', 'traccion': '-',
  },
  'UPS': {
    'litio': 'X', 'standard': 'X', 'long-life': 'XX', 'ultra-long-life': 'X',
    'high-rate': 'XX', 'solar-agm': '-', 'deep-cycle': '-',
    'frontal-terminal': 'X', 'high-temperature': 'X', 'lead-carbon': '-',
    'wind-power': 'X', 'solar-gel': '-', 'deep-cycle-gel': '-', 'opzv': 'XX',
    'electric-vehicle': '-', 'traccion': '-',
  },
  'Iluminación Emergencia': {
    'litio': '-', 'standard': 'X', 'long-life': 'X', 'ultra-long-life': 'X',
    'high-rate': 'X', 'solar-agm': 'X', 'deep-cycle': 'X',
    'frontal-terminal': '-', 'high-temperature': 'X', 'lead-carbon': 'X',
    'wind-power': 'X', 'solar-gel': 'X', 'deep-cycle-gel': '-', 'opzv': 'X',
    'electric-vehicle': '-', 'traccion': '-',
  },
  'TV por Cable': {
    'litio': 'X', 'standard': 'X', 'long-life': '-', 'ultra-long-life': '-',
    'high-rate': '-', 'solar-agm': '-', 'deep-cycle': 'X',
    'frontal-terminal': '-', 'high-temperature': 'X', 'lead-carbon': '-',
    'wind-power': '-', 'solar-gel': '-', 'deep-cycle-gel': '-', 'opzv': '-',
    'electric-vehicle': '-', 'traccion': '-',
  },
  'Centrales Eléctricas': {
    'litio': '-', 'standard': 'X', 'long-life': '-', 'ultra-long-life': 'X',
    'high-rate': 'XX', 'solar-agm': 'XX', 'deep-cycle': '-',
    'frontal-terminal': '-', 'high-temperature': '-', 'lead-carbon': 'X',
    'wind-power': '-', 'solar-gel': '-', 'deep-cycle-gel': '-', 'opzv': 'X',
    'electric-vehicle': '-', 'traccion': '-',
  },
  'Electrónica General': {
    'litio': '-', 'standard': 'XX', 'long-life': 'X', 'ultra-long-life': '-',
    'high-rate': '-', 'solar-agm': '-', 'deep-cycle': 'X',
    'frontal-terminal': '-', 'high-temperature': '-', 'lead-carbon': '-',
    'wind-power': '-', 'solar-gel': '-', 'deep-cycle-gel': '-', 'opzv': '-',
    'electric-vehicle': '-', 'traccion': '-',
  },
  'Red Ferroviaria': {
    'litio': '-', 'standard': 'X', 'long-life': 'X', 'ultra-long-life': '-',
    'high-rate': '-', 'solar-agm': 'X', 'deep-cycle': 'X',
    'frontal-terminal': 'X', 'high-temperature': 'X', 'lead-carbon': '-',
    'wind-power': '-', 'solar-gel': 'X', 'deep-cycle-gel': 'X', 'opzv': 'X',
    'electric-vehicle': '-', 'traccion': '-',
  },
  'Energías Renovables': {
    'litio': 'XX', 'standard': '-', 'long-life': '-', 'ultra-long-life': 'X',
    'high-rate': '-', 'solar-agm': 'XX', 'deep-cycle': 'X',
    'frontal-terminal': 'X', 'high-temperature': 'X', 'lead-carbon': 'XX',
    'wind-power': 'XX', 'solar-gel': 'XX', 'deep-cycle-gel': 'X', 'opzv': 'X',
    'electric-vehicle': 'X', 'traccion': 'X',
  },
  'Movilidad': {
    'litio': '-', 'standard': '-', 'long-life': '-', 'ultra-long-life': '-',
    'high-rate': '-', 'solar-agm': '-', 'deep-cycle': 'XX',
    'frontal-terminal': '-', 'high-temperature': '-', 'lead-carbon': '-',
    'wind-power': '-', 'solar-gel': 'XX', 'deep-cycle-gel': 'X', 'opzv': 'X',
    'electric-vehicle': 'X', 'traccion': 'X',
  },
  'Sanitario': {
    'litio': 'X', 'standard': '-', 'long-life': '-', 'ultra-long-life': '-',
    'high-rate': '-', 'solar-agm': '-', 'deep-cycle': 'X',
    'frontal-terminal': '-', 'high-temperature': 'X', 'lead-carbon': '-',
    'wind-power': '-', 'solar-gel': 'XX', 'deep-cycle-gel': '-', 'opzv': 'X',
    'electric-vehicle': 'X', 'traccion': 'X',
  },
  'Universal': {
    'litio': '-', 'standard': 'XX', 'long-life': 'X', 'ultra-long-life': '-',
    'high-rate': '-', 'solar-agm': '-', 'deep-cycle': '-',
    'frontal-terminal': '-', 'high-temperature': '-', 'lead-carbon': '-',
    'wind-power': '-', 'solar-gel': '-', 'deep-cycle-gel': '-', 'opzv': '-',
    'electric-vehicle': '-', 'traccion': '-',
  },
};
```

---

## 7. Cómo aplicar en el Wizard (Tab "Búsqueda guiada")

### Dimensiones de filtro con dependencias:

```
APLICACIÓN (app-tile paso 1)
  ↕ afecta bidireccional
TECNOLOGÍA (tech-pills paso 2)
  ↕ afecta bidireccional  
TIPO DE PLACA (plate-select paso 2)
```

```
VOLTAJE y CAPACIDAD → independientes (no afectan compatibilidad gamma)
EUROBAT → independiente (solo Litio NO tiene Eurobat, resto sí)
```

### Flujo en paso 2 (especificaciones):

Cuando usuario llega a paso 2 con una app seleccionada:
1. Calcular `validGammas(app=X, tech=null, plate=null)`
2. `availableTechs` = tecnologías presentes en validGammas
3. Deshabilitar pills de tecnología que NO están en availableTechs
4. Cuando usuario selecciona tech pill:
   - Recalcular `validGammas(app=X, tech=Y, plate=null)`
   - Actualizar opciones de placa disponibles
   - Si queda 0 gammas → no permitir la selección
5. Mostrar al usuario: "X gammas disponibles" en tiempo real

### UX: ¿Deshabilitar u ocultar?

**Recomendación: deshabilitar (no ocultar)**
- El usuario puede ver que esa opción existe pero no está disponible
- Agregar tooltip: "No disponible con [filtro activo]"
- Ocultar solo si la opción nunca va a ser útil en ese contexto

---

## 8. Validación de combinaciones en el Tab "Filtros técnicos"

En el tab de filtros técnicos avanzados, aplicar el mismo algoritmo:

```javascript
// Al cambiar cualquier select/input:
function onFilterChange(changedKey, changedValue) {
  const currentFilters = collectCurrentFilters();
  currentFilters[changedKey] = changedValue;
  
  const validGammas = computeValidGammas(currentFilters);
  
  if (validGammas.length === 0) {
    showWarning(`La combinación "${formatFilters(currentFilters)}" no tiene productos. 
                 Revisa los filtros seleccionados.`);
    highlightConflictingFilter(changedKey);
  }
  
  updateAvailableOptions(currentFilters);
}
```

---

## 9. Edge cases y decisiones de diseño

### ¿Qué pasa con "Lead Carbon" como tecnología?

Lead Carbon es técnicamente VRLA-AGM con carbono. En el catálogo aparece como su propia gamma dentro de VRLA/AGM. En los filtros:
- Si el usuario selecciona `Tecnología = VRLA-AGM`, debería incluir Lead Carbon
- Si hay un filtro específico `Lead Carbon`, tratarlo como sub-tecnología

**Decisión:** Tratar Lead Carbon como valor separado del filtro tecnología. Si el usuario selecciona VRLA-AGM genérico, Lead Carbon está incluido.

### ¿XX vs X en el filtrado?

La distinción XX/X es para **ordenación y recomendación**, no para **filtrado**. Ambos son compatibles. El algoritmo usa `compat !== '-'` para determinar validez.

Usar XX para:
- Ordenar resultados (XX gammas primero)
- Añadir badge "Recomendado" en las cards de producto

### Eurobat

Litio (LiFePO4) NO tiene clasificación Eurobat. Si usuario activa filtro Eurobat + selecciona LiFePO4 → warning visible, no error bloqueante (el servidor filtrará a 0 resultados, mostrar mensaje claro).

---

## 10. Plan de implementación

1. **Fase 1:** Crear `GAMMA_DATA` y `APP_COMPAT` como constantes en `kaise-catalog.js`
2. **Fase 2:** Implementar `computeValidGammas()` y `computeAvailableOptions()`  
3. **Fase 3:** En wizard paso 2 — deshabilitar tech pills incompatibles al llegar desde app tile
4. **Fase 4:** Cuando usuario cambia tech pill → actualizar plate select
5. **Fase 5:** Añadir contador "N tipos de batería disponibles" en tiempo real
6. **Fase 6:** En tab filtros técnicos — mismo sistema de invalidación
7. **Fase 7 (opcional):** Tooltip en opciones deshabilitadas explicando por qué

### Archivos a modificar:
- `assets/kaise-catalog.js` — lógica del algoritmo
- `templates/catalog.php` — data-attributes y estructura HTML si se necesita
- `assets/kaise-catalog.css` — estilos de opciones deshabilitadas/advertencias
