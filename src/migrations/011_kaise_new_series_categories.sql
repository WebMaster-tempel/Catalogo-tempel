-- Migration 011: 5 new Kaise product series categories + features
-- Series: HIGH RATE, SOLAR AGM, DEEP CYCLE, FRONT TERMINAL, HIGH TEMPERATURE
BEGIN;

-- =====================================================================
-- CATEGORIES
-- =====================================================================
INSERT INTO categories (id, name, slug, description, parent_id,
                         technology, plate_type, design_life_years, cycles,
                         capacity_range, applications, eurobat, characteristics) VALUES

  ('a11c1e00-1000-4000-8000-000000000005',
   'KAISE HIGH RATE',
   'kaise-high-rate',
   'Baterías de alta descarga con diseño optimizado de rejillas y fórmula especial de empastado. Hasta 30% más energía que la serie standard. Vida útil 5 años (<116W) y 8 años (>135W). Potencias de 162W a 6200W (10 min a 1,60V/elem).',
   NULL,
   'VRLA-AGM',
   'Flat',
   '5-8 años',
   NULL,
   '9 – 250 Ah',
   'Telecomunicaciones, Equipos SAI, Instalaciones eléctricas, Equipos de emergencia',
   FALSE,
   'Baja resistencia interna. Placas positivas y negativas de Pb-Sn-Ca. Alta densidad energética y rendimiento. Funciona con baja presión interna. Recombinación de gases liberados en la carga. Componentes reconocidos por UL. Rejillas de plomo-calcio para mayor vida útil.'),

  ('a11c1e00-1000-4000-8000-000000000006',
   'KAISE SOLAR AGM',
   'kaise-solar-agm',
   'Baterías diseñadas para energías renovables con excelente desempeño cíclico. Configuración especial de placas con separador AGM de alta calidad para mayor vida útil. Válvulas especiales para controlar pérdida de agua.',
   NULL,
   'VRLA-AGM',
   'AGM',
   NULL,
   NULL,
   '80 – 250 Ah (C100)',
   'Energías renovables, Equipos de pruebas eléctricas, Sistemas de iluminación de emergencia, Equipamientos marítimos, Sistemas de telecomunicaciones, Autocaravanas',
   FALSE,
   'Buen comportamiento cíclico. Baja autodescarga. Libre de mantenimiento convencional. Materiales externos e internos compuestos de plástico ABS.'),

  ('a11c1e00-1000-4000-8000-000000000007',
   'KAISE DEEP CYCLE',
   'kaise-deep-cycle',
   'Baterías para altas descargas con placas muy gruesas no porosas que resisten ciclos de alta descarga repetidamente. Electrolito ligeramente más resistente que los normales para una vida cíclica superior.',
   NULL,
   'VRLA-AGM',
   'Tubular',
   NULL,
   NULL,
   '26 – 230 Ah (C10)',
   'Sistemas de energía solar, Sillas de ruedas eléctricas, Coches de Golf, Equipamientos marítimos, Centrales eléctricas, Sistemas de ferrocarriles, Sistemas de telecomunicaciones, Sistemas de TV por cable, Sistemas de energía de emergencia, Juguetes eléctricos, Autocaravanas',
   FALSE,
   'Elevada fiabilidad y calidad. Recuperación después de ciclos profundos. Alta densidad energética. Larga vida útil en uso cíclico y en flotación. Cumple normas internacionales, JIS y DIN.'),

  ('a11c1e00-1000-4000-8000-000000000008',
   'KAISE FRONT TERMINAL',
   'kaise-front-terminal',
   'Baterías para telecomunicaciones que proporcionan energía inmediata en caso de fallo eléctrico. Funciona como backup para sistemas de comunicación. Vida útil hasta 10-12 años con terminales frontales para facilitar la conexión.',
   NULL,
   'VRLA-AGM',
   'Flat',
   '10-12 años',
   NULL,
   '100 – 200 Ah (C10)',
   'Sistemas de telecomunicaciones, SAI, Centrales eléctricas, Otras fuentes de energía de emergencia o stand-by',
   FALSE,
   'Placas de alta densidad y grosor de Pb-Sn-Ca. Sistema de desgasificación centralizado. Asas de plástico o cuerda para facilitar el transporte y la instalación. Terminales frontales para facilitar la conexión. Baja resistencia interna. Baja autodescarga. Materiales ABS retardantes de llama clasificación V0.'),

  ('a11c1e00-1000-4000-8000-000000000009',
   'KAISE HIGH TEMPERATURE',
   'kaise-high-temperature',
   'Serie VRLA-AGM con tecnología mejorada para alta temperatura (35°C-40°C). Materias primas de alta pureza para mejor rendimiento y vida útil. Reduce significativamente el costo operativo al reducir uso de aire acondicionado.',
   NULL,
   'VRLA-AGM',
   'Flat',
   '15+ años (2V), 10+ años (12V)',
   NULL,
   '100 – 1000 Ah (C10)',
   'Estaciones híbridas remotas de telecomunicaciones, Energías renovables eólica y solar, Sistemas de nivelación de frecuencia de red, Aplicaciones de backup en áreas de baja fiabilidad de red, Sistemas autónomos en ambientes extremos',
   FALSE,
   'Aleación especial anticorrosión. Fórmula especial de pasta anti alta-temperatura. Contenedor especial anti alta-temperatura. Doble sellado especial y agente aislante. Material activo optimizado para alta temperatura. Rango de temperatura: -40°C a +80°C. Cumple normas IEC, IEEE, UL, EN, CE. Diseño de vida a 35°C: 15+ años (2V), 10+ años (12V).');

