# Gamma: KAISE LONG LIFE

## Identificador interno
`long-life`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | VRLA-AGM |
| Tipo de placa | Flat |
| Familia | VRLA/AGM |
| Clasificación Eurobat | SÍ |
| Número de ciclos | ≈1200 |
| Vida de diseño | 10 años |

## Voltajes disponibles
- **12 V** (único)

## Capacidades disponibles
- **Rango:** 7,2 – 250 Ah
- Capacidad medida en régimen **10h (C10)**

## Productos

### 12 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KBL1272 | 7,2 | 151 | 65 | 94 | 100 | F1/F2 | 2,4 |
| KBL12120 | 12 | 151 | 98 | 95 | 101 | F1/F2 | 3,9 |
| KBL12180 | 18 | 181 | 77 | 168 | 168 | M5 | 5,7 |
| KBL12260 | 26 | 166 | 175 | 125 | 125 | M5 | 8,1 |
| KBL12330 | 33 | 195 | 130 | 167 | 167 | M6 | 10,0 |
| KBL12400 | 40 | 197 | 165 | 172 | 172 | M6 | 13,2 |
| KBL12450 | 45 | 197 | 165 | 172 | 172 | M6 | 15,0 |
| KBL12550 | 55 | 229 | 138 | 205 | 208 | M6 | 16,5 |
| KBL12650 | 65 | 350 | 166 | 175 | 175 | M6 | 21,0 |
| KBL12750 | 75 | 258 | 168 | 208 | 211 | M6 | 22,5 |
| KBL12900 | 90 | 307 | 168 | 211 | 214 | M6 | 28,5 |
| KBL121000 | 100 | 330 | 171 | 216 | 219 | M8 | 28,0 |
| KBL121200 | 120 | 407 | 173 | 237 | 237 | M8 | 33,5 |
| KBL121340 | 134 | 340 | 173 | 280 | 287 | M8 | 39,0 |
| KBL121500 | 150 | 484 | 170 | 241 | 241 | M8 | 42,5 |
| KBL121800 | 180 | 522 | 240 | 219 | 222 | M8 | 54,0 |
| KBL122000 | 200 | 522 | 240 | 219 | 222 | M8 | 57,0 |
| KBL122300 | 230 | 521 | 269 | 204 | 209 | M8 | 67,0 |
| KBL122500 | 250 | 520 | 268 | 220 | 223 | M8 | 68,0 |

**Total SKUs: 19**

## Características generales
- Estabilidad y alta fiabilidad
- Baja autodescarga
- Elevada densidad energética
- Larga vida útil en flotación
- Placas empastadas con rejillas de aleación Pb-Sn-Ca de alta densidad

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| UPS / SAI | XX (mejor opción) |
| Telecomunicaciones | - |
| TV por Cable | - |
| Centrales Eléctricas | - |
| Iluminación de Emergencia | X |
| Electrónica General | X |
| Red Ferroviaria | X |
| Energías Renovables | - |
| Movilidad | - |
| Sanitario | - |
| Universal | X |

> XX = mejor opción · X = compatible · - = no compatible

## Aplicaciones reales (del catálogo de producto)
- SAI
- Sistemas de telecomunicaciones
- Televisión por cable
- Centrales eléctricas
- Equipamientos marítimos y militares
- Sistemas de emergencia y ferrocarriles

## Reglas de filtro derivadas

```
Si gamma = long-life:
  → tecnología = VRLA-AGM, placa = Flat
  → voltaje = 12V (único)
  → capacidad ∈ [7,2 – 250 Ah]
  → aplicación ∉ {Telecomunicaciones, TV por Cable, Centrales Eléctricas,
                   Energías Renovables, Movilidad, Sanitario}
```

## Notas
- Solo 12V — no hay versión 6V ni 2V
- KBL12400 y KBL12450: mismas dimensiones (197×165×172mm), diferente cap (40 vs 45 Ah)
- KBL121800 y KBL122000: mismas dimensiones (522×240×219mm), diferente cap (180 vs 200 Ah)
- Diferencia clave vs Standard: doble de vida (10 vs 3-5 años), sin 6V, capacidades mayores
- Diferencia clave vs Ultra Long Life: Single voltaje 12V vs 2V (ULL es para bancos grandes)
