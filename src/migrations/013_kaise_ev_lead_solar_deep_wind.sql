-- Migration 013: 5 new Kaise product series categories
-- Series: ELECTRIC VEHICLE, ELECTRIC VEHICLE TRACCIÓN, LEAD CARBON, SOLAR GEL, DEEP CYCLE GEL, WIND POWER
BEGIN;

-- =====================================================================
-- CATEGORIES
-- =====================================================================
INSERT INTO categories (id, name, slug, description, parent_id,
                         technology, plate_type, design_life_years, cycles,
                         capacity_range, applications, eurobat, characteristics) VALUES

  ('a13c1e00-1000-4000-8000-000000000001',
   'KAISE ELECTRIC VEHICLE',
   'kaise-electric-vehicle',
   'Baterías especialmente diseñadas para vehículos eléctricos con rejilla y material activo especializados. Tienen placas con caja de polipropileno resistente a impactos, diseñadas para soportar vibraciones y ambientes extremos. Ofrecen rendimiento superior, calidad y fiabilidad para diversas opciones de ciclos en ambientes secos, están conectados para ciclos de vida mejorados en aplicaciones comerciales, industriales, residenciales y privadas. Sin necesidad de mantenimiento y con construcción avanzada, son ideales para aplicaciones de tracción ligera.',
   NULL,
   'VRLA-AGM',
   'Flat',
   NULL,
   NULL,
   '6 – 230 Ah (C10)',
   'Bicicletas eléctricas y sillas de ruedas, Coches, triciclos y carritos de golf, Aspiradoras industriales, Juguetes eléctricos, Energías renovables',
   FALSE,
   'Diseño de rejilla computerizado para alcanzar 99,99% de pureza en una aleación de Pb-Ca con elevada resistencia. Grupos de placas fijas garantizan mayor resistencia a vibraciones. Placas formadas en tanque para garantizar la formación uniforme de las placas. Pueden operar en una amplia franja de temperatura (-40°C a 60°C). Aislamiento doble con separadores de fibra de vidrio microporos. Sistema de suspensión de llamas a través de los válvulos para una total seguridad. Baja autodescarga (1%-3%/mes). Terminal multi funciones.'),

  ('a13c1e00-1000-4000-8000-000000000002',
   'KAISE ELECTRIC VEHICLE TRACCIÓN',
   'kaise-electric-vehicle-traccion',
   'Baterías de tracción para vehículos eléctricos con capacidades desde 145Ah hasta 344Ah. Diseñadas para proporcionar ciclos profundos y descargas continuas. Especialmente creadas para sistemas de tracción en carretillas elevadoras, coches de golf y otros vehículos eléctricos.',
   NULL,
   'VRLA-AGM',
   'Tubular/Flat',
   NULL,
   NULL,
   '145 – 420 Ah (C20)',
   'Carretillas elevadoras, Coches de golf, Vehículos eléctricos de carga',
   FALSE,
   'Placas de gran capacidad con separador AGM. Capacidades nominales en ciclo profundo. Sistema de electrólito mejorado. Rangos de descarga @ 25Amp y @ 75Amp. Terminales especiales para tracción. Excelente comportamiento en descargas profundas.'),

  ('a13c1e00-1000-4000-8000-000000000003',
   'KAISE LEAD CARBON',
   'kaise-lead-carbon',
   'La serie LEAD CARBON es una batería de plomo y carbono que incorpora material de carbono de alta capacidad y conductividad al electrodo negativo. Esta tecnología combina las ventajas de las baterías de plomo con la de los supercondensadores. Las baterías de plomo y carbono proporcionan no solo alta densidad de potencia, sino también carga y descarga rápidas y un ciclo de vida más largo, especialmente en aplicaciones de carga parcial (PSoC). Es adecuado para energía renovable, solar y eólica, así como sistemas de almacenamiento de energía (Energy Storage).',
   NULL,
   'VRLA-AGM',
   'Flat',
   '15-20 años (12V, 2V)',
   '4000+ ciclos @ 60% DoD',
   '75 – 250 Ah',
   'Sistemas de red inteligentes, Sistemas de almacenamiento de energía en el hogar, Sistemas de suministro de energía híbridos, Almacenamiento de energía renovable, solar y eólica, Alumbrado público solar, Sistemas de nivelación de los picos y frecuencia de red',
   FALSE,
   'Diseño de vida de 15 años (12V) a 20 años (2V) @25°C. Larga vida útil en ciclo profundo, más de 4.000 ciclos con 60% DoD. Excelente comportamiento en PSoC (Partial State of Charger). Excelente aceptación de carga, carga rápida/descarga intensa. Carga súper rápida: 0% a 90% de nivel de SoC en menos de 1,5 horas. Fácil instalación y mantenimiento. Baja autodescarga. Cumple con las normas IEC, IEEE, UL, EN, CE, etc.'),

  ('a13c1e00-1000-4000-8000-000000000004',
   'KAISE SOLAR GEL',
   'kaise-solar-gel',
   'Las baterías de la serie Solar GEL se utilizan principalmente para el sector de las energías renovables debido a su excelente comportamiento cíclico. La densidad del ácido inferior, exceso de electrolito y una mayor distancia entre las placas mantiene estas baterías a baja temperatura y también reduce la corrosión de las placas de rejilla. Las válvulas están especialmente diseñadas para controlar la pérdida de agua por gasificación y evitar la entrada de aire u otros elementos.',
   NULL,
   'VRLA-GEL',
   'Tubular',
   NULL,
   NULL,
   '80 – 250 Ah (C100)',
   'Energías renovables, Equipos de pruebas eléctricas, Sistemas de iluminación de emergencia, Equipamientos marítimos, Sistemas de Telecomunicaciones, Autocaravanas',
   FALSE,
   'Buen comportamiento cíclico. Baja autodescarga. Alta estabilidad térmica. Libre de mantenimiento convencional. Materiales externos compuestos de plásticos ABS.'),

  ('a13c1e00-1000-4000-8000-000000000005',
   'KAISE DEEP CYCLE GEL',
   'kaise-deep-cycle-gel',
   'La serie Deep Cycle Gel es una batería PURE GEL con un ciclo de vida de 15-20 años en aplicaciones estacionarias, ideal para aplicaciones de descarga cíclica o estacionaria en entornos extremos. Utilizando placas resistentes, plomo de alta pureza y electrolito de gel patentado, esta serie ofrece una excelente recuperación después de una descarga profunda. Construida con tecnología de punta a nivel internacional.',
   NULL,
   'VRLA-GEL',
   'Tubular',
   '15-20 años (12V)',
   NULL,
   '33 – 250 Ah (C10)',
   'Sistemas de energía solar y eólica, Sistemas de TV por cable, Telecomunicaciones, Sillas de ruedas eléctricas, Equipamientos militares, Equipamientos marítimos, Equipamientos médicos, Iluminación de emergencia, Centrales eléctricas, Sistema ferroviario, Carritos de Golf, Silla de ruedas eléctrica, Autocaravanas',
   FALSE,
   'Larga vida útil. Elevada fiabilidad y calidad. Alta potencia. Excelente recuperación después de descargas profundas. Cumple las normativas. No es sensible a descargas profundas ocasionales. Construida con tecnología de punta a nivel internacional. Alta capacidad térmica que reduce el riesgo de fugas térmicas y el secado profundo de la materia electrolítica. Separadores en PVC y SiO2 de origen alemán, 100% testado.'),

  ('a13c1e00-1000-4000-8000-000000000006',
   'KAISE WIND POWER',
   'kaise-wind-power',
   'La serie Wind Power es una batería de plomo-ácido con aleación especial de rejilla y materia prima de alta pureza seguirá una menor formación de gas, menos autodescarga. Diseño único de válvula de ventilación: controla la pérdida de agua, previene la entrada de aire y chispas en el interior.',
   NULL,
   'VRLA',
   'Flat',
   NULL,
   NULL,
   '7.2 – 12 Ah',
   'Sistema de generación eólica, SAI y EPS, Luces de emergencia, Señalización ferroviaria y sistema de señalización de aeronaves, Marina y estaciones de energía, Suministro de energía para comunicaciones, Energías renovables',
   FALSE,
   'La aleación especial de la rejilla y la materia prima de alta pureza garantizan una menor formación de gases y una menor autodescarga. La tecnología refinada de la rejilla y las placas más gruesas se utilizan para prolongar la vida útil de la batería y reducir la velocidad de corrosión de la rejilla de placas. Menor densidad del ácido, exceso de electrolito y mayor distancia entre placas para mantener la batería a baja temperatura. Utilización de la tecnología de recombinación de oxígeno: sin mantenimiento. Material ABS que aumenta la resistencia del contenedor de la batería.');

