import mongoose, { Schema, model, models } from 'mongoose';

export interface IProduct {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: mongoose.Types.ObjectId | string;
  images: string[];
  SKU: string;
  brand: string;
  price: number;
  originalPrice: number;
  material: string;
  keyType: string;
  securityGrade: string;
  features: string[];
  specifications: Map<string, string>;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  whatsappOverride?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    images: { type: [String], required: true },
    SKU: { type: String, required: true, unique: true, index: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    material: { type: String, required: true },
    keyType: { type: String, required: true },
    securityGrade: { type: String, required: true },
    features: { type: [String], default: [] },
    specifications: { type: Schema.Types.Map, of: String, default: {} },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    whatsappOverride: { type: String },
  },
  { timestamps: true }
);

export const Product = models.Product || model('Product', ProductSchema);
