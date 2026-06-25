import { Router } from 'express';
import { db } from '../db/connection';
import { writingSubmissions } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { AuthRequest, authenticate } from '../middleware/auth';

const router = Router();

// POST: Score writing and save submission
router.post('/score', authenticate, async (req: AuthRequest, res) => {
  try {
    const { content, topic, userId: clientUserId } = req.body;
    const userId = (req as AuthRequest).userId || clientUserId || 'demo-user';

    // Call AI scoring endpoint on same server
    const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 3001}`;
    const aiResponse = await fetch(`${serverUrl}/api/ai/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'writing', content, topic }),
    });

    if (!aiResponse.ok) throw new Error('AI scoring failed');
    const aiResult = await aiResponse.json();

    // Save to database
    const submissionId = `ws-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    await db.insert(writingSubmissions).values({
      id: submissionId,
      userId,
      topic: topic || '',
      content,
      score: aiResult.total,
      vocabularyScore: aiResult.vocabulary,
      grammarScore: aiResult.grammar,
      structureScore: aiResult.structure,
      coherenceScore: aiResult.coherence,
      lengthScore: aiResult.length,
      suggestionsJson: JSON.stringify(aiResult.suggestions || []),
    } as any);

    res.json({ ...aiResult, id: submissionId });
  } catch (error) {
    console.error('Writing score error:', error);
    res.status(500).json({ error: 'Writing scoring failed' });
  }
});

// GET: Get writing history
router.get('/history', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = (req as AuthRequest).userId || 'demo-user';
    const history = await db
      .select()
      .from(writingSubmissions)
      .where(eq(writingSubmissions.userId, userId))
      .orderBy(desc(writingSubmissions.createdAt))
      .limit(50);

    res.json(
      history.map((h) => ({
        id: h.id,
        topic: h.topic,
        content: h.content,
        score: h.score,
        vocabulary: h.vocabularyScore,
        grammar: h.grammarScore,
        structure: h.structureScore,
        coherence: h.coherenceScore,
        suggestions: JSON.parse(h.suggestionsJson || '[]'),
        timestamp: h.createdAt,
      })),
    );
  } catch (error) {
    console.error('Writing history error:', error);
    res.status(500).json({ error: 'Failed to get writing history' });
  }
});

export { router as writingRouter };
