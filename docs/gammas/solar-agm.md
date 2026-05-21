# Gamma: KAISE SOLAR AGM

## Identificador interno
`solar-agm`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | VRLA-AGM |
| Tipo de placa | Flat |
| Familia | VRLA/AGM |
| Clasificación Eurobat | SÍ |
| Número de ciclos | ≈2250 |
| Vida de diseño | 8–12 años |

## Voltajes disponibles
- **12 V** (único)

## Capacidades disponibles
- **Rango:** 80 – 250 Ah
- Capacidad medida en régimen **100h (C100)** — diferente al resto de gammas AGM (C10)

## Productos

### 12 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KBAS12800 | 80 | 350 | 166 | 175 | 175 | M6 | 19,5 |
| KBAS12900 | 90 | 258 | 168 | 212 | 215 | M6 | 22,5 |
| KBAS121200 | 120 | 330 | 171 | 216 | 219 | M8 | 29,5 |
| KBAS121400 | 140 | 407 | 173 | 237 | 237 | M8 | 33,5 |
| KBAS121600 | 160 | 341 | 173 | 281 | 286 | M8 | 41,5 |
| KBAS121800 | 180 | 484 | 170 | 241 | 241 | M8 | 42,5 |
| KBAS122500 | 250 | 522 | 240 | 219 | 222 | M8 | 59,0 |

**Total SKUs: 7**

## Características generales
- Excelente desempeño cíclico (optimizado para carga/descarga solar)
- Buen comportamiento cíclico
- Baja autodescarga
- Libre de mantenimiento convencional
- Materiales externos e internos de plástico ABS
- Configuración especial de placas + separador AGM de alta calidad
- Válvulas diseñadas para controlar pérdida de agua y evitar entrada de aire

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| Energías Renovables | XX (mejor opción) |
| Centrales Eléctricas | XX (mejor opción) |
| Telecomunicaciones | X |
| Iluminación de Emergencia | X |
| Red Ferroviaria | X |
| UPS / SAI | - |
| TV por Cable | - |
| Electrónica General | - |
| Movilidad | - |
| Sanitario | - |
| Universal | - |

> XX = mejor opción · X = compatible · - = no compatible

## Aplicaciones reales (del catálogo de producto)
- Energías renovables
- Equipos de pruebas eléctricas
- Sistemas de iluminación de emergencia
- Equipamientos marítimos
- Sistemas de telecomunicaciones
- Autocaravanas

## Reglas de filtro derivadas

```
Si gamma = solar-agm:
  → tecnología = VRLA-AGM, placa = Flat
  → voltaje = 12V (único)
  → capacidad ∈ [80 – 250 Ah] — no hay modelos pequeños
  → régimen capacidad = C100 (importante: no comparar directamente con C10 de otras gammas)
  → ciclos = ≈2250 (mayor que Long Life y Deep Cycle estándar)
  → aplicación ∉ {UPS/SAI, TV por Cable, Electrónica General, Movilidad, Sanitario, Universal}
```

## Notas
- **C100 vs C10**: la capacidad se mide a 100h, no a 10h como el resto de AGM.
  Un KBAS122500 (250 Ah C100) no equivale directamente a un KBL122500 (250 Ah C10).
  En la UI del filtro de capacidad, considerar si mostrar advertencia o normalizar.
- Gamma más pequeña en número de SKUs (7) — solo modelos de capacidad media-alta
- Sin modelos <80 Ah — no apropiada para aplicaciones con demanda pequeña
- Mayor número de ciclos que Long Life (≈2250 vs ≈1200) — por eso es "Solar" (ciclos diarios)
