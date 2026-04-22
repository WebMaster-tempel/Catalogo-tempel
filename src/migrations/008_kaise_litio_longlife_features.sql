-- Seed category features for KAISE LITIO, LONG LIFE, and ULTRA LONG LIFE
BEGIN;

-- KAISE LITIO Applications (12)
INSERT INTO category_features (id, category_id, type, label, "order") VALUES
  ('a11c1e00-6001-4000-8000-000000000001', 'a11c1e00-1000-4000-8000-000000000001', 'application', 'Energía de reserva para pequeños SAI', 1),
  ('a11c1e00-6001-4000-8000-000000000002', 'a11c1e00-1000-4000-8000-000000000001', 'application', 'Iluminación de paneles outdoor', 2),
  ('a11c1e00-6001-4000-8000-000000000003', 'a11c1e00-1000-4000-8000-000000000001', 'application', 'Enlace eléctrico de FTTB y LAN / WIFI', 3),
  ('a11c1e00-6001-4000-8000-000000000004', 'a11c1e00-1000-4000-8000-000000000001', 'application', 'Monitoreo y vigilancia de calles y carreteras', 4),
  ('a11c1e00-6001-4000-8000-000000000005', 'a11c1e00-1000-4000-8000-000000000001', 'application', 'Sistemas de energía renovable', 5),
  ('a11c1e00-6001-4000-8000-000000000006', 'a11c1e00-1000-4000-8000-000000000001', 'application', 'Equipamientos marítimos', 6),
  ('a11c1e00-6001-4000-8000-000000000007', 'a11c1e00-1000-4000-8000-000000000001', 'application', 'Almacenamiento de energía solar y eólica', 7),
  ('a11c1e00-6001-4000-8000-000000000008', 'a11c1e00-1000-4000-8000-000000000001', 'application', 'Herramientas eléctricas', 8),
  ('a11c1e00-6001-4000-8000-000000000009', 'a11c1e00-1000-4000-8000-000000000001', 'application', 'Bicicletas eléctricas', 9),
  ('a11c1e00-6001-4000-8000-00000000000a', 'a11c1e00-1000-4000-8000-000000000001', 'application', 'Carritos de Golf', 10),
  ('a11c1e00-6001-4000-8000-00000000000b', 'a11c1e00-1000-4000-8000-000000000001', 'application', 'Sillas de ruedas y scooters', 11),
  ('a11c1e00-6001-4000-8000-00000000000c', 'a11c1e00-1000-4000-8000-000000000001', 'application', 'Autocaravanas', 12),

-- KAISE LITIO Characteristics (10)
  ('a11c1e00-6001-4000-8000-00000000000d', 'a11c1e00-1000-4000-8000-000000000001', 'characteristic', 'Alta densidad de energía, peso ligero y reducción de espacio', 1),
  ('a11c1e00-6001-4000-8000-00000000000e', 'a11c1e00-1000-4000-8000-000000000001', 'characteristic', 'Capacidad de carga rápida (1C) y descarga (1C)', 2),
  ('a11c1e00-6001-4000-8000-00000000000f', 'a11c1e00-1000-4000-8000-000000000001', 'characteristic', 'Larga vida útil en ciclos profundos (5.000 ciclos con DOD de 75%)', 3),
  ('a11c1e00-6001-4000-8000-000000000010', 'a11c1e00-1000-4000-8000-000000000001', 'characteristic', 'Admite conexiones paralelas para aumentar la capacidad', 4),
  ('a11c1e00-6001-4000-8000-000000000011', 'a11c1e00-1000-4000-8000-000000000001', 'characteristic', 'Sistema integrado de gestión de batería (BMS) para garantizar seguridad', 5),
  ('a11c1e00-6001-4000-8000-000000000012', 'a11c1e00-1000-4000-8000-000000000001', 'characteristic', 'Baja tasa de autodescarga', 6),
  ('a11c1e00-6001-4000-8000-000000000013', 'a11c1e00-1000-4000-8000-000000000001', 'characteristic', 'Sin efecto memoria', 7),
  ('a11c1e00-6001-4000-8000-000000000014', 'a11c1e00-1000-4000-8000-000000000001', 'characteristic', 'Sin liberación de gas', 8),
  ('a11c1e00-6001-4000-8000-000000000015', 'a11c1e00-1000-4000-8000-000000000001', 'characteristic', 'Sin mantenimiento', 9),
  ('a11c1e00-6001-4000-8000-000000000016', 'a11c1e00-1000-4000-8000-000000000001', 'characteristic', 'Comunicación BMS para monitoreo y control en tiempo real', 10),

