import { Router } from 'express';
import { 
  getExperience, 
  createExperience, 
  updateExperience, 
  deleteExperience 
} from '../controllers/experienceController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = Router();

router.get('/', getExperience);
router.post('/', authenticateAdmin, createExperience);
router.put('/:id', authenticateAdmin, updateExperience);
router.patch('/:id', authenticateAdmin, updateExperience);
router.delete('/:id', authenticateAdmin, deleteExperience);

export default router;
