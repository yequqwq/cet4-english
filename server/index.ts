import express from 'express';
import cors from 'cors';
import { writeFileSync } from 'fs';
import { authRouter } from './routes/auth';
import { writingRouter } from './routes/writing';
import { translationRouter } from './routes/translation';
import { statsRouter } from './routes/stats';
import { authenticate } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Auth middleware (allows demo mode)
app.use('/api', authenticate);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/writing', writingRouter);
app.use('/api/translation', translationRouter);
app.use('/api/stats', statsRouter);

// AI scoring endpoint (combined writing + translation)
app.post('/api/ai/score', async (req, res) => {
  try {
    const { type, content, topic, originalText, userTranslation } = req.body;

    if (type === 'writing') {
      const result = await scoreWriting(content, topic);
      return res.json(result);
    }

    if (type === 'translation') {
      const result = await scoreTranslation(originalText, userTranslation);
      return res.json(result);
    }

    res.status(400).json({ error: 'Invalid type. Use "writing" or "translation"' });
  } catch (error) {
    console.error('AI scoring error:', error);
    res.status(500).json({ error: 'AI scoring failed' });
  }
});

// Local regex-based fallback scoring (when no AI key is configured)
async function scoreWriting(content: string, topic: string) {
  // Check for AI key
  const useAI = process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY;

  if (useAI) {
    return await scoreWritingWithAI(content, topic, useAI);
  }

  // Fallback: enhanced regex-based scoring (matches current frontend logic)
  return localWritingScore(content);
}

async function scoreWritingWithAI(content: string, topic: string, apiKey: string) {
  const prompt = `璇疯瘎浠疯繖绡嘋ET-4鑻辫浣滄枃锛屼粠璇嶆眹涓板瘜搴?0-20)銆佽娉曞噯纭€?0-20)銆佸彞寮忓鏍锋€?0-20)銆佹钀借繛璐€?0-20)銆佸唴瀹归暱搴?0-20)浜斾釜缁村害璇勫垎锛屾€诲垎100銆傚悓鏃剁粰鍑?鏉℃敼杩涘缓璁€傝繑鍥濲SON鏍煎紡锛屼笉瑕佸寘鍚叾浠栨枃瀛椼€?
浣滄枃涓婚锛?{topic}
浣滄枃鍐呭锛?{content}

瑕佹眰杩斿洖鏍煎紡锛?{
  "total": 85,
  "vocabulary": 16,
  "grammar": 17,
  "structure": 15,
  "coherence": 18,
  "length": 19,
  "suggestions": ["寤鸿1", "寤鸿2", "寤鸿3"],
  "feedback": "鎬讳綋璇勪环"
}`;

  try {
    const response = await fetch(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'qwen-max',
          messages: [
            {
              role: 'system',
              content: 'You are a CET-4 English writing evaluator. Always return pure JSON.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Qwen API returned ${response.status}`);
    }

    const data = await response.json();
    let content_text = data.choices[0].message.content;
    // Strip markdown code blocks if present
    content_text = content_text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();
    const result = JSON.parse(content_text);

    // Ensure all fields exist
    return {
      total: result.total || 70,
      vocabulary: result.vocabulary || 14,
      grammar: result.grammar || 14,
      structure: result.structure || 14,
      coherence: result.coherence || 14,
      length: result.length || 14,
      suggestions: result.suggestions || ['Continue practicing regularly'],
      feedback: result.feedback || '',
      ai: true,
    };
  } catch (err) {
    console.error('AI scoring failed, falling back to local:', err);
    return localWritingScore(content);
  }
}

function localWritingScore(content: string) {
  const words = content
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim().length > 0);
  const wordCount = words.length;

  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, '')));
  const richness = wordCount > 0 ? uniqueWords.size / wordCount : 0;
  const vocabularyScore = Math.min(20, Math.round(richness * 30 + Math.min(wordCount / 30, 5)));

  const advancedWords = [
    'however',
    'therefore',
    'nevertheless',
    'moreover',
    'furthermore',
    'consequently',
    'significantly',
    'substantially',
    'predominantly',
    'inevitably',
    'fundamentally',
    'comprehensive',
    'sophisticated',
    'phenomenon',
    'paradigm',
    'hypothesis',
    'implication',
    'methodology',
    'controversy',
    'sustainable',
    'infrastructure',
    'legitimate',
    'alternative',
    'phenomena',
    'demonstrate',
    'illustrate',
  ];
  const transitionWords = [
    'however',
    'therefore',
    'moreover',
    'furthermore',
    'in addition',
    'on the other hand',
    'consequently',
    'nevertheless',
    'meanwhile',
    'ultimately',
  ];
  const lowerText = content.toLowerCase();
  const advancedCount = advancedWords.filter((w) => lowerText.includes(w)).length;
  const transitionCount = transitionWords.filter((w) => lowerText.includes(w)).length;
  const advancedScore = Math.min(20, Math.round(advancedCount * 3 + transitionCount * 2));

  const sentencePatterns = [
    /\b[A-Z][a-z]+\b.+?[.!?]\s+[A-Z]/,
    /\b(which|that|who|whom|whose)\b/,
    /\b(if|when|while|although|because|since|unless)\b/,
  ];
  const patternMatches = sentencePatterns.filter((p) => p.test(content)).length;
  const avgSentenceLength = wordCount / Math.max(sentences.length, 1);
  const sentenceVariance =
    sentences.reduce((sum, s) => {
      const len = s.trim().split(/\s+/).length;
      return sum + Math.pow(len - avgSentenceLength, 2);
    }, 0) / Math.max(sentences.length, 1);
  const structureScore = Math.min(
    20,
    Math.round(patternMatches * 5 + 15 - sentenceVariance / 10 + Math.min(wordCount / 50, 5)),
  );

  const coherenceMarkers = [
    'first',
    'second',
    'third',
    'finally',
    'in conclusion',
    'to summarize',
    'in summary',
    'on the one hand',
    'on the other hand',
  ];
  const coherenceCount = coherenceMarkers.filter((m) => lowerText.includes(m)).length;
  const coherenceScore = Math.min(
    20,
    Math.round(coherenceCount * 5 + Math.min(paragraphs.length * 3, 8)),
  );

  const grammarIssues: string[] = [];
  if (/\bi\b/g.test(content) && !/\bI\b/g.test(content)) grammarIssues.push('澶у啓i瀛楁瘝I搴旇澶у啓');
  if (/\ba\s+[aeiou]/gi.test(content)) grammarIssues.push('鍐犺瘝a鍚庢帴鍏冮煶寮€澶村崟璇嶅簲浣跨敤an');
  const grammarScore = Math.max(0, 20 - grammarIssues.length * 5);

  const lengthScore = Math.min(20, Math.round(wordCount / 15));
  const totalScore = Math.min(
    100,
    vocabularyScore + advancedScore + structureScore + coherenceScore + grammarScore + lengthScore,
  );

  return {
    total: totalScore,
    vocabulary: vocabularyScore,
    grammar: grammarScore,
    structure: structureScore,
    coherence: coherenceScore,
    length: lengthScore,
    suggestions:
      grammarIssues.length > 0
        ? grammarIssues
        : ['灏濊瘯浣跨敤鏇村楂樼骇璇嶆眹', '澧炲姞娈佃惤闂寸殑杩炴帴璇?, '娉ㄦ剰璇硶鍑嗙‘鎬?],
    ai: false,
  };
}

