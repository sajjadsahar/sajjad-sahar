import { Router } from 'express';
import { getPortfolioData, getProfile, updateProfile } from '../controllers/profileController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = Router();

router.get('/portfolio', getPortfolioData);
router.get('/profile', getProfile);
router.put('/profile', authenticateAdmin, updateProfile);

export default router;
