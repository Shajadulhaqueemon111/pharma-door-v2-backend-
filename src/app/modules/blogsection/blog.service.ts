import { IBlog } from './blog.interface';
import { BlogModel } from './blog.modle';

export const createBlog = async (payload: IBlog): Promise<IBlog> => {
  const blog = await BlogModel.create(payload);
  return blog;
};

export const getAllBlogs = async (): Promise<IBlog[]> => {
  return BlogModel.find();
};

export const getBlogById = async (id: string): Promise<IBlog | null> => {
  return BlogModel.findById(id);
};

export const updateBlogById = async (
  id: string,
  payload: Partial<IBlog>,
): Promise<IBlog | null> => {
  return BlogModel.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteBlogById = async (id: string): Promise<IBlog | null> => {
  return BlogModel.findByIdAndDelete(id);
};
