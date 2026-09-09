import { Router } from 'express';
import { 
  generateAIImage, 
  editAIImage, 
  enhanceText, 
  handleUpload 
} from '../controllers/aiController.js';
import { resetSeed } from '../controllers/systemController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';
import { validateUploadPayload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/ai/generate-image', authenticateAdmin, generateAIImage);
router.post('/ai/edit-image', authenticateAdmin, editAIImage);
router.post('/ai/enhance-text', authenticateAdmin, enhanceText);
router.post('/upload', authenticateAdmin, validateUploadPayload, handleUpload);
router.post('/system/reset-seed', authenticateAdmin, resetSeed);

export default router;
