import { request } from './client';

export interface TranslationScore {
  total: number;
  accuracy: number;
  fluency: number;
  vocabulary: number;
  suggestions: string[];
  feedback?: string;
  ai?: boolean;
  id?: string;
}

export interface TranslationHistoryItem {
  id: string;
  originalText: string;
  userTranslation: string;
  score: number;
  accuracy: number;
  fluency: number;
  vocabulary: number;
  suggestions: string[];
  timestamp: string;
}

export async function scoreTranslation(
  originalText: string,
  userTranslation: string,
): Promise<TranslationScore> {
  return request<TranslationScore>('/api/translation/score', {
    method: 'POST',
    body: JSON.stringify({ originalText, userTranslation }),
  });
}

export async function getTranslationHistory(): Promise<TranslationHistoryItem[]> {
  return request<TranslationHistoryItem[]>('/api/translation/history');
}
