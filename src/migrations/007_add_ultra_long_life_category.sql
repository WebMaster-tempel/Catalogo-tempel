-- Add KAISE ULTRA LONG LIFE category and update descriptions if needed
BEGIN;

-- KAISE ULTRA LONG LIFE category (new)
INSERT INTO categories (id, name, slug, description, parent_id, technology, plate_type, design_life_years, cycles, capacity_range, applications, eurobat, characteristics)
VALUES (
  'a11c1e00-1000-4000-8000-000000000004',
  'KAISE ULTRA LONG LIFE',
  'kaise-ultra-long-life',
  'VRLA AGM Ultra Long Life. Vida útil 10-16 años. Rango 200-3000 Ah. Construcción robusta para aplicaciones críticas.',
  NULL,
  'VRLA-AGM',
  'Flat',
  '10-16 años',
  '~1500',
  '200 – 3000 Ah (10Ah)',
  'Equipos de control de telecomunicaciones y comunicación
Sistemas de iluminación de emergencia
Centrales eléctricas y nucleares
Equipamientos marítimos
Generadores eléctricos
Sistemas de alarmas
SAI
Sistemas de seguridad e incendios
Equipos de control',
  TRUE,
  'Libre de mantenimiento convencional
Gran amplitud térmica (-15°C - +45°C)
Baja autodescarga
Regulación mediante válvulas y elevada capacidad para descargas
Diferentes posibilidades de posicionado en su instalación'
);

COMMIT;
