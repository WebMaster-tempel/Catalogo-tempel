import Joi from 'joi';

export const createProductTypeSchema = Joi.object({
  name: Joi.string().required().max(255),
  description: Joi.string().optional().allow(''),
});

export const createAttributeSchema = Joi.object({
  name: Joi.string().required().max(255).pattern(/^[a-z_]+$/),
  label: Joi.string().required().max(255),
  data_type: Joi.string().required().valid('string', 'number', 'boolean', 'date'),
  unit: Joi.string().optional().max(50),
  is_filterable: Joi.boolean().default(false),
});

export const createCategorySchema = Joi.object({
  name: Joi.string().required().max(255),
  slug: Joi.string().required().max(255).pattern(/^[a-z0-9-]+$/),
  parent_id: Joi.string().uuid().optional(),
  description: Joi.string().optional().allow(''),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().optional().max(255),
  slug: Joi.string().optional().max(255).pattern(/^[a-z0-9-]+$/),
  parent_id: Joi.string().uuid().optional(),
  description: Joi.string().optional().allow(''),
}).min(1);

export const createProductSchema = Joi.object({
  name: Joi.string().required().max(255),
  slug: Joi.string().required().max(255).pattern(/^[a-z0-9-]+$/),
  description: Joi.string().optional().allow(''),
  product_type_id: Joi.string().uuid().required(),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
  main_image_id: Joi.string().uuid().optional(),
  attributes: Joi.object().unknown(true).required(),
  category_ids: Joi.array().items(Joi.string().uuid()).optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().optional().max(255),
  slug: Joi.string().optional().max(255).pattern(/^[a-z0-9-]+$/),
  description: Joi.string().optional().allow(''),
  status: Joi.string().valid('draft', 'published', 'archived').optional(),
  main_image_id: Joi.string().uuid().optional(),
  attributes: Joi.object().unknown(true).optional(),
  category_ids: Joi.array().items(Joi.string().uuid()).optional(),
}).min(1);

export const addMediaSchema = Joi.object({
  type: Joi.string().required().valid('image', 'pdf'),
  url: Joi.string().uri().required(),
  title: Joi.string().optional().max(255),
  order: Joi.number().optional().default(0),
});

export const listProductsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  per_page: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().optional(),
  category_id: Joi.string().uuid().optional(),
  product_type_id: Joi.string().uuid().optional(),
  status: Joi.string().valid('draft', 'published', 'archived').optional(),
  filters: Joi.object().unknown(true).optional(),
  // Advanced category-based filters
  application: Joi.string().optional(),
  technology: Joi.string().optional(),
  plate_type: Joi.string().optional(),
  eurobat: Joi.boolean().optional(),
  capacity_range: Joi.string().optional(),
  characteristics: Joi.string().optional(),
  // Numeric product attribute filters
  capacity_min: Joi.number().optional(),
  capacity_max: Joi.number().optional(),
  voltage: Joi.number().optional(),
});

export const assignProductTypeAttributeSchema = Joi.object({
  attribute_id: Joi.string().uuid().required(),
  is_required: Joi.boolean().default(false),
  order: Joi.number().integer().default(0),
});
