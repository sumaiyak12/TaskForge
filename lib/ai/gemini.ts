import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';

export const ai = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateTextWithGemini(prompt: string, fallbackResponse: string): Promise<string> {
  if (!ai || !apiKey || apiKey.includes('sample')) {
    return fallbackResponse;
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || fallbackResponse;
  } catch (error) {
    console.error('Gemini API call failed, using intelligent fallback engine:', error);
    return fallbackResponse;
  }
}
