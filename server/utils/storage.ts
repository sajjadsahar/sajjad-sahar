import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

export interface StoredDocument {
  url: string;
  publicId: string;
  fileType: 'image' | 'pdf';
  originalName: string;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

// Lazy configure Cloudinary
let cloudinaryConfigured = false;
function ensureCloudinaryConfig() {
  if (!cloudinaryConfigured && isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
    cloudinaryConfigured = true;
  }
}

/**
 * Upload buffer directly to Cloudinary
 */
function uploadBufferToCloudinary(
  buffer: Buffer, 
  originalname: string, 
  fileType: 'image' | 'pdf'
): Promise<{ url: string; publicId: string }> {
  ensureCloudinaryConfig();
  return new Promise((resolve, reject) => {
    const resourceType = fileType === 'pdf' ? 'auto' : 'image';
    const cleanName = path.parse(originalname).name.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50) || 'cert';
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'portfolio/certificates',
        resource_type: resourceType,
        public_id: `${cleanName}_${Date.now()}`
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Cloudinary upload returned empty response'));
        }
        resolve({
          url: result.secure_url || result.url,
          publicId: result.public_id
        });
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Save buffer to server/uploads local disk directory
 */
async function saveBufferToLocalStorage(
  buffer: Buffer, 
  originalname: string, 
  fileType: 'image' | 'pdf'
): Promise<{ url: string; publicId: string }> {
  const uploadsDir = path.join(process.cwd(), 'server', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const rawExt = path.extname(originalname).toLowerCase();
  const validExt = rawExt && (rawExt === '.pdf' || rawExt === '.jpg' || rawExt === '.jpeg' || rawExt === '.png' || rawExt === '.webp')
    ? rawExt
    : (fileType === 'pdf' ? '.pdf' : '.jpg');

  const baseName = path.parse(originalname).name.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40) || 'cert';
  const filename = `${baseName}_${Date.now()}${validExt}`;
  const filepath = path.join(uploadsDir, filename);

  await fs.promises.writeFile(filepath, buffer);

  return {
    url: `/uploads/${filename}`,
    publicId: filename
  };
}

/**
 * Core storage function for certificate documents (images and PDFs)
 */
export async function storeCertificateDocument(
  buffer: Buffer,
  originalname: string,
  mimetype: string
): Promise<StoredDocument> {
  const ext = path.extname(originalname).toLowerCase();
  const isPdf = mimetype.includes('pdf') || ext === '.pdf';
  const fileType: 'image' | 'pdf' = isPdf ? 'pdf' : 'image';

  // 1. If Cloudinary credentials exist, attempt Cloudinary upload
  if (isCloudinaryConfigured()) {
    try {
      const { url, publicId } = await uploadBufferToCloudinary(buffer, originalname, fileType);
      return { url, publicId, fileType, originalName: originalname };
    } catch (cloudErr: any) {
      console.warn('Cloudinary upload unsuccessful, falling back to persistent local storage:', cloudErr?.message || cloudErr);
    }
  }

  // 2. Fallback to high-reliability local disk storage
  const { url, publicId } = await saveBufferToLocalStorage(buffer, originalname, fileType);
  return { url, publicId, fileType, originalName: originalname };
}

/**
 * Store base64 data string (e.g. from JSON payload or legacy upload)
 */
export async function storeBase64Document(
  base64Data: string,
  filename = 'certificate_document',
  fileType?: 'image' | 'pdf'
): Promise<StoredDocument> {
  let cleanBase64 = base64Data;
  let detectedType: 'image' | 'pdf' = fileType || 'image';
  let mime = 'image/jpeg';

  if (base64Data.startsWith('data:')) {
    const match = base64Data.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      mime = match[1];
      if (mime.includes('pdf')) detectedType = 'pdf';
      cleanBase64 = match[2];
    }
  } else if (filename.toLowerCase().endsWith('.pdf')) {
    detectedType = 'pdf';
    mime = 'application/pdf';
  }

  const buffer = Buffer.from(cleanBase64, 'base64');
  return storeCertificateDocument(buffer, filename, mime);
}

/**
 * Delete a stored document (from Cloudinary or local disk)
 */
export async function deleteCertificateDocument(publicId?: string): Promise<void> {
  if (!publicId) return;

  if (isCloudinaryConfigured() && !publicId.includes('.')) {
    try {
      ensureCloudinaryConfig();
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.warn('Could not remove file from Cloudinary:', err);
    }
  }

  try {
    const localPath = path.join(process.cwd(), 'server', 'uploads', publicId);
    if (fs.existsSync(localPath)) {
      await fs.promises.unlink(localPath);
    }
  } catch (err) {
    // Ignore local unlink errors
  }
}
