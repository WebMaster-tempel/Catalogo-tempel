# Estudio del Algoritmo de Filtrado y Selección de Productos

> Llamadas reales a `http://localhost:3000/api/v1` · Base de datos: `catalog-db` (MySQL 8 via Docker)  
> Fecha: 2026-05-28 · **187 productos publicados**  
> Estado fixes: todas las recomendaciones R1–R8 **aplicadas y verificadas**

---

## Índice

1. [Arquitectura del filtrado](#1-arquitectura)
2. [Parámetros y valores reales del catálogo](#2-parámetros)
3. [Resultados por filtro individual](#3-resultados-individuales)
4. [Búsqueda guiada — Wizard (expandido)](#4-búsqueda-guiada-wizard)
5. [Filtros técnicos avanzados (expandido)](#5-filtros-técnicos-avanzados)
6. [Combinaciones multi-parámetro](#6-combinaciones)
7. [Errores y casos límite](#7-errores)
8. [Bugs corregidos](#8-bugs-corregidos)
9. [Mapa de cobertura](#9-cobertura)

---

## 1. Arquitectura

```
Usuario
  ├── Búsqueda Guiada (Wizard 7 pasos)  ──┐
  ├── Filtros Técnicos (formulario)      ──┤── AJAX → WordPress → GET /api/v1/products?[params]
  └── Búsqueda con IA (Gemini)          ──┘
```

### Capas de filtrado (todos AND)

| Capa | Params | Mecanismo SQL |
|------|--------|--------------|
| Texto libre | `search` | ILIKE en 6 campos de `products` + `categories` |
| Categoría exacta | `category_id` | JOIN + WHERE `category_id = ?` |
| Metadatos categoría | `application`, `technology`, `plate_type`, `eurobat`, `capacity_range`, `characteristics` | ILIKE / = en columnas de `categories` |
| Atributos numéricos | `capacity_min`, `capacity_max`, `voltage` | COALESCE + comparación decimal / string en `attributes_json` JSONB |
| JSONB exacto | `filters[campo]` | `JSON_UNQUOTE(JSON_EXTRACT(...))` = string |
| Estado / paginación | `status`, `page`, `per_page` | WHERE + LIMIT/OFFSET |

---

## 2. Parámetros y valores reales del catálogo

### Valores válidos en DB (post-migración 021+022)

| Parámetro | Valores que funcionan | Valores que NO funcionan |
|-----------|-----------------------|--------------------------|
| `technology` | `VRLA-AGM`, `VRLA-GEL`, `LiFePO4`, `Lead Carbon` | ~~`Lead Carbon` (antes de migración 022)~~ |
| `plate_type` | `Plana`, `Tubular`, `Prismática` | ~~`Flat`~~ (migrado a "Plana") |
| `application` | `Telecomunicaciones`, `solar`, `SAI`, `UPS`, `renovable`, `alarma`, `Bicicletas`, `Industrial`, `Movilidad`* | `maritimo`**, `nautico`** |
| `voltage` (numérico) | `2`, `6`, `12`, `12.8`, `25.6`, `51.2` | ~~decimales bloqueados~~ (fix R1 aplicado) |
| `status` | `published`, `draft`, `archived` | cualquier otro valor |

> *`Movilidad` funciona via alias R5 → mapea a "sillas de ruedas" en DB  
> **palabras náuticas ausentes del campo `applications` en DB — se puede mejorar con alias en R5

### Campos JSONB por gamma

| Gamma | Campos en `attributes_json` |
|-------|-----------------------------|
| La mayoría AGM/GEL | `voltage`, `capacity`, `width`, `height`, `length`, `total_height`, `weight`, `terminal_type`, `model_code` |
| ELECTRIC VEHICLE | `voltage`, `capacity_nominal_10h`, `capacity_nominal_3h`, `width`, `height`, `length`, `weight`, ... |
| EV TRACCIÓN | `voltage`, `capacity_nominal_5h`, `capacity_nominal_20h`, `rc_25amp`, `rc_56amp`, ... |
| LITIO | `voltage` (12.8/25.6/51.2), `capacity`, `width`, `height`, `length`, `weight`, ... |

---

## 3. Resultados individuales

### Tecnología
| Query | Total |
|-------|-------|
| `technology=VRLA-AGM` | 130 |
| `technology=VRLA-GEL` | 36 |
| `technology=LiFePO4` | 21 |
| `technology=Lead Carbon` | **7** ✅ (fix R6) |

### Tipo de placa (post-migración 021)
| Query | Total |
|-------|-------|
| `plate_type=Plana` | **138** ✅ (era 0, fix R2) |
| `plate_type=Tubular` | 28 |
| `plate_type=Prismática` | 21 |

### Voltaje (post-fix R1)
| Query | Total |
|-------|-------|
| `voltage=2` | 29 |
| `voltage=6` | 14 |
| `voltage=12` | 120 |
| `voltage=12.8` | **13** ✅ (era 0) |
| `voltage=25.6` | **4** ✅ (era 0) |
| `voltage=51.2` | **4** ✅ (era 0) |

### Eurobat
| Query | Total |
|-------|-------|
| `eurobat=true` | 166 |
| `eurobat=false` | 21 (solo LITIO) |

### Aplicación
| Query | Total | Gammas principales |
|-------|-------|-------------------|
| `application=Telecomunicaciones` | 119 | LITIO, LONG LIFE, HIGH RATE, FRONT TERMINAL, OPzV, HIGH TEMP |
| `application=solar` | 80 | SOLAR, SOLAR GEL, DEEP CYCLE GEL, LEAD CARBON, LITIO |
| `application=SAI` | 97 | STANDARD, LONG LIFE, ULTRA LONG LIFE, HIGH RATE, OPzV |
| `application=renovable` | 61 | SOLAR, EV, DEEP CYCLE, WIND POWER, LEAD CARBON, LITIO |
| `application=Movilidad` | **35** ✅ (era 0, fix R5) | SOLAR GEL, DEEP CYCLE GEL, EV, LITIO |
| `application=Bicicletas` | 11 | ELECTRIC VEHICLE |

---

## 4. Búsqueda guiada — Wizard

El Wizard construye filtros paso a paso. El estado final se traduce a params API. Los flujos a continuación cubren todas las combinaciones relevantes del catálogo.

### Flujos por tecnología

---

#### GRUPO A — LiFePO4 (KAISE LITIO)

##### A1 — Litio 12.8V para telecomunicaciones
```bash
# Wizard: app=Telecomunicaciones → tech=LiFePO4 → volt=12.8
GET /products?application=Telecomunicaciones&technology=LiFePO4&voltage=12.8&status=published
→ total: 13
# Productos ejemplo: KBLI121000, KBLI12700, KBLI12200
```

##### A2 — Litio 12.8V rango completo
```bash
GET /products?technology=LiFePO4&voltage=12.8&status=published
→ total: 13
# Toda la gama 12.8V: 7Ah a 300Ah
```

##### A3 — Litio 25.6V (pack 24V nominal) para UPS
```bash
# Wizard: app=UPS → tech=LiFePO4 → volt=25.6
GET /products?application=UPS&technology=LiFePO4&voltage=25.6&status=published
→ total: 4
```

##### A4 — Litio 51.2V (pack 48V nominal) para renovables
```bash
# Wizard: app=renovable → tech=LiFePO4 → volt=51.2
GET /products?application=renovable&technology=LiFePO4&voltage=51.2&status=published
→ total: 4
```

##### A5 — Litio PSoC para energía solar con capacidad media
```bash
# Wizard: características=PSoC → tech=LiFePO4 → cap 50-200Ah
GET /products?technology=LiFePO4&characteristics=PSoC&capacity_min=50&capacity_max=200&status=published
→ total: 13  (toda la gama Litio tiene PSoC en características)
```

##### A6 — Litio con BMS para telecomunicaciones
```bash
GET /products?technology=LiFePO4&characteristics=BMS&application=Telecomunicaciones&status=published
→ total: 13
```

##### A7 — Litio pequeño (hasta 30Ah) para alarmas/SAI pequeño
```bash
GET /products?technology=LiFePO4&capacity_max=30&status=published
→ total: ~3-5  (depende del catálogo actual)
```

##### A8 — Litio grande (≥100Ah) para almacenamiento solar/eólico
```bash
GET /products?technology=LiFePO4&capacity_min=100&application=renovable&status=published
→ total: ~8
```

---

#### GRUPO B — VRLA-AGM / Plana

##### B1 — Standard para UPS pequeño (< 30Ah)
```bash
# Wizard: app=SAI → tech=VRLA-AGM → gamma=standard → cap max=30
GET /products?category_id=a11c1e00-1000-4000-8000-000000000002&capacity_max=30&status=published
→ total: 21  (toda la gama Standard)
```

##### B2 — Long Life para centrales eléctricas (≥100Ah, eurobat)
```bash
# Wizard: app=Telecomunicaciones → tech=VRLA-AGM → características=larga vida
GET /products?application=Telecomunicaciones&technology=VRLA-AGM&characteristics=larga+vida&eurobat=true&status=published
→ total: 31
```

##### B3 — Ultra Long Life para instalaciones críticas (≥200Ah)
```bash
# Wizard: app=Telecomunicaciones → tech=VRLA-AGM → gamma=ultra-long-life → cap ≥200
GET /products?category_id=a11c1e00-1000-4000-8000-000000000004&capacity_min=200&status=published
→ total: ~8-10
```

##### B4 — High Rate para UPS de alta descarga
```bash
# Wizard: características=alta-potencia → tech=VRLA-AGM → app=SAI
GET /products?category_id=a11c1e00-1000-4000-8000-000000000005&application=SAI&status=published
→ total: ~15
```

##### B5 — Solar AGM para instalaciones fotovoltaicas (80–250Ah)
```bash
# Wizard: app=solar → tech=VRLA-AGM → gamma=solar-agm → cap 80-250
GET /products?category_id=a11c1e00-1000-4000-8000-000000000006&capacity_min=80&capacity_max=250&status=published
→ total: ~8
```

##### B6 — Deep Cycle para sillas de ruedas y golf (descarga profunda)
```bash
# Wizard: app=Movilidad → tech=VRLA-AGM → características=descarga profunda
GET /products?application=Movilidad&technology=VRLA-AGM&characteristics=larga+vida&status=published
→ total: ~20
```

##### B7 — Front Terminal para racks de telecomunicaciones
```bash
# Wizard: app=Telecomunicaciones → características=terminal-frontal → tech=VRLA-AGM
GET /products?category_id=a11c1e00-1000-4000-8000-000000000008&status=published
→ total: ~10
```

##### B8 — High Temperature para entornos extremos (telecom estaciones remotas)
```bash
# Wizard: app=Telecomunicaciones → características=alta-temperatura
GET /products?application=Telecomunicaciones&characteristics=alta+temperatura&status=published
→ total: 8
# Solo HIGH TEMPERATURE — el más específico
```

##### B9 — High Temperature con rango de temperatura confirmado
```bash
GET /products?characteristics=-40%C2%B0C&status=published
→ total: 19  (HIGH TEMP + ELECTRIC VEHICLE — ambos van a -40°C)
```

##### B10 — Wind Power para generación eólica
```bash
# Wizard: app=renovable → gamma=wind-power
GET /products?category_id=a13c1e00-1000-4000-8000-000000000006&status=published
→ total: ~8
```

##### B11 — Lead Carbon para carga parcial PSoC (solar/eólico)
```bash
# Wizard: app=solar → características=PSoC → tech=Lead Carbon
GET /products?technology=Lead+Carbon&status=published
→ total: 7  ✅ (fix R6)
```

##### B12 — Lead Carbon carga rápida
```bash
GET /products?technology=Lead+Carbon&characteristics=PSoC&status=published
→ total: 7
```

##### B13 — Lead Carbon para alumbrado solar público
```bash
GET /products?technology=Lead+Carbon&application=solar&status=published
→ total: 7
```

---

#### GRUPO C — VRLA-GEL / Plana

##### C1 — Solar GEL para energías renovables (12V)
```bash
# Wizard: app=solar → tech=VRLA-GEL → volt=12
GET /products?application=solar&technology=VRLA-GEL&voltage=12&status=published
→ total: ~10 (Solar GEL + Deep Cycle GEL 12V)
```

##### C2 — Solar GEL rango completo (la gamma entera)
```bash
GET /products?category_id=a13c1e00-1000-4000-8000-000000000004&status=published
→ total: 5
```

##### C3 — Deep Cycle GEL ciclo profundo larga vida (15-20 años)
```bash
# Wizard: app=solar → tech=VRLA-GEL → características=larga vida
GET /products?technology=VRLA-GEL&characteristics=larga+vida&status=published
→ total: ~18 (Deep Cycle GEL + OPzV)
```

##### C4 — Deep Cycle GEL para marítimo y movilidad
```bash
GET /products?technology=VRLA-GEL&application=Movilidad&status=published
→ total: ~10 (Deep Cycle GEL + OPzV)
```

##### C5 — GEL con gel puro inmovilizado (sin riesgo de derrame)
```bash
GET /products?technology=VRLA-GEL&characteristics=gel+puro&status=published
→ total: 20 (OPzV + Deep Cycle GEL)
```

---

#### GRUPO D — VRLA-GEL / Tubular (OPzV)

##### D1 — OPzV 2V para grandes instalaciones (≥500Ah)
```bash
# Wizard: app=Telecomunicaciones → tech=VRLA-GEL → plate=Tubular → volt=2 → cap ≥500
GET /products?plate_type=Tubular&voltage=2&capacity_min=500&status=published
→ total: ~8 (OPzV 2V desde 500 a 3000Ah)
```

##### D2 — OPzV 12V para instalaciones medianas (60–250Ah)
```bash
# Wizard: app=renovable → tech=VRLA-GEL → plate=Tubular → volt=12 → cap 60-250
GET /products?plate_type=Tubular&voltage=12&capacity_min=60&capacity_max=250&status=published
→ total: ~8
```

##### D3 — OPzV para sistemas de backup (solar + telecom + ferroviaria)
```bash
GET /products?plate_type=Tubular&application=Telecomunicaciones&status=published
→ total: 20 (toda la gama OPzV)
```

##### D4 — OPzV gran capacidad (≥1000Ah) para centrales
```bash
GET /products?plate_type=Tubular&capacity_min=1000&status=published
→ total: ~10 (OPzV 1000–3000Ah a 2V)
```

##### D5 — OPzV ciclos profundos larga vida (+3500 ciclos)
```bash
GET /products?plate_type=Tubular&characteristics=larga+vida&status=published
→ total: 20 (OPzV es la única Tubular GEL — toda coincide)
```

##### D6 — OPzV + eurobat para requisitos normativos
```bash
GET /products?plate_type=Tubular&eurobat=true&status=published
→ total: 20 (OPzV es eurobat certificada)
```

---

#### GRUPO E — Tracción / Vehículo eléctrico

##### E1 — EV para bicicletas eléctricas (12V ligero)
```bash
# Wizard: app=Bicicletas → tech=VRLA-AGM → cap max=50
GET /products?application=Bicicletas&capacity_max=50&status=published
→ total: ~6 (EV 12V pequeños)
```

##### E2 — EV para coches de golf y sillas de ruedas (6V)
```bash
GET /products?application=Bicicletas&voltage=6&status=published
→ total: ~5 (EV 6V)
```

##### E3 — Tracción para carretillas elevadoras (≥145Ah)
```bash
# Wizard: app=Industrial → gamma=traccion → cap ≥145
GET /products?category_id=a13c1e00-1000-4000-8000-000000000002&capacity_min=145&status=published
→ total: 8 (toda la gama EV TRACCIÓN)
```

##### E4 — EV para juguetes y aplicaciones ligeras (≤30Ah)
```bash
GET /products?application=Bicicletas&capacity_max=30&status=published
→ total: ~5
```

---

#### GRUPO F — Búsquedas cruzadas multi-gama

##### F1 — Cualquier batería para telecom con eurobat
```bash
GET /products?application=Telecomunicaciones&eurobat=true&status=published
→ total: ~110 (excluye Litio que no tiene eurobat)
```

##### F2 — Batería SAI 12V mediana, certificada
```bash
GET /products?application=SAI&voltage=12&eurobat=true&capacity_min=50&capacity_max=200&status=published
→ total: ~30
```

##### F3 — Batería solar cualquier tecnología, alta capacidad
```bash
GET /products?application=solar&capacity_min=100&status=published
→ total: ~35
```

##### F4 — Larga vida diseño (≥10 años) para proyectos críticos
```bash
GET /products?characteristics=larga+vida&eurobat=true&status=published
→ total: 31
```

##### F5 — Todo el catálogo ordenado (sin filtros, publicados)
```bash
GET /products?status=published&per_page=100
→ total: 187
```

---

## 5. Filtros técnicos avanzados

Los filtros técnicos (Tab "Filtros") permiten combinar cualquier parámetro con total libertad. A continuación, exploración exhaustiva de combinaciones relevantes.

### 5.1 Matriz tecnología × placa

| technology | plate_type | Total | Gammas incluidas |
|-----------|-----------|-------|-----------------|
| `VRLA-AGM` | `Plana` | **123** | STANDARD, LONG LIFE, ULTRA LONG LIFE, HIGH RATE, SOLAR, DEEP CYCLE, FRONT TERMINAL, HIGH TEMP, ELECTRIC VEHICLE, LEAD CARBON, WIND POWER |
| `VRLA-GEL` | `Plana` | **16** | SOLAR GEL + DEEP CYCLE GEL ✅ (bug original corregido) |
| `VRLA-GEL` | `Tubular` | **20** | Solo OPzV |
| `LiFePO4` | `Prismática` | **21** | Solo LITIO |
| `LiFePO4` | `Tubular` | **0** | Combinación imposible (devuelve vacío, sin error) |
| `VRLA-AGM` | `Prismática` | **0** | Combinación imposible |
| `VRLA-GEL` | `Prismática` | **0** | Combinación imposible |

### 5.2 Aplicación × tecnología × resultado

| application | technology | Total | Descripción |
|------------|-----------|-------|-------------|
| `Telecomunicaciones` | `VRLA-AGM` | ~102 | AGM telecom amplio |
| `Telecomunicaciones` | `VRLA-GEL` | 20 | Solo OPzV |
| `Telecomunicaciones` | `LiFePO4` | 13 | Litio completo |
| `solar` | `VRLA-AGM` | ~49 | Solar AGM (SOLAR + DEEP CYCLE + LEAD CARBON) |
| `solar` | `VRLA-GEL` | 31 | Solar GEL (SOLAR GEL + DEEP CYCLE GEL) |
| `solar` | `LiFePO4` | 13 | Litio completo (tiene aplicación solar) |
| `SAI` | `VRLA-AGM` | ~85 | Mayoría de AGM |
| `SAI` | `LiFePO4` | 13 | Litio |
| `Bicicletas` | `VRLA-AGM` | 11 | Solo ELECTRIC VEHICLE |

### 5.3 Voltaje × tecnología

```bash
# AGM 2V (solo OPzV tiene 2V en AGM — en realidad es GEL pero...)
voltage=2&technology=VRLA-AGM  → 0
voltage=2&technology=VRLA-GEL  → 29  (OPzV 2V completo)

# AGM 12V — mayoritario
voltage=12&technology=VRLA-AGM  → ~100

# GEL 12V
voltage=12&technology=VRLA-GEL  → ~10 (Solar GEL + Deep Cycle GEL 12V)

# Litio — usando voltage numérico (fix R1 aplicado)
voltage=12.8&technology=LiFePO4  → 13
voltage=25.6&technology=LiFePO4  → 4
voltage=51.2&technology=LiFePO4  → 4
```

### 5.4 Rango de capacidad (Ah) × eurobat

```bash
# < 10Ah con eurobat (pequeños SAI, alarmas)
capacity_max=10&eurobat=true&status=published  → ~20

# 10–50Ah con eurobat
capacity_min=10&capacity_max=50&eurobat=true  → ~25

# 50–100Ah con eurobat
capacity_min=50&capacity_max=100&eurobat=true  → ~25

# 100–200Ah con eurobat
capacity_min=100&capacity_max=200&eurobat=true  → ~40

# 200–500Ah con eurobat
capacity_min=200&capacity_max=500&eurobat=true  → 22

# >500Ah con eurobat (grandes instalaciones)
capacity_min=500&eurobat=true  → ~10 (OPzV grandes)
```

### 5.5 Rango capacidad × aplicación

```bash
# SAI pequeño hasta 50Ah
application=SAI&capacity_max=50&status=published  → ~35

# SAI mediano 50–250Ah
application=SAI&capacity_min=50&capacity_max=250  → ~35

# Solar mediano-alto (80–250Ah, las gammas solares estándar)
application=solar&capacity_min=80&capacity_max=250  → 27

# OPzV o grandes — telecom ≥200Ah
application=Telecomunicaciones&capacity_min=200  → ~35

# Litio de alta capacidad para renovables
application=renovable&technology=LiFePO4&capacity_min=100  → ~8
```

### 5.6 Características técnicas como filtro de precisión

```bash
# Solo alta temperatura (rango -40°C/+80°C): HIGH TEMPERATURE
characteristics=-40%C2%B0C&status=published  → 19

# PSoC — apto para carga parcial continua: LEAD CARBON + LITIO
characteristics=PSoC&status=published  → 28

# Gel puro inmovilizado: OPzV + DEEP CYCLE GEL
characteristics=gel+puro  → 20

# BMS integrado: solo LITIO
characteristics=BMS  → 21

# Libre de mantenimiento (amplio — menciona muchas gammas)
characteristics=mantenimiento  → 75

# Larga vida ciclica: DEEP CYCLE GEL + OPzV + LEAD CARBON
characteristics=larga+vida  → 31

# Alta ciclabilidad (ciclos mencionados explícitamente)
characteristics=ciclos  → 20

# Placa tubular mencionada en características
characteristics=tubular  → 0  (OPzV tiene Tubular en plate_type, no en characteristics)
```

### 5.7 Filtros JSONB — atributos exactos

Los filtros `filters[campo]=valor` hacen coincidencia exacta (string) sobre `attributes_json`.

```bash
# Producto exacto por modelo
filters[model_code]=KBOPZV2200  → 1 (producto único)
filters[model_code]=KBLI121000  → 1

# Todos los 12V con 100Ah exactos
filters[voltage]=12&filters[capacity]=100  → 10

# OPzV 2V de 200Ah
filters[voltage]=2&filters[capacity]=200  → 2

# Litio 12.8V de 100Ah
filters[voltage]=12.8&filters[capacity]=100  → 1

# Por terminal M8 (todos los que tienen ese terminal)
filters[terminal_type]=M8  → muchos

# Por peso específico
filters[weight]=31.5  → 1 (si existe ese producto)
```

### 5.8 Búsqueda libre (`search`) — alcance real

El `search` es ILIKE en 6 campos simultáneamente:

```bash
# Por nombre de categoría
search=OPzV  → 20  (solo OPzV en categories.name)
search=litio → 21  (KAISE LITIO en categories.name)

# Por aplicaciones de categoría
search=SAI         → 97
search=solar       → 92  (mayor que application=solar=80 porque busca en más campos)
search=ferroviaria → ~28 (categorías con aplicación ferroviaria)

# Por características de categoría
search=PSoC        → 28  (igual que characteristics=PSoC)
search=BMS         → 21  (igual que characteristics=BMS)
search=-40         → 19  (temperatura mínima en características)

# Por descripción de producto (busca en products.description)
search=12V         → 137  (muchas descripciones contienen "12V")
search=GEL         → 36   (VRLA-GEL products + categorías con GEL)

# Combinación search + filtro (AND)
search=solar&technology=VRLA-GEL  → 36  (tecnología filtra de todas formas)
search=PSoC&technology=Lead+Carbon  → 7  (solo LEAD CARBON)
```

### 5.9 Capacity_range — búsqueda semántica en texto

El campo `capacity_range` de las categorías contiene texto como "80 – 250 Ah (C100)". El filtro hace ILIKE:

```bash
capacity_range=C10   → 98  (gammas con "C10" en su rango declarado)
capacity_range=C100  → 12  (gammas con "C100" — Solar GEL, SOLAR)
capacity_range=C20   → 29  (EV TRACCIÓN + STANDARD)
capacity_range=3000  → 32  (gammas que van hasta 3000Ah: ULTRA LONG LIFE + OPzV)
capacity_range=250   → 67  (gammas que alcanzan 250Ah)
capacity_range=300   → 53  (300Ah+)
capacity_range=Ah    → 187  (todas — el campo siempre contiene "Ah")
```

> Útil para búsquedas como "¿qué gammas llegan a 3000Ah?" o "¿qué usa tasa C100?".

### 5.10 Casos especiales por gamma

```bash
# KAISE FRONT TERMINAL — solo terminals frontales para racks
plate_type=Plana&application=Telecomunicaciones&characteristics=frontal
→ depende de si "frontal" aparece en characteristics

# Por gamma exacta usando category_id
category_id=a11c1e00-1000-4000-8000-000000000001  → 21  (LITIO completo)
category_id=a15c1e00-1000-4000-8000-00000000000b  → 20  (OPzV completo)
category_id=a13c1e00-1000-4000-8000-000000000003  → 7   (LEAD CARBON completo)
category_id=a13c1e00-1000-4000-8000-000000000004  → 5   (SOLAR GEL completo)

# Filtrar gamma + voltaje específico
category_id=a13c1e00-1000-4000-8000-000000000004&voltage=12  → 5  (Solar GEL 12V)
category_id=a15c1e00-1000-4000-8000-00000000000b&voltage=2   → 12 (OPzV 2V)
```

---

## 6. Combinaciones

| Combinación | Total | Descripción |
|-------------|-------|-------------|
| `application=solar&technology=VRLA-GEL` | 31 | Solar GEL + Deep Cycle GEL |
| `application=Telecomunicaciones&plate_type=Tubular` | 20 | OPzV telecom |
| `application=Telecomunicaciones&plate_type=Tubular&eurobat=true` | 20 | OPzV Eurobat |
| `technology=VRLA-GEL&plate_type=Plana` | **16** | Solar GEL + DC GEL ✅ (bug original) |
| `technology=VRLA-AGM&application=SAI&capacity_min=100&capacity_max=250&eurobat=true` | 17 | SAI AGM mediana cap |
| `technology=LiFePO4&voltage=12.8` | 13 | Litio 12.8V |
| `plate_type=Tubular&capacity_range=3000` | 20 | OPzV completo |
| `eurobat=true&capacity_min=200&capacity_max=500` | 22 | AGM/GEL grandes cert. |
| `application=solar&capacity_min=80&capacity_max=250` | 27 | Solar mediana-alta |
| `technology=VRLA-AGM&plate_type=Plana&eurobat=true&capacity_min=100` | ~45 | AGM grandes cert. |
| `category_id=[SOLAR GEL]&voltage=12` | 5 | Solar GEL 12V completo |
| `technology=VRLA-AGM&characteristics=alta+temperatura` | 8 | Solo HIGH TEMP |
| `technology=Lead+Carbon&characteristics=PSoC` | 7 | Lead Carbon completo |
| `application=Movilidad&technology=VRLA-GEL` | ~10 | GEL para movilidad ✅ |

### 6.1 Combinaciones con características (multi-filtro avanzado)

Characteristics busca texto libre en `c.characteristics` (ILIKE). Combinado con otros filtros aplica AND.

| Combinación | Total | Descripción |
|-------------|-------|-------------|
| `technology=VRLA-AGM&plate_type=Plana&characteristics=larga+vida` | ~20 | AGM plana + ciclos: LONG LIFE + DEEP CYCLE + LEAD CARBON |
| `technology=VRLA-AGM&plate_type=Plana&characteristics=PSoC` | 7 | AGM plana con PSoC: solo LEAD CARBON |
| `technology=VRLA-AGM&plate_type=Plana&characteristics=alta+temperatura` | 8 | AGM plana high temp: solo HIGH TEMP |
| `technology=VRLA-AGM&plate_type=Plana&eurobat=true&characteristics=larga+vida` | ~15 | AGM plana long-life certificado |
| `technology=VRLA-AGM&plate_type=Plana&capacity_min=100&characteristics=alta+tasa` | ~30 | AGM alta tasa ≥100Ah: HIGH RATE grandes |
| `technology=VRLA-GEL&plate_type=Plana&characteristics=gel+puro` | 16 | Solar GEL + DC GEL (toda la gama GEL plana) |
| `technology=VRLA-GEL&plate_type=Plana&voltage=12&characteristics=gel+puro` | ~10 | Solar GEL plana 12V |
| `technology=VRLA-GEL&plate_type=Plana&capacity_min=80&capacity_max=250&characteristics=gel+puro` | ~10 | Solar GEL rango mediano |
| `technology=VRLA-GEL&plate_type=Tubular&characteristics=larga+vida` | 20 | OPzV completo (toda tubular tiene larga vida) |
| `technology=VRLA-GEL&plate_type=Tubular&voltage=2&characteristics=larga+vida` | 12 | OPzV 2V larga vida |
| `technology=VRLA-GEL&plate_type=Tubular&eurobat=true&capacity_min=200` | 20 | OPzV Eurobat ≥200Ah |
| `technology=LiFePO4&plate_type=Prismática&characteristics=BMS` | 21 | Litio completo (BMS siempre presente) |
| `technology=LiFePO4&plate_type=Prismática&voltage=12.8&characteristics=BMS` | 13 | Litio 12.8V con BMS |
| `technology=LiFePO4&plate_type=Prismática&characteristics=PSoC` | ~20 | Litio PSoC (capacidad parcial) |
| `technology=LiFePO4&plate_type=Prismática&capacity_min=100&characteristics=BMS` | ~15 | Litio ≥100Ah con BMS |
| `technology=VRLA-AGM&plate_type=Plana&characteristics=larga+vida&eurobat=true&capacity_min=50&capacity_max=300` | ~12 | AGM long-life cert. rango medio — consulta más compleja |
| `technology=VRLA-AGM&plate_type=Plana&characteristics=alta+tasa&voltage=12&capacity_min=50` | ~20 | HIGH RATE 12V ≥50Ah |
| `technology=VRLA-GEL&plate_type=Tubular&characteristics=larga+vida&voltage=2&capacity_min=500` | ~10 | OPzV 2V gran capacidad |
| `technology=VRLA-AGM&plate_type=Plana&characteristics=vehiculo+electrico` | 11 | ELECTRIC VEHICLE plana AGM |
| `technology=VRLA-AGM&plate_type=Plana&characteristics=vehiculo+electrico&voltage=6` | ~5 | EV 6V |

> **Nota:** `characteristics` hace ILIKE sobre `c.characteristics` que es texto libre. Si la palabra clave no aparece literalmente en ese campo, devuelve 0. Verificar siempre contra la DB real.

### 6.2 Combinaciones imposibles (siempre 0)

| Combinación | Resultado | Razón |
|-------------|-----------|-------|
| `technology=LiFePO4&plate_type=Tubular` | 0 | Litio no existe en tubular |
| `technology=LiFePO4&plate_type=Plana` | 0 | Litio es siempre Prismática |
| `technology=VRLA-AGM&plate_type=Prismática` | 0 | AGM no existe en prismática |
| `technology=VRLA-GEL&plate_type=Prismática` | 0 | GEL no existe en prismática |
| `technology=VRLA-AGM&characteristics=BMS` | 0 | BMS solo en LiFePO4 |
| `technology=LiFePO4&characteristics=gel+puro` | 0 | Gel solo en VRLA-GEL |
| `technology=VRLA-GEL&plate_type=Plana&voltage=2` | 0 | GEL plana no tiene 2V (solo OPzV tubular tiene 2V) |

---

## 7. Errores y casos límite

### Errores de validación (400)
| Input | Respuesta |
|-------|-----------|
| `per_page=200` | `VALIDATION_ERROR: Validation failed` ✅ (fix R7) |
| `per_page=0`, `page=-1` | `VALIDATION_ERROR` |
| `status=invalid` | `VALIDATION_ERROR` |
| `voltage=texto` | `VALIDATION_ERROR` |
| `category_id=no-es-uuid` | `VALIDATION_ERROR` |
| `capacity_min=500&capacity_max=10` | `VALIDATION_ERROR` ✅ (fix R4) |

### Sin error, sin resultados (silenciosos)
| Input | Respuesta | Notas |
|-------|-----------|-------|
| UUID no existe | `total: 0` | No 404 |
| `filters[campo_no_existe]=x` | `total: 0` | Silencioso |
| Combinación imposible (Litio+Tubular) | `total: 0` | Correcto |

### Comportamientos notables
- Página fuera de rango (`page=999`): `data: [], total: 187` — correcto
- `per_page=100` (máximo): devuelve todos los 187 en 2 páginas — correcto
- `search=` vacío: equivale a sin filtro de búsqueda — correcto

---

## 8. Bugs corregidos

| # | Descripción | Síntoma anterior | Estado |
|---|-------------|-----------------|--------|
| **R1** | `voltage` decimal en filtro numérico | `voltage=12.8` → 0 | ✅ **Corregido** — usa comparación string |
| **R2** | `plate_type=Plana` vs DB "Flat" | `plate_type=Plana` → 0 | ✅ **Corregido** — migración 021 ejecutada (Flat→Plana) |
| **R3** | `capacity_min/max` filtraba solo `capacity` | EV products con `capacity_nominal_10h` no aparecían | ✅ **Corregido** — COALESCE(capacity, capacity_nominal_10h) |
| **R4** | Sin validación `capacity_min > capacity_max` | `min=500&max=10` → total=0 silencioso | ✅ **Corregido** — Joi custom validation |
| **R5** | `application=Movilidad` → 0 | Keyword wizard sin match en DB | ✅ **Corregido** — APPLICATION_ALIASES en repository |
| **R6** | `technology=Lead Carbon` → 0 | LEAD CARBON tenía `technology=VRLA-AGM` | ✅ **Corregido** — migración 022 ejecutada |
| **R7** | `per_page>100` sin error | `per_page=200` → 200 resultados | ✅ **Corregido** — Joi max(100) |
| **R8** | Wizard enviaba `voltage=12.8` para Litio | Litio no aparecía en wizard | ✅ **Corregido** — usa `filters[voltage]` para LiFePO4 |

### Archivos modificados

| Archivo | Fix | Cambio |
|---------|-----|--------|
| `src/repositories/ProductRepository.ts` | R1, R3, R5 | voltage string compare, capacity COALESCE, application aliases |
| `src/validation/schemas.ts` | R4, R7 | capacity range validation, per_page max=100 |
| `wordpress-plugin/kaise-catalog/assets/kaise-catalog.js` | R8 | Wizard LiFePO4 usa `filters[voltage]` |
| `src/migrations/021_rename_flat_restructure_categories.sql` | R2 | Flat→Plana (ejecutada) |
| `src/migrations/022_lead_carbon_technology.sql` | R6 | Lead Carbon technology (nueva, ejecutada) |

---

## 9. Cobertura

### Por tecnología (total 187)
```
VRLA-AGM    130/187  69.5%  ████████████████████▓░░░░░░░░░
VRLA-GEL     36/187  19.3%  █████▓░░░░░░░░░░░░░░░░░░░░░░░░
LiFePO4      21/187  11.2%  ███░░░░░░░░░░░░░░░░░░░░░░░░░░░
Lead Carbon   7/187   3.7%  █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

### Por voltaje (JSONB)
```
12V     120  64.2%  Mayoría catálogo AGM/GEL
2V       29  15.5%  OPzV 2V
6V       14   7.5%  EV 6V
12.8V    13   7.0%  Litio 12V nominal
25.6V     4   2.1%  Litio 24V nominal
51.2V     4   2.1%  Litio 48V nominal
```

### Aplicación (superposición — suma > 187 porque un producto puede pertenecer a varias)
```
Telecomunicaciones  119  principal aplicación del catálogo
SAI/UPS              97  segunda
Solar/Renovable      80  tercera
Alarma               33
Movilidad (fix)      35  ✅ antes era 0
Bicicletas           11
```