-- =====================================================================
-- CATEGORY FEATURES: KAISE HIGH RATE
-- =====================================================================
INSERT INTO category_features (id, category_id, type, label, "order") VALUES
  ('a11c1e00-7005-4000-8000-000000000001', 'a11c1e00-1000-4000-8000-000000000005', 'application', 'Telecomunicaciones', 1),
  ('a11c1e00-7005-4000-8000-000000000002', 'a11c1e00-1000-4000-8000-000000000005', 'application', 'Equipos SAI', 2),
  ('a11c1e00-7005-4000-8000-000000000003', 'a11c1e00-1000-4000-8000-000000000005', 'application', 'Instalaciones eléctricas', 3),
  ('a11c1e00-7005-4000-8000-000000000004', 'a11c1e00-1000-4000-8000-000000000005', 'application', 'Equipos de emergencia', 4),
  ('a11c1e00-7005-4000-8000-000000000005', 'a11c1e00-1000-4000-8000-000000000005', 'characteristic', 'Baja resistencia interna', 1),
  ('a11c1e00-7005-4000-8000-000000000006', 'a11c1e00-1000-4000-8000-000000000005', 'characteristic', 'Placas positivas y negativas de Pb-Sn-Ca', 2),
  ('a11c1e00-7005-4000-8000-000000000007', 'a11c1e00-1000-4000-8000-000000000005', 'characteristic', 'Alta densidad energética y rendimiento', 3),
  ('a11c1e00-7005-4000-8000-000000000008', 'a11c1e00-1000-4000-8000-000000000005', 'characteristic', 'Funciona con baja presión interna', 4),
  ('a11c1e00-7005-4000-8000-000000000009', 'a11c1e00-1000-4000-8000-000000000005', 'characteristic', 'Recombinación de los gases liberados en la carga', 5),
  ('a11c1e00-7005-4000-8000-00000000000a', 'a11c1e00-1000-4000-8000-000000000005', 'characteristic', 'Componentes reconocidos por UL', 6),
  ('a11c1e00-7005-4000-8000-00000000000b', 'a11c1e00-1000-4000-8000-000000000005', 'characteristic', 'Rejillas de plomo-calcio para mayor vida útil (6 meses almacenamiento a 20°C)', 7),
  ('a11c1e00-7005-4000-8000-00000000000c', 'a11c1e00-1000-4000-8000-000000000005', 'characteristic', 'Potencias entre 162W y 6200W por elemento durante 10 min. (a 1,60V/elemento)', 8),
  ('a11c1e00-7005-4000-8000-00000000000d', 'a11c1e00-1000-4000-8000-000000000005', 'characteristic', 'Vida útil de 5 años (<116W) y 8 años (>135W)', 9);

-- =====================================================================
-- CATEGORY FEATURES: KAISE SOLAR AGM
-- =====================================================================
INSERT INTO category_features (id, category_id, type, label, "order") VALUES
  ('a11c1e00-7006-4000-8000-000000000001', 'a11c1e00-1000-4000-8000-000000000006', 'application', 'Energías renovables', 1),
  ('a11c1e00-7006-4000-8000-000000000002', 'a11c1e00-1000-4000-8000-000000000006', 'application', 'Equipos de pruebas eléctricas', 2),
  ('a11c1e00-7006-4000-8000-000000000003', 'a11c1e00-1000-4000-8000-000000000006', 'application', 'Sistemas de iluminación de emergencia', 3),
  ('a11c1e00-7006-4000-8000-000000000004', 'a11c1e00-1000-4000-8000-000000000006', 'application', 'Equipamientos marítimos', 4),
  ('a11c1e00-7006-4000-8000-000000000005', 'a11c1e00-1000-4000-8000-000000000006', 'application', 'Sistemas de telecomunicaciones', 5),
  ('a11c1e00-7006-4000-8000-000000000006', 'a11c1e00-1000-4000-8000-000000000006', 'application', 'Autocaravanas', 6),
  ('a11c1e00-7006-4000-8000-000000000007', 'a11c1e00-1000-4000-8000-000000000006', 'characteristic', 'Buen comportamiento cíclico', 1),
  ('a11c1e00-7006-4000-8000-000000000008', 'a11c1e00-1000-4000-8000-000000000006', 'characteristic', 'Baja autodescarga', 2),
  ('a11c1e00-7006-4000-8000-000000000009', 'a11c1e00-1000-4000-8000-000000000006', 'characteristic', 'Libre de mantenimiento convencional', 3),
  ('a11c1e00-7006-4000-8000-00000000000a', 'a11c1e00-1000-4000-8000-000000000006', 'characteristic', 'Materiales externos e internos compuestos de plástico ABS', 4);

