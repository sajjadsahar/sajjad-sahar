import { Router } from 'express';
import { 
  sendMessage, 
  getMessages, 
  markMessageRead, 
  deleteMessage 
} from '../controllers/messageController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = Router();

router.post('/', sendMessage);
router.get('/', authenticateAdmin, getMessages);
router.put('/:id/read', authenticateAdmin, markMessageRead);
router.patch('/:id/read', authenticateAdmin, markMessageRead);
router.put('/:id', authenticateAdmin, markMessageRead);
router.patch('/:id', authenticateAdmin, markMessageRead);
router.delete('/:id', authenticateAdmin, deleteMessage);

export default router;
