# Estructura del Catálogo Tempel

Documento de referencia de la jerarquía del catálogo de productos.

Última actualización: reorganización introducida por `src/migrations/015_reorganize_categories.sql`.

---

## Modelo jerárquico

El catálogo se organiza en una jerarquía de hasta **4 niveles de profundidad** bajo el `product_type` **BATERÍA**. Los nodos superiores son **categorías estructurales** (sin productos asociados directamente) y los nodos hoja son **gammas** (contienen los productos).

Las **etiquetas** (`tags`) se asignan exclusivamente a las **gammas** y permiten filtrar productos transversalmente por uso (Cíclico / Estacionario).

---

## Árbol de categorías

```
BATERÍA (product_type)
│
├── Litio  [estructural]
│   └── LFP  [estructural]
│       └── Kaise Litio  [gamma → productos]
│
└── Plomo Ácido  [estructural]
    │
    ├── Plomo Carbono  [estructural]
    │   └── Kaise Lead Carbon  [gamma]  🏷️ Cíclico · Estacionario
    │
    └── VRLA  [estructural]
        │
        ├── AGM  [estructural]
        │   │
        │   ├── Tracción  [estructural]
        │   │   └── Kaise Electric Vehicle  [gamma]
        │   │
        │   ├── Kaise Standard         [gamma]  🏷️ Estacionario
        │   ├── Kaise Long Life        [gamma]  🏷️ Estacionario
        │   ├── Kaise Ultra Long Life  [gamma]  🏷️ Estacionario
        │   ├── Kaise Solar            [gamma]  🏷️ Cíclico           (antes "Kaise Solar AGM")
        │   ├── Kaise Deep Cycle       [gamma]  🏷️ Cíclico
        │   ├── Kaise Front Terminal   [gamma]  🏷️ Estacionario      (específica de telecomunicaciones)
        │   ├── Kaise High Rate        [gamma]  🏷️ Estacionario
        │   └── Kaise Wind Power       [gamma]  🏷️ Estacionario      (específica de energía eólica)
        │
        ├── Alta Temperatura  [estructural]
        │   └── Kaise High Temperature  [gamma]  🏷️ Estacionario
        │
        ├── Gel Puro  [estructural]
        │   ├── Kaise Solar Gel        [gamma]  🏷️ Cíclico · Estacionario
        │   ├── Kaise Deep Cycle Gel   [gamma]  🏷️ Cíclico
        │   └── Kaise OPzV             [gamma]  🏷️ Cíclico · Estacionario
        │
        └── Gel Híbrido  [estructural, vacío]

── Kaise Electric Vehicle Tracción  [gamma, parent_id = NULL]  (pendiente de reorganizar)
```

---

## Categorías estructurales (sin productos)

| Categoría | Slug | Padre |
|---|---|---|
| Litio | `litio` | (raíz) |
| LFP | `lfp` | Litio |
| Plomo Ácido | `plomo-acido` | (raíz) |
| Plomo Carbono | `plomo-carbono` | Plomo Ácido |
| VRLA | `vrla` | Plomo Ácido |
| AGM | `agm` | VRLA |
| Tracción | `traccion` | AGM |
| Alta Temperatura | `alta-temperatura` | VRLA |
| Gel Puro | `gel-puro` | VRLA |
| Gel Híbrido | `gel-hibrido` | VRLA |

---

## Gammas (contienen productos)

| Gamma | Slug | Padre | Etiquetas |
|---|---|---|---|
| Kaise Litio | `kaise-litio` | LFP | — |
| Kaise Lead Carbon | `kaise-lead-carbon` | Plomo Carbono | Cíclico, Estacionario |
| Kaise Electric Vehicle | `kaise-electric-vehicle` | Tracción | — |
| Kaise Standard | `kaise-standard` | AGM | Estacionario |
| Kaise Long Life | `kaise-long-life` | AGM | Estacionario |
| Kaise Ultra Long Life | `kaise-ultra-long-life` | AGM | Estacionario |
| Kaise Solar | `kaise-solar` | AGM | Cíclico |
| Kaise Deep Cycle | `kaise-deep-cycle` | AGM | Cíclico |
| Kaise Front Terminal | `kaise-front-terminal` | AGM | Estacionario |
| Kaise High Rate | `kaise-high-rate` | AGM | Estacionario |
| Kaise Wind Power | `kaise-wind-power` | AGM | Estacionario |
| Kaise High Temperature | `kaise-high-temperature` | Alta Temperatura | Estacionario |
| Kaise Solar Gel | `kaise-solar-gel` | Gel Puro | Cíclico, Estacionario |
| Kaise Deep Cycle Gel | `kaise-deep-cycle-gel` | Gel Puro | Cíclico |
| Kaise OPzV | `kaise-opzv` | Gel Puro | Cíclico, Estacionario |
| Kaise Electric Vehicle Tracción | `kaise-electric-vehicle-traccion` | (raíz, pendiente) | — |

---

## Sistema de etiquetas

Tabla `tags` (dos filas iniciales):

| name | label |
|---|---|
| `cyclical` | Cíclico |
| `stationary` | Estacionario |

Las etiquetas se asocian con categorías mediante la tabla de unión `category_tags` (`category_id`, `tag_id`).

---

## Cambios respecto a la versión anterior

1. Todas las categorías estaban planas (`parent_id = NULL`). Ahora hay **4 niveles** de profundidad máxima.
2. Se renombra **"Kaise Solar AGM" → "Kaise Solar"** (slug `kaise-solar-agm` → `kaise-solar`).
3. Se incorpora la gamma **Kaise OPzV** con 20 productos (12 en serie 2V y 8 en serie 12V).
4. Se añade el sistema de **etiquetas** (tablas `tags` y `category_tags`).
5. **Kaise Electric Vehicle Tracción** queda provisionalmente como nodo raíz; su reubicación se planifica en una iteración posterior.
