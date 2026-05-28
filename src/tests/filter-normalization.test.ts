import { ProductRepository } from '../repositories/ProductRepository';

// ── normalizeTechnology ───────────────────────────────────────────────────────

describe('normalizeTechnology', () => {
  const norm = ProductRepository.normalizeTechnology.bind(ProductRepository);

  test('exact canonical values pass through unchanged', () => {
    expect(norm('VRLA-AGM')).toBe('VRLA-AGM');
    expect(norm('VRLA-GEL')).toBe('VRLA-GEL');
    expect(norm('LiFePO4')).toBe('LiFePO4');
    expect(norm('Lead Carbon')).toBe('Lead Carbon');
  });

  test('VRLA-AGM variants all resolve to VRLA-AGM', () => {
    expect(norm('vrla-agm')).toBe('VRLA-AGM');
    expect(norm('VRLA AGM')).toBe('VRLA-AGM');
    expect(norm('vrla agm')).toBe('VRLA-AGM');
    expect(norm('AGM')).toBe('VRLA-AGM');
    expect(norm('agm')).toBe('VRLA-AGM');
  });

  test('VRLA-GEL variants all resolve to VRLA-GEL', () => {
    expect(norm('vrla-gel')).toBe('VRLA-GEL');
    expect(norm('VRLA GEL')).toBe('VRLA-GEL');
    expect(norm('gel')).toBe('VRLA-GEL');
    expect(norm('GEL')).toBe('VRLA-GEL');
  });

  test('LiFePO4 variants all resolve to LiFePO4', () => {
    expect(norm('lifepo4')).toBe('LiFePO4');
    expect(norm('LFP')).toBe('LiFePO4');
    expect(norm('lfp')).toBe('LiFePO4');
    expect(norm('litio')).toBe('LiFePO4');
    expect(norm('Litio')).toBe('LiFePO4');
  });

  test('Lead Carbon variants all resolve to Lead Carbon', () => {
    expect(norm('lead carbon')).toBe('Lead Carbon');
    expect(norm('Lead Carbon')).toBe('Lead Carbon');
    expect(norm('lead-carbon')).toBe('Lead Carbon');
    expect(norm('Lead-Carbon')).toBe('Lead Carbon');
    expect(norm('plomo carbono')).toBe('Lead Carbon');
    expect(norm('plomo-carbono')).toBe('Lead Carbon');
  });

  test('unknown value passes through as-is', () => {
    expect(norm('NiMH')).toBe('NiMH');
    expect(norm('SomeOtherTech')).toBe('SomeOtherTech');
  });

  test('trims whitespace before normalizing', () => {
    expect(norm('  agm  ')).toBe('VRLA-AGM');
    expect(norm('\tVRLA-AGM\n')).toBe('VRLA-AGM');
  });
});

// ── normalizePlateType ────────────────────────────────────────────────────────

describe('normalizePlateType', () => {
  const norm = ProductRepository.normalizePlateType.bind(ProductRepository);

  test('Plana returns both Plana and Flat (covers pre- and post-migration 021)', () => {
    const result = norm('Plana');
    expect(result).toContain('Plana');
    expect(result).toContain('Flat');
    expect(result.length).toBe(2);
  });

  test('flat (lowercase) returns same variants as Plana', () => {
    const result = norm('flat');
    expect(result).toContain('Plana');
    expect(result).toContain('Flat');
  });

  test('plana (lowercase) returns same variants as Plana', () => {
    const result = norm('plana');
    expect(result).toContain('Plana');
    expect(result).toContain('Flat');
  });

  test('Flat (capital) returns same variants as Plana', () => {
    const result = norm('Flat');
    expect(result).toContain('Plana');
    expect(result).toContain('Flat');
  });

  test('Tubular variants resolve correctly', () => {
    expect(norm('Tubular')).toEqual(['Tubular']);
    expect(norm('tubular')).toEqual(['Tubular']);
  });

  test('Prismatic variants resolve to all Spanish/English forms', () => {
    const expected = ['Prismática', 'Prismatica', 'Prismatic'];
    expect(norm('Prismatic')).toEqual(expected);
    expect(norm('prismatic')).toEqual(expected);
    expect(norm('Prismatica')).toEqual(expected);
    expect(norm('prismatica')).toEqual(expected);
    expect(norm('Prismática')).toEqual(expected);
    expect(norm('prismática')).toEqual(expected);
  });

  test('AGM variant resolves for solar-agm category', () => {
    expect(norm('AGM')).toEqual(['AGM']);
    expect(norm('agm')).toEqual(['AGM']);
  });

  test('unknown value returns single-element array with the raw value', () => {
    expect(norm('FlatPlate')).toEqual(['FlatPlate']);
  });

  test('trims whitespace before normalizing', () => {
    const result = norm('  Plana  ');
    expect(result).toContain('Plana');
    expect(result).toContain('Flat');
  });
});

// ── Combinaciones críticas (documentadas en FILTER_STUDY.md) ─────────────────

describe('critical filter combinations from FILTER_STUDY.md', () => {
  const normTech  = ProductRepository.normalizeTechnology.bind(ProductRepository);
  const normPlate = ProductRepository.normalizePlateType.bind(ProductRepository);

  // B1–B11: technology=VRLA-AGM, plate_type=Plana → should match DB rows
  test('VRLA-AGM + Plana: tech normalizes and plate covers both DB variants', () => {
    expect(normTech('VRLA-AGM')).toBe('VRLA-AGM');
    const plateVariants = normPlate('Plana');
    expect(plateVariants).toContain('Plana');
    expect(plateVariants).toContain('Flat');
  });

  // C1–C5: technology=VRLA-GEL, plate_type=Plana
  test('VRLA-GEL + Plana: tech normalizes correctly', () => {
    expect(normTech('VRLA-GEL')).toBe('VRLA-GEL');
    const plateVariants = normPlate('Plana');
    expect(plateVariants.length).toBeGreaterThan(0);
  });

  // D1–D6: plate_type=Tubular → only one DB variant
  test('Tubular: returns single variant (no legacy migration issue)', () => {
    expect(normPlate('Tubular')).toEqual(['Tubular']);
  });

  // A1–A8: technology=LiFePO4, plate_type=Prismática
  test('LiFePO4 + Prismática: both resolve correctly', () => {
    expect(normTech('LiFePO4')).toBe('LiFePO4');
    const plateVariants = normPlate('Prismática');
    expect(plateVariants).toContain('Prismática');
  });

  // Lead Carbon fix (R6)
  test('Lead Carbon: resolves from various input forms', () => {
    expect(normTech('Lead Carbon')).toBe('Lead Carbon');
    expect(normTech('lead-carbon')).toBe('Lead Carbon');
    expect(normTech('Lead-Carbon')).toBe('Lead Carbon');
  });

  // AGM input (short form) maps to VRLA-AGM
  test('AGM shorthand maps to VRLA-AGM', () => {
    expect(normTech('AGM')).toBe('VRLA-AGM');
  });
});
