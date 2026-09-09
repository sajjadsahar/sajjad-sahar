import { Router } from 'express';
import { getAnalytics, recordPageView } from '../controllers/analyticsController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = Router();

router.get('/', authenticateAdmin, getAnalytics);
router.post('/view', recordPageView);

export default router;
