import { Schema, model } from 'mongoose';
import { IBlog } from './blog.interface';

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    tags: [{ type: String }],
    category: { type: String },
    thumbnail: { type: String },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const BlogModel = model<IBlog>('Blog', BlogSchema);
