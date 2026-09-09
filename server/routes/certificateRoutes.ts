import { Router } from 'express';
import { 
  getCertificates, 
  getCertificateById, 
  createCertificate, 
  updateCertificate, 
  deleteCertificate 
} from '../controllers/certificateController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = Router();

router.get('/', getCertificates);
router.get('/:id', getCertificateById);
router.post('/', authenticateAdmin, createCertificate);
router.put('/:id', authenticateAdmin, updateCertificate);
router.delete('/:id', authenticateAdmin, deleteCertificate);

export default router;
