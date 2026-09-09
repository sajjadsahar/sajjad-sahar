import { Router } from 'express';
import { login, getMe, updateCredentials, downloadResume } from '../controllers/authController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = Router();

router.post('/login', login);
router.get('/me', authenticateAdmin, getMe);
router.post('/update-credentials', authenticateAdmin, updateCredentials);

export { downloadResume };
export default router;
