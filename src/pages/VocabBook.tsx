import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { words } from '../data/words';
import {
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  PlayCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export const VocabBook = () => {
  const { wordProgress } = useAppStore();
  const [activeTab, setActiveTab] = useState<'cet4' | 'cet6' | 'kaoyan'>('cet4');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const { speak } = useAudioPlayer();

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filteredWords = words.filter((w) => w.difficulty === activeTab);

  const stats = {
    total: filteredWords.length,
    mastered: filteredWords.filter((w) => {
      const progress = wordProgress[w.id];
      return progress && progress.mastery >= 5;
    }).length,
    learning: filteredWords.filter((w) => {
      const progress = wordProgress[w.id];
      return progress && progress.mastery > 0 && progress.mastery < 5;
    }).length,
    new: filteredWords.filter((w) => {
      const progress = wordProgress[w.id];
      return !progress || progress.mastery === 0;
    }).length,
  };

  const getWordStatus = (wordId: string) => {
    const progress = wordProgress[wordId];
    if (!progress || progress.mastery === 0) return 'new';
    if (progress.mastery >= 5) return 'mastered';
    return 'learning';
  };

  const handleSpeak = (word: string) => {
    speak(word);
  };

  const groupedByCategory = filteredWords.reduce(
    (acc, word) => {
      if (!acc[word.category]) {
        acc[word.category] = [];
      }
      acc[word.category].push(word);
      return acc;
    },
    {} as Record<string, typeof words>,
  );

  const categoryNames: Record<string, string> = {
    campus: '校园生活',
    tech: '科技技术',
    culture: '文化社会',
    environment: '环境自然',
    economy: '经济商业',
  };

  const tabs = [
    { key: 'cet4', label: '四级词汇', color: 'bg-gradient-to-r from-green-400 to-green-600' },
    { key: 'cet6', label: '六级词汇', color: 'bg-gradient-to-r from-orange-400 to-orange-600' },
    { key: 'kaoyan', label: '考研词汇', color: 'bg-gradient-to-r from-purple-400 to-purple-600' },
  ] as const;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">单词本</h1>
          <p className="text-white/60">查看你的词汇学习进度</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary-400">{stats.total}</div>
          <div className="text-white/60 text-sm">总词汇</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{stats.mastered}</div>
          <div className="text-white/60 text-sm">已掌握</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">{stats.learning}</div>
          <div className="text-white/60 text-sm">学习中</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-400">{stats.new}</div>
          <div className="text-white/60 text-sm">待学习</div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === tab.key
                ? `${tab.color} text-white shadow-lg scale-105`
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {Object.entries(groupedByCategory).map(([category, categoryWords]) => (
          <div key={category} className="glass-card rounded-xl overflow-hidden">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium text-white">
                  {categoryNames[category] || category}
                </span>
                <span className="text-white/40 text-sm">{categoryWords.length} 个单词</span>
              </div>
              {expandedCategories[category] ? (
                <ChevronUp className="w-5 h-5 text-white/60" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white/60" />
              )}
            </button>

            {expandedCategories[category] && (
              <div className="border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                  {categoryWords.map((word) => {
                    const status = getWordStatus(word.id);
                    const progress = wordProgress[word.id];
                    const mastery = progress?.mastery || 0;

                    return (
                      <div
                        key={word.id}
                        className={`p-4 rounded-xl transition-all ${
                          status === 'mastered'
                            ? 'bg-green-500/20 border border-green-500/30'
                            : status === 'learning'
                              ? 'bg-yellow-500/20 border border-yellow-500/30'
                              : 'bg-white/10 border border-white/10'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold text-white">{word.word}</span>
                              <button
                                onClick={() => handleSpeak(word.word)}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                              >
                                <PlayCircle className="w-4 h-4 text-white/60" />
                              </button>
                            </div>
                            <div className="text-white/50 text-sm">{word.phonetic}</div>
                            <div className="text-white/70 text-sm mt-1">{word.meaning}</div>
                          </div>
                          {status === 'mastered' ? (
                            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                          ) : status === 'learning' ? (
                            <Clock className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-6 h-6 text-white/40 flex-shrink-0" />
                          )}
                        </div>

                        {mastery > 0 && mastery < 5 && (
                          <div className="mt-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-white/40">掌握度</span>
                              <span className="text-xs text-yellow-400">{mastery}/5</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-green-400 transition-all"
                                style={{ width: `${(mastery / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {status === 'mastered' && (
                          <div className="mt-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-white/40">掌握度</span>
                              <span className="text-xs text-green-400">5/5</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-green-400 to-green-500 w-full" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">暂无该难度的词汇</p>
        </div>
      )}
    </div>
  );
};
