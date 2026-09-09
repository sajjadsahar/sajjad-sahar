import { Router } from 'express';
import { 
  getAchievements, 
  createAchievement, 
  updateAchievement, 
  deleteAchievement 
} from '../controllers/achievementController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = Router();

router.get('/', getAchievements);
router.post('/', authenticateAdmin, createAchievement);
router.put('/:id', authenticateAdmin, updateAchievement);
router.delete('/:id', authenticateAdmin, deleteAchievement);

export default router;
