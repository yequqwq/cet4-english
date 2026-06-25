import { request } from './client';

export interface WritingScore {
  total: number;
  vocabulary: number;
  grammar: number;
  structure: number;
  coherence: number;
  length: number;
  suggestions: string[];
  feedback?: string;
  ai?: boolean;
  id?: string;
}

export interface WritingHistoryItem {
  id: string;
  topic: string;
  content: string;
  score: number;
  vocabulary: number;
  grammar: number;
  structure: number;
  coherence: number;
  suggestions: string[];
  timestamp: string;
}

export async function scoreWriting(content: string, topic: string): Promise<WritingScore> {
  return request<WritingScore>('/api/writing/score', {
    method: 'POST',
    body: JSON.stringify({ content, topic }),
  });
}

export async function getWritingHistory(): Promise<WritingHistoryItem[]> {
  return request<WritingHistoryItem[]>('/api/writing/history');
}
