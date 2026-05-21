# Gamma: KAISE SOLAR GEL

## Identificador interno
`solar-gel`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | VRLA-GEL |
| Tipo de placa | Flat |
| Familia | Gel |
| Clasificación Eurobat | SÍ |
| Número de ciclos | ≈1200 |
| Vida de diseño | 10–12 años |

## Voltajes disponibles
- **12 V** (único)

## Capacidades disponibles
- **Rango:** 80 – 250 Ah
- Capacidad medida en régimen **100h (C100)**
- Sin modelos pequeños — solo capacidades medias-grandes

## Productos

### 12 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KBGS12800 | 80 | 350 | 166 | 175 | 175 | M6 | 21,0 |
| KBGS121200 | 120 | 330 | 171 | 216 | 219 | M8 | 29,5 |
| KBGS121400 | 140 | 407 | 173 | 237 | 237 | M8 | 33,5 |
| KBGS121800 | 180 | 484 | 170 | 241 | 241 | M8 | 42,0 |
| KBGS122500 | 250 | 522 | 240 | 219 | 222 | M8 | 57,0 |

**Total SKUs: 5**

## Características generales
- Electrolito gelificado: densidad de ácido inferior, exceso de electrolito
- Mayor distancia entre placas → menor temperatura, menor corrosión de rejilla
- Excelente comportamiento cíclico (por electrolito gel)
- **Alta estabilidad térmica** (mejor que AGM en temperatura)
- Baja autodescarga
- Libre de mantenimiento convencional
- Materiales externos: plásticos ABS
- Válvulas para controlar pérdida de agua por gasificación

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| Energías Renovables | XX (mejor opción) |
| Movilidad | XX (mejor opción) |
| Sanitario | XX (mejor opción) |
| Telecomunicaciones | X |
| Iluminación de Emergencia | X |
| Red Ferroviaria | X |
| UPS / SAI | - |
| TV por Cable | - |
| Centrales Eléctricas | - |
| Electrónica General | - |
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
Si gamma = solar-gel:
  → tecnología = VRLA-GEL, placa = Flat
  → voltaje = 12V (único)
  → capacidad ∈ [80 – 250 Ah] — sin modelos pequeños
  → régimen capacidad = C100 (igual que Solar AGM — no comparar directamente con C10)
  → aplicación ∉ {UPS/SAI, TV por Cable, Centrales Eléctricas, Electrónica General, Universal}
```

## Notas
- **C100**: mismo régimen que Solar AGM. KBGS122500 ≠ KBL122500 en potencia real entregada.
- Primera gamma **GEL** del índice — tecnología diferente (gel vs fibra de vidrio absorbente)
- Ventaja vs Solar AGM: mejor tolerancia térmica, menor gasificación
- Desventaja vs Solar AGM: generalmente mayor precio, no apto para descarga rápida (SAI)
- Coincidencia de modelos: KBGS12800 y KBAS12800 tienen dimensiones similares pero tecnología diferente
- **Movilidad = XX** y **Sanitario = XX**: mismo patrón que High Temperature — verificar con Kaise
