# Gamma: KAISE HIGH TEMPERATURE

## Identificador interno
`high-temperature`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | VRLA-AGM |
| Tipo de placa | Flat |
| Familia | VRLA/AGM |
| Clasificación Eurobat | SÍ |
| Número de ciclos | — (ciclos profundos) |
| Vida de diseño | 15+ años (2V @ 35°C) / 10+ años (12V @ 35°C) |

## Voltajes disponibles
- **2 V** (celdas para bancos)
- **12 V**

## Capacidades disponibles
- 2V: 200 – 1000 Ah
- 12V: 100 – 200 Ah
- **Rango total:** 100 – 1000 Ah
- Capacidad medida en régimen **10h (C10)**

## Productos

### 2 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KBHT22000 | 200 | 170 | 110 | 328 | 348 | M8 | 13,5 |
| KBHT23000 | 300 | 170 | 150 | 328 | 348 | M8 | 18,8 |
| KBHT25000 | 500 | 240 | 175 | 330 | 350 | M8 | 30,0 |
| KBHT28000 | 800 | 410 | 175 | 330 | 350 | M8 | 50,4 |
| KBHT210000 | 1000 | 475 | 175 | 328 | 350 | M8 | 60,0 |

### 12 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KBHT121000 | 100 | 394 | 110 | 286 | 286 | M6 | 31,5 |
| KBHT121500 | 150 | 551 | 110 | 288 | 288 | M6 | 46,6 |
| KBHT122000 | 200 | 560 | 126 | 320 | 320 | M8 | 59,5 |

**Total SKUs: 8**

## Características generales
- Aleación especial anticorrosión
- Fórmula especial de pasta anti alta-temperatura
- Contenedor especial anti alta-temperatura
- Doble sellado especial + agente aislante anti alta-temperatura
- Material activo optimizado para condiciones de alta temperatura
- **Rango operativo: –40°C a +80°C** (más amplio del catálogo)
- Funcionamiento continuo superior a 35°C sin degradación significativa
- Excelente rendimiento en ciclos profundos
- Cumple normas IEC, IEEE, UL, EN, CE

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| Telecomunicaciones | XX (mejor opción) |
| UPS / SAI | X |
| Iluminación de Emergencia | X |
| TV por Cable | X |
| Red Ferroviaria | X |
| Energías Renovables | X |
| Sanitario | X |
| Centrales Eléctricas | - |
| Electrónica General | - |
| Universal | - |

> XX = mejor opción · X = compatible · - = no compatible

## Aplicaciones reales (del catálogo de producto)
- Estaciones híbridas remotas de telecomunicaciones
- Energías renovables (eólica y solar)
- Sistemas de nivelación de frecuencia de red
- Backup en áreas donde la confiabilidad de la red es pobre
- Sistemas autónomos en ambientes extremos

## Reglas de filtro derivadas

```
Si gamma = high-temperature:
  → tecnología = VRLA-AGM, placa = Flat
  → voltaje ∈ {2, 12}
  → si voltaje = 2V → capacidad ∈ [200 – 1000 Ah]
  → si voltaje = 12V → capacidad ∈ [100 – 200 Ah]
  → aplicación ∉ {Centrales Eléctricas, Electrónica General, Universal}
```

## Notas
- **Doble voltaje (2V y 12V)** — como Ultra Long Life, pero con temperatura extendida
- Los 12V son formato frontal (394×110 / 551×110 / 560×126) — idéntico footprint a Front Terminal
- Temperatura operativa –40°C a +80°C: gamma para entornos hostiles (desiertos, zonas árticas, industria)
- Movilidad = `-` (no compatible según tabla maestra — confirmado)
