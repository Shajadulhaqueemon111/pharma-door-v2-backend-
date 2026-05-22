import express from 'express';
import { blogController } from './blog.controller';

import { USER_ROLE } from '../user/user.constant';
import authValidateRequest from '../../middlewares/auth.validationRequest';

const router = express.Router();

router.post(
  '/create-blog',
  authValidateRequest(USER_ROLE.pharmacist),
  blogController.createBlogs,
);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getSingleBlog);
router.patch(
  '/:id',
  authValidateRequest(USER_ROLE.pharmacist),
  blogController.updateBlog,
);
router.delete(
  '/:id',
  authValidateRequest(USER_ROLE.pharmacist),
  blogController.deleteBlog,
);

export const BlogRoute = router;
