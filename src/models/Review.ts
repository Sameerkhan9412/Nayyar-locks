import mongoose, { Schema, model, models } from 'mongoose';

export interface IReview {
  _id: mongoose.Types.ObjectId | string;
  customerName: string;
  location: string;
  avatar: string;
  rating: number;
  title: string;
  comment: string;
  linkedProduct?: mongoose.Types.ObjectId | string;
  isFeatured: boolean;
  isPublished: boolean;
  source: string;
  reviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    customerName: { type: String, required: true },
    location: { type: String, required: true },
    avatar: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    linkedProduct: { type: Schema.Types.ObjectId, ref: 'Product', index: true },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    source: { type: String, default: 'Manual' },
    reviewDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Review = models.Review || model('Review', ReviewSchema);
