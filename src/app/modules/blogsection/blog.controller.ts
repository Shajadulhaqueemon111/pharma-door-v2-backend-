import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import * as BlogService from './blog.service';
import httpStatus from 'http-status';

const createBlogs = catchAsync(async (req, res) => {
  const result = await BlogService.createBlog(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blog created successfully',
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req, res) => {
  const result = await BlogService.getAllBlogs();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blogs fetched successfully',
    data: result,
  });
});

const getSingleBlog = catchAsync(async (req, res) => {
  const result = await BlogService.getBlogById(req.params.id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Blog retrive successfully ',
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const result = await BlogService.updateBlogById(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog updated successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const result = await BlogService.deleteBlogById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog deleted successfully',
    data: result,
  });
});

export const blogController = {
  createBlogs,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