async function scoreTranslation(originalText: string, userTranslation: string) {
  const useAI = process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY;

  if (useAI) {
    return await scoreTranslationWithAI(originalText, userTranslation, useAI);
  }

  // Fallback: local scoring
  return localTranslationScore(originalText, userTranslation);
}

async function scoreTranslationWithAI(
  originalText: string,
  userTranslation: string,
  apiKey: string,
) {
  const prompt = `璇勪环浠ヤ笅缈昏瘧璐ㄩ噺銆?
鍘熸枃锛?{originalText}
鐢ㄦ埛缈昏瘧锛?{userTranslation}

璇蜂粠鍑嗙‘鎬?0-35)銆佹祦鐣呭害(0-35)銆佺敤璇?0-30)涓変釜缁村害璇勫垎锛屾€诲垎100銆傜粰鍑?鏉℃敼杩涘缓璁€傝繑鍥濲SON鏍煎紡銆?
杩斿洖鏍煎紡锛?{
  "total": 85,
  "accuracy": 30,
  "fluency": 28,
  "vocabulary": 27,
  "suggestions": ["寤鸿1", "寤鸿2", "寤鸿3"],
  "feedback": "鎬讳綋璇勪环"
}`;

  try {
    const response = await fetch(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'qwen-max',
          messages: [
            {
              role: 'system',
              content: 'You are a translation evaluator. Always return pure JSON.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
        }),
      },
    );

    if (!response.ok) throw new Error(`API ${response.status}`);
    const data = await response.json();
    let content_text = data.choices[0].message.content;
    content_text = content_text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();
    const result = JSON.parse(content_text);

    return {
      total: result.total || 70,
      accuracy: result.accuracy || 25,
      fluency: result.fluency || 25,
      vocabulary: result.vocabulary || 20,
      suggestions: result.suggestions || ['Continue practicing'],
      feedback: result.feedback || '',
      ai: true,
    };
  } catch (err) {
    console.error('AI translation scoring failed, falling back to local:', err);
    return localTranslationScore(originalText, userTranslation);
  }
}

function localTranslationScore(originalText: string, userTranslation: string) {
  const keywords = originalText
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .map((w) => w.toLowerCase().replace(/[^a-z]/g, ''));
  const userWords = userTranslation.toLowerCase();
  const matched = keywords.filter((kw) => userWords.includes(kw)).length;
  const accuracy = keywords.length > 0 ? Math.round((matched / keywords.length) * 35) : 20;
  const wordCount = userTranslation.split(/\s+/).filter((w) => w.length > 0).length;
  const fluency = Math.min(35, Math.round(wordCount / 3) + 10);
  const vocabRichness = new Set(userTranslation.split(/\s+/).map((w) => w.toLowerCase())).size;
  const vocabulary = Math.min(30, vocabRichness + 10);
  const total = Math.min(100, accuracy + fluency + vocabulary);

  return {
    total,
    accuracy,
    fluency,
    vocabulary,
    suggestions: [
      accuracy < 20 ? '娉ㄦ剰鍏抽敭璇嶇殑鍑嗙‘缈昏瘧' : '鍏抽敭璇嶇炕璇戣壇濂?,
      fluency < 25 ? '灏濊瘯浣垮彞瀛愭洿娴佺晠鑷劧' : '鍙ュ瓙娴佺晠搴﹀彲浠?,
      '澶氱Н绱悓涔夋浛鎹㈣瘝姹?,
    ],
    ai: false,
  };
}

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`CET-4 Backend running on http://localhost:${PORT}`);
  console.log(
    `AI: ${process.env.DASHSCOPE_API_KEY ? 'Qwen API enabled' : 'Local scoring mode (set DASHSCOPE_API_KEY for AI)'}`,
  );
});