-- =====================================================================
-- CATEGORY FEATURES: KAISE ELECTRIC VEHICLE
-- =====================================================================
INSERT INTO category_features (id, category_id, type, label, "order") VALUES
  ('a13c1e00-7001-4000-8000-000000000001', 'a13c1e00-1000-4000-8000-000000000001', 'application', 'Bicicletas eléctricas y sillas de ruedas', 1),
  ('a13c1e00-7001-4000-8000-000000000002', 'a13c1e00-1000-4000-8000-000000000001', 'application', 'Coches, triciclos y carritos de golf', 2),
  ('a13c1e00-7001-4000-8000-000000000003', 'a13c1e00-1000-4000-8000-000000000001', 'application', 'Aspiradoras industriales', 3),
  ('a13c1e00-7001-4000-8000-000000000004', 'a13c1e00-1000-4000-8000-000000000001', 'application', 'Juguetes eléctricos', 4),
  ('a13c1e00-7001-4000-8000-000000000005', 'a13c1e00-1000-4000-8000-000000000001', 'application', 'Energías renovables', 5),
  ('a13c1e00-7001-4000-8000-000000000006', 'a13c1e00-1000-4000-8000-000000000001', 'characteristic', 'Diseño de rejilla computerizado para alta pureza', 1),
  ('a13c1e00-7001-4000-8000-000000000007', 'a13c1e00-1000-4000-8000-000000000001', 'characteristic', 'Grupos de placas fijas para mayor resistencia a vibraciones', 2),
  ('a13c1e00-7001-4000-8000-000000000008', 'a13c1e00-1000-4000-8000-000000000001', 'characteristic', 'Placas formadas en tanque para uniformidad', 3),
  ('a13c1e00-7001-4000-8000-000000000009', 'a13c1e00-1000-4000-8000-000000000001', 'characteristic', 'Operación en amplio rango de temperatura (-40°C a 60°C)', 4),
  ('a13c1e00-7001-4000-8000-00000000000a', 'a13c1e00-1000-4000-8000-000000000001', 'characteristic', 'Aislamiento doble con separadores de fibra de vidrio', 5),
  ('a13c1e00-7001-4000-8000-00000000000b', 'a13c1e00-1000-4000-8000-000000000001', 'characteristic', 'Sistema de suspensión de llamas', 6),
  ('a13c1e00-7001-4000-8000-00000000000c', 'a13c1e00-1000-4000-8000-000000000001', 'characteristic', 'Baja autodescarga (1%-3%/mes)', 7);

