import { ProductRepository } from '../repositories/ProductRepository';
import { ProductAttributeValuesRepository } from '../repositories/ProductAttributeValuesRepository';
import { AttributeRepository } from '../repositories/AttributeRepository';
import { ProductTypeRepository } from '../repositories/ProductTypeRepository';
import { MediaRepository } from '../repositories/MediaRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { Product, QueryOptions, Attribute } from '../types';
import { IDatabase } from 'pg-promise';

export class ProductService {
  private productRepo: ProductRepository;
  private attributeValuesRepo: ProductAttributeValuesRepository;
  private attributeRepo: AttributeRepository;
  private productTypeRepo: ProductTypeRepository;
  private mediaRepo: MediaRepository;
  private categoryRepo: CategoryRepository;
  private db: IDatabase<any>;

  constructor(db: IDatabase<any>) {
    this.db = db;
    this.productRepo = new ProductRepository(db);
    this.attributeValuesRepo = new ProductAttributeValuesRepository(db);
    this.attributeRepo = new AttributeRepository(db);
    this.productTypeRepo = new ProductTypeRepository(db);
    this.mediaRepo = new MediaRepository(db);
    this.categoryRepo = new CategoryRepository(db);
  }

  async createProduct(
    data: Omit<Product, 'id' | 'created_at' | 'updated_at'> & {
      attributes: Record<string, any>;
      category_ids?: string[];
    }
  ): Promise<any> {
    return this.db.tx(async (t) => {
      const { attributes, category_ids, ...productData } = data;

      // Validate attributes match product type
      await this.validateProductAttributes(data.product_type_id, attributes);

      // Create product
      const product = await this.productRepo.create(productData);

      // Create attribute values
      await this.attributeValuesRepo.create(product.id, attributes);

      // Assign categories
      if (category_ids && category_ids.length > 0) {
        for (const categoryId of category_ids) {
          await this.categoryRepo.assignProduct(product.id, categoryId);
        }
      }

      return this.productRepo.findFullProduct(product.id);
    });
  }

  async updateProduct(
    id: string,
    data: Partial<Product> & {
      attributes?: Record<string, any>;
      category_ids?: string[];
    }
  ): Promise<any> {
    return this.db.tx(async (t) => {
      const { attributes, category_ids, ...productData } = data;

      // Validate attributes if provided
      if (attributes) {
        const product = await this.productRepo.findById(id);
        if (product) {
          await this.validateProductAttributes(product.product_type_id, attributes);
        }
      }

      // Update product
      const product = await this.productRepo.update(id, productData);

      // Update attribute values if provided
      if (attributes) {
        await this.attributeValuesRepo.upsert(id, attributes);
      }

      // Update categories if provided
      if (category_ids !== undefined) {
        // Remove all existing categories
        const existingCategories = await this.categoryRepo.getProductCategories(id);
        for (const category of existingCategories) {
          await this.categoryRepo.removeProduct(id, category.id);
        }

        // Add new categories
        for (const categoryId of category_ids) {
          await this.categoryRepo.assignProduct(id, categoryId);
        }
      }

      return this.productRepo.findFullProduct(id);
    });
  }

  async getProduct(id: string): Promise<any> {
    return this.productRepo.findFullProduct(id);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.productRepo.delete(id);
  }

  async listProducts(options: QueryOptions): Promise<any> {
    if (options.filters && Object.keys(options.filters).length > 0) {
      return this.productRepo.listWithDynamicFilters(options);
    }
    return this.productRepo.list(options);
  }

  private async validateProductAttributes(
    productTypeId: string,
    attributes: Record<string, any>
  ): Promise<void> {
    const productType = await this.productTypeRepo.getWithAttributes(productTypeId);

    if (!productType || !productType.attributes || productType.attributes.length === 0) {
      return; // No validation needed
    }

    const attributeMap = new Map<string, Attribute & { is_required: boolean }>();
    for (const attr of productType.attributes) {
      attributeMap.set(attr.name, attr);
    }

    // Check required attributes
    for (const [name, attr] of attributeMap.entries()) {
      if (attr.is_required && !(name in attributes)) {
        throw new Error(`Required attribute missing: ${attr.label}`);
      }
    }

    // Validate data types
    for (const [name, value] of Object.entries(attributes)) {
      const attr = attributeMap.get(name);
      if (attr) {
        this.validateAttributeValue(attr, value);
      }
    }
  }

  private validateAttributeValue(attr: Attribute & { is_required?: boolean }, value: any): void {
    if (value === null || value === undefined) {
      return;
    }

    switch (attr.data_type) {
      case 'number':
        if (typeof value !== 'number') {
          throw new Error(`${attr.label} must be a number`);
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new Error(`${attr.label} must be a boolean`);
        }
        break;
      case 'date':
        if (!(value instanceof Date) && typeof value !== 'string') {
          throw new Error(`${attr.label} must be a date`);
        }
        break;
      case 'string':
        if (typeof value !== 'string') {
          throw new Error(`${attr.label} must be a string`);
        }
        break;
    }
  }

  async addMedia(productId: string, mediaData: any): Promise<any> {
    return this.mediaRepo.create({
      product_id: productId,
      type: mediaData.type,
      url: mediaData.url,
      title: mediaData.title,
      order: mediaData.order || 0,
    });
  }

  async removeMedia(mediaId: string): Promise<boolean> {
    return this.mediaRepo.delete(mediaId);
  }

  async getProductMedia(productId: string): Promise<any[]> {
    return this.mediaRepo.getProductMedia(productId);
  }
}
