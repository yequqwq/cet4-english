import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Send, History, Star, ArrowLeft, Sparkles, Loader2, TrendingUp } from 'lucide-react';
import { writingTemplates, translationExamples } from '../data/writing';
import { useAppStore } from '../store/useAppStore';
import { scoreWriting, type WritingScore } from '../api/writing';
import { scoreTranslation, type TranslationScore } from '../api/translation';

type TabType = 'writing' | 'translation';
type WritingMode = 'view' | 'practice';
type TranslationMode = 'view' | 'practice';

interface AIReport {
  total: number;
  vocabulary: number;
  grammar: number;
  structure: number;
  coherence: number;
  length: number;
  suggestions: string[];
  feedback?: string;
  ai: boolean;
}

interface TransAIReport {
  total: number;
  accuracy: number;
  fluency: number;
  vocabulary: number;
  suggestions: string[];
  feedback?: string;
  ai: boolean;
}

function localAnalyzeWriting(content: string): { score: number; report: AIReport } {
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')));
  const richness = uniqueWords.size / Math.max(wordCount, 1);
  const vocabularyScore = Math.min(20, Math.round(richness * 40));
  const patterns = [/[A-Z][^.!?]*[.!?]/, /\b(he|she|they|it|we|I)\b/, /\b(is|are|was|were|has|have)\b/];
  const grammarHits = patterns.filter(p => p.test(content)).length;
  const grammarScore = Math.min(20, Math.round((grammarHits / patterns.length) * 25));
  const transitions = ['however', 'therefore', 'moreover', 'furthermore', 'in conclusion', 'firstly', 'secondly', 'finally', 'in addition', 'on the other hand'];
  const transCount = transitions.filter(t => content.toLowerCase().includes(t)).length;
  const structureScore = Math.min(20, transCount * 5);
  const paragraphs = content.split(/\n\s*\n/).filter(Boolean);
  const coherenceScore = Math.min(20, paragraphs.length * 7);
  const lengthScore = wordCount >= 120 ? 20 : wordCount >= 80 ? 15 : wordCount >= 50 ? 10 : Math.max(0, Math.round(wordCount / 5));
  const total = vocabularyScore + grammarScore + structureScore + coherenceScore + lengthScore;
  const suggestions: string[] = [];
  if (wordCount < 120) suggestions.push('Increase word count to at least 120 words (CET-4 requirement).');
  if (transCount < 2) suggestions.push('Use more transitional words (however, therefore, furthermore) to improve flow.');
  if (paragraphs.length < 3) suggestions.push('Divide your essay into at least 3 paragraphs: introduction, body, conclusion.');
  if (richness < 0.5) suggestions.push('Try to use more varied vocabulary to avoid repetition.');
  if (suggestions.length === 0) suggestions.push('Great work! Keep practicing to maintain your level.');
  return { score: total, report: { total, vocabulary: vocabularyScore, grammar: grammarScore, structure: structureScore, coherence: coherenceScore, length: lengthScore, suggestions, ai: false } };
}

function localTranslateScore(english: string, userChinese: string): TransAIReport {
  const keywords = english.toLowerCase().split(/\s+/).filter(w => w.length > 2).map(w => w.replace(/[^a-z]/g, ''));
  const chineseChars = userChinese.trim().length;
  const lengthRatio = Math.min(1, chineseChars / Math.max(keywords.length * 1.5, 1));
  const accuracy = Math.min(100, Math.round(lengthRatio * 85));
  const fluency = Math.min(100, Math.round(lengthRatio * 75 + (chineseChars > 10 ? 15 : 0)));
  const vocabulary = Math.min(100, Math.round(lengthRatio * 70 + (chineseChars > 20 ? 20 : 0)));
  const total = Math.round(accuracy * 0.5 + fluency * 0.25 + vocabulary * 0.25);
  const suggestions: string[] = [];
  if (chineseChars < 10) suggestions.push('Your translation is too short. Try to translate the full meaning.');
  if (accuracy < 60) suggestions.push('Focus on translating key content words accurately.');
  if (fluency < 60) suggestions.push('Read your translation aloud to check if it sounds natural in Chinese.');
  if (suggestions.length === 0) suggestions.push('Good translation! Compare with the reference to find nuances.');
  return { total, accuracy, fluency, vocabulary, suggestions, ai: false };
}