-- =====================================================================
-- CATEGORY FEATURES: KAISE ELECTRIC VEHICLE TRACCIÓN
-- =====================================================================
INSERT INTO category_features (id, category_id, type, label, "order") VALUES
  ('a13c1e00-7002-4000-8000-000000000001', 'a13c1e00-1000-4000-8000-000000000002', 'application', 'Carretillas elevadoras', 1),
  ('a13c1e00-7002-4000-8000-000000000002', 'a13c1e00-1000-4000-8000-000000000002', 'application', 'Coches de golf', 2),
  ('a13c1e00-7002-4000-8000-000000000003', 'a13c1e00-1000-4000-8000-000000000002', 'application', 'Vehículos eléctricos de carga', 3),
  ('a13c1e00-7002-4000-8000-000000000004', 'a13c1e00-1000-4000-8000-000000000002', 'characteristic', 'Placas de gran capacidad con separador AGM', 1),
  ('a13c1e00-7002-4000-8000-000000000005', 'a13c1e00-1000-4000-8000-000000000002', 'characteristic', 'Capacidades nominales en ciclo profundo', 2),
  ('a13c1e00-7002-4000-8000-000000000006', 'a13c1e00-1000-4000-8000-000000000002', 'characteristic', 'Sistema de electrólito mejorado', 3),
  ('a13c1e00-7002-4000-8000-000000000007', 'a13c1e00-1000-4000-8000-000000000002', 'characteristic', 'Rangos de descarga @ 25Amp y @ 75Amp', 4),
  ('a13c1e00-7002-4000-8000-000000000008', 'a13c1e00-1000-4000-8000-000000000002', 'characteristic', 'Terminales especiales para tracción', 5),
  ('a13c1e00-7002-4000-8000-000000000009', 'a13c1e00-1000-4000-8000-000000000002', 'characteristic', 'Excelente comportamiento en descargas profundas', 6);

