import { Router } from 'express';
import { 
  getProjects, 
  getProjectByIdOrSlug, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = Router();

router.get('/', getProjects);
router.get('/:idOrSlug', getProjectByIdOrSlug);
router.post('/', authenticateAdmin, createProject);
router.put('/:id', authenticateAdmin, updateProject);
router.delete('/:id', authenticateAdmin, deleteProject);

export default router;