-- KAISE LONG LIFE Applications (6)
  ('a11c1e00-6002-4000-8000-000000000001', 'a11c1e00-1000-4000-8000-000000000003', 'application', 'SAI', 1),
  ('a11c1e00-6002-4000-8000-000000000002', 'a11c1e00-1000-4000-8000-000000000003', 'application', 'Sistemas de Telecomunicaciones', 2),
  ('a11c1e00-6002-4000-8000-000000000003', 'a11c1e00-1000-4000-8000-000000000003', 'application', 'Televisión por cable', 3),
  ('a11c1e00-6002-4000-8000-000000000004', 'a11c1e00-1000-4000-8000-000000000003', 'application', 'Centrales eléctricas', 4),
  ('a11c1e00-6002-4000-8000-000000000005', 'a11c1e00-1000-4000-8000-000000000003', 'application', 'Equipamientos marítimos y militares', 5),
  ('a11c1e00-6002-4000-8000-000000000006', 'a11c1e00-1000-4000-8000-000000000003', 'application', 'Sistemas de emergencia y ferrocarriles', 6),

-- KAISE LONG LIFE Characteristics (5)
  ('a11c1e00-6002-4000-8000-000000000007', 'a11c1e00-1000-4000-8000-000000000003', 'characteristic', 'Estabilidad y alta fiabilidad', 1),
  ('a11c1e00-6002-4000-8000-000000000008', 'a11c1e00-1000-4000-8000-000000000003', 'characteristic', 'Baja autodescarga', 2),
  ('a11c1e00-6002-4000-8000-000000000009', 'a11c1e00-1000-4000-8000-000000000003', 'characteristic', 'Elevada densidad energética', 3),
  ('a11c1e00-6002-4000-8000-00000000000a', 'a11c1e00-1000-4000-8000-000000000003', 'characteristic', 'Larga vida útil en flotación (10 años)', 4),
  ('a11c1e00-6002-4000-8000-00000000000b', 'a11c1e00-1000-4000-8000-000000000003', 'characteristic', 'Placas Pb-Sn-Ca de alta densidad para larga vida útil', 5),

-- KAISE ULTRA LONG LIFE Applications (9)
  ('a11c1e00-6003-4000-8000-000000000001', 'a11c1e00-1000-4000-8000-000000000004', 'application', 'Equipos de control de telecomunicaciones y comunicación', 1),
  ('a11c1e00-6003-4000-8000-000000000002', 'a11c1e00-1000-4000-8000-000000000004', 'application', 'Sistemas de iluminación de emergencia', 2),
  ('a11c1e00-6003-4000-8000-000000000003', 'a11c1e00-1000-4000-8000-000000000004', 'application', 'Centrales eléctricas y nucleares', 3),
  ('a11c1e00-6003-4000-8000-000000000004', 'a11c1e00-1000-4000-8000-000000000004', 'application', 'Equipamientos marítimos', 4),
  ('a11c1e00-6003-4000-8000-000000000005', 'a11c1e00-1000-4000-8000-000000000004', 'application', 'Generadores eléctricos', 5),
  ('a11c1e00-6003-4000-8000-000000000006', 'a11c1e00-1000-4000-8000-000000000004', 'application', 'Sistemas de alarmas', 6),
  ('a11c1e00-6003-4000-8000-000000000007', 'a11c1e00-1000-4000-8000-000000000004', 'application', 'SAI', 7),
  ('a11c1e00-6003-4000-8000-000000000008', 'a11c1e00-1000-4000-8000-000000000004', 'application', 'Sistemas de seguridad e incendios', 8),
  ('a11c1e00-6003-4000-8000-000000000009', 'a11c1e00-1000-4000-8000-000000000004', 'application', 'Equipos de control', 9),

-- KAISE ULTRA LONG LIFE Characteristics (5)
  ('a11c1e00-6003-4000-8000-00000000000a', 'a11c1e00-1000-4000-8000-000000000004', 'characteristic', 'Libre de mantenimiento convencional', 1),
  ('a11c1e00-6003-4000-8000-00000000000b', 'a11c1e00-1000-4000-8000-000000000004', 'characteristic', 'Gran amplitud térmica (-15°C - +45°C)', 2),
  ('a11c1e00-6003-4000-8000-00000000000c', 'a11c1e00-1000-4000-8000-000000000004', 'characteristic', 'Baja autodescarga', 3),
  ('a11c1e00-6003-4000-8000-00000000000d', 'a11c1e00-1000-4000-8000-000000000004', 'characteristic', 'Regulación mediante válvulas y elevada capacidad para descargas', 4),
  ('a11c1e00-6003-4000-8000-00000000000e', 'a11c1e00-1000-4000-8000-000000000004', 'characteristic', 'Diferentes posibilidades de posicionado en su instalación', 5);

COMMIT;
