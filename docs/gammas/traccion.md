# Gamma: KAISE TRACCIÓN (Vehículos de Tracción)

## Identificador interno
`traccion`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | VRLA-AGM |
| Tipo de placa | Flat |
| Familia | Movilidad |
| Clasificación Eurobat | SÍ |
| Número de ciclos | ≈1200 |
| Vida de diseño | — (no especificado en catálogo) |

## Voltajes disponibles
- **6 V**
- **8 V**
- **12 V**

## Capacidades disponibles
- 6V: 185 – 344 Ah (C5) / 225 – 420 Ah (C20)
- 8V: 145 – 155 Ah (C5) / 170 – 190 Ah (C20)
- 12V: 120 Ah (C5) / 150 Ah (C20)
- **Rango principal (C20):** 150 – 420 Ah
- **Dos regímenes de capacidad:** 5h (C5) y 20h (C20) + Capacidad de Reserva (minutos)

## Productos

### 6 V
| Modelo | Cap. C5 (Ah) | Cap. C20 (Ah) | Res. @25A (min) | Res. @75A (min) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|---|---|---|
| KB6225TR | 185 | 225 | 445 | 115 | 260 | 180 | 248 | 280 | M8 | 28,6 |
| KB6245TR | 201 | 245 | 500 | 135 | 244 | 191 | 246,5 | 268 | 1(AP) | 31,0 |
| KB6260TR | 215 | 260 | 530 | 145 | 260 | 180 | 248 | 280 | M8 | 30,4 |
| KB6330TR | 271 | 330 | 711 | 195 | 296 | 176 | 336 | 336 | M8 | 42,0 |
| KB6420TR | 344 | 420 | 850 | 220 | 296 | 176 | 425 | 425 | M8 | 52,0 |

### 8 V
| Modelo | Cap. C5 (Ah) | Cap. C20 (Ah) | Res. @56A (min) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|---|---|
| KB8170TR | 145 | 170 | 117 | 260 | 180 | 248 | 280 | M8 | 29,2 |
| KB8190TR | 155 | 190 | 132 | 260 | 180 | 248 | 280 | M8 | 31,5 |

### 12 V
| Modelo | Cap. C5 (Ah) | Cap. C20 (Ah) | Res. @56A (min) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|---|---|
| KB12150TR | 120 | 150 | 102 | 328 | 180 | 248 | 280 | M8 | 36,7 |

**Total SKUs: 8**

## Características generales
*(Compartidas con Electric Vehicle — misma página del catálogo)*
- Rejilla y material activo especializados (99,99% de pureza)
- Aleación de Pb-Ca con elevada resistencia
- Grupos de placas fijas — mayor resistencia a vibraciones
- Placas formadas en tanque — formación uniforme de las placas
- Rango operativo: –40°C a +60°C
- Aislamiento doble con separadores de fibra de vidrio microporosos
- Sistema de supresión de llamas a través de válvulas
- Baja autodescarga: 1%–3%/mes
- Terminal multifunciones
- Clasificada como "Batería no derramable" (UN2800)
- Cumple normas DOT HMR49, materiales no peligrosos

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| Energías Renovables | X |
| Movilidad | X |
| Sanitario | X |
| Telecomunicaciones | - |
| UPS / SAI | - |
| Iluminación de Emergencia | - |
| TV por Cable | - |
| Centrales Eléctricas | - |
| Electrónica General | - |
| Red Ferroviaria | - |
| Universal | - |

> XX = mejor opción · X = compatible · - = no compatible

## Aplicaciones reales (del catálogo de producto)
- Bicicletas eléctricas y sillas de ruedas
- Coches, triciclos y carritos de golf
- Aspiradoras industriales
- Juguetes eléctricos
- Energías renovables

## Diferencias clave vs Electric Vehicle

| Característica | Electric Vehicle | Tracción |
|---|---|---|
| Capacidad (C20) | 17 – 250 Ah | 150 – 420 Ah |
| Régimen capacidad | C10 + C3 | C5 + C20 |
| Columna extra | — | Capacidad de Reserva (min) |
| Uso típico | Ligero (bici, scooter, golf) | Pesado (carretilla, industrial) |
| Modelos pequeños | Sí (17 Ah 12V) | No (mínimo 120 Ah) |

## Reglas de filtro derivadas

```
Si gamma = traccion:
  → tecnología = VRLA-AGM, placa = Flat
  → voltaje ∈ {6, 8, 12}
  → capacidad_min ≥ 120 Ah (C5) / ≥ 150 Ah (C20)
  → ningún modelo < 120 Ah — no para aplicaciones ligeras
  → aplicación ∈ {Energías Renovables, Movilidad, Sanitario}
```

## Notas
- KB6245TR: terminal "1(AP)" — tipo especial diferente al M8 del resto
- C5 vs C20: misma batería, la capacidad nominal en C20 es ≈20% mayor que en C5
- Capacidad de Reserva medida en minutos (no en Ah) — parámetro clave para golf/industrial
- Tracción tiene el rango de capacidades más alto del catálogo (hasta 420 Ah C20)
- Comparte página de catálogo con Electric Vehicle — mismas características físicas de construcción
