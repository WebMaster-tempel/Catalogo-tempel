# Gamma: KAISE FRONT TERMINAL

## Identificador interno
`frontal-terminal`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | VRLA-AGM |
| Tipo de placa | Flat |
| Familia | VRLA/AGM |
| Clasificación Eurobat | SÍ |
| Número de ciclos | — (uso flotación) |
| Vida de diseño | 10–12 años |

## Voltajes disponibles
- **12 V** (único)

## Capacidades disponibles
- **Rango:** 100 – 200 Ah
- Capacidad medida en régimen **10h (C10)**
- Sin modelos pequeños — solo capacidades industriales medias

## Productos

### 12 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KBF121000 | 100 | 394 | 110 | 286 | 286 | M6 | 31,0 |
| KBF121050 | 100 | 508 | 110 | 239 | 239 | M6 | 32,8 |
| KBF121550 | 125 | 551 | 110 | 288 | 288 | M8 | 44,8 |
| KBF122000 | 200 | 560 | 126 | 320 | 320 | M8 | 61,0 |

**Total SKUs: 4** (gamma más pequeña del catálogo junto con Wind Power)

## Características generales
- Placas de alta densidad y grosor de Pb-Sn-Ca
- **Terminales frontales** (diferencia física clave — permite rack frontal)
- Sistema de desgasificación centralizado
- Asas de plástico o cuerda para facilitar transporte e instalación
- Baja resistencia interna
- Baja autodescarga
- Carcasa de plástico ABS retardante de llama, clasificación **V0**

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| Telecomunicaciones | XX (mejor opción) |
| UPS / SAI | X |
| Red Ferroviaria | X |
| Energías Renovables | X |
| Iluminación de Emergencia | - |
| TV por Cable | - |
| Centrales Eléctricas | - |
| Electrónica General | - |
| Movilidad | - |
| Sanitario | - |
| Universal | - |

> XX = mejor opción · X = compatible · - = no compatible

## Aplicaciones reales (del catálogo de producto)
- Sistemas de telecomunicaciones
- SAI
- Centrales eléctricas
- Otras fuentes de energía de emergencia o stand-by

## Reglas de filtro derivadas

```
Si gamma = frontal-terminal:
  → tecnología = VRLA-AGM, placa = Flat
  → voltaje = 12V (único)
  → capacidad ∈ [100 – 200 Ah] — no hay modelos <100 Ah
  → aplicación ∉ {Iluminación de Emergencia, TV por Cable, Centrales Eléctricas,
                   Electrónica General, Movilidad, Sanitario, Universal}
```

## Notas
- **Dos modelos de 100 Ah** (KBF121000 y KBF121050): misma capacidad, dimensiones distintas
  (394×110×286 vs 508×110×239) — el usuario puede necesitar saber cuál cabe físicamente
- Terminal frontal = instalación en rack/armario telecom — no es para uso doméstico
- Carcasa V0 (retardante de llama) — requerimiento típico en salas de telecomunicaciones
- Solo 4 SKUs: gamma especializada, muy limitada en opciones
