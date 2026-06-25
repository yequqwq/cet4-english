import { Router } from 'express';
import { db } from '../db/connection';
import { translationSubmissions, studyRecords } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { AuthRequest, authenticate } from '../middleware/auth';

const router = Router();

// POST: Score translation and save submission
router.post('/score', authenticate, async (req: AuthRequest, res) => {
  try {
    const { originalText, userTranslation, userId: clientUserId } = req.body;
    const userId = (req as AuthRequest).userId || clientUserId || 'demo-user';

    const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 3001}`;
    const aiResponse = await fetch(`${serverUrl}/api/ai/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'translation', originalText, userTranslation }),
    });

    if (!aiResponse.ok) throw new Error('AI scoring failed');
    const aiResult = await aiResponse.json();

    const submissionId = `ts-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    await db.insert(translationSubmissions).values({
      id: submissionId,
      userId,
      originalText,
      userTranslation,
      score: aiResult.total,
      accuracyScore: aiResult.accuracy,
      fluencyScore: aiResult.fluency,
      vocabularyScore: aiResult.vocabulary,
      suggestionsJson: JSON.stringify(aiResult.suggestions || []),
    } as any);

    res.json({ ...aiResult, id: submissionId });
  } catch (error) {
    console.error('Translation score error:', error);
    res.status(500).json({ error: 'Translation scoring failed' });
  }
});

// GET: Get translation history
router.get('/history', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = (req as AuthRequest).userId || 'demo-user';
    const history = await db
      .select()
      .from(translationSubmissions)
      .where(eq(translationSubmissions.userId, userId))
      .orderBy(desc(translationSubmissions.createdAt))
      .limit(50);

    res.json(
      history.map((h) => ({
        id: h.id,
        originalText: h.originalText,
        userTranslation: h.userTranslation,
        score: h.score,
        accuracy: h.accuracyScore,
        fluency: h.fluencyScore,
        vocabulary: h.vocabularyScore,
        suggestions: JSON.parse(h.suggestionsJson || '[]'),
        timestamp: h.createdAt,
      })),
    );
  } catch (error) {
    console.error('Translation history error:', error);
    res.status(500).json({ error: 'Failed to get translation history' });
  }
});

// POST: Record study activity
router.post('/record', authenticate, async (req: AuthRequest, res) => {
  try {
    const { action, wordsCount, minutes, score } = req.body;
    const userId = (req as AuthRequest).userId || 'demo-user';

    const recordId = `sr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    await db.insert(studyRecords).values({
      id: recordId,
      userId,
      action,
      wordsCount: wordsCount || 0,
      minutes: minutes || 0,
      score: score || null,
    } as any);

    res.json({ id: recordId });
  } catch (error) {
    console.error('Study record error:', error);
    res.status(500).json({ error: 'Failed to record study' });
  }
});

// GET: Get study stats
router.get('/overview', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = (req as AuthRequest).userId || 'demo-user';
    const records = await db
      .select()
      .from(studyRecords)
      .where(eq(studyRecords.userId, userId))
      .orderBy(desc(studyRecords.createdAt));

    const totalMinutes = records.reduce((sum, r) => sum + (r.minutes || 0), 0);
    const totalWords = records.reduce((sum, r) => sum + (r.wordsCount || 0), 0);

    // Group by date for 7-day trend
    const byDate: Record<string, { minutes: number; words: number }> = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      byDate[key] = { minutes: 0, words: 0 };
    }
    records.forEach((r) => {
      if (r.createdAt) {
        const date = r.createdAt.split(' ')[0];
        if (byDate[date]) {
          byDate[date].minutes += r.minutes || 0;
          byDate[date].words += r.wordsCount || 0;
        }
      }
    });

    res.json({
      totalMinutes,
      totalWords,
      records: Object.entries(byDate).map(([date, data]) => ({
        date,
        minutes: data.minutes,
        wordsLearned: data.words,
        wordsReviewed: 0,
      })),
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export { router as translationRouter };
