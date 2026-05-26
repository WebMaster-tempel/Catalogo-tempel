# Gamma: KAISE HIGH RATE

## Identificador interno
`high-rate`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | VRLA-AGM |
| Tipo de placa | Flat |
| Familia | VRLA/AGM |
| Clasificación Eurobat | SÍ |
| Número de ciclos | — (no especificado, uso en flotación) |
| Vida de diseño | 5–8 años (5 años <116W / 8 años >135W) |

## Voltajes disponibles
- **6 V** (un único modelo)
- **12 V**

## Capacidades disponibles
- 6V: 9 Ah
- 12V: 5,4 – 250 Ah
- **Rango total:** 5,4 – 250 Ah
- **Parámetro diferencial:** Potencia nominal en Vatios (10 min @ 9,6V) — rango 153W–6882W

## Productos

### 6 V
| Modelo | Potencia (W) | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|---|
| KBHR690 | 153,48 | 9,0 | 151 | 34 | 94 | 100 | F2 | 1,4 |

### 12 V
| Modelo | Potencia (W) | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|---|
| KBHR1254 | 170,52 | 5,4 | 90 | 70 | 101 | 107 | F2 | 1,5 |
| KBHR1260 | 180 | 6,0 | 151 | 51 | 93 | 99 | F1+F2 | 1,8 |
| KBHR1290 | 306,96 | 9,0 | 151 | 65 | 94 | 100 | F2 | 2,5 |
| KBHR12120 | 409,26 | 12 | 151 | 98 | 95 | 101 | F2 | 3,2 |
| KBHR12200 | 648 | 20 | 181 | 77 | 167 | 167 | M5 | 6,2 |
| KBHR12260 | 769,2 | 26 | 166 | 176 | 125 | 125 | M5 | 8,1 |
| KBHR12280 | 799,8 | 28 | 164 | 125 | 174 | 174 | M5 | 8,4 |
| KBHR12350 | 1211,4 | 35 | 195 | 130 | 164 | 167 | M6 | 10,4 |
| KBHR12450 | 1115,4 | 45 | 197 | 165 | 170 | 170 | M6 | 14,2 |
| KBHR12550 | 1864,2 | 55 | 229 | 138 | 200 | 203 | M6 | 17,7 |
| KBHR12650 | 1990,2 | 65 | 348 | 167 | 178 | 178 | M6 | 21,4 |
| KBHR12820 | 2592 | 82 | 260 | 168 | 210 | 210 | M6 | 25,0 |
| KBHR12900 | 3060 | 95 | 307 | 168 | 211 | 214 | M6 | 31,0 |
| KBHR121000 | 3195 | 100 | 326 | 170 | 213 | 216 | M6 | 31,6 |
| KBHR121550 | 4036,8 | 155 | 335 | 172 | 275 | 278 | M6 | 42,4 |
| KBHR122200 | 6348 | 225 | 522 | 240 | 219 | 224 | M8 | 72,0 |
| KBHR122500 | 6882 | 250 | 521 | 268 | 220 | 225 | M8 | 80,5 |

**Total SKUs: 18**

## Características generales
- Baja resistencia interna (clave para alta descarga)
- Placas positivas y negativas de Pb-Sn-Ca
- Alta densidad energética y rendimiento
- Funciona con baja presión interna
- Recombinación de gases liberados en la carga
- Componentes reconocidos por UL
- Rejillas de plomo-calcio (6 meses en almacenamiento a 20°C)
- Amplitud de potencias: 162W–6200W por elemento durante 10 min (@ 1,60V/elemento)
- Hasta 30% más energía que la serie Standard

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| Telecomunicaciones | XX (mejor opción) |
| UPS / SAI | XX (mejor opción) |
| Centrales Eléctricas | XX (mejor opción) |
| Iluminación de Emergencia | X |
| Energías Renovables | - |
| TV por Cable | - |
| Electrónica General | - |
| Red Ferroviaria | - |
| Movilidad | - |
| Sanitario | - |
| Universal | - |

> XX = mejor opción · X = compatible · - = no compatible

## Aplicaciones reales (del catálogo de producto)
- Telecomunicaciones
- Equipos SAI
- Instalaciones eléctricas
- Equipos de emergencia

## Reglas de filtro derivadas

```
Si gamma = high-rate:
  → tecnología = VRLA-AGM, placa = Flat
  → voltaje ∈ {6, 12}
  → capacidad ∈ [5,4 – 250 Ah]
  → parámetro especial: potencia_nominal_W (10 min @ 9,6V) — único en el catálogo
  → aplicación ∉ {Energías Renovables, TV por Cable, Electrónica General,
                   Red Ferroviaria, Movilidad, Sanitario, Universal}
```

## Notas
- **Única gamma con columna "Potencia (W)"** — el filtro de búsqueda podría añadir campo watts
- Vida de diseño dual: 5 años (<116W) / 8 años (>135W) — depende del modelo
- Terminal F2 predominante en modelos pequeños (en lugar de F1 habitual en otras gammas)
- Un único modelo 6V (KBHR690) — si usuario filtra 6V solo aparece este modelo
- KBHR1254 y KBHR1260: capacidades muy similares (5,4 vs 6,0 Ah), dimensiones diferentes