-- =====================================================================
-- CATEGORY FEATURES: KAISE LEAD CARBON
-- =====================================================================
INSERT INTO category_features (id, category_id, type, label, "order") VALUES
  ('a13c1e00-7003-4000-8000-000000000001', 'a13c1e00-1000-4000-8000-000000000003', 'application', 'Sistemas de red inteligentes', 1),
  ('a13c1e00-7003-4000-8000-000000000002', 'a13c1e00-1000-4000-8000-000000000003', 'application', 'Sistemas de almacenamiento de energía en el hogar', 2),
  ('a13c1e00-7003-4000-8000-000000000003', 'a13c1e00-1000-4000-8000-000000000003', 'application', 'Sistemas de suministro de energía híbridos', 3),
  ('a13c1e00-7003-4000-8000-000000000004', 'a13c1e00-1000-4000-8000-000000000003', 'application', 'Almacenamiento de energía renovable, solar y eólica', 4),
  ('a13c1e00-7003-4000-8000-000000000005', 'a13c1e00-1000-4000-8000-000000000003', 'application', 'Alumbrado público solar', 5),
  ('a13c1e00-7003-4000-8000-000000000006', 'a13c1e00-1000-4000-8000-000000000003', 'application', 'Sistemas de nivelación de picos y frecuencia de red', 6),
  ('a13c1e00-7003-4000-8000-000000000007', 'a13c1e00-1000-4000-8000-000000000003', 'characteristic', 'Vida de diseño de 15-20 años', 1),
  ('a13c1e00-7003-4000-8000-000000000008', 'a13c1e00-1000-4000-8000-000000000003', 'characteristic', 'Más de 4000 ciclos con 60% DoD', 2),
  ('a13c1e00-7003-4000-8000-000000000009', 'a13c1e00-1000-4000-8000-000000000003', 'characteristic', 'Excelente comportamiento en PSoC', 3),
  ('a13c1e00-7003-4000-8000-00000000000a', 'a13c1e00-1000-4000-8000-000000000003', 'characteristic', 'Excelente aceptación de carga, carga rápida/descarga intensa', 4),
  ('a13c1e00-7003-4000-8000-00000000000b', 'a13c1e00-1000-4000-8000-000000000003', 'characteristic', 'Carga súper rápida: 0% a 90% en menos de 1,5 horas', 5),
  ('a13c1e00-7003-4000-8000-00000000000c', 'a13c1e00-1000-4000-8000-000000000003', 'characteristic', 'Fácil instalación y mantenimiento', 6),
  ('a13c1e00-7003-4000-8000-00000000000d', 'a13c1e00-1000-4000-8000-000000000003', 'characteristic', 'Baja autodescarga', 7);

