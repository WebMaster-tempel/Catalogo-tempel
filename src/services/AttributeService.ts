import { DbPool } from '../database/connection';
import { AttributeRepository } from '../repositories/AttributeRepository';
import { Attribute } from '../types';


export class AttributeService {
  private attributeRepo: AttributeRepository;

  constructor(db: DbPool) {
    this.attributeRepo = new AttributeRepository(db);
  }

  async createAttribute(data: Omit<Attribute, 'id' | 'created_at' | 'updated_at'>): Promise<Attribute> {
    const existing = await this.attributeRepo.findByName(data.name);
    if (existing) {
      throw new Error(`Attribute with name '${data.name}' already exists`);
    }
    return this.attributeRepo.create(data);
  }

  async getAttribute(id: string): Promise<Attribute> {
    const attribute = await this.attributeRepo.findById(id);
    if (!attribute) {
      throw new Error('Attribute not found');
    }
    return attribute;
  }

  async listAttributes(): Promise<Attribute[]> {
    return this.attributeRepo.findAll();
  }

  async getFilterableAttributes(): Promise<Attribute[]> {
    return this.attributeRepo.getFilterableAttributes();
  }

  async getAttributesByProductType(productTypeId: string): Promise<Attribute[]> {
    return this.attributeRepo.getAttributesByProductType(productTypeId);
  }

  async deleteAttribute(id: string): Promise<boolean> {
    return this.attributeRepo.delete(id);
  }
}
