import { useState, useCallback } from 'react';
import {
  Volume2,
  RefreshCw,
  Eye,
  CheckCircle,
  BookMarked,
  Shuffle,
  SkipForward,
  ArrowRightLeft,
  Languages,
  ChevronLeft,
  ChevronRight,
  Star,
  AlertCircle,
} from 'lucide-react';
import { translationSentences } from '../data/translationSentences';
import { useAppStore } from '../store/useAppStore';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

type TranslationMode = 'e2c' | 'c2e';

export const Translation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndices, setPreviousIndices] = useState<number[]>([]);
  const [userTranslation, setUserTranslation] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({ completed: 0, revealed: 0 });
  const [mode, setMode] = useState<TranslationMode>('e2c');
  const [addedWord, setAddedWord] = useState<string | null>(null);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const { addToTranslationWrongBook, translationWrongBook } =
    useAppStore();
  const { speak } = useAudioPlayer();

  const currentSentence = translationSentences[currentIndex];

  const toggleMode = () => {
    setMode((prev) => (prev === 'e2c' ? 'c2e' : 'e2c'));
    setUserTranslation('');
    setShowAnswer(false);
  };

  const playSentence = useCallback(() => {
    const textToPlay = mode === 'e2c' ? currentSentence.english : currentSentence.chinese;
    speak(textToPlay, {
      lang: mode === 'e2c' ? 'en-US' : 'zh-CN',
      rate: mode === 'e2c' ? 0.7 : 0.9,
    });
  }, [currentSentence, mode, speak]);

  // 保存当前索引到历史
  const saveToHistory = (currentIdx: number) => {
    setPreviousIndices((prev) => [...prev, currentIdx]);
  };

  // 随机跳转到另一个句子
  const randomNext = useCallback(() => {
    saveToHistory(currentIndex);
    const randomIndex = Math.floor(Math.random() * translationSentences.length);
    setCurrentIndex(randomIndex);
    setUserTranslation('');
    setShowAnswer(false);
  }, [currentIndex]);

  // 下一个句子
  const nextSentence = useCallback(() => {
    saveToHistory(currentIndex);
    setCurrentIndex((prev) => (prev + 1) % translationSentences.length);
    setUserTranslation('');
    setShowAnswer(false);
    setSessionStats((prev) => ({ ...prev, completed: prev.completed + 1 }));
  }, [currentIndex]);

  // 上一句
  const previousSentence = useCallback(() => {
    if (previousIndices.length > 0) {
      const prevIndex = previousIndices[previousIndices.length - 1];
      setPreviousIndices((prev) => prev.slice(0, -1));
      setCurrentIndex(prevIndex);
      setUserTranslation('');
      setShowAnswer(false);
    }
  }, [previousIndices]);

  // 跳过（不计入统计）
  const skipSentence = useCallback(() => {
    saveToHistory(currentIndex);
    setCurrentIndex((prev) => (prev + 1) % translationSentences.length);
    setUserTranslation('');
    setShowAnswer(false);
  }, [currentIndex]);

  // 显示答案
  const handleShowAnswer = () => {
    setShowAnswer(true);
    setSessionStats((prev) => ({ ...prev, revealed: prev.revealed + 1 }));
  };

  // 点击单词加入翻译错题本
  const handleWordClick = (word: string) => {
    const wordLower = word.toLowerCase().trim();
    if (wordLower && !translationWrongBook.includes(wordLower)) {
      addToTranslationWrongBook(wordLower);
      setAddedWord(wordLower);
      setShowAddedToast(true);
      setTimeout(() => {
        setShowAddedToast(false);
        setAddedWord(null);
      }, 2000);
    } else if (translationWrongBook.includes(wordLower)) {
      // 已在错题本中
      setAddedWord(wordLower);
      setShowAddedToast(true);
      setTimeout(() => {
        setShowAddedToast(false);
        setAddedWord(null);
      }, 2000);
    }
  };

  // 将英文句子分割成可点击的单词
  const renderClickableEnglish = () => {
    const words = currentSentence.english.split(/\s+/);
    return words.map((word, index) => {
      const cleanWord = word.replace(/[^a-zA-Z'-]/g, '');
      const isAdded = addedWord && cleanWord.toLowerCase() === addedWord.toLowerCase();

      return (
        <span key={index}>
          <button
            onClick={() => handleWordClick(cleanWord)}
            className={`px-1 py-0.5 rounded transition-all duration-200 hover:scale-110 ${
              isAdded
                ? 'bg-green-500/50 text-green-300 animate-pulse'
                : translationWrongBook.includes(cleanWord.toLowerCase())
                  ? 'bg-red-500/40 text-red-300 hover:bg-red-500/50'
                  : 'hover:bg-red-500/30 hover:text-red-300'
            }`}
            title={
              translationWrongBook.includes(cleanWord.toLowerCase())
                ? '已在错题本中，点击重新添加'
                : '点击加入错题本'
            }
          >
            {word}
          </button>{' '}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 animate-fade-in-up">
      {/* 错题本添加成功提示 */}
      {showAddedToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              {translationWrongBook.includes(addedWord || '') && addedWord
                ? '已在翻译错题本中'
                : `"${addedWord}" 已加入翻译错题本`}
            </span>
          </div>
        </div>
      )}

      <header className="p-6 mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">翻译练习</h1>
        <p className="text-white/70">六级/考研长难句翻译训练，点击单词可加入翻译错题本</p>

        {/* 翻译错题本入口 */}
        {translationWrongBook.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-red-400" />
              <span className="text-red-300">
                翻译错题本中有 {translationWrongBook.length} 个单词
              </span>
            </div>
          </div>
        )}
      </header>

      <section className="px-6 mb-6">
        {/* 学习进度统计 */}
        <div className="glass-card p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white/70">已完成</span>
              <span className="text-white font-bold">{sessionStats.completed}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-yellow-400" />
              <span className="text-white/70">查看答案</span>
              <span className="text-white font-bold">{sessionStats.revealed}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-red-400" />
              <span className="text-white/70">翻译错题</span>
              <span className="text-white font-bold">{translationWrongBook.length}</span>
            </div>
          </div>
          <div className="text-white/50 text-sm">共 {translationSentences.length} 个句子</div>
        </div>

        {/* 翻译模式切换 */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-white/70" />
              <span className="text-white/70">翻译模式：</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMode('e2c');
                  setUserTranslation('');
                  setShowAnswer(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === 'e2c'
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                英译中
              </button>
              <button
                onClick={() => {
                  setMode('c2e');
                  setUserTranslation('');
                  setShowAnswer(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === 'c2e'
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                中译英
              </button>
            </div>
          </div>
        </div>

        {/* 难度标签 */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentSentence.difficulty === 'cet6'
                ? 'bg-orange-500/30 text-orange-300'
                : 'bg-purple-500/30 text-purple-300'
            }`}
          >
            {currentSentence.difficulty === 'cet6' ? '六级难度' : '考研难度'}
          </span>
        </div>

        {/* 翻译内容区域 */}
        <div className="glass-card p-6 mb-6">
          {/* 英译中模式：显示英文 */}
          {mode === 'e2c' ? (
            <>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xl text-white leading-relaxed font-english">
                    {renderClickableEnglish()}
                  </p>
                </div>
                <button
                  onClick={playSentence}
                  className="ml-4 p-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full hover:scale-110 transition-transform flex-shrink-0"
                  title="播放句子"
                >
                  <Volume2 className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm mt-4 pt-4 border-t border-white/10">
                <AlertCircle className="w-4 h-4" />
                <span>点击不会的单词，将其加入错题本（红色高亮表示已添加）</span>
              </div>
            </>
          ) : (
            /* 中译英模式：显示中文 */
            <>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xl text-white leading-relaxed">{currentSentence.chinese}</p>
                </div>
                <button
                  onClick={playSentence}
                  className="ml-4 p-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full hover:scale-110 transition-transform flex-shrink-0"
                  title="播放句子"
                >
                  <Volume2 className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm mt-4 pt-4 border-t border-white/10">
                <ArrowRightLeft className="w-4 h-4" />
                <span>请将上述中文翻译成英文</span>
              </div>
            </>
          )}
        </div>

        {/* 用户翻译输入 */}
        <div className="glass-card p-6 mb-6">
          <label className="block text-white/70 mb-3">
            {mode === 'e2c' ? '请翻译上述英文句子：' : '请将中文翻译成英文：'}
          </label>
          <textarea
            value={userTranslation}
            onChange={(e) => setUserTranslation(e.target.value)}
            placeholder={
              mode === 'e2c' ? '在此输入你的中文翻译...' : 'Please translate into English...'
            }
            className="input-glow w-full h-32 resize-none text-white"
          />
        </div>

        {/* 导航按钮 - 上一句/下一句 */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={previousSentence}
            disabled={previousIndices.length === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              previousIndices.length === 0
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            上一题
          </button>
          <span className="text-white/50">
            {currentIndex + 1} / {translationSentences.length}
          </span>
          <button
            onClick={nextSentence}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-white/20 text-white hover:bg-white/30 transition-all"
          >
            下一题
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={playSentence} className="btn-secondary flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            播放
          </button>

          <button
            onClick={handleShowAnswer}
            disabled={showAnswer}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              showAnswer
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90 hover:-translate-y-1'
            }`}
          >
            <Eye className="w-5 h-5" />
            {showAnswer ? '已显示' : '查看答案'}
          </button>

          <button onClick={skipSentence} className="btn-secondary flex items-center gap-2">
            <SkipForward className="w-5 h-5" />
            跳过
          </button>

          <button
            onClick={randomNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 hover:-translate-y-1 transition-all"
          >
            <Shuffle className="w-5 h-5" />
            随机跳转
          </button>
        </div>

        {/* 答案显示 */}
        {showAnswer && (
          <div className="glass-card p-6 mt-6 border-2 border-green-500/50 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-bold text-green-400">参考答案</h3>
            </div>

            {/* 英译中模式：显示中文答案 */}
            {mode === 'e2c' ? (
              <div>
                <p className="text-sm text-white/50 mb-2">中文翻译：</p>
                <p className="text-white text-lg leading-relaxed">{currentSentence.chinese}</p>
              </div>
            ) : (
              /* 中译英模式：显示英文答案 */
              <div>
                <p className="text-sm text-white/50 mb-2">English Translation:</p>
                <p className="text-white text-lg leading-relaxed font-english">
                  {currentSentence.english}
                </p>
                <button
                  onClick={() => speak(currentSentence.english, { lang: 'en-US', rate: 0.7 })}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary-500/30 text-primary-300 rounded-lg hover:bg-primary-500/50 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  朗读答案
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 快速跳转难度 */}
      <section className="px-6 mb-8">
        <h3 className="text-lg font-bold text-white mb-4">快速跳转难度</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const indices = translationSentences
                .map((s, i) => (s.difficulty === 'cet6' ? i : -1))
                .filter((i) => i !== -1);
              if (indices.length > 0) {
                saveToHistory(currentIndex);
                const randomIdx = indices[Math.floor(Math.random() * indices.length)];
                setCurrentIndex(randomIdx);
                setUserTranslation('');
                setShowAnswer(false);
              }
            }}
            className="px-4 py-2 rounded-lg transition-all hover:-translate-y-1 bg-orange-500/30 text-orange-300 hover:bg-orange-500/40"
          >
            六级难度
          </button>
          <button
            onClick={() => {
              const indices = translationSentences
                .map((s, i) => (s.difficulty === 'kaoyan' ? i : -1))
                .filter((i) => i !== -1);
              if (indices.length > 0) {
                saveToHistory(currentIndex);
                const randomIdx = indices[Math.floor(Math.random() * indices.length)];
                setCurrentIndex(randomIdx);
                setUserTranslation('');
                setShowAnswer(false);
              }
            }}
            className="px-4 py-2 rounded-lg transition-all hover:-translate-y-1 bg-purple-500/30 text-purple-300 hover:bg-purple-500/40"
          >
            考研难度
          </button>
          <button
            onClick={randomNext}
            className="px-4 py-2 rounded-lg transition-all hover:-translate-y-1 bg-green-500/30 text-green-300 hover:bg-green-500/40"
          >
            随机混合
          </button>
        </div>
      </section>
    </div>
  );
};
