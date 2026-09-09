import { Router } from 'express';
import { 
  getBlogs, 
  getBlogByIdOrSlug, 
  createBlog, 
  updateBlog, 
  deleteBlog 
} from '../controllers/blogController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = Router();

router.get('/', getBlogs);
router.get('/:idOrSlug', getBlogByIdOrSlug);
router.post('/', authenticateAdmin, createBlog);
router.put('/:id', authenticateAdmin, updateBlog);
router.delete('/:id', authenticateAdmin, deleteBlog);

export default router;
