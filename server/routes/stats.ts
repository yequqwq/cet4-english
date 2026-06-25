import { Router } from 'express';
import { db } from '../db/connection';
import { studyRecords, writingSubmissions, translationSubmissions } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { AuthRequest, authenticate } from '../middleware/auth';

const router = Router();

// GET: Overall learning stats
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

    const writingCount = await db
      .select()
      .from(writingSubmissions)
      .where(eq(writingSubmissions.userId, userId));
    const translationCount = await db
      .select()
      .from(translationSubmissions)
      .where(eq(translationSubmissions.userId, userId));

    res.json({
      totalMinutes,
      totalWords,
      writingSubmissions: writingCount.length,
      translationSubmissions: translationCount.length,
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

export { router as statsRouter };
