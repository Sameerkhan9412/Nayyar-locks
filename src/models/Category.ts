import mongoose, { Schema, model, models } from 'mongoose';

export interface ICategory {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parent?: mongoose.Types.ObjectId | string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null, index: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category = models.Category || model('Category', CategorySchema);