-- =====================================================================
-- CATEGORY FEATURES: KAISE DEEP CYCLE
-- =====================================================================
INSERT INTO category_features (id, category_id, type, label, "order") VALUES
  ('a11c1e00-7007-4000-8000-000000000001', 'a11c1e00-1000-4000-8000-000000000007', 'application', 'Sistemas de energía solar', 1),
  ('a11c1e00-7007-4000-8000-000000000002', 'a11c1e00-1000-4000-8000-000000000007', 'application', 'Sillas de ruedas eléctricas', 2),
  ('a11c1e00-7007-4000-8000-000000000003', 'a11c1e00-1000-4000-8000-000000000007', 'application', 'Coches de Golf', 3),
  ('a11c1e00-7007-4000-8000-000000000004', 'a11c1e00-1000-4000-8000-000000000007', 'application', 'Equipamientos marítimos', 4),
  ('a11c1e00-7007-4000-8000-000000000005', 'a11c1e00-1000-4000-8000-000000000007', 'application', 'Centrales eléctricas', 5),
  ('a11c1e00-7007-4000-8000-000000000006', 'a11c1e00-1000-4000-8000-000000000007', 'application', 'Sistemas de ferrocarriles', 6),
  ('a11c1e00-7007-4000-8000-000000000007', 'a11c1e00-1000-4000-8000-000000000007', 'application', 'Sistemas de telecomunicaciones', 7),
  ('a11c1e00-7007-4000-8000-000000000008', 'a11c1e00-1000-4000-8000-000000000007', 'application', 'Sistemas de TV por cable', 8),
  ('a11c1e00-7007-4000-8000-000000000009', 'a11c1e00-1000-4000-8000-000000000007', 'application', 'Sistemas de energía de emergencia', 9),
  ('a11c1e00-7007-4000-8000-00000000000a', 'a11c1e00-1000-4000-8000-000000000007', 'application', 'Juguetes eléctricos', 10),
  ('a11c1e00-7007-4000-8000-00000000000b', 'a11c1e00-1000-4000-8000-000000000007', 'application', 'Autocaravanas', 11),
  ('a11c1e00-7007-4000-8000-00000000000c', 'a11c1e00-1000-4000-8000-000000000007', 'characteristic', 'Elevada fiabilidad y calidad', 1),
  ('a11c1e00-7007-4000-8000-00000000000d', 'a11c1e00-1000-4000-8000-000000000007', 'characteristic', 'Recuperación después de ciclos profundos', 2),
  ('a11c1e00-7007-4000-8000-00000000000e', 'a11c1e00-1000-4000-8000-000000000007', 'characteristic', 'Alta densidad energética', 3),
  ('a11c1e00-7007-4000-8000-00000000000f', 'a11c1e00-1000-4000-8000-000000000007', 'characteristic', 'Larga vida útil en uso cíclico y en flotación', 4),
  ('a11c1e00-7007-4000-8000-000000000010', 'a11c1e00-1000-4000-8000-000000000007', 'characteristic', 'Cumple normas internacionales, JIS y DIN', 5);