-- =====================================================================
-- CATEGORY FEATURES: KAISE SOLAR GEL
-- =====================================================================
INSERT INTO category_features (id, category_id, type, label, "order") VALUES
  ('a13c1e00-7004-4000-8000-000000000001', 'a13c1e00-1000-4000-8000-000000000004', 'application', 'Energías renovables', 1),
  ('a13c1e00-7004-4000-8000-000000000002', 'a13c1e00-1000-4000-8000-000000000004', 'application', 'Equipos de pruebas eléctricas', 2),
  ('a13c1e00-7004-4000-8000-000000000003', 'a13c1e00-1000-4000-8000-000000000004', 'application', 'Sistemas de iluminación de emergencia', 3),
  ('a13c1e00-7004-4000-8000-000000000004', 'a13c1e00-1000-4000-8000-000000000004', 'application', 'Equipamientos marítimos', 4),
  ('a13c1e00-7004-4000-8000-000000000005', 'a13c1e00-1000-4000-8000-000000000004', 'application', 'Sistemas de telecomunicaciones', 5),
  ('a13c1e00-7004-4000-8000-000000000006', 'a13c1e00-1000-4000-8000-000000000004', 'application', 'Autocaravanas', 6),
  ('a13c1e00-7004-4000-8000-000000000007', 'a13c1e00-1000-4000-8000-000000000004', 'characteristic', 'Buen comportamiento cíclico', 1),
  ('a13c1e00-7004-4000-8000-000000000008', 'a13c1e00-1000-4000-8000-000000000004', 'characteristic', 'Baja autodescarga', 2),
  ('a13c1e00-7004-4000-8000-000000000009', 'a13c1e00-1000-4000-8000-000000000004', 'characteristic', 'Alta estabilidad térmica', 3),
  ('a13c1e00-7004-4000-8000-00000000000a', 'a13c1e00-1000-4000-8000-000000000004', 'characteristic', 'Libre de mantenimiento convencional', 4),
  ('a13c1e00-7004-4000-8000-00000000000b', 'a13c1e00-1000-4000-8000-000000000004', 'characteristic', 'Materiales externos compuestos de plásticos ABS', 5);

-- =====================================================================
-- CATEGORY FEATURES: KAISE DEEP CYCLE GEL
-- =====================================================================
INSERT INTO category_features (id, category_id, type, label, "order") VALUES
  ('a13c1e00-7005-4000-8000-000000000001', 'a13c1e00-1000-4000-8000-000000000005', 'application', 'Sistemas de energía solar y eólica', 1),
  ('a13c1e00-7005-4000-8000-000000000002', 'a13c1e00-1000-4000-8000-000000000005', 'application', 'Sistemas de TV por cable', 2),
  ('a13c1e00-7005-4000-8000-000000000003', 'a13c1e00-1000-4000-8000-000000000005', 'application', 'Telecomunicaciones', 3),
  ('a13c1e00-7005-4000-8000-000000000004', 'a13c1e00-1000-4000-8000-000000000005', 'application', 'Sillas de ruedas eléctricas', 4),
  ('a13c1e00-7005-4000-8000-000000000005', 'a13c1e00-1000-4000-8000-000000000005', 'application', 'Equipamientos militares', 5),
  ('a13c1e00-7005-4000-8000-000000000006', 'a13c1e00-1000-4000-8000-000000000005', 'application', 'Equipamientos marítimos', 6),
  ('a13c1e00-7005-4000-8000-000000000007', 'a13c1e00-1000-4000-8000-000000000005', 'application', 'Equipamientos médicos', 7),
  ('a13c1e00-7005-4000-8000-000000000008', 'a13c1e00-1000-4000-8000-000000000005', 'application', 'Iluminación de emergencia', 8),
  ('a13c1e00-7005-4000-8000-000000000009', 'a13c1e00-1000-4000-8000-000000000005', 'application', 'Centrales eléctricas', 9),
  ('a13c1e00-7005-4000-8000-00000000000a', 'a13c1e00-1000-4000-8000-000000000005', 'application', 'Sistema ferroviario', 10),
  ('a13c1e00-7005-4000-8000-00000000000b', 'a13c1e00-1000-4000-8000-000000000005', 'application', 'Carritos de golf', 11),
  ('a13c1e00-7005-4000-8000-00000000000c', 'a13c1e00-1000-4000-8000-000000000005', 'application', 'Autocaravanas', 12),
  ('a13c1e00-7005-4000-8000-00000000000d', 'a13c1e00-1000-4000-8000-000000000005', 'characteristic', 'Larga vida útil', 1),
  ('a13c1e00-7005-4000-8000-00000000000e', 'a13c1e00-1000-4000-8000-000000000005', 'characteristic', 'Elevada fiabilidad y calidad', 2),
  ('a13c1e00-7005-4000-8000-00000000000f', 'a13c1e00-1000-4000-8000-000000000005', 'characteristic', 'Alta potencia', 3),
  ('a13c1e00-7005-4000-8000-000000000010', 'a13c1e00-1000-4000-8000-000000000005', 'characteristic', 'Excelente recuperación después de descargas profundas', 4),
  ('a13c1e00-7005-4000-8000-000000000011', 'a13c1e00-1000-4000-8000-000000000005', 'characteristic', 'No es sensible a descargas profundas ocasionales', 5),
  ('a13c1e00-7005-4000-8000-000000000012', 'a13c1e00-1000-4000-8000-000000000005', 'characteristic', 'Tecnología de punta a nivel internacional', 6),
  ('a13c1e00-7005-4000-8000-000000000013', 'a13c1e00-1000-4000-8000-000000000005', 'characteristic', 'Alta capacidad térmica que reduce el riesgo de fugas', 7),
  ('a13c1e00-7005-4000-8000-000000000014', 'a13c1e00-1000-4000-8000-000000000005', 'characteristic', 'Separadores en PVC y SiO2 de origen alemán, 100% testado', 8);

