# Gamma: KAISE LEAD CARBON

## Identificador interno
`lead-carbon`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | VRLA-AGM (carbono en electrodo negativo) |
| Tipo de placa | Flat |
| Familia | VRLA/AGM |
| Clasificación Eurobat | SÍ |
| Número de ciclos | +4.000 (60% DoD) / +5.000 (según tabla gama) |
| Vida de diseño | 15 años (12V) / 20 años (2V) @ 25°C |

## Voltajes disponibles
- **12 V** (únicos modelos publicados)
- *(el catálogo menciona "20 años (2V)" en características → versión 2V existe pero no publicada aquí)*

## Capacidades disponibles
- **Rango publicado:** 75 – 250 Ah (12V)
- Capacidad medida en régimen **10h (C10)**

## Productos

### 12 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KBLC12750 | 75 | 260 | 169 | 211 | 218 | M6 | 25,0 |
| KBLC121000 | 100 | 330 | 171 | 216 | 219 | M8 | 30,8 |
| KBLC121500 | 150 | 484 | 170 | 241 | 241 | M8 | 47,0 |
| KBLC121750 | 165 | 532 | 207 | 214 | 219 | M8 | 51,0 |
| KBLC122000 | 200 | 522 | 240 | 219 | 222 | M8 | 61,5 |
| KBLC122000S | 200 | 522 | 268 | 220 | 226 | M8 | 75,6 |
| KBLC122250 | 250 | 520 | 268 | 220 | 223 | M8 | 71,0 |

**Total SKUs: 7**

## Características generales
- **Carbono de alta capacidad y conductividad en electrodo negativo**
- Combina ventajas de baterías plomo-ácido + supercondensadores
- Alta densidad de potencia + alta densidad de energía
- Carga y descarga rápidas
- **Excelente PSoC** (Partial State of Charge) — clave para solar/eólico sin carga completa
- Carga súper rápida: 0% → 90% SoC en menos de **1,5 horas**
- Vida útil 4.000+ ciclos (60% DoD) — la mayor de la familia VRLA-AGM
- Baja autodescarga
- Cumple IEC, IEEE, UL, EN, CE

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| Energías Renovables | XX (mejor opción) |
| Centrales Eléctricas | X |
| Iluminación de Emergencia | X |
| Movilidad | - |
| Telecomunicaciones | - |
| UPS / SAI | - |
| TV por Cable | - |
| Electrónica General | - |
| Red Ferroviaria | - |
| Sanitario | - |
| Universal | - |

> XX = mejor opción · X = compatible · - = no compatible

## Aplicaciones reales (del catálogo de producto)
- Sistemas de red inteligentes (Smart Grid)
- Almacenamiento de energía en el hogar
- Sistemas de suministro de energía híbridos
- Almacenamiento de energía renovable (solar y eólica)
- Alumbrado público solar
- Nivelación de picos y frecuencia de red

## Reglas de filtro derivadas

```
Si gamma = lead-carbon:
  → tecnología = VRLA-AGM (carbono), placa = Flat
  → voltaje = 12V (publicado)
  → capacidad ∈ [75 – 250 Ah]
  → ciclos = +4.000 — mejor rendimiento cíclico de toda familia AGM
  → PSoC excelente → apto para sistemas solar/eólico con carga intermitente
```

## Notas
- **KBLC122000 y KBLC122000S**: misma capacidad (200 Ah), dimensiones diferentes
  (522×240×219 vs 522×268×220) — sufijo "S" probablemente = "Slim" o versión alternativa
- Mayor vida en ciclos de toda familia AGM (+4.000 vs ≈1200-2250 del resto)
- Carga en 1,5h = ventaja enorme en solar/eólico donde la ventana de carga es corta
