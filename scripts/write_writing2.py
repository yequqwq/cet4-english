import os
os.chdir(r'D:\cxdownload\English')

content = r'''import { useState } from 'react';
import { PenTool, BookOpen, ChevronDown, ChevronUp, Copy, Check, Send, History, Star, Zap, BarChart3, TrendingUp, Type, ArrowLeft } from 'lucide-react';
import { writingTemplates, translationExamples } from '../data/writing';
import { useAppStore } from '../store/useAppStore';

type TabType = 'writing' | 'translation';
type WritingMode = 'view' | 'practice';

interface AIReport {
  total: number;
  vocabulary: number;
  grammar: number;
  structure: number;
  coherence: number;
  length: number;
  suggestions: string[];
}

export const Writing = () => {
  const [activeTab, setActiveTab] = useState<TabType>('writing');
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [expandedExample, setExpandedExample] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [writingMode, setWritingMode] = useState<WritingMode>('view');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addWritingHistory, writingHistory } = useAppStore();

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // 6 维度 AI 评分引擎
  const analyzeWriting = (text: string): { score: number; report: AIReport } => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    const wordCount = words.length;

    // 1. 词汇丰富度 (unique words / total words)
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')));
    const richness = wordCount > 0 ? uniqueWords.size / wordCount : 0;
    const vocabularyScore = Math.min(20, Math.round(richness * 30 + Math.min(wordCount / 30, 5)));

    // 2. 高级词汇检测
    const advancedWords = [
      'however', 'therefore', 'nevertheless', 'moreover', 'furthermore', 'consequently',
      'significantly', 'substantially', 'predominantly', 'inevitably', 'fundamentally',
      'comprehensive', 'sophisticated', 'phenomenon', 'paradigm', 'hypothesis',
      'implication', 'methodology', 'controversy', 'sustainable', 'infrastructure',
      'legitimate', 'alternative', 'phenomena', 'demonstrate', 'illustrate'
    ];
    const transitionWords = ['however', 'therefore', 'moreover', 'furthermore', 'in addition', 'on the other hand', 'consequently', 'nevertheless', 'meanwhile', 'ultimately'];
    const lowerText = text.toLowerCase();
    const advancedCount = advancedWords.filter(w => lowerText.includes(w)).length;
    const transitionCount = transitionWords.filter(w => lowerText.includes(w)).length;
    const advancedScore = Math.min(20, Math.round(advancedCount * 3 + transitionCount * 2));

    // 3. 句式多样性
    const sentencePatterns = [
      /\b[A-Z][a-z]+\b.+?[.!?]\s+[A-Z]/,
      /\b(which|that|who|whom|whose)\b/,
      /\b(if|when|while|although|because|since|unless)\b/,
    ];
    const patternMatches = sentencePatterns.filter(p => p.test(text)).length;

    // 4. 句子长度方差
    const avgSentenceLength = wordCount / Math.max(sentences.length, 1);
    const sentenceVariance = sentences.reduce((sum, s) => {
      const len = s.trim().split(/\s+/).length;
      return sum + Math.pow(len - avgSentenceLength, 2);
    }, 0) / Math.max(sentences.length, 1);
    const structureScore = Math.min(20, Math.round(patternMatches * 5 + 15 - sentenceVariance / 10 + Math.min(wordCount / 50, 5)));

    // 5. 段落连贯性
    const coherenceMarkers = ['first', 'second', 'third', 'finally', 'in conclusion', 'to summarize', 'in summary', 'on the one hand', 'on the other hand'];
    const coherenceCount = coherenceMarkers.filter(m => lowerText.includes(m)).length;
    const coherenceScore = Math.min(20, Math.round(coherenceCount * 5 + Math.min(paragraphs.length * 3, 8)));

    // 6. 语法检测 (简单启发式)
    const grammarIssues: string[] = [];
    if (/\bi\b/g.test(text) && !/\bI\b/g.test(text)) grammarIssues.push('大写字母 I 应该大写');
    if (/\ba\s+[aeiou]/gi.test(text)) grammarIssues.push('冠词 a 后接元音开头单词应使用 an');
    if (/\b(there|their|they're)\b/gi.test(text)) grammarIssues.push('注意 there/their/they\'re 的正确使用');
    const grammarScore = Math.max(0, 20 - grammarIssues.length * 5);

    // 7. 长度评分
    const lengthScore = Math.min(20, Math.round(wordCount / 15));

    // 总分
    const totalScore = Math.min(100, vocabularyScore + advancedScore + structureScore + coherenceScore + grammarScore + lengthScore);

    return { score: totalScore, report: { total: totalScore, vocabulary: vocabularyScore, grammar: grammarScore, structure: structureScore, coherence: coherenceScore, length: lengthScore, suggestions: grammarIssues } };
  };

  const handleSubmitWriting = () => {
    if (!userInput.trim()) return;
    const result = analyzeWriting(userInput);
    setScore(result.score);
    setAiReport(result.report);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      addWritingHistory(userInput, result.score);
    }, 1500);
  };

  const handleReset = () => {
    setUserInput('');
    setScore(null);
    setAiReport(null);
  };

  const handleCopyExample = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const currentTemplate = writingTemplates[selectedTopic];

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <div className="p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">写作翻译</h1>
            <p className="text-white/60 text-sm mt-1">AI 智能批改，提升写作水平</p>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 p-1 bg-white/10 rounded-xl w-fit">
          {(['writing', 'translation'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg font-medium transition-all text-sm ${
                activeTab === tab
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab === 'writing' ? '写作练习' : '翻译练习'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'writing' && (
        <div className="px-6 space-y-6">
          {/* 主题选择 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">选择主题</h2>
            <div className="flex flex-wrap gap-2">
              {writingTemplates.map((template, index) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTopic(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    selectedTopic === index
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white/10 text-white/70 hover:bg-white/15'
                  }`}
                >
                  {template.topic}
                </button>
              ))}
            </div>
          </div>

          {/* 参考句型 */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent-400" /> 参考句型
              </h3>
              <span className="text-xs text-white/50">{currentTemplate.templates.length} 个</span>
            </div>
            <div className="space-y-2">
              {currentTemplate.templates.map((tpl, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-xs text-accent-400 font-bold mt-0.5">{i + 1}.</span>
                  <p className="text-white/80 text-sm flex-1">{tpl}</p>
                  <button
                    onClick={() => handleCopy(tpl, i)}
                    className="p-1 rounded hover:bg-white/10 transition-colors shrink-0"
                  >
                    {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-white/40" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 范文示例 */}
          {currentTemplate.examples.length > 0 && (
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" /> 范文示例
                </h3>
                <button
                  onClick={() => setExpandedExample(expandedExample === 0 ? null : 0)}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  {expandedExample === 0 ? <ChevronUp className="w-4 h-4 text-white/60" /> : <ChevronDown className="w-4 h-4 text-white/60" />}
                </button>
              </div>
              {expandedExample === 0 && (
                <div className="space-y-3">
                  {currentTemplate.examples.map((ex, i) => (
                    <div key={i} className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-amber-300 text-sm">{ex.title}</h4>
                        <button
                          onClick={() => handleCopyExample(ex.content)}
                          className="p-1 rounded hover:bg-amber-500/20 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5 text-amber-400/60" />
                        </button>
                      </div>
                      <p className="text-amber-200/80 text-sm leading-relaxed whitespace-pre-wrap">{ex.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 写作练习区 */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <PenTool className="w-4 h-4 text-blue-400" /> 开始写作
            </h3>
            <div className="mb-3">
              <div className="text-xs text-white/50 mb-2">
                请根据上方参考句型，围绕「{currentTemplate.topic}」主题写一篇短文（建议 120-180 词）
              </div>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="在这里输入你的英语作文..."
                className="w-full h-48 p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm leading-relaxed"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">
                {userInput.split(/\s+/).filter(w => w.length > 0).length} 词
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm rounded-lg bg-white/10 text-white/70 hover:bg-white/15 transition-colors"
                >
                  重置
                </button>
                <button
                  onClick={handleSubmitWriting}
                  disabled={!userInput.trim() || isAnalyzing}
                  className="px-5 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      AI 批改中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      提交批改
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI 批改结果 */}
          {score !== null && aiReport && (
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" /> AI 批改结果
              </h3>

              {/* 总分 */}
              <div className="flex items-center gap-6 mb-5">
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                    <circle
                      cx="56" cy="56" r="48"
                      stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4446'}
                      strokeWidth="6" fill="none"
                      strokeDasharray={2 * Math.PI * 48}
                      strokeDashoffset={2 * Math.PI * 48 * (1 - score / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <span className="text-3xl font-bold text-white">{score}</span>
                      <span className="text-xs text-white/50 block">/100</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-blue-500/10 rounded-lg">
                    <p className="text-xs text-blue-400">词汇丰富度</p>
                    <p className="text-lg font-bold text-blue-300">{aiReport.vocabulary}/20</p>
                  </div>
                  <div className="p-2.5 bg-green-500/10 rounded-lg">
                    <p className="text-xs text-green-400">语法准确性</p>
                    <p className="text-lg font-bold text-green-300">{aiReport.grammar}/20</p>
                  </div>
                  <div className="p-2.5 bg-purple-500/10 rounded-lg">
                    <p className="text-xs text-purple-400">句式多样性</p>
                    <p className="text-lg font-bold text-purple-300">{aiReport.structure}/20</p>
                  </div>
                  <div className="p-2.5 bg-amber-500/10 rounded-lg">
                    <p className="text-xs text-amber-400">段落连贯性</p>
                    <p className="text-lg font-bold text-amber-300">{aiReport.coherence}/20</p>
                  </div>
                </div>
              </div>

              {/* 改进建议 */}
              {aiReport.suggestions.length > 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <h4 className="text-sm font-medium text-red-400 mb-2">改进建议</h4>
                  <ul className="space-y-1">
                    {aiReport.suggestions.map((s, i) => (
                      <li key={i} className="text-xs text-red-300/80 flex items-start gap-2">
                        <span className="mt-0.5">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 历史成绩 */}
          {writingHistory.length > 0 && (
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-sky-400" /> 写作历史
                </h3>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-xs text-white/50 hover:text-white/80 transition-colors"
                >
                  {showHistory ? '收起' : '展开'}
                </button>
              </div>
              {showHistory && (
                <div className="space-y-2">
                  {writingHistory.slice().reverse().map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/60 truncate">{item.content.substring(0, 50)}...</p>
                        <p className="text-xs text-white/40 mt-0.5">{new Date(item.date).toLocaleString('zh-CN')}</p>
                      </div>
                      <span className={`ml-3 text-lg font-bold ${item.score >= 80 ? 'text-green-400' : item.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                        {item.score}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'translation' && (
        <div className="px-6 space-y-4">
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Type className="w-4 h-4 text-indigo-400" /> 翻译练习
            </h3>
            <p className="text-white/60 text-sm mb-4">选择英译中或中译英模式，提升双语能力</p>
            <div className="text-center py-12">
              <Type className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/50 text-sm">翻译功能开发中，敬请期待...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
'''

with open('src/pages/Writing.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print(f'Writing.tsx written: {len(content)} bytes')
