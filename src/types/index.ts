export type DataType = 'string' | 'number' | 'boolean' | 'date';
export type ProductStatus = 'draft' | 'published' | 'archived';
export type MediaType = 'image' | 'pdf';

export interface ProductType {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Attribute {
  id: string;
  name: string;
  label: string;
  data_type: DataType;
  unit?: string;
  is_filterable: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProductTypeAttribute {
  id: string;
  product_type_id: string;
  attribute_id: string;
  is_required: boolean;
  order: number;
  created_at: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  product_type_id: string;
  status: ProductStatus;
  main_image_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProductAttributeValues {
  id: string;
  product_id: string;
  attributes_json: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface ProductCategory {
  product_id: string;
  category_id: string;
}

export interface Media {
  id: string;
  product_id: string;
  type: MediaType;
  url: string;
  title?: string;
  order: number;
  created_at: Date;
  updated_at: Date;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: PaginationMeta;
  };
}

export interface FilterOptions {
  [key: string]: string | number | boolean;
}

export interface QueryOptions {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string;
  product_type_id?: string;
  status?: ProductStatus;
  filters?: FilterOptions;
}
