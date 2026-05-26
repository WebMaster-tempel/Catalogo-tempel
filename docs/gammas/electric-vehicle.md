# Gamma: KAISE ELECTRIC VEHICLE

## Identificador interno
`electric-vehicle`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | VRLA-AGM |
| Tipo de placa | Flat |
| Familia | Movilidad |
| Clasificación Eurobat | SÍ |
| Número de ciclos | ≈1200 |
| Vida de diseño | — (no especificado en catálogo) |

## Voltajes disponibles
- **6 V**
- **8 V** (único voltaje 8V del catálogo)
- **12 V**

## Capacidades disponibles
- 6V: 230 – 250 Ah
- 8V: 190 Ah
- 12V: 17 – 170 Ah
- **Rango total:** 17 – 250 Ah
- **Dos regímenes de capacidad:** 10h (C10) y 3h (C3) — aplica a modelos 12V

## Productos

### 6 V
| Modelo | Cap. C10 (Ah) | Cap. C3 (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|---|
| KB6200EV | 230 | 201 | 260 | 180 | 268 | 273 | M8 | 32,5 |
| KB6220EV | 250 | 220 | 260 | 180 | 268 | 273 | M8 | 35,0 |

### 8 V
| Modelo | Cap. C10 (Ah) | Cap. C3 (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|---|
| KB8170EV | 190 | 170 | 260 | 180 | 280 | 280 | M8 | 36,5 |

### 12 V
| Modelo | Cap. C10 (Ah) | Cap. C3 (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|---|
| KB1212EV | 17 | 13,3 (C2) | 151 | 99 | 98 | 98,5 | M5 | 4,35 |
| KB1220EV | 29,5 | 23 (C2) | 181 | 77 | 170 | 170 | M5 | 6,9 |
| KB1255EV | 55 | 52,3 | 223 | 136 | 177 | 177 | M6 | 14,1 |
| KB1280EV | 100 | 80 | 260 | 168 | 210 | 210 | M6 | 26,5 |
| KB12110EV | 118 | 106 | 330 | 172 | 214 | 214 | M8 | 33,2 |
| KB12120EV | 137 | 120 | 407 | 175 | 212 | 216 | M8 | 40,0 |
| KB12135EV | 157 | 135 | 336 | 172 | 279 | 279 | M8 | 45,0 |
| KB12150EV | 170 | 150 | 481 | 170 | 239 | 239 | M8 | 50,0 |

**Total SKUs: 11**

## Características generales
- Rejilla y material activo especializados para tracción ligera
- Caja de polipropileno resistente a impactos, vibraciones y ambientes extremos
- Tecnología de celdas secas (seco = sin electrolito libre)
- Ciclos de vida mejorados en aplicaciones comerciales, industriales, residenciales y privadas
- Rango operativo: –40°C a +60°C
- Aislamiento doble con separadores de fibra de vidrio microporosos
- Sistema de supresión de llamas a través de válvulas
- Baja autodescarga: 1%–3%/mes
- Terminal multifunciones
- Clasificada como "Batería no derramable" (UN2800) para transporte
- Cumple normas DOT HMR49, materiales no peligrosos
- Sin necesidad de mantenimiento

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| Energías Renovables | X |
| Movilidad | X |
| Sanitario | X |
| Telecomunicaciones | - |
| UPS / SAI | - |
| Iluminación de Emergencia | - |
| TV por Cable | - |
| Centrales Eléctricas | - |
| Electrónica General | - |
| Red Ferroviaria | - |
| Universal | - |

> XX = mejor opción · X = compatible · - = no compatible

## Aplicaciones reales (del catálogo de producto)
- Bicicletas eléctricas y sillas de ruedas
- Coches, triciclos y carritos de golf
- Aspiradoras industriales
- Juguetes eléctricos
- Energías renovables

## Reglas de filtro derivadas

```
Si gamma = electric-vehicle:
  → tecnología = VRLA-AGM, placa = Flat
  → voltaje ∈ {6, 8, 12}
  → voltaje = 8V → única gamma con 8V en todo el catálogo
  → si voltaje = 6V → capacidad ∈ [230 – 250 Ah]
  → si voltaje = 8V → capacidad = 190 Ah (solo 1 SKU)
  → si voltaje = 12V → capacidad ∈ [17 – 170 Ah]
  → aplicación ∈ {Energías Renovables, Movilidad, Sanitario}
```

## Notas
- **8V** = voltaje único en todo el catálogo → si usuario filtra 8V solo aparece esta gamma
- KB1212EV y KB1220EV: columna C3 muestra "C2" en vez de C3 — régimen distinto para modelos pequeños
- Terminal M5 en modelos pequeños (17-29.5 Ah), M6 en medios, M8 en grandes
- Polipropileno impacto-resistente = diseñado para vibración (vehículos)
- Clasificación UN2800 "no derramable" = puede transportarse sin restricciones IATA/ADR
