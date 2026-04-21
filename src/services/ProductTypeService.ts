import { ProductTypeRepository } from '../repositories/ProductTypeRepository';
import { ProductType } from '../types';
import { IDatabase } from 'pg-promise';

export class ProductTypeService {
  private productTypeRepo: ProductTypeRepository;

  constructor(db: IDatabase<any>) {
    this.productTypeRepo = new ProductTypeRepository(db);
  }

  async createProductType(data: Omit<ProductType, 'id' | 'created_at' | 'updated_at'>): Promise<ProductType> {
    const existing = await this.productTypeRepo.findByName(data.name);
    if (existing) {
      throw new Error(`Product type with name '${data.name}' already exists`);
    }
    return this.productTypeRepo.create(data);
  }

  async getProductType(id: string): Promise<any> {
    const productType = await this.productTypeRepo.getWithAttributes(id);
    if (!productType) {
      throw new Error('Product type not found');
    }
    return productType;
  }

  async listProductTypes(): Promise<ProductType[]> {
    return this.productTypeRepo.findAll();
  }

  async deleteProductType(id: string): Promise<boolean> {
    return this.productTypeRepo.delete(id);
  }

  async assignAttribute(productTypeId: string, attributeId: string, isRequired: boolean, order: number): Promise<any> {
    return this.productTypeRepo.assignAttribute(productTypeId, attributeId, isRequired, order);
  }

  async removeAttribute(productTypeId: string, attributeId: string): Promise<boolean> {
    return this.productTypeRepo.removeAttribute(productTypeId, attributeId);
  }
}
