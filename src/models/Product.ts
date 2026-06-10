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
    slug: { type: String, unique: true, index: true },
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    images: { type: [String], required: true },
    SKU: { 
      type: String, 
      default: () => 'SKU-' + Date.now() + '-' + Math.floor(Math.random() * 1000), 
      unique: true, 
      index: true 
    },
    brand: { type: String, default: 'Nayyars' },
    price: { type: Number, default: 0 },
    originalPrice: { type: Number, default: 0 },
    material: { type: String, default: '' },
    keyType: { type: String, default: '' },
    securityGrade: { type: String, default: '' },
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

if (mongoose.models && mongoose.models.Product) {
  delete mongoose.models.Product;
}

export const Product = mongoose.model('Product', ProductSchema);
