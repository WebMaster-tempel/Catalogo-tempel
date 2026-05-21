# Gamma: KAISE WIND POWER

## Identificador interno
`wind-power`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | VRLA-AGM |
| Tipo de placa | Flat |
| Familia | VRLA/AGM |
| Clasificación Eurobat | SÍ |
| Número de ciclos | — (no especificado) |
| Vida de diseño | 10–12 años (implícito por características) |

## Voltajes disponibles
- **12 V** (único)

## Capacidades disponibles
- **Rango:** 7,2 – 12 Ah
- Capacidad medida en régimen **10h (C10)**
- **Gamma de capacidad más pequeña del catálogo** — solo 2 SKUs de capacidad baja

## Productos

### 12 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KBL1272WP | 7,2 | 151 | 64,5 | 94 | 99,5 | F2 | 2,50 |
| KB12120WP | 12 | 151 | 98 | 94 | 100 | F2 | 3,85 |

**Total SKUs: 2** (gamma más pequeña del catálogo)

## Características generales
- Aleación especial de rejilla + materia prima de alta pureza → menor formación de gas
- Menor autodescarga que AGM estándar
- Tecnología de refinado de rejilla + placas más gruesas → mayor vida útil
- Velocidad de corrosión de rejilla reducida
- Menor densidad de ácido + exceso de electrolito + mayor distancia entre placas → baja temperatura
- Tecnología de recombinación de oxígeno: **sin mantenimiento**
- Carcasa ABS (ABS ignífugo opcional)
- Diseño único de válvula: controla pérdida de agua, previene entrada de aire y chispas

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| Energías Renovables | XX (mejor opción) |
| Telecomunicaciones | X |
| UPS / SAI | X |
| Iluminación de Emergencia | X |
| Red Ferroviaria | - |
| Movilidad | - |
| TV por Cable | - |
| Centrales Eléctricas | - |
| Electrónica General | - |
| Sanitario | - |
| Universal | - |

> XX = mejor opción · X = compatible · - = no compatible

## Aplicaciones reales (del catálogo de producto)
- Sistema de generación eólica
- SAI y EPS
- Luces de emergencia
- Señalización ferroviaria y aeronáutica
- Marina y estaciones de energía
- Suministro de energía para comunicaciones

## Reglas de filtro derivadas

```
Si gamma = wind-power:
  → tecnología = VRLA-AGM, placa = Flat
  → voltaje = 12V (único)
  → capacidad ∈ [7,2 – 12 Ah] — SOLO capacidades pequeñas
  → terminal = F2 (ambos modelos)
  → si usuario filtra capacidad_min > 12 → wind-power queda fuera
```

## Notas
- **Solo 2 SKUs** — la gamma más especializada y pequeña del catálogo AGM
- Mismas dimensiones base que Standard (151×65×94 / 151×98×94) pero con terminal F2
- Terminal F2 en ambos modelos (vs F1/F2 mixto en otras gammas)
- El nombre "Wind Power" y las características sugieren optimización para generación eólica
  (ciclos irregulares, baja temperatura, baja autodescarga)
- **Paradoja del catálogo:** Energías Renovables = `-` en tabla maestra pero es su aplicación principal
  → hay que decidir si corregir la tabla maestra o mantenerla y overridear en el código
