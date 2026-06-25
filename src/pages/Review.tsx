import { useState, useEffect, useCallback } from 'react';
import {
  Brain,
  Volume2,
  Check,
  X,
  ArrowRight,
  Calendar,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { words } from '../data/words';
import { useAppStore } from '../store/useAppStore';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export const Review = () => {
  const { getTodayReviewWords, reviewWord, getReviewStats, reviewSchedule } =
    useAppStore();
  const { playWord } = useAudioPlayer();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewWords, setReviewWords] = useState<string[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ remembered: 0, forgot: 0 });
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const todayWords = getTodayReviewWords();
    setReviewWords(todayWords);
  }, [getTodayReviewWords]);

  const currentWord = reviewWords[currentIndex]
    ? words.find((w) => w.id === reviewWords[currentIndex])
    : null;
  const stats = getReviewStats();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRemember = useCallback(async () => {
    if (!currentWord) return;

    setShowResult(true);
    await playWord(currentWord.word);

    reviewWord(currentWord.id, 5); // 5 = 完全记住
    setSessionStats((prev) => ({ ...prev, remembered: prev.remembered + 1 }));

    setTimeout(() => {
      setShowResult(false);
      setIsFlipped(false);
      if (currentIndex < reviewWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 1000);
  }, [currentWord, currentIndex, reviewWords.length, playWord, reviewWord]);

  const handleForget = useCallback(async () => {
    if (!currentWord) return;

    setShowResult(true);
    await playWord(currentWord.word);

    reviewWord(currentWord.id, 2); // 2 = 忘记
    setSessionStats((prev) => ({ ...prev, forgot: prev.forgot + 1 }));

    setTimeout(() => {
      setShowResult(false);
      setIsFlipped(false);
      if (currentIndex < reviewWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 1000);
  }, [currentWord, currentIndex, reviewWords.length, playWord, reviewWord]);

  const handleSkip = () => {
    setIsFlipped(false);
    if (currentIndex < reviewWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePlay = () => {
    if (currentWord) {
      playWord(currentWord.word);
    }
  };

  // 获取复习间隔描述
  const getIntervalDescription = (wordId: string) => {
    const plan = reviewSchedule[wordId];
    if (!plan) return '';

    const intervals = {
      1: '第2天',
      2: '第4天',
      3: '第7天',
      4: '第15天',
      5: '长期记忆',
    };

    return intervals[plan.level as keyof typeof intervals] || `等级${plan.level}`;
  };

  // 获取复习进度
  const getProgressDescription = (wordId: string) => {
    const plan = reviewSchedule[wordId];
    if (!plan) return '';

    return `已复习 ${plan.reviewCount} 次`;
  };

  if (reviewWords.length === 0) {
    return (
      <div className="p-6 max-w-6xl mx-auto animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">艾宾浩斯复习</h1>
            <p className="text-white/60">科学记忆，高效复习</p>
          </div>
        </div>

        <div className="glass-card p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">今日复习已完成！</h2>
          <p className="text-white/70 mb-8">太棒了！你已经完成了今天的单词复习任务</p>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-green-400">{stats.total}</div>
              <div className="text-white/60 text-sm">总词汇</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-blue-400">
                {
                  Object.keys(reviewSchedule).filter((id) => {
                    const plan = reviewSchedule[id];
                    const today = new Date().toISOString().split('T')[0];
                    return plan.lastReviewDate === today;
                  }).length
                }
              </div>
              <div className="text-white/60 text-sm">今日已复习</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-purple-400">{Math.max(0, stats.overdue)}</div>
              <div className="text-white/60 text-sm">待复习</div>
            </div>
          </div>
        </div>

        <div className="mt-6 glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            艾宾浩斯复习原理
          </h3>
          <div className="space-y-3 text-white/70">
            <p>艾宾浩斯遗忘曲线表明，记忆需要科学的复习间隔才能长期保持。</p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4">
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-green-400">第1次</div>
                <div className="text-sm text-white/60">1天后</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-blue-400">第2次</div>
                <div className="text-sm text-white/60">3天后</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-purple-400">第3次</div>
                <div className="text-sm text-white/60">7天后</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-pink-400">第4次</div>
                <div className="text-sm text-white/60">14天后</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-orange-400">第5次</div>
                <div className="text-sm text-white/60">长期记忆</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">艾宾浩斯复习</h1>
            <p className="text-white/60">科学记忆，高效复习</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-white/70">
              {currentIndex + 1}/{reviewWords.length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">{reviewWords.length}</div>
          <div className="text-white/60 text-sm">待复习</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{sessionStats.remembered}</div>
          <div className="text-white/60 text-sm">已记住</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-400">{sessionStats.forgot}</div>
          <div className="text-white/60 text-sm">待加强</div>
        </div>
      </div>

      {currentWord && (
        <>
          <div className="w-full h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / reviewWords.length) * 100}%` }}
            />
          </div>

          <div
            className={`glass-card p-8 mb-6 cursor-pointer transition-all duration-300 ${
              isFlipped ? 'flipped' : ''
            } ${showResult ? (sessionStats.remembered > sessionStats.forgot ? 'border-green-500/50' : 'border-red-500/50') : ''}`}
            onClick={handleFlip}
          >
            <div className="flex flex-col items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay();
                }}
                className="mb-4 p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all"
              >
                <Volume2 className="w-6 h-6 text-white" />
              </button>

              <h2 className="text-4xl font-bold text-white mb-2 font-english">
                {currentWord.word}
              </h2>
              <p className="text-lg text-white/70 mb-4">{currentWord.phonetic}</p>

              {isFlipped && (
                <div className="w-full mt-4 space-y-4 animate-fade-in">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">释义</p>
                    <p className="text-white text-lg">{currentWord.meaning}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">例句</p>
                    <p className="text-white/90 italic">{currentWord.example}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span className="text-white/60 text-sm">
                        下次: {getIntervalDescription(currentWord.id)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-white/60 text-sm">
                        {getProgressDescription(currentWord.id)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {!isFlipped && <p className="text-white/50 mt-4">点击卡片查看释义</p>}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleSkip}
              className="px-6 py-3 glass-card text-white/70 hover:text-white hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              跳过
            </button>
            <button
              onClick={handleForget}
              disabled={!isFlipped || showResult}
              className="px-8 py-4 bg-gradient-to-r from-red-500/30 to-red-600/30 border-2 border-red-500/50 text-red-300 font-bold rounded-2xl hover:from-red-500/40 hover:to-red-600/40 hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-6 h-6" />
              忘记了
            </button>
            <button
              onClick={handleRemember}
              disabled={!isFlipped || showResult}
              className="px-8 py-4 bg-gradient-to-r from-green-500/30 to-green-600/30 border-2 border-green-500/50 text-green-300 font-bold rounded-2xl hover:from-green-500/40 hover:to-green-600/40 hover:-translate-y-1 transition-all flex items-center gap-3 shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-6 h-6" />
              记住了
            </button>
          </div>
        </>
      )}
    </div>
  );
};
