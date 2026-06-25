import { request } from './client';

export interface StudyStats {
  totalMinutes: number;
  totalWords: number;
  writingSubmissions: number;
  translationSubmissions: number;
  records: {
    date: string;
    minutes: number;
    wordsLearned: number;
    wordsReviewed: number;
  }[];
}

export async function getStudyStats(): Promise<StudyStats> {
  return request<StudyStats>('/api/stats/overview');
}

export async function recordStudy(
  action: string,
  wordsCount: number,
  minutes: number,
  score?: number,
): Promise<{ id: string }> {
  return request('/api/stats/record', {
    method: 'POST',
    body: JSON.stringify({ action, wordsCount, minutes, score }),
  });
}
