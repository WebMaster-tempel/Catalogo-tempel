import { db } from '../database/connection';
import { v4 as uuid } from 'uuid';

async function seed() {
  try {
    console.log('Seeding database...');

    // Create product types
    const batteryTypeId = uuid();
    const powerBankTypeId = uuid();

    await db.none(
      `INSERT INTO product_types (id, name, description) VALUES
       ($1, $2, $3),
       ($4, $5, $6)`,
      [
        batteryTypeId,
        'Battery',
        'Industrial and consumer batteries',
        powerBankTypeId,
        'Power Bank',
        'Portable power banks for devices',
      ]
    );

    console.log('✓ Created product types');

    // Create attributes
    const voltageAttrId = uuid();
    const capacityAttrId = uuid();
    const weightAttrId = uuid();
    const chemistryAttrId = uuid();
    const cycleLifeAttrId = uuid();

    await db.none(
      `INSERT INTO attributes (id, name, label, data_type, unit, is_filterable) VALUES
       ($1, $2, $3, $4, $5, $6),
       ($7, $8, $9, $10, $11, $12),
       ($13, $14, $15, $16, $17, $18),
       ($19, $20, $21, $22, $23, $24),
       ($25, $26, $27, $28, $29, $30)`,
      [
        voltageAttrId, 'voltage', 'Voltage', 'number', 'V', true,
        capacityAttrId, 'capacity', 'Capacity', 'number', 'mAh', true,
        weightAttrId, 'weight', 'Weight', 'number', 'g', false,
        chemistryAttrId, 'chemistry', 'Chemistry Type', 'string', null, true,
        cycleLifeAttrId, 'cycle_life', 'Cycle Life', 'number', 'cycles', true,
      ]
    );

    console.log('✓ Created attributes');

    // Assign attributes to product types
    await db.none(
      `INSERT INTO product_type_attributes (product_type_id, attribute_id, is_required, "order") VALUES
       ($1, $2, $3, $4),
       ($5, $6, $7, $8),
       ($9, $10, $11, $12),
       ($13, $14, $15, $16),
       ($17, $18, $19, $20)`,
      [
        batteryTypeId, voltageAttrId, true, 0,
        batteryTypeId, capacityAttrId, true, 1,
        batteryTypeId, chemistryAttrId, true, 2,
        batteryTypeId, weightAttrId, false, 3,
        batteryTypeId, cycleLifeAttrId, false, 4,
      ]
    );

    console.log('✓ Assigned attributes to product types');

    // Create categories
    const lithiumCatId = uuid();
    const leadAcidCatId = uuid();
    const nimhCatId = uuid();
    const industrialCatId = uuid();
    const consumerCatId = uuid();

    await db.none(
      `INSERT INTO categories (id, name, slug, parent_id, description) VALUES
       ($1, $2, $3, $4, $5),
       ($6, $7, $8, $9, $10),
       ($11, $12, $13, $14, $15),
       ($16, $17, $18, $19, $20),
       ($21, $22, $23, $24, $25)`,
      [
        industrialCatId, 'Industrial', 'industrial', null, 'Industrial batteries',
        consumerCatId, 'Consumer', 'consumer', null, 'Consumer batteries',
        lithiumCatId, 'Lithium Ion', 'lithium-ion', consumerCatId, 'Lithium Ion batteries',
        leadAcidCatId, 'Lead Acid', 'lead-acid', industrialCatId, 'Lead acid batteries',
        nimhCatId, 'NiMH', 'nimh', consumerCatId, 'Nickel Metal Hydride batteries',
      ]
    );

    console.log('✓ Created categories');

    // Create sample products
    const product1Id = uuid();
    const product2Id = uuid();
    const product3Id = uuid();

    await db.none(
      `INSERT INTO products (id, name, slug, description, product_type_id, status) VALUES
       ($1, $2, $3, $4, $5, $6),
       ($7, $8, $9, $10, $11, $12),
       ($13, $14, $15, $16, $17, $18)`,
      [
        product1Id, 'Premium Lithium Battery 12V 100Ah', 'premium-li-12v-100ah',
        'High-performance lithium battery suitable for renewable energy storage',
        batteryTypeId, 'published',

        product2Id, 'Industrial Lead Acid 24V', 'industrial-lead-24v',
        'Durable lead acid battery for industrial applications',
        batteryTypeId, 'published',

        product3Id, 'Consumer Power Bank 20000mAh', 'consumer-powerbank-20k',
        'Portable power bank for mobile devices',
        powerBankTypeId, 'published',
      ]
    );

    console.log('✓ Created products');

    // Add product attributes
    await db.none(
      `INSERT INTO product_attribute_values (product_id, attributes_json) VALUES
       ($1, $2),
       ($3, $4),
       ($5, $6)`,
      [
        product1Id, JSON.stringify({
          voltage: 12,
          capacity: 100000,
          chemistry: 'Lithium Ion',
          weight: 15.5,
          cycle_life: 3000,
        }),

        product2Id, JSON.stringify({
          voltage: 24,
          capacity: 200000,
          chemistry: 'Lead Acid',
          weight: 25.0,
          cycle_life: 500,
        }),

        product3Id, JSON.stringify({
          voltage: 5,
          capacity: 20000,
          chemistry: 'Lithium Polymer',
          weight: 0.4,
          cycle_life: 1000,
        }),
      ]
    );

    console.log('✓ Added product attributes');

    // Assign products to categories
    await db.none(
      `INSERT INTO product_categories (product_id, category_id) VALUES
       ($1, $2),
       ($3, $4),
       ($5, $6)`,
      [
        product1Id, lithiumCatId,
        product2Id, leadAcidCatId,
        product3Id, consumerCatId,
      ]
    );

    console.log('✓ Assigned products to categories');

    // Add sample media
    const media1Id = uuid();
    const media2Id = uuid();

    await db.none(
      `INSERT INTO media (id, product_id, type, url, title, "order") VALUES
       ($1, $2, $3, $4, $5, $6),
       ($7, $8, $9, $10, $11, $12)`,
      [
        media1Id, product1Id, 'image', 'https://storage.example.com/products/li-battery-1.jpg',
        'Product image 1', 0,

        media2Id, product1Id, 'pdf', 'https://storage.example.com/products/li-battery-specs.pdf',
        'Technical specifications', 1,
      ]
    );

    console.log('✓ Added media');

    console.log('\n✓ Seed completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
