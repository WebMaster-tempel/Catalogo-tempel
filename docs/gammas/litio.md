# Gamma: KAISE LITIO

## Identificador interno
`litio`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | LiFePO4 |
| Tipo de placa | Prismática |
| Familia | Litio |
| Clasificación Eurobat | NO |
| Número de ciclos | +6.000 (DOD 75%) |
| Vida de diseño | +10 años |

## Voltajes disponibles
- **12.8 V** (4 celdas × 3.2V)
- **25.6 V** (8 celdas × 3.2V)
- **51.2 V** (16 celdas × 3.2V)

## Capacidades disponibles
- 12.8V: 7 – 300 Ah
- 25.6V: 54 – 300 Ah
- 51.2V: 50 – 200 Ah
- **Rango total:** 7 – 300 Ah

## Productos

### 12.8 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KBLI1270F1 | 7 | 151 | 65 | 94 | 99 | F1 | 1,1 |
| KBLI12120F1 | 12 | 151 | 99 | 99 | 105 | F1 | 1,5 |
| KBLI12200 | 22 | 181 | 77 | 171 | 176 | M5 | 2,5 |
| KBLI12300 | 30 | 175 | 166 | 125 | 125 | M6 | 4,0 |
| KBLI12330 | 33 | 174 | 165 | 125 | 125 | M6 | 4,0 |
| KBLI12400 | 42 | 197 | 165 | 172 | 172 | M6 | 5,0 |
| KBLI12540 | 54 | 229 | 138 | 208 | 215 | M6 | 6,5 |
| KBLI12780 | 78 | 260 | 168 | 209 | 212 | M8 | 9,0 |
| KBLI121000 | 100 | 330 | 172 | 215 | 223 | M8 | 12,0 |
| KBLI121200 | 120 | 330 | 172 | 218 | 223 | M8 | 14,0 |
| KBLI121500 | 150 | 483 | 170 | 240 | 240 | M8 | 18,5 |
| KBLI122000 | 200 | 522 | 240 | 218 | 224 | M8 | 24,2 |
| KBLI123000 | 300 | 522 | 269 | 220 | 222 | M8 | 35,0 |

### 25.6 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KBLI24500 | 54 | 330 | 172 | 215 | 223 | M8 | 14,0 |
| KBLI241000 | 100 | 522 | 240 | 218 | 225 | M8 | 23,5 |
| KBLI242000 | 200 | 450 | 442 | 223 | 223 | M8 | 49,0 |
| KBLI243000 | 300 | 442 | 500 | 210 | 210 | M6 | 52,0 |

### 51.2 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KBLI48500 | 50 | 450 | 442 | 135 | 135 | M8 | 29,0 |
| KBLI481000 | 100 | 450 | 442 | 223 | 223 | M8 | 49,5 |
| KBLI481500 | 150 | 442 | 550 | 176 | 176 | M8 | 62,0 |
| KBLI482000 | 200 | 440 | 442 | 223 | 223 | M8 | 90,0 |

**Total SKUs: 21**

## Características generales
- Alta densidad de energía, peso ligero
- Carga rápida (1C) y descarga (1C)
- 5.000 ciclos con DOD 75%
- BMS integrado (voltaje, corriente, temperatura, cortocircuito, equilibrio)
- Comunicación BMS via RS232 / RS485
- Conexiones paralelas para ampliar capacidad
- Baja autodescarga
- Sin efecto memoria, sin gas, sin mantenimiento
- Dimensiones compatibles formato 19"

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| Telecomunicaciones | XX (mejor opción) |
| UPS / SAI | X |
| Energías Renovables | XX (mejor opción) |
| TV por Cable | X |
| Sanitario | X |
| Iluminación de Emergencia | - |
| Centrales Eléctricas | - |
| Electrónica General | - |
| Red Ferroviaria | - |
| Movilidad | - |
| Universal | - |

> XX = mejor opción · X = compatible · - = no compatible

## Aplicaciones reales (del catálogo de producto)
- Energía de reserva para pequeños SAI
- Iluminación de paneles outdoor
- Enlace eléctrico FTTB y LAN/WIFI
- Monitoreo y vigilancia de calles y carreteras
- Sistemas de energía renovable (solar y eólica)
- Equipamientos marítimos
- Herramientas eléctricas
- Bicicletas eléctricas
- Carritos de Golf
- Sillas de ruedas y scooters
- Autocaravanas

## Reglas de filtro derivadas

```
Si tecnología = LiFePO4 → gamma = litio (única)
  → placa = Prismática (automático)
  → eurobat = false (siempre)
  → voltaje ∈ {12.8, 25.6, 51.2}
  → aplicación ∉ {Movilidad, Iluminación Emergencia, Electrónica General,
                   Red Ferroviaria, Universal, Centrales Eléctricas}
```

## Notas
- SKU KBLI12300 y KBLI12330: mismas dimensiones, capacidad diferente (30 vs 33 Ah)
- Voltaje nominal "51.2V" (16S LiFePO4). En algunos sistemas se menciona como "48V nominal"
- Terminal F1 solo en modelos pequeños (≤12Ah en 12.8V)