-- =====================================================================
-- CATEGORY FEATURES: KAISE WIND POWER
-- =====================================================================
INSERT INTO category_features (id, category_id, type, label, "order") VALUES
  ('a13c1e00-7006-4000-8000-000000000001', 'a13c1e00-1000-4000-8000-000000000006', 'application', 'Sistema de generación eólica', 1),
  ('a13c1e00-7006-4000-8000-000000000002', 'a13c1e00-1000-4000-8000-000000000006', 'application', 'SAI y EPS', 2),
  ('a13c1e00-7006-4000-8000-000000000003', 'a13c1e00-1000-4000-8000-000000000006', 'application', 'Luces de emergencia', 3),
  ('a13c1e00-7006-4000-8000-000000000004', 'a13c1e00-1000-4000-8000-000000000006', 'application', 'Señalización ferroviaria y sistema de señalización de aeronaves', 4),
  ('a13c1e00-7006-4000-8000-000000000005', 'a13c1e00-1000-4000-8000-000000000006', 'application', 'Marina y estaciones de energía', 5),
  ('a13c1e00-7006-4000-8000-000000000006', 'a13c1e00-1000-4000-8000-000000000006', 'application', 'Suministro de energía para comunicaciones', 6),
  ('a13c1e00-7006-4000-8000-000000000007', 'a13c1e00-1000-4000-8000-000000000006', 'application', 'Energías renovables', 7),
  ('a13c1e00-7006-4000-8000-000000000008', 'a13c1e00-1000-4000-8000-000000000006', 'characteristic', 'Aleación especial de la rejilla para baja formación de gases', 1),
  ('a13c1e00-7006-4000-8000-000000000009', 'a13c1e00-1000-4000-8000-000000000006', 'characteristic', 'Materia prima de alta pureza para baja autodescarga', 2),
  ('a13c1e00-7006-4000-8000-00000000000a', 'a13c1e00-1000-4000-8000-000000000006', 'characteristic', 'Placas más gruesas para prolongar la vida útil', 3),
  ('a13c1e00-7006-4000-8000-00000000000b', 'a13c1e00-1000-4000-8000-000000000006', 'characteristic', 'Menor velocidad de corrosión de la rejilla', 4),
  ('a13c1e00-7006-4000-8000-00000000000c', 'a13c1e00-1000-4000-8000-000000000006', 'characteristic', 'Mantiene la batería a baja temperatura', 5),
  ('a13c1e00-7006-4000-8000-00000000000d', 'a13c1e00-1000-4000-8000-000000000006', 'characteristic', 'Tecnología de recombinación de oxígeno: sin mantenimiento', 6),
  ('a13c1e00-7006-4000-8000-00000000000e', 'a13c1e00-1000-4000-8000-000000000006', 'characteristic', 'Material ABS que aumenta la resistencia del contenedor', 7);

COMMIT;
