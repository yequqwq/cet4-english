import { useState } from 'react';
import { PenTool, BookOpen, ChevronDown, ChevronUp, Copy, Check, Send, History, Star } from 'lucide-react';
import { writingTemplates, translationExamples } from '../data/writing';
import { useAppStore } from '../store/useAppStore';

type TabType = 'writing' | 'translation';
type WritingMode = 'view' | 'practice';

export const Writing = () => {
  const [activeTab, setActiveTab] = useState<TabType>('writing');
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [expandedExample, setExpandedExample] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [writingMode, setWritingMode] = useState<WritingMode>('view');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const { addWritingHistory, writingHistory } = useAppStore();

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSubmitWriting = () => {
    if (!userInput.trim()) return;
    
    const keywords = ['however', 'therefore', 'in conclusion', 'first', 'second', 'finally', 'importantly', 'significantly'];
    let matchedKeywords = 0;
    keywords.forEach((keyword) => {
      if (userInput.toLowerCase().includes(keyword)) {
        matchedKeywords++;
      }
    });
    
    const lengthScore = Math.min(30, Math.floor(userInput.length / 10));
    const keywordScore = matchedKeywords * 5;
    const totalScore = Math.min(100, lengthScore + keywordScore + 30);
    
    setScore(totalScore);
    addWritingHistory({
      topic: writingTemplates[selectedTopic]?.topic || '写作练习',
      content: userInput,
      score: totalScore,
    });
  };

  const handleSubmitTranslation = () => {
    if (!userInput.trim()) return;
    
    const example = translationExamples[selectedTopic];
    const correctWords = example.english.toLowerCase().split(' ').filter(Boolean);
    const userWords = userInput.toLowerCase().split(' ').filter(Boolean);
    
    let matchedWords = 0;
    userWords.forEach((word) => {
      if (correctWords.includes(word)) {
        matchedWords++;
      }
    });
    
    const accuracy = Math.min(100, Math.round((matchedWords / correctWords.length) * 100));
    const totalScore = Math.min(100, accuracy);
    
    setScore(totalScore);
    addWritingHistory({
      topic: `翻译：${example.chinese.slice(0, 20)}...`,
      content: userInput,
      score: totalScore,
    });
  };

  const handleReset = () => {
    setUserInput('');
    setScore(null);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 animate-fade-in-up">
      <header className="p-6 mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">写作翻译</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab('writing');
              setWritingMode('view');
              setScore(null);
              setUserInput('');
            }}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'writing' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            写作模板
          </button>
          <button
            onClick={() => {
              setActiveTab('translation');
              setWritingMode('view');
              setScore(null);
              setUserInput('');
            }}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'translation' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            翻译练习
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${showHistory ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            <History className="w-4 h-4" />
            历史记录
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
                {writingHistory.slice().reverse().map((item) => (
                  <div key={item.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{item.topic}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 font-bold">{item.score}</span>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm line-clamp-2">{item.content}</p>
                    <p className="text-white/50 text-xs mt-2">
                      {new Date(item.timestamp).toLocaleString('zh-CN')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'writing' ? (
        <section className="px-6">
          {writingMode === 'view' ? (
            <>
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {writingTemplates.map((template, index) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTopic(index)}
                    className={`px-4 py-2 rounded-full transition-all whitespace-nowrap ${selectedTopic === index ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                  >
                    {template.topic}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-4">常用句型模板</h2>
                  <div className="space-y-4">
                    {writingTemplates[selectedTopic]?.templates.map((template, index) => (
                      <div key={index} className="bg-white/5 rounded-xl p-4">
                        <p className="text-white font-english italic">{template}</p>
                        <button
                          onClick={() => handleCopy(template, index)}
                          className="mt-3 flex items-center gap-2 text-white/70 hover:text-white transition-all"
                        >
                          {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copiedIndex === index ? '已复制' : '复制'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">范文示例</h2>
                    <button
                      onClick={() => setWritingMode('practice')}
                      className="btn-primary text-sm"
                    >
                      开始练习
                    </button>
                  </div>
                  {writingTemplates[selectedTopic]?.examples.map((example, index) => (
                    <div key={index} className="bg-white/5 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedExample(expandedExample === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-all"
                      >
                        <span className="text-white font-medium">{example.title}</span>
                        {expandedExample === index ? (
                          <ChevronUp className="w-5 h-5 text-white/70" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-white/70" />
                        )}
                      </button>
                      {expandedExample === index && (
                        <div className="px-4 pb-4 animate-fade-in-up">
                          <p className="text-white/90 leading-relaxed whitespace-pre-line">{example.content}</p>
                          <button
                            onClick={() => handleCopy(example.content, index + 100)}
                            className="mt-3 flex items-center gap-2 text-white/70 hover:text-white transition-all"
                          >
                            {copiedIndex === index + 100 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copiedIndex === index + 100 ? '已复制' : '复制范文'}
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
                <button onClick={() => setWritingMode('view')} className="text-white/70 hover:text-white">
                  返回模板
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-white/70 mb-2">主题：{writingTemplates[selectedTopic]?.topic}</p>
                <p className="text-white/70 text-sm">参考模板：{writingTemplates[selectedTopic]?.templates[0]}</p>
              </div>

              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="请在此输入您的作文..."
                className="input-glow w-full h-64 resize-none mb-4 font-english"
              />

              {score !== null && (
                <div className="mb-4 p-4 bg-white/5 rounded-xl animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <span className="text-2xl font-bold text-yellow-400">{score}</span>
                    <span className="text-white/70">分</span>
                  </div>
                  <p className="text-white/70 text-sm">
                    {score >= 80 ? '优秀！您的文章结构清晰，用词恰当。' : 
                     score >= 60 ? '良好！继续加油，注意使用更多连接词。' : 
                     '还需努力！建议参考范文，学习更多句型。'}
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={handleReset} className="btn-secondary">
                  重置
                </button>
                <button onClick={handleSubmitWriting} className="btn-primary flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  提交评分
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="px-6">
          {writingMode === 'view' ? (
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">翻译练习</h2>
              <div className="space-y-4">
                {translationExamples.map((example, index) => (
                  <div key={example.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white/70 text-sm mb-1">中文原文</p>
                        <p className="text-white text-lg">{example.chinese}</p>
                      </div>
                      <button
                        onClick={() => setSelectedTopic(index)}
                        className="ml-4 btn-primary text-sm"
                      >
                        练习
                      </button>
                    </div>
                    <div className="mt-3">
                      <p className="text-white/70 text-sm mb-1">参考翻译</p>
                      <p className="text-white font-english">{example.english}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">翻译练习</h2>
                <button onClick={() => setWritingMode('view')} className="text-white/70 hover:text-white">
                  返回列表
                </button>
              </div>

              <div className="mb-6 p-4 bg-white/5 rounded-xl">
                <p className="text-white/70 text-sm mb-2">中文原文</p>
                <p className="text-white text-lg">{translationExamples[selectedTopic]?.chinese}</p>
              </div>

              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="请输入英文翻译..."
                className="input-glow w-full h-48 resize-none mb-4 font-english"
              />

              {score !== null && (
                <div className="mb-4 p-4 bg-white/5 rounded-xl animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <span className="text-2xl font-bold text-yellow-400">{score}</span>
                    <span className="text-white/70">分</span>
                  </div>
                  <div className="mt-4">
                    <p className="text-white/70 text-sm mb-2">参考翻译</p>
                    <p className="text-white font-english">{translationExamples[selectedTopic]?.english}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={handleReset} className="btn-secondary">
                  重置
                </button>
                <button onClick={handleSubmitTranslation} className="btn-primary flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  提交评分
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};