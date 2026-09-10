import { Response } from 'express';
import { AuthRequest } from '../middleware/authenticateAdmin.js';
import { 
  generateHighQualityImage, 
  createOrEditImage, 
  enhanceTechnicalText 
} from '../gemini.js';
import { storeBase64Document } from '../utils/storage.js';

export async function generateAIImage(req: AuthRequest, res: Response) {
  try {
    const { prompt, imageSize, aspectRatio } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required for image generation' });
    }

    const size = (imageSize === '4K' || imageSize === '2K' || imageSize === '1K') ? imageSize : '1K';
    const ratio = aspectRatio || '16:9';

    const imageUrl = await generateHighQualityImage(prompt, size, ratio);
    return res.json({ success: true, imageUrl, imageSize: size, aspectRatio: ratio });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'AI Image generation failed' });
  }
}

export async function editAIImage(req: AuthRequest, res: Response) {
  try {
    const { prompt, imageSource, mimeType, aspectRatio } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required for image editing' });
    }

    const imageUrl = await createOrEditImage(prompt, imageSource, mimeType || 'image/png', aspectRatio || '16:9');
    return res.json({ success: true, imageUrl });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'AI Image editing failed' });
  }
}

export async function enhanceText(req: AuthRequest, res: Response) {
  try {
    const { prompt, type } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemPrompt = type === 'blog'
      ? 'You are Sajjad Sahar, a high-achieving software engineering student and full-stack developer. Write an insightful, professional technical blog excerpt or article with markdown formatting.'
      : 'You are an experienced software engineer. Write a structured, professional project description with technical challenges, key features, and architecture details.';

    const enhanced = await enhanceTechnicalText(prompt, systemPrompt);
    return res.json({ text: enhanced });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'AI text generation failed' });
  }
}

export async function handleUpload(req: AuthRequest, res: Response) {
  try {
    const { base64Data, filename, fileType } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'base64Data is required' });
    }

    const stored = await storeBase64Document(
      base64Data, 
      filename || 'uploaded-file', 
      fileType
    );

    return res.json({
      success: true,
      url: stored.url,
      publicId: stored.publicId,
      fileType: stored.fileType,
      filename: stored.originalName
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
