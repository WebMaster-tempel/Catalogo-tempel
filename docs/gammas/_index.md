# Índice de Gammas — Kaise Catalog

## Estado de documentación

| Gamma | ID interno | Familia | Archivo | Estado |
|---|---|---|---|---|
| KAISE LITIO | `litio` | Litio | [litio.md](litio.md) | ✅ Completo |
| KAISE STANDARD | `standard` | VRLA/AGM | [standard.md](standard.md) | ✅ Completo |
| KAISE LONG LIFE | `long-life` | VRLA/AGM | [long-life.md](long-life.md) | ✅ Completo |
| KAISE ULTRA LONG LIFE | `ultra-long-life` | VRLA/AGM | [ultra-long-life.md](ultra-long-life.md) | ✅ Completo |
| KAISE HIGH RATE | `high-rate` | VRLA/AGM | [high-rate.md](high-rate.md) | ✅ Completo |
| KAISE SOLAR AGM | `solar-agm` | VRLA/AGM | [solar-agm.md](solar-agm.md) | ✅ Completo |
| KAISE DEEP CYCLE | `deep-cycle` | VRLA/AGM | [deep-cycle.md](deep-cycle.md) | ✅ Completo |
| KAISE FRONTAL TERMINAL | `frontal-terminal` | VRLA/AGM | [frontal-terminal.md](frontal-terminal.md) | ✅ Completo |
| KAISE HIGH TEMPERATURE | `high-temperature` | VRLA/AGM | [high-temperature.md](high-temperature.md) | ✅ Completo |
| KAISE LEAD CARBON | `lead-carbon` | VRLA/AGM | [lead-carbon.md](lead-carbon.md) | ✅ Completo ⚠️ |
| KAISE WIND POWER | `wind-power` | VRLA/AGM | [wind-power.md](wind-power.md) | ✅ Completo ⚠️ |
| KAISE SOLAR GEL | `solar-gel` | Gel | [solar-gel.md](solar-gel.md) | ✅ Completo |
| KAISE DEEP CYCLE GEL | `deep-cycle-gel` | Gel | [deep-cycle-gel.md](deep-cycle-gel.md) | ✅ Completo |
| KAISE OPzV | `opzv` | Gel | [opzv.md](opzv.md) | ✅ Completo |
| KAISE ELECTRIC VEHICLE | `electric-vehicle` | Movilidad | [electric-vehicle.md](electric-vehicle.md) | ✅ Completo |
| KAISE TRACCIÓN | `traccion` | Movilidad | [traccion.md](traccion.md) | ✅ Completo |

## Resumen de atributos fijos por gamma

| ID | Tecnología | Placa | Eurobat | Ciclos | Vida diseño | Capacidad |
|---|---|---|---|---|---|---|
| `litio` | LiFePO4 | Prismática | NO | +6.000 | +10 años | 7–300 Ah |
| `standard` | VRLA-AGM | Flat | SÍ | ≈1050–1200 | 3–5 años | 1,2–28 Ah |
| `long-life` | VRLA-AGM | Flat | SÍ | ≈1200 | 10 años | 7,2–250 Ah |
| `ultra-long-life` | VRLA-AGM | Flat | SÍ | ≈1200 | 10–16 años | 200–3000 Ah |
| `high-rate` | VRLA-AGM | Flat | SÍ | — | 5–8 años | 5,4–250 Ah |
| `solar-agm` | VRLA-AGM | Flat | SÍ | ≈2250 | 8–12 años | 80–250 Ah |
| `deep-cycle` | VRLA-AGM | Flat | SÍ | ≈1500–1700 | 10 años | 26–230 Ah |
| `frontal-terminal` | VRLA-AGM | Flat | SÍ | — | 10–12 años | 100–200 Ah |
| `high-temperature` | VRLA-AGM | Flat | SÍ | — | 10–15 años | 100–1000 Ah |
| `lead-carbon` | VRLA-AGM | Flat | SÍ | +5.000 | 15–20 años | 75–250 Ah |
| `wind-power` | VRLA-AGM | Flat | SÍ | — | 10–12 años | 7,2–12 Ah |
| `solar-gel` | VRLA-GEL | Flat | SÍ | ≈1200 | 10–12 años | 80–250 Ah |
| `deep-cycle-gel` | VRLA-GEL | Flat | SÍ | +1.200 | 12 años | 33–250 Ah |
| `opzv` | VRLA-GEL | Tubular | SÍ | +3.500 | 16–20 años | 60–3000 Ah |
| `electric-vehicle` | VRLA-AGM | Flat | SÍ | ≈1200 | — | 17–250 Ah |
| `traccion` | VRLA-AGM | Flat | SÍ | ≈1200 | — | 150–420 Ah |

## Estructura de cada archivo gamma

```markdown
# Gamma: KAISE [NOMBRE]
## Identificador interno
## Atributos fijos
## Voltajes disponibles
## Capacidades disponibles
## Productos (tabla SKUs)
## Características generales
## Aplicaciones compatibles (tabla XX/X/-)
## Aplicaciones reales (lista del catálogo)
## Reglas de filtro derivadas
## Notas
```
