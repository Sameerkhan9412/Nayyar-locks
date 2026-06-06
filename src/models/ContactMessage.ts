import mongoose, { Schema, model, models } from 'mongoose';

export interface IContactMessage {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isReplied: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ContactMessage = models.ContactMessage || model('ContactMessage', ContactMessageSchema);