export const Writing = () => {
  const [activeTab, setActiveTab] = useState<TabType>('writing');
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [expandedExample, setExpandedExample] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [writingMode, setWritingMode] = useState<WritingMode>('view');
  const [userInput, setUserInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [translationMode, setTranslationMode] = useState<TranslationMode>('view');
  const [translationSentenceIdx, setTranslationSentenceIdx] = useState(0);
  const [userTranslation, setUserTranslation] = useState('');
  const [transReport, setTransReport] = useState<TransAIReport | null>(null);
  const [isTransAnalyzing, setIsTransAnalyzing] = useState(false);
  const { addWritingHistory, writingHistory } = useAppStore();
  const currentTemplate = writingTemplates[selectedTopic];

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSubmitWriting = async () => {
    if (!userInput.trim()) return;
    setIsAnalyzing(true);
    try {
      const result: WritingScore = await scoreWriting(userInput, currentTemplate.topic);
      const report: AIReport = { total: result.total, vocabulary: result.vocabulary, grammar: result.grammar, structure: result.structure, coherence: result.coherence, length: result.length, suggestions: result.suggestions, feedback: result.feedback, ai: result.ai !== false };
      setAiReport(report);
      addWritingHistory({ topic: currentTemplate.topic, content: userInput, score: report.total });
    } catch {
      const localResult = localAnalyzeWriting(userInput);
      setAiReport(localResult.report);
      addWritingHistory({ topic: currentTemplate.topic, content: userInput, score: localResult.score });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitTranslation = async () => {
    if (!userTranslation.trim()) return;
    setIsTransAnalyzing(true);
    const sentence = translationExamples[translationSentenceIdx];
    try {
      const result: TranslationScore = await scoreTranslation(sentence.english, userTranslation);
      const report: TransAIReport = { total: result.total, accuracy: result.accuracy, fluency: result.fluency, vocabulary: result.vocabulary, suggestions: result.suggestions, feedback: result.feedback, ai: result.ai !== false };
      setTransReport(report);
      addWritingHistory({ topic: `翻译：${sentence.chinese.slice(0, 20)}...`, content: userTranslation, score: report.total });
    } catch {
      const localResult = localTranslateScore(sentence.english, userTranslation);
      setTransReport(localResult);
    } finally {
      setIsTransAnalyzing(false);
    }
  };

  const handleResetTranslation = () => { setUserTranslation(''); setTransReport(null); };
  const handleReset = () => { setUserInput(''); setAiReport(null); };

  const dimensionBars = (dims: { label: string; score: number; max: number; color: string }[]) =>
    dims.map(d => (
      <div key={d.label} className="flex items-center gap-3">
        <span className="text-white/60 text-sm w-24 shrink-0">{d.label}</span>
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(d.score / d.max) * 100}%`, backgroundColor: d.color }} />
        </div>
        <span className="text-white font-bold text-sm w-8 text-right">{d.score}/{d.max}</span>
      </div>
    ));

  return (
    <div className="min-h-screen pb-24 md:pb-0 animate-fade-in-up">
      <header className="p-6 mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">写作翻译</h1>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => { setActiveTab('writing'); setWritingMode('view'); setUserInput(''); setAiReport(null); }}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'writing' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
            写作模板
          </button>
          <button onClick={() => { setActiveTab('translation'); setTranslationMode('view'); setUserTranslation(''); setTransReport(null); }}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'translation' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
            翻译练习
          </button>
          <button onClick={() => setShowHistory(!showHistory)}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${showHistory ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
            <History className="w-4 h-4" /> 历史记录
          </button>
        </div>
      </header>

      {showHistory && (
        <section className="px-6 mb-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">写作历史</h3>
            {writingHistory.length === 0 ? (
              <p className="text-white/70 text-center py-8">暂无写作记录</p>
            ) : (
              <div className="space-y-4">
                {writingHistory.slice().reverse().map(item => (
                  <div key={item.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{item.topic}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 font-bold">{item.score}</span>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm line-clamp-2">{item.content}</p>
                    <p className="text-white/50 text-xs mt-2">{new Date(item.timestamp).toLocaleString('zh-CN')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'writing' && (
        <section className="px-6">
          {writingMode === 'view' ? (
            <>
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {writingTemplates.map((t, i) => (
                  <button key={t.id} onClick={() => setSelectedTopic(i)}
                    className={`px-4 py-2 rounded-full transition-all whitespace-nowrap ${selectedTopic === i ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                    {t.topic}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-4">常用句型模板</h2>
                  <div className="space-y-4">
                    {writingTemplates[selectedTopic]?.templates.map((tpl, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4">
                        <p className="text-white font-english italic">{tpl}</p>
                        <button onClick={() => handleCopy(tpl, i)} className="mt-3 flex items-center gap-2 text-white/70 hover:text-white transition-all">
                          {copiedIndex === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copiedIndex === i ? '已复制' : '复制'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">范文示例</h2>
                    <button onClick={() => setWritingMode('practice')} className="btn-primary text-sm">开始练习</button>
                  </div>
                  {writingTemplates[selectedTopic]?.examples.map((ex, i) => (
                    <div key={i} className="bg-white/5 rounded-xl overflow-hidden mb-3">
                      <button onClick={() => setExpandedExample(expandedExample === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-all">
                        <span className="text-white font-medium">{ex.title}</span>
                        {expandedExample === i ? <ChevronUp className="w-5 h-5 text-white/70" /> : <ChevronDown className="w-5 h-5 text-white/70" />}
                      </button>
                      {expandedExample === i && (
                        <div className="px-4 pb-4 animate-fade-in-up">
                          <p className="text-white/90 leading-relaxed whitespace-pre-line">{ex.content}</p>
                          <button onClick={() => handleCopy(ex.content, i + 100)} className="mt-3 flex items-center gap-2 text-white/70 hover:text-white transition-all">
                            {copiedIndex === i + 100 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copiedIndex === i + 100 ? '已复制' : '复制范文'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">写作练习</h2>
                <button onClick={() => { setWritingMode('view'); handleReset(); }} className="text-white/70 hover:text-white flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> 返回模板
                </button>
              </div>
              <div className="mb-6">
                <p className="text-white/70 mb-1">主题：{currentTemplate?.topic}</p>
                <p className="text-white/50 text-sm">建议字数：120-180 词</p>
              </div>

              {aiReport && (
                <div className="mb-6 p-6 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl border border-white/10 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`text-4xl font-black ${aiReport.total >= 80 ? 'text-green-400' : aiReport.total >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{aiReport.total}</div>
                      <div>
                        <div className="text-white/80 text-sm">总分 / 100</div>
                        {aiReport.ai && <span className="inline-flex items-center gap-1 text-xs text-primary-400 mt-1"><Sparkles className="w-3 h-3" /> AI 批改</span>}
                      </div>
                    </div>
                    {aiReport.ai === false && <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">本地评分</span>}
                  </div>
                  <div className="space-y-3 mb-4">
                    {dimensionBars([
                      { label: '词汇丰富度', score: aiReport.vocabulary, max: 20, color: '#8b5cf6' },
                      { label: '语法准确性', score: aiReport.grammar, max: 20, color: '#3b82f6' },
                      { label: '句式多样性', score: aiReport.structure, max: 20, color: '#06b6d4' },
                      { label: '段落连贯性', score: aiReport.coherence, max: 20, color: '#10b981' },
                      { label: '内容长度', score: aiReport.length, max: 20, color: '#f59e0b' },
                    ])}
                  </div>
                  {aiReport.suggestions.length > 0 && (
                    <div>
                      <h4 className="text-white/70 text-sm font-medium mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> 改进建议</h4>
                      <ul className="space-y-2">
                        {aiReport.suggestions.map((s, i) => (<li key={i} className="text-white/80 text-sm flex items-start gap-2"><span className="text-primary-400 mt-0.5 shrink-0">•</span> {s}</li>))}
                      </ul>
                    </div>
                  )}
                  {aiReport.feedback && <p className="mt-4 text-white/60 text-sm italic border-t border-white/10 pt-4">{aiReport.feedback}</p>}
                </div>
              )}

              <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)}
                placeholder={`请输入你的作文...\n\n参考模板：${currentTemplate?.templates[0] || ''}`}
                className="input-glow w-full h-64 resize-none mb-4 font-english" />
              <div className="flex gap-4">
                <button onClick={handleReset} className="btn-secondary">重置</button>
                <button onClick={handleSubmitWriting} disabled={isAnalyzing || !userInput.trim()}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isAnalyzing ? <><Loader2 className="w-4 h-4 animate-spin" /> AI 批改中...</> : <><Send className="w-4 h-4" /> 提交评分</>}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === 'translation' && (
        <section className="px-6">
          {translationMode === 'view' ? (
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">翻译练习</h2>
              <div className="space-y-4">
                {translationExamples.map((ex, i) => (
                  <div key={ex.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white/70 text-sm mb-1">中文原文</p>
                        <p className="text-white text-lg">{ex.chinese}</p>
                      </div>
                      <button onClick={() => { setTranslationSentenceIdx(i); setTranslationMode('practice'); setUserTranslation(''); setTransReport(null); }}
                        className="ml-4 btn-primary text-sm shrink-0">
                        开始练习
                      </button>
                    </div>
                    <div className="mt-3">
                      <p className="text-white/70 text-sm mb-1">参考翻译</p>
                      <p className="text-white font-english">{ex.english}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">翻译练习</h2>
                <button onClick={() => { setTranslationMode('view'); handleResetTranslation(); }}
                  className="text-white/70 hover:text-white flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> 返回列表
                </button>
              </div>
              <div className="flex items-center justify-between mb-4">
                <button disabled={translationSentenceIdx === 0}
                  onClick={() => { setTranslationSentenceIdx(p => p - 1); setUserTranslation(''); setTransReport(null); }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  <ArrowLeft className="w-4 h-4" /> 上一句
                </button>
                <span className="text-white/50 text-sm">{translationSentenceIdx + 1} / {translationExamples.length}</span>
                <button disabled={translationSentenceIdx === translationExamples.length - 1}
                  onClick={() => { setTranslationSentenceIdx(p => p + 1); setUserTranslation(''); setTransReport(null); }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  下一句 <ChevronDown className="w-4 h-4 rotate-270" />
                </button>
              </div>
              <div className="mb-6 p-4 bg-white/5 rounded-xl">
                <p className="text-white/70 text-sm mb-2">英文原文</p>
                <p className="text-white text-lg font-english">{translationExamples[translationSentenceIdx].english}</p>
              </div>

              {transReport && (
                <div className="mb-6 p-6 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl border border-white/10 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`text-4xl font-black ${transReport.total >= 80 ? 'text-green-400' : transReport.total >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{transReport.total}</div>
                      <div>
                        <div className="text-white/80 text-sm">总分 / 100</div>
                        {transReport.ai && <span className="inline-flex items-center gap-1 text-xs text-primary-400 mt-1"><Sparkles className="w-3 h-3" /> AI 批改</span>}
                      </div>
                    </div>
                    {transReport.ai === false && <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">本地评分</span>}
                  </div>
                  <div className="space-y-3 mb-4">
                    {dimensionBars([
                      { label: '准确性', score: Math.round(transReport.accuracy / 100 * 20), max: 20, color: '#3b82f6' },
                      { label: '流畅度', score: Math.round(transReport.fluency / 100 * 20), max: 20, color: '#10b981' },
                      { label: '用词', score: Math.round(transReport.vocabulary / 100 * 20), max: 20, color: '#f59e0b' },
                    ])}
                  </div>
                  {transReport.suggestions.length > 0 && (
                    <div>
                      <h4 className="text-white/70 text-sm font-medium mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> 改进建议</h4>
                      <ul className="space-y-2">
                        {transReport.suggestions.map((s, i) => (<li key={i} className="text-white/80 text-sm flex items-start gap-2"><span className="text-primary-400 mt-0.5 shrink-0">•</span> {s}</li>))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-white/70 text-sm mb-1">参考翻译：</p>
                    <p className="text-white font-english">{translationExamples[translationSentenceIdx].chinese}</p>
                  </div>
                </div>
              )}

              <textarea value={userTranslation} onChange={(e) => setUserTranslation(e.target.value)}
                placeholder="请输入中文翻译..." className="input-glow w-full h-32 resize-none mb-4" />
              <div className="flex gap-4">
                <button onClick={handleResetTranslation} className="btn-secondary">重置</button>
                <button onClick={handleSubmitTranslation} disabled={isTransAnalyzing || !userTranslation.trim()}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isTransAnalyzing ? <><Loader2 className="w-4 h-4 animate-spin" /> AI 批改中...</> : <><Send className="w-4 h-4" /> 提交评分</>}
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
