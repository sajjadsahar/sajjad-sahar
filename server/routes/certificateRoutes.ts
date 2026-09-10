import { Router } from 'express';
import { 
  getCertificates, 
  getCertificateById, 
  createCertificate, 
  updateCertificate, 
  deleteCertificate,
  uploadCertificateDocument
} from '../controllers/certificateController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';
import { handleCertificateUpload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/', getCertificates);
router.get('/:id', getCertificateById);
router.post('/upload', authenticateAdmin, handleCertificateUpload, uploadCertificateDocument);
router.post('/', authenticateAdmin, handleCertificateUpload, createCertificate);
router.put('/:id', authenticateAdmin, handleCertificateUpload, updateCertificate);
router.patch('/:id', authenticateAdmin, handleCertificateUpload, updateCertificate);
router.delete('/:id', authenticateAdmin, deleteCertificate);

export default router;
