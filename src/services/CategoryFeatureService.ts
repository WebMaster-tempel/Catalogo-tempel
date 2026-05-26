import { DbPool } from '../database/connection';

import { CategoryFeatureRepository } from '../repositories/CategoryFeatureRepository';
import { CategoryFeature } from '../types';

export class CategoryFeatureService {
  private repo: CategoryFeatureRepository;

  constructor(db: DbPool) {
    this.repo = new CategoryFeatureRepository(db);
  }

  async getFeatures(categoryId: string): Promise<CategoryFeature[]> {
    return this.repo.findByCategoryId(categoryId);
  }

  async getFeaturesByType(categoryId: string, type: string): Promise<CategoryFeature[]> {
    return this.repo.findByType(categoryId, type);
  }

  async createFeature(categoryId: string, type: 'application' | 'characteristic', label: string, order?: number): Promise<CategoryFeature> {
    const features = await this.repo.findByCategoryId(categoryId);
    const maxOrder = features.filter((f) => f.type === validType).length;

    return this.repo.create({
      category_id: categoryId,
      type: validType,
      label,
      order: order ?? maxOrder + 1,
    });
  }

  async updateFeature(featureId: string, data: Partial<Omit<CategoryFeature, 'id' | 'category_id' | 'created_at' | 'updated_at'>>): Promise<CategoryFeature> {
    return this.repo.update(featureId, data);
  }

  async deleteFeature(featureId: string): Promise<boolean> {
    return this.repo.delete(featureId);
  }

  async reorderFeatures(categoryId: string, featureIds: string[]): Promise<void> {
    return this.repo.reorder(categoryId, featureIds);
  }
}
