# Gamma: KAISE OPzV

## Identificador interno
`opzv`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | VRLA-GEL |
| Tipo de placa | **Tubular** (único en el catálogo) |
| Familia | Gel |
| Clasificación Eurobat | SÍ |
| Número de ciclos | +3.500 |
| Vida de diseño | 16 años (12V) / 20 años (2V) @ 25°C |

## Voltajes disponibles
- **2 V** (celdas para bancos de alta capacidad)
- **12 V**

## Capacidades disponibles
- 2V: 200 – 3000 Ah
- 12V: 60 – 200 Ah
- **Rango total:** 60 – 3000 Ah
- Capacidad medida en régimen **10h (C10)**

## Productos

### 2 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KBOPZV2200 | 200 | 103 | 206 | 355 | 390 | M8 | 16,0 |
| KBOPZV2300 | 300 | 145 | 206 | 355 | 390 | M8 | 23,5 |
| KBOPZV2420 | 420 | 145 | 206 | 470 | 505 | M8 | 32,5 |
| KBOPZV2500 | 490 | 166 | 206 | 470 | 505 | M8 | 38,0 |
| KBOPZV2600 | 600 | 145 | 206 | 645 | 680 | M8 | 45,0 |
| KBOPZV2800 | 800 | 191 | 210 | 645 | 680 | M8 | 60,5 |
| KBOPZV21000 | 1000 | 233 | 210 | 645 | 680 | M8 | 73,5 |
| KBOPZV21200 | 1200 | 276 | 210 | 645 | 680 | M8 | 88,5 |
| KBOPZV21500 | 1500 | 275 | 210 | 795 | 830 | M8 | 104,5 |
| KBOPZV22000 | 2000 | 399 | 214 | 770 | 805 | M8 | 142,5 |
| KBOPZV22500 | 2500 | 487 | 212 | 770 | 805 | M8 | 180,5 |
| KBOPZV23000 | 3000 | 576 | 212 | 770 | 805 | M8 | 214,0 |

### 12 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KBOPZV1260 | 60 | 260 | 169 | 211 | 216 | M6 | 23,0 |
| KBOPZV1280 | 80 | 328 | 172 | 215 | 220 | M8 | 30,0 |
| KBOPZV12100 | 100 | 407 | 177 | 225 | 225 | M8 | 34,5 |
| KBOPZV12120 | 120 | 483 | 170 | 241 | 242 | M8 | 44,6 |
| KBOPZV12140 | 140 | 532 | 207 | 214 | 219 | M8 | 52,8 |
| KBOPZV12160 | 160 | 532 | 207 | 214 | 219 | M8 | 57,0 |
| KBOPZV12180 | 180 | 522 | 240 | 219 | 224 | M8 | 65,0 |
| KBOPZV12200 | 200 | 521 | 268 | 220 | 225 | M8 | 69,5 |

**Total SKUs: 20** (gamma más grande del catálogo)

## Características generales
- **Placa tubular** (único en todo el catálogo Kaise) — mayor resistencia mecánica
- Tecnología GEL inmovilizado — baja emisión de gases
- Estándares DIN (placa positiva, placa tubular, fórmula de material activo patentada)
- Supera valores estándar DIN: +20 años en flotación a 25°C
- Electrolito gel puro — cortocircuito interno imposible
- Baja emisión de gases (aleación libre de antimonio + recombinación interna de oxígeno)
- Instalación vertical estándar o **horizontal bajo pedido**
- Cumple IEC, IEEE, UL, EN, CE
- Mayor número de ciclos de toda la familia GEL (+3.500)

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| Telecomunicaciones | XX (mejor opción) |
| UPS / SAI | XX (mejor opción) |
| Centrales Eléctricas | X |
| Iluminación de Emergencia | X |
| Red Ferroviaria | X |
| Energías Renovables | X |
| Movilidad | X |
| Sanitario | X |
| TV por Cable | - |
| Electrónica General | - |
| Universal | - |

> XX = mejor opción · X = compatible · - = no compatible

## Aplicaciones reales (del catálogo de producto)
- Sistemas de telecomunicaciones
- Estaciones de retransmisión de señales telefónicas y de radio
- Sistemas de iluminación de emergencia
- Centrales eléctricas (convencionales y energías alternativas solar/eólica)
- Grandes UPS y backup de ordenador
- Señalización ferroviaria
- Reserva de energía a bordo de barcos y en tierra
- Ingeniería de procesos y control

## Reglas de filtro derivadas

```
Si gamma = opzv:
  → tecnología = VRLA-GEL, placa = Tubular  ← ÚNICO con placa Tubular
  → voltaje ∈ {2, 12}
  → si voltaje = 2V → capacidad ∈ [200 – 3000 Ah]
  → si voltaje = 12V → capacidad ∈ [60 – 200 Ah]
  → ciclos = +3.500 (mayor de toda familia GEL)
  → aplicación ∉ {TV por Cable, Electrónica General, Universal}

Si placa = Tubular → gamma = opzv (FORZADO, única gamma con Tubular)
Si tecnología = VRLA-GEL + placa = Flat → gamma ∈ {solar-gel, deep-cycle-gel}
```

## Notas
- **KBOPZV2500**: capacidad real = 490 Ah (no 500 — leer del modelo KBOPzV2500)
- KBOPZV12140 y KBOPZV12160: mismas dimensiones (532×207×214mm), cap 140 vs 160 Ah
- Gamma más grande del catálogo (20 SKUs), mayor rango de capacidad (60–3000 Ah)
- Instalación horizontal bajo pedido — relevante para armarios técnicos de baja altura
- La placa Tubular = regla determinista en el algoritmo: único filtro que fuerza una gamma concreta
