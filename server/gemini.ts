import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

/**
 * Generate high-quality images with affordance for 1K, 2K, 4K resolution using gemini-3-pro-image-preview
 */
export async function generateHighQualityImage(
  prompt: string,
  imageSize: '1K' | '2K' | '4K' = '1K',
  aspectRatio: '1:1' | '16:9' | '4:3' | '3:4' | '9:16' = '16:9'
): Promise<string> {
  const ai = getGenAI();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please configure it in Settings.');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio,
        imageSize,
      },
    },
  });

  const candidates = response.candidates;
  if (!candidates || candidates.length === 0 || !candidates[0].content?.parts) {
    throw new Error('No image returned from Gemini model.');
  }

  for (const part of candidates[0].content.parts) {
    if (part.inlineData && part.inlineData.data) {
      const mimeType = part.inlineData.mimeType || 'image/png';
      return `data:${mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error('Image data was not present in the model response.');
}

/**
 * Create or edit images using gemini-3.1-flash-image-preview
 */
export async function createOrEditImage(
  prompt: string,
  base64ImageSource?: string,
  mimeType: string = 'image/png',
  aspectRatio: '1:1' | '16:9' | '4:3' | '3:4' = '16:9'
): Promise<string> {
  const ai = getGenAI();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please configure it in Settings.');
  }

  const parts: any[] = [];

  if (base64ImageSource) {
    // Strip data url prefix if present
    const rawBase64 = base64ImageSource.replace(/^data:image\/[a-z]+;base64,/, '');
    parts.push({
      inlineData: {
        data: rawBase64,
        mimeType: mimeType || 'image/png',
      },
    });
  }

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: {
      parts,
    },
    config: {
      imageConfig: {
        aspectRatio,
      },
    },
  });

  const candidates = response.candidates;
  if (!candidates || candidates.length === 0 || !candidates[0].content?.parts) {
    throw new Error('No image returned from Gemini flash image model.');
  }

  for (const part of candidates[0].content.parts) {
    if (part.inlineData && part.inlineData.data) {
      const mime = part.inlineData.mimeType || 'image/png';
      return `data:${mime};base64,${part.inlineData.data}`;
    }
  }

  throw new Error('Image data was not present in the model response.');
}

/**
 * Generate or improve technical project descriptions, features, or blogs using gemini-3.8-flash
 */
export async function enhanceTechnicalText(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  const ai = getGenAI();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction || 'You are an expert full-stack engineer and technical writer. Provide clear, professional, concise text.',
    },
  });

  return response.text || '';
}
