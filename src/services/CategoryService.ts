import { DbPool } from '../database/connection';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { Category } from '../types';


export class CategoryService {
  private categoryRepo: CategoryRepository;

  constructor(db: DbPool) {
    this.categoryRepo = new CategoryRepository(db);
  }

  async createCategory(data: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const existing = await this.categoryRepo.findBySlug(data.slug);
    if (existing) {
      throw new Error(`Category with slug '${data.slug}' already exists`);
    }
    return this.categoryRepo.create(data);
  }

  async getCategory(id: string): Promise<Category> {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    return this.categoryRepo.update(id, data);
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categoryRepo.delete(id);
  }

  async listCategories(): Promise<Category[]> {
    return this.categoryRepo.findAll();
  }

  async getCategoryTree(): Promise<any[]> {
    return this.categoryRepo.getHierarchyTree();
  }

  async getChildCategories(parentId: string): Promise<Category[]> {
    return this.categoryRepo.getChildCategories(parentId);
  }
}
