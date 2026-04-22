export interface ProductType {
  id: string;
  name: string;
  description?: string;
  attributes?: AttributeWithMeta[];
}

export interface Attribute {
  id: string;
  name: string;
  label: string;
  data_type: 'string' | 'number' | 'boolean' | 'date';
  unit?: string;
  is_filterable: boolean;
}

export interface AttributeWithMeta extends Attribute {
  is_required: boolean;
  order: number;
}

export interface CategoryFeature {
  id: string;
  category_id: string;
  type: 'application' | 'characteristic';
  label: string;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  level?: number;
  technology?: string;
  plate_type?: string;
  design_life_years?: string;
  cycles?: string;
  capacity_range?: string;
  applications?: string;
  eurobat?: boolean;
  characteristics?: string;
  features?: CategoryFeature[];
}

export interface Media {
  id: string;
  type: 'image' | 'pdf';
  url: string;
  title?: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  product_type_id: string;
  status: 'draft' | 'published' | 'archived';
  main_image_id?: string;
  attributes_json?: Record<string, unknown>;
  categories?: Category[];
  media?: Media[];
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}
