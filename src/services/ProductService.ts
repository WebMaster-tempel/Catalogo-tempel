import { ProductRepository } from '../repositories/ProductRepository';
import { ProductAttributeValuesRepository } from '../repositories/ProductAttributeValuesRepository';
import { ProductTypeRepository } from '../repositories/ProductTypeRepository';
import { MediaRepository } from '../repositories/MediaRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { DbPool } from '../database/connection';
import { Product, QueryOptions, Attribute } from '../types';

export class ProductService {
  private productRepo: ProductRepository;
  private attributeValuesRepo: ProductAttributeValuesRepository;
  private productTypeRepo: ProductTypeRepository;
  private mediaRepo: MediaRepository;
  private categoryRepo: CategoryRepository;
  private db: DbPool;

  constructor(db: DbPool) {
    this.db = db;
    this.productRepo      = new ProductRepository(db);
    this.attributeValuesRepo = new ProductAttributeValuesRepository(db);
    this.productTypeRepo  = new ProductTypeRepository(db);
    this.mediaRepo        = new MediaRepository(db);
    this.categoryRepo     = new CategoryRepository(db);
  }

  async createProduct(
    data: Omit<Product, 'id' | 'created_at' | 'updated_at'> & {
      attributes: Record<string, any>;
      category_ids?: string[];
    }
  ): Promise<any> {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();
      const { attributes, category_ids, ...productData } = data;
      await this.validateProductAttributes(data.product_type_id, attributes);
      const product = await this.productRepo.create(productData);
      await this.attributeValuesRepo.create(product.id, attributes);
      if (category_ids && category_ids.length > 0) {
        for (const categoryId of category_ids) {
          await this.categoryRepo.assignProduct(product.id, categoryId);
        }
      }
      await conn.commit();
      return this.productRepo.findFullProduct(product.id);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async updateProduct(
    id: string,
    data: Partial<Product> & {
      attributes?: Record<string, any>;
      category_ids?: string[];
    }
  ): Promise<any> {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();
      const { attributes, category_ids, ...productData } = data;

      if (attributes) {
        const product = await this.productRepo.findById(id);
        if (product) {
          await this.validateProductAttributes(product.product_type_id, attributes);
        }
      }

      await this.productRepo.update(id, productData);

      if (attributes) {
        await this.attributeValuesRepo.upsert(id, attributes);
      }

      if (category_ids !== undefined) {
        const existingCategories = await this.categoryRepo.getProductCategories(id);
        for (const category of existingCategories) {
          await this.categoryRepo.removeProduct(id, category.id);
        }
        for (const categoryId of category_ids) {
          await this.categoryRepo.assignProduct(id, categoryId);
        }
      }

      await conn.commit();
      return this.productRepo.findFullProduct(id);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async getProduct(id: string): Promise<any> {
    return this.productRepo.findFullProduct(id);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.productRepo.delete(id);
  }

  async listProducts(options: QueryOptions): Promise<any> {
    return this.productRepo.search(options);
  }

  private async validateProductAttributes(
    productTypeId: string,
    attributes: Record<string, any>
  ): Promise<void> {
    const productType = await this.productTypeRepo.getWithAttributes(productTypeId);
    if (!productType || !productType.attributes || productType.attributes.length === 0) return;

    const attributeMap = new Map<string, Attribute & { is_required: boolean }>();
    for (const attr of productType.attributes) {
      attributeMap.set(attr.name, attr);
    }

    for (const [name, attr] of attributeMap.entries()) {
      if (attr.is_required && !(name in attributes)) {
        throw new Error(`Required attribute missing: ${attr.label}`);
      }
    }

    for (const [name, value] of Object.entries(attributes)) {
      const attr = attributeMap.get(name);
      if (attr) this.validateAttributeValue(attr, value);
    }
  }

  private validateAttributeValue(attr: Attribute & { is_required?: boolean }, value: any): void {
    if (value === null || value === undefined) return;
    switch (attr.data_type) {
      case 'number':
        if (typeof value !== 'number') throw new Error(`${attr.label} must be a number`);
        break;
      case 'boolean':
        if (typeof value !== 'boolean') throw new Error(`${attr.label} must be a boolean`);
        break;
      case 'date':
        if (!(value instanceof Date) && typeof value !== 'string')
          throw new Error(`${attr.label} must be a date`);
        break;
      case 'string':
        if (typeof value !== 'string') throw new Error(`${attr.label} must be a string`);
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
