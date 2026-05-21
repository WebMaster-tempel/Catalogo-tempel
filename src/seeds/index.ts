import { db } from '../database/connection';
import { v4 as uuid } from 'uuid';

async function seed() {
  try {
    console.log('Seeding database...');

    const batteryTypeId  = uuid();
    const powerBankTypeId = uuid();

    await db.execute(
      `INSERT INTO product_types (id, name, description) VALUES
       (?, ?, ?), (?, ?, ?)`,
      [batteryTypeId, 'Battery', 'Industrial and consumer batteries',
       powerBankTypeId, 'Power Bank', 'Portable power banks for devices']
    );
    console.log('✓ Created product types');

    const voltageAttrId   = uuid();
    const capacityAttrId  = uuid();
    const weightAttrId    = uuid();
    const chemistryAttrId = uuid();
    const cycleLifeAttrId = uuid();

    await db.execute(
      `INSERT INTO attributes (id, name, label, data_type, unit, is_filterable) VALUES
       (?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?)`,
      [
        voltageAttrId,   'voltage',    'Voltage',       'number', 'V',      1,
        capacityAttrId,  'capacity',   'Capacity',      'number', 'mAh',   1,
        weightAttrId,    'weight',     'Weight',        'number', 'g',      0,
        chemistryAttrId, 'chemistry',  'Chemistry Type','string', null,     1,
        cycleLifeAttrId, 'cycle_life', 'Cycle Life',    'number', 'cycles', 1,
      ]
    );
    console.log('✓ Created attributes');

    await db.execute(
      `INSERT INTO product_type_attributes (id, product_type_id, attribute_id, is_required, \`order\`) VALUES
       (?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?)`,
      [
        uuid(), batteryTypeId, voltageAttrId,   1, 0,
        uuid(), batteryTypeId, capacityAttrId,  1, 1,
        uuid(), batteryTypeId, chemistryAttrId, 1, 2,
        uuid(), batteryTypeId, weightAttrId,    0, 3,
        uuid(), batteryTypeId, cycleLifeAttrId, 0, 4,
      ]
    );
    console.log('✓ Assigned attributes');

    const lithiumCatId    = uuid();
    const leadAcidCatId   = uuid();
    const nimhCatId       = uuid();
    const industrialCatId = uuid();
    const consumerCatId   = uuid();

    await db.execute(
      `INSERT INTO categories (id, name, slug, parent_id, description) VALUES
       (?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?)`,
      [
        industrialCatId, 'Industrial',  'industrial',  null,          'Industrial batteries',
        consumerCatId,   'Consumer',    'consumer',    null,          'Consumer batteries',
        lithiumCatId,    'Lithium Ion', 'lithium-ion', consumerCatId, 'Lithium Ion batteries',
        leadAcidCatId,   'Lead Acid',   'lead-acid',   industrialCatId,'Lead acid batteries',
        nimhCatId,       'NiMH',        'nimh',        consumerCatId, 'Nickel Metal Hydride batteries',
      ]
    );
    console.log('✓ Created categories');

    const product1Id = uuid();
    const product2Id = uuid();
    const product3Id = uuid();

    await db.execute(
      `INSERT INTO products (id, name, slug, description, product_type_id, status) VALUES
       (?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?)`,
      [
        product1Id, 'Premium Lithium Battery 12V 100Ah', 'premium-li-12v-100ah',
          'High-performance lithium battery for renewable energy storage', batteryTypeId, 'published',
        product2Id, 'Industrial Lead Acid 24V', 'industrial-lead-24v',
          'Durable lead acid battery for industrial applications', batteryTypeId, 'published',
        product3Id, 'Consumer Power Bank 20000mAh', 'consumer-powerbank-20k',
          'Portable power bank for mobile devices', powerBankTypeId, 'published',
      ]
    );
    console.log('✓ Created products');

    await db.execute(
      `INSERT INTO product_attribute_values (id, product_id, attributes_json) VALUES (?,?,?),(?,?,?),(?,?,?)`,
      [
        uuid(), product1Id, JSON.stringify({ voltage:12, capacity:100000, chemistry:'Lithium Ion', weight:15.5, cycle_life:3000 }),
        uuid(), product2Id, JSON.stringify({ voltage:24, capacity:200000, chemistry:'Lead Acid',   weight:25.0, cycle_life:500  }),
        uuid(), product3Id, JSON.stringify({ voltage: 5, capacity: 20000, chemistry:'Lithium Polymer', weight:0.4, cycle_life:1000 }),
      ]
    );
    console.log('✓ Added product attributes');

    await db.execute(
      `INSERT INTO product_categories (product_id, category_id) VALUES (?,?),(?,?),(?,?)`,
      [product1Id, lithiumCatId, product2Id, leadAcidCatId, product3Id, consumerCatId]
    );
    console.log('✓ Assigned products to categories');

    await db.execute(
      `INSERT INTO media (id, product_id, type, url, title, \`order\`) VALUES (?,?,?,?,?,?),(?,?,?,?,?,?)`,
      [
        uuid(), product1Id, 'image', 'https://storage.example.com/li-battery-1.jpg', 'Product image', 0,
        uuid(), product1Id, 'pdf',   'https://storage.example.com/li-battery-specs.pdf', 'Specs PDF', 1,
      ]
    );
    console.log('✓ Added media\n✓ Seed completed');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
