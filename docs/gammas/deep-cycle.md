# Gamma: KAISE DEEP CYCLE

## Identificador interno
`deep-cycle`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | VRLA-AGM |
| Tipo de placa | Flat |
| Familia | VRLA/AGM |
| Clasificación Eurobat | SÍ |
| Número de ciclos | ≈1500–1700 |
| Vida de diseño | 10 años |

## Voltajes disponibles
- **12 V** (único)

## Capacidades disponibles
- **Rango:** 26 – 230 Ah
- Capacidad medida en régimen **10h (C10)**

## Productos

### 12 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KBC12260 | 26 | 166 | 176 | 125 | 125 | M5 | 8,6 |
| KBC12280 | 28 | 165 | 125 | 174 | 174 | M6 | 8,8 |
| KBC12330 | 33 | 195 | 130 | 167 | 167 | M6 | 10,0 |
| KBC12450 | 45 | 197 | 165 | 172 | 172 | M6 | 15,0 |
| KBC12550 | 55 | 229 | 138 | 205 | 208 | M6 | 17,5 |
| KBC12650 | 65 | 350 | 166 | 175 | 175 | M6 | 19,5 |
| KBC12750 | 70 | 258 | 168 | 212 | 215 | M6 | 22,5 |
| KBC121000 | 100 | 330 | 171 | 216 | 219 | M8 | 29,5 |
| KBC121200 | 120 | 407 | 173 | 237 | 237 | M8 | 33,5 |
| KBC121340 | 135 | 341 | 173 | 281 | 286 | M8 | 41,5 |
| KBC121500 | 150 | 484 | 170 | 241 | 241 | M8 | 42,5 |
| KBC122000 | 200 | 522 | 240 | 219 | 222 | M8 | 59,0 |
| KBC122300 | 230 | 521 | 269 | 204 | 209 | M8 | 67,0 |

**Total SKUs: 13**

## Características generales
- Placas muy gruesas no porosas — resisten ciclos de alta descarga repetidos
- Placas empastadas con material activo + productos químicos especiales
- Electrolito ligeramente más resistente que electrolito normal
- Elevada fiabilidad y calidad
- Recuperación después de ciclos profundos
- Alta densidad energética
- Larga vida útil en uso cíclico y en flotación
- Cumple normas internacionales JIS y DIN

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| Movilidad | XX (mejor opción) |
| Telecomunicaciones | X |
| Iluminación de Emergencia | X |
| TV por Cable | X |
| Centrales Eléctricas | - |
| Red Ferroviaria | X |
| Energías Renovables | X |
| Sanitario | X |
| Electrónica General | X |
| UPS / SAI | - |
| Universal | - |

> XX = mejor opción · X = compatible · - = no compatible

## Aplicaciones reales (del catálogo de producto)
- Sistemas de energía solar
- Sillas de ruedas eléctricas
- Coches de Golf
- Equipamientos marítimos
- Centrales eléctricas
- Sistemas de ferrocarriles
- Sistemas de telecomunicaciones
- Sistemas de TV por cable
- Sistemas de energía de emergencia
- Juguetes eléctricos
- Autocaravanas

## Reglas de filtro derivadas

```
Si gamma = deep-cycle:
  → tecnología = VRLA-AGM, placa = Flat
  → voltaje = 12V (único)
  → capacidad ∈ [26 – 230 Ah]
  → ciclos = ≈1500-1700 (superior a Long Life ≈1200, inferior a Solar AGM ≈2250)
  → aplicación ∉ {Centrales Eléctricas, UPS/SAI, Universal}
```

## Notas
- Única gamma AGM con XX en Movilidad — diseñada para ciclado profundo
- Mayor ciclos que Long Life pero menor que Solar AGM
- KBC12750: modelo nominal "75" pero cap real = 70 Ah (verificar en API)
- Sin modelos <26 Ah — no para aplicaciones pequeñas
- Diferencia clave vs Long Life: placas más gruesas, mayor capacidad de recuperación en descarga profunda
- Diferencia clave vs Solar AGM: rango de cap diferente (26-230 vs 80-250), Solar AGM mide en C100
