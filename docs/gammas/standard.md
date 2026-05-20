# Gamma: KAISE STANDARD

## Identificador interno
`standard`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | VRLA-AGM |
| Tipo de placa | Flat |
| Familia | VRLA/AGM |
| Clasificación Eurobat | SÍ |
| Número de ciclos | ≈1050–1200 |
| Vida de diseño | 3–5 años |

## Voltajes disponibles
- **6 V**
- **12 V**

## Capacidades disponibles
- 6V: 1,2 – 12 Ah
- 12V: 1,2 – 28 Ah
- **Rango total:** 1,2 – 28 Ah

## Productos

### 6 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KB612 | 1,2 | 98 | 25 | 53 | 58 | F1 | 0,3 |
| KB628 | 2,8 | 66 | 33 | 97 | 103 | F1 | 0,5 |
| KB632 | 3,2 | 134 | 35 | 60 | 65 | F1 | 0,6 |
| KB645 | 4,5 | 71 | 47 | 97 | 101 | F1 | 0,8 |
| KB670 | 7,0 | 151 | 34 | 94 | 100 | F1 | 1,1 |
| KB6120 | 12 | 151 | 50 | 94 | 100 | F1 | 1,7 |

### 12 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KB1212 | 1,2 | 98 | 43 | 53 | 58 | F1 | 0,5 |
| KB1223 | 2,3 | 177 | 35 | 62 | 67 | F1 | 0,9 |
| KB1232 | 3,2 | 135 | 67 | 60 | 65 | F1 | 1,2 |
| KB1250 | 5,0 | 90 | 70 | 101 | 107 | F1/F2 | 1,6 |
| KB1270 Security | 7,0 | 151 | 65 | 94 | 100 | F1 | 1,9 |
| KB1272 | 7,2 | 151 | 65 | 94 | 100 | F1/F2 | 2,1 |
| KB1290 | 9,0 | 151 | 65 | 94 | 100 | F1/F2 | 2,5 |
| KB12120 | 12 | 151 | 98 | 96 | 101 | F1/F2 | 3,5 |
| KB12180 | 18 | 181 | 76 | 167 | 167 | M5 | 5,0 |
| KB12200 | 20 | 181 | 76 | 167 | 167 | M5 | 5,5 |
| KB12260 | 26 | 166 | 175 | 125 | 125 | M5 | 7,7 |
| KB12280 | 28 | 164 | 125 | 174 | 174 | M5 | 9,1 |

**Total SKUs: 18**

## Características generales
- VRLA (Valve Regulated Lead Acid) con AGM (Absorbent Glass Mat)
- Estabilidad y alta fiabilidad
- Construcción sellada, libre de mantenimiento
- Regulada por válvula
- Rejilla de alta resistencia
- Baja autodescarga
- Componentes UL reconocidos (25860)
- Buen rendimiento a bajas temperaturas

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| Electrónica General | XX (mejor opción) |
| Universal | XX (mejor opción) |
| Telecomunicaciones | X |
| UPS / SAI | X |
| Iluminación de Emergencia | X |
| TV por Cable | X |
| Centrales Eléctricas | X |
| Red Ferroviaria | X |
| Energías Renovables | - |
| Movilidad | - |
| Sanitario | - |

> XX = mejor opción · X = compatible · - = no compatible

## Aplicaciones reales (del catálogo de producto)
- Sistemas de alarma
- TV por cable
- Equipo de comunicaciones y control
- Cajas registradoras electrónicas
- Equipos de comprobación portátiles
- Bicicletas eléctricas y sillas de ruedas
- Sistemas de iluminación de emergencia
- Sistemas de seguridad y contra incendios
- Equipos geofísicos, marítimos y médicos
- Microprocesadores
- Iluminación portátil (cine y vídeo)
- Herramientas eléctricas
- Sistemas de telecomunicaciones
- Cámaras de televisión y vídeo
- Juguetes
- SAI
- Máquinas de venta automática

## Reglas de filtro derivadas

```
Si tecnología = VRLA-AGM + vida_corta (3-5 años) → gamma probable = standard
  → placa = Flat (automático)
  → eurobat = true (disponible)
  → voltaje ∈ {6, 12}
  → capacidad_max = 28 Ah
  → aplicación ∉ {Energías Renovables, Movilidad, Sanitario}
```

## Notas
- Única gamma con modelo "Security" (KB1270 Security) — mismo tamaño que KB1272 pero sin terminal F2
- Gama de capacidades pequeñas: ideal alarmas, SAI pequeños, electrónica
- KB12200 y KB12180: mismas dimensiones (181×76×167mm), diferente capacidad (20 vs 18 Ah)
- Terminal F1/F2 desde 5Ah en adelante (12V) — compatible con conectores Quick-Connect estándar
- Vida de diseño más corta de todas las gammas (3–5 años) → precio más bajo → aplicaciones no críticas
