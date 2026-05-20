# Gamma: KAISE DEEP CYCLE GEL

## Identificador interno
`deep-cycle-gel`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | VRLA-GEL (PURE GEL) |
| Tipo de placa | Flat |
| Familia | Gel |
| Clasificación Eurobat | SÍ |
| Número de ciclos | +1.200 |
| Vida de diseño | 15–20 años (estacionaria) |

## Voltajes disponibles
- **12 V** (único)

## Capacidades disponibles
- **Rango:** 33 – 250 Ah
- Capacidad medida en régimen **10h (C10)**

## Productos

### 12 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KBG12300 | 33 | 195 | 130 | 167 | 167 | M6 | 10,0 |
| KBG12400 | 40 | 197 | 165 | 172 | 172 | M6 | 13,2 |
| KBG12550 | 55 | 229 | 138 | 205 | 208 | M6 | 16,5 |
| KBG12650 | 65 | 350 | 166 | 175 | 175 | M6 | 21,0 |
| KBG12800 | 80 | 258 | 168 | 208 | 211 | M6 | 24,0 |
| KBG12900 | 90 | 330 | 171 | 216 | 219 | M8 | 27,0 |
| KBG121000 | 100 | 330 | 171 | 216 | 219 | M8 | 29,5 |
| KBG121200 | 120 | 407 | 173 | 237 | 237 | M8 | 33,5 |
| KBG121500 | 150 | 484 | 170 | 241 | 241 | M8 | 42,5 |
| KBG122000 | 200 | 522 | 240 | 219 | 222 | M8 | 57,0 |
| KBG122500 | 250 | 520 | 268 | 220 | 223 | M8 | 71,0 |

**Total SKUs: 11**

## Características generales
- **PURE GEL**: electrolito gel patentado
- Placas resistentes + plomo de alta pureza
- Excelente recuperación después de descarga profunda
- Larga vida útil (15–20 años en aplicaciones estacionarias)
- No sensible a descargas profundas ocasionales
- Alta capacidad térmica — reduce riesgo de fugas térmicas y secado del electrolito
- Separadores en PVC y SiO₂ de origen alemán, 100% testado
- Alta potencia
- Cumple normativas internacionales

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| Telecomunicaciones | - |
| UPS / SAI | - |
| Iluminación de Emergencia | - |
| TV por Cable | - |
| Centrales Eléctricas | - |
| Electrónica General | - |
| Red Ferroviaria | X |
| Energías Renovables | X |
| Movilidad | X |
| Sanitario | - |
| Universal | - |

> XX = mejor opción · X = compatible · - = no compatible

## Aplicaciones reales (del catálogo de producto)
- Sistemas de energía solar y eólica
- Sistemas de TV por cable
- Telecomunicaciones
- Sillas de ruedas eléctricas
- Equipamientos militares y marítimos
- Equipamientos médicos y sanitarios
- Iluminación de emergencia
- Centrales eléctricas
- Sistema ferroviario
- Carritos de Golf
- Autocaravanas

## Notas sobre discrepancia tabla maestra vs catálogo
Las aplicaciones reales del catálogo incluyen Telecomunicaciones, TV Cable, Iluminación Emergencia,
Centrales Eléctricas y Sanitario — pero la tabla maestra marca `-` para estas. La tabla maestra
parece conservadora para esta gamma. Para el algoritmo, usar la tabla maestra como fuente autoritativa.

## Reglas de filtro derivadas

```
Si gamma = deep-cycle-gel:
  → tecnología = VRLA-GEL, placa = Flat
  → voltaje = 12V (único)
  → capacidad ∈ [33 – 250 Ah]
  → vida diseño = 15-20 años (la mayor de las GEL Flat)
  → aplicación ∈ {Red Ferroviaria, Energías Renovables, Movilidad} según tabla maestra
```

## Notas
- KBG12900 y KBG121000: dimensiones idénticas (330×171×216mm), cap 90 vs 100 Ah
- "PURE GEL" — enfatiza electrolito gel puro vs gel-AGM de otras gammas
- Vida de diseño 15-20 años superior a Solar Gel (10-12 años) — gamma más duradera del catálogo GEL Flat
- C10 (no C100 como Solar Gel) — comparación directa posible con otras gammas C10