-- =====================================================================
-- CATEGORY FEATURES: KAISE FRONT TERMINAL
-- =====================================================================
INSERT INTO category_features (id, category_id, type, label, "order") VALUES
  ('a11c1e00-7008-4000-8000-000000000001', 'a11c1e00-1000-4000-8000-000000000008', 'application', 'Sistemas de telecomunicaciones', 1),
  ('a11c1e00-7008-4000-8000-000000000002', 'a11c1e00-1000-4000-8000-000000000008', 'application', 'SAI', 2),
  ('a11c1e00-7008-4000-8000-000000000003', 'a11c1e00-1000-4000-8000-000000000008', 'application', 'Centrales eléctricas', 3),
  ('a11c1e00-7008-4000-8000-000000000004', 'a11c1e00-1000-4000-8000-000000000008', 'application', 'Otras fuentes de energía de emergencia o stand-by', 4),
  ('a11c1e00-7008-4000-8000-000000000005', 'a11c1e00-1000-4000-8000-000000000008', 'characteristic', 'Placas de alta densidad y grosor de Pb-Sn-Ca para mayor vida útil', 1),
  ('a11c1e00-7008-4000-8000-000000000006', 'a11c1e00-1000-4000-8000-000000000008', 'characteristic', 'Sistema de desgasificación centralizado', 2),
  ('a11c1e00-7008-4000-8000-000000000007', 'a11c1e00-1000-4000-8000-000000000008', 'characteristic', 'Asas de plástico o cuerda para facilitar el transporte y la instalación', 3),
  ('a11c1e00-7008-4000-8000-000000000008', 'a11c1e00-1000-4000-8000-000000000008', 'characteristic', 'Terminales frontales para facilitar la conexión', 4),
  ('a11c1e00-7008-4000-8000-000000000009', 'a11c1e00-1000-4000-8000-000000000008', 'characteristic', 'Baja resistencia interna', 5),
  ('a11c1e00-7008-4000-8000-00000000000a', 'a11c1e00-1000-4000-8000-000000000008', 'characteristic', 'Baja autodescarga', 6),
  ('a11c1e00-7008-4000-8000-00000000000b', 'a11c1e00-1000-4000-8000-000000000008', 'characteristic', 'Vida útil de hasta 10-12 años', 7),
  ('a11c1e00-7008-4000-8000-00000000000c', 'a11c1e00-1000-4000-8000-000000000008', 'characteristic', 'Materiales ABS retardantes de llama con clasificación V0', 8);

-- =====================================================================
-- CATEGORY FEATURES: KAISE HIGH TEMPERATURE
-- =====================================================================
INSERT INTO category_features (id, category_id, type, label, "order") VALUES
  ('a11c1e00-7009-4000-8000-000000000001', 'a11c1e00-1000-4000-8000-000000000009', 'application', 'Estaciones híbridas remotas de telecomunicaciones', 1),
  ('a11c1e00-7009-4000-8000-000000000002', 'a11c1e00-1000-4000-8000-000000000009', 'application', 'Energías renovables, eólica y solar', 2),
  ('a11c1e00-7009-4000-8000-000000000003', 'a11c1e00-1000-4000-8000-000000000009', 'application', 'Sistemas de nivelación de frecuencia de red', 3),
  ('a11c1e00-7009-4000-8000-000000000004', 'a11c1e00-1000-4000-8000-000000000009', 'application', 'Aplicaciones de backup en áreas donde la confiabilidad de la red es pobre', 4),
  ('a11c1e00-7009-4000-8000-000000000005', 'a11c1e00-1000-4000-8000-000000000009', 'application', 'Sistemas autónomos en ambientes extremos', 5),
  ('a11c1e00-7009-4000-8000-000000000006', 'a11c1e00-1000-4000-8000-000000000009', 'characteristic', 'Aleación especial anticorrosión', 1),
  ('a11c1e00-7009-4000-8000-000000000007', 'a11c1e00-1000-4000-8000-000000000009', 'characteristic', 'Fórmula especial de pasta anti alta-temperatura', 2),
  ('a11c1e00-7009-4000-8000-000000000008', 'a11c1e00-1000-4000-8000-000000000009', 'characteristic', 'Contenedor especial anti alta-temperatura', 3),
  ('a11c1e00-7009-4000-8000-000000000009', 'a11c1e00-1000-4000-8000-000000000009', 'characteristic', 'Doble sellado especial y agente aislante anti-alta temperatura', 4),
  ('a11c1e00-7009-4000-8000-00000000000a', 'a11c1e00-1000-4000-8000-000000000009', 'characteristic', 'Material activo optimizado para condiciones de alta temperatura', 5),
  ('a11c1e00-7009-4000-8000-00000000000b', 'a11c1e00-1000-4000-8000-000000000009', 'characteristic', 'Rango de temperatura de funcionamiento: -40°C a +80°C', 6),
  ('a11c1e00-7009-4000-8000-00000000000c', 'a11c1e00-1000-4000-8000-000000000009', 'characteristic', 'Adecuado para funcionamiento continuo a temperaturas superiores a 35°C', 7),
  ('a11c1e00-7009-4000-8000-00000000000d', 'a11c1e00-1000-4000-8000-000000000009', 'characteristic', 'Excelente rendimiento en ciclos profundos', 8),
  ('a11c1e00-7009-4000-8000-00000000000e', 'a11c1e00-1000-4000-8000-000000000009', 'characteristic', 'Cumple con las normas IEC, IEEE, UL, EN, CE', 9),
  ('a11c1e00-7009-4000-8000-00000000000f', 'a11c1e00-1000-4000-8000-000000000009', 'characteristic', 'Diseño de vida a 35°C (95°F): 15+ años (2V), 10+ años (12V)', 10);

COMMIT;
