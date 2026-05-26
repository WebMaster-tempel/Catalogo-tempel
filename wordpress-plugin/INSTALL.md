# Kaise Catalog — Instalación en WordPress

## 1. Copiar el plugin

Copia la carpeta `kaise-catalog/` en:

```
wp-content/plugins/kaise-catalog/
```

Estructura final:
```
wp-content/plugins/kaise-catalog/
├── kaise-catalog.php
├── templates/
│   └── catalog.php
└── assets/
    ├── kaise-catalog.css
    └── kaise-catalog.js
```

## 2. Activar

**WordPress Admin → Plugins → Activar "Kaise Catalog"**

## 3. Configurar

**Ajustes → Kaise Catalog**

| Campo | Valor |
|---|---|
| URL de la API | `https://tu-dominio.com/api/v1` |
| Clave Anthropic | `sk-ant-…` (de console.anthropic.com) |
| Resultados por página | `20` (recomendado) |

> La clave Anthropic activa el buscador con IA. Sin ella, solo funcionan los filtros avanzados.

## 4. Insertar en una página

Shortcode básico:
```
[kaise_catalog]
```

Con opciones:
```
[kaise_catalog per_page="12" show_ai="true" show_filters="true"]
```

| Atributo | Default | Descripción |
|---|---|---|
| `per_page` | 20 | Resultados por página |
| `show_ai` | true | Muestra el buscador con IA |
| `show_filters` | true | Muestra el panel de filtros |

## Cómo funciona el buscador con IA

El usuario escribe en lenguaje natural, por ejemplo:

> "Necesito una batería de 12V 100Ah especial para bicicletas eléctricas"

El plugin llama a **Claude Haiku** (Anthropic) que extrae los parámetros:

```json
{
  "voltage": 12,
  "capacity_min": 90,
  "capacity_max": 110,
  "application": "Bicicletas",
  "status": "published"
}
```

Esos parámetros se pasan a tu API `/products` y se muestran los resultados.

## Filtros avanzados disponibles

- Búsqueda libre (nombre, descripción, categoría)
- Tensión: 2V, 6V, 12V, 12.8V, 24V, 48V…
- Capacidad mínima / máxima (Ah)KaiseCatalog 
- Tecnología: VRLA-AGM, VRLA-GEL, LiFePO4, Lead Carbon
- Tipo de placa: Plana, Tubular, Prismática
- Aplicación: Solar, SAI/UPS, Telecomunicaciones, Bicicletas…
- Gamma (categoría hoja, cargada desde la API)
- Solo certificadas Eurobat

## CORS

Si WP y la API están en dominios distintos, añade en tu API:

```
Access-Control-Allow-Origin: https://tu-wordpress.com
```

O mejor: el plugin actúa de **proxy** (las llamadas a la API se hacen desde PHP del servidor WP, no desde el navegador), por lo que CORS no es problema por defecto.
