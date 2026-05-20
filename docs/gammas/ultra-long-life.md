# Gamma: KAISE ULTRA LONG LIFE

## Identificador interno
`ultra-long-life`

## Atributos fijos
| Atributo | Valor |
|---|---|
| Tecnología | VRLA-AGM |
| Tipo de placa | Flat |
| Familia | VRLA/AGM |
| Clasificación Eurobat | SÍ |
| Número de ciclos | ≈1200 |
| Vida de diseño | 10–16 años |

## Voltajes disponibles
- **2 V** (único — celdas individuales para bancos de baterías)

## Capacidades disponibles
- **Rango:** 200 – 3000 Ah
- Capacidad medida en régimen **10h (C10)**

## Productos

### 2 V
| Modelo | Cap. (Ah) | L (mm) | An (mm) | Al (mm) | Alt. Total (mm) | Terminal | Peso (Kg) |
|---|---|---|---|---|---|---|---|
| KB2200 | 200 | 171 | 111 | 330 | 365 | M8 | 12,8 |
| KB2300 | 300 | 171 | 151 | 330 | 366 | M8 | 18,0 |
| KB2400 | 400 | 211 | 175 | 329 | 367 | M8 | 25,2 |
| KB2500 | 500 | 241 | 172 | 330 | 366 | M8 | 29,5 |
| KB2600 | 600 | 301 | 175 | 331 | 366 | M8 | 35,6 |
| KB2800 | 800 | 301 | 172 | 330 | 342 | M8 | 38,5 |
| KB21000 | 1000 | 410 | 172 | 330 | 342 | M8 | 51,0 |
| KB21200 | 1200 | 473 | 172 | 330 | 342 | M8 | 59,5 |
| KB21500 | 1500 | 355 | 337 | 330 | 342 | M8 | 80,0 |
| KB22000 | 2000 | 476 | 337 | 330 | 342 | M8 | 106 |
| KB22500 | 2500 | 476 | 337 | 330 | 342 | M8 | 118 |
| KB23000 | 3000 | 696 | 340 | 330 | 342 | M8 | 159 |

**Total SKUs: 12**

## Características generales
- Libre de mantenimiento convencional
- Gran amplitud térmica (–15°C a +45°C)
- Baja autodescarga
- Regulación mediante válvulas, elevada capacidad para descargas
- Diferentes posibilidades de posicionado en instalación
- Tecnología AGM de mayor calidad y fiabilidad del sector

## Aplicaciones compatibles (según tabla catálogo)
| Aplicación | Compatibilidad |
|---|---|
| Telecomunicaciones | X |
| Iluminación de Emergencia | X |
| Centrales Eléctricas | X |
| Energías Renovables | X |
| UPS / SAI | X |
| TV por Cable | - |
| Electrónica General | - |
| Red Ferroviaria | - |
| Movilidad | - |
| Sanitario | - |
| Universal | - |

> XX = mejor opción · X = compatible · - = no compatible

## Aplicaciones reales (del catálogo de producto)
- Equipos de control de telecomunicaciones y comunicación
- Sistemas de iluminación de emergencia
- Centrales eléctricas y nucleares
- Equipamientos marítimos
- Generadores eléctricos
- Sistemas de alarmas
- SAI
- Sistemas de seguridad e incendios
- Equipos de control
- Energía auxiliar o de emergencia

## Reglas de filtro derivadas

```
Si gamma = ultra-long-life:
  → tecnología = VRLA-AGM, placa = Flat
  → voltaje = 2V (ÚNICO — alerta UI: "Celda 2V para bancos de baterías")
  → capacidad ∈ [200 – 3000 Ah] — capacidades industriales grandes
  → aplicación ∉ {TV por Cable, Electrónica General, Red Ferroviaria,
                   Movilidad, Sanitario, Universal}
```

## Notas
- **Voltaje 2V** es crítico para el filtro: son celdas individuales, no baterías completas.
  El usuario que filtra por 12V nunca debería ver esta gamma.
  Para formar banco 12V se necesitan 6 celdas en serie; 24V = 12 celdas, etc.
- Capacidades mayores del catálogo (hasta 3000 Ah) — aplicaciones industriales/telecom grandes
- KB22000 y KB22500: mismas dimensiones externas (476×337×330mm), diferente cap (2000 vs 2500 Ah)
- Diferencia clave vs Long Life: voltaje 2V vs 12V, capacidades masivas, vida hasta 16 años
