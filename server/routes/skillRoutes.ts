import { Router } from 'express';
import { 
  getSkills, 
  createSkill, 
  updateSkill, 
  deleteSkill 
} from '../controllers/skillController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = Router();

router.get('/', getSkills);
router.post('/', authenticateAdmin, createSkill);
router.put('/:id', authenticateAdmin, updateSkill);
router.delete('/:id', authenticateAdmin, deleteSkill);

export default router;
