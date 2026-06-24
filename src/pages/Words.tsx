import { useState, useEffect } from 'react';
import { Search, Filter, Grid3X3, List, Volume2, Play, Trophy, RotateCcw, BookMarked, ArrowLeft, Gauge } from 'lucide-react';
import { words, wordCategories, difficultyLevels, type Word } from '../data/words';
import { FlipCard } from '../components/FlipCard';
import { useAppStore } from '../store/useAppStore';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

type ViewMode = 'card' | 'list';
type StudyState = 'idle' | 'studying' | 'summary';

const WORDS_PER_GROUP = 20;

export const Words = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Word['category'] | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Word['difficulty'] | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [studyState, setStudyState] = useState<StudyState>('idle');
  const [studyGroup, setStudyGroup] = useState<Word[]>([]);
  const [sessionStats, setSessionStats] = useState({ known: 0, unknown: 0 });
  const [isReviewMode, setIsReviewMode] = useState(false);
  const { wordProgress, updateWordProgress, markWordWrong, updateTaskProgress, addHistoryRecord, addStudyTime, wrongBook, addToReviewSchedule } = useAppStore();
  const { speak } = useAudioPlayer();

  const filteredWords = words.filter((word) => {
    const matchesSearch =
      word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.meaning.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || word.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const currentWord = filteredWords[currentIndex];
  const currentMastery = currentWord ? wordProgress[currentWord.id]?.mastery || 0 : 0;

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, searchQuery]);

  // 检测是否是复习错题模式
  useEffect(() => {
    const isReview = localStorage.getItem('review_wrongbook');
    if (isReview === 'true') {
      setIsReviewMode(true);
      // 清空标记
      localStorage.removeItem('review_wrongbook');
      // 自动开始学习错题本单词
      setTimeout(() => {
        initWrongBookStudy();
      }, 100);
    }
  }, []);

  // 获取错题本单词
  const getWrongBookWords = () => {
    return wrongBook
      .map(id => words.find(w => w.id === id))
      .filter(Boolean) as Word[];
  };

  const initWrongBookStudy = () => {
    const wrongWords = getWrongBookWords();
    if (wrongWords.length > 0) {
      setStudyGroup(wrongWords);
      setCurrentIndex(0);
      setSessionStats({ known: 0, unknown: 0 });
      setStudyState('studying');
    }
  };

  const initStudyGroup = () => {
    if (isReviewMode) {
      initWrongBookStudy();
      return;
    }
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
    setStudyGroup(shuffled.slice(0, WORDS_PER_GROUP));
    setCurrentIndex(0);
    setSessionStats({ known: 0, unknown: 0 });
    setStudyState('studying');
  };

  const handleExitReview = () => {
    setIsReviewMode(false);
    setStudyState('idle');
    setStudyGroup([]);
  };

  const handleNext = () => {
    if (studyState === 'studying') {
      if (currentIndex < studyGroup.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setStudyState('summary');
        addStudyTime(Math.ceil(studyGroup.length * 1.5));
        addHistoryRecord({
          minutes: Math.ceil(studyGroup.length * 1.5),
          wordsLearned: sessionStats.known,
          wordsReviewed: studyGroup.length,
        });
        updateTaskProgress('1', sessionStats.known);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMasteryChange = (mastery: number) => {
    if (currentWord) {
      updateWordProgress(currentWord.id, mastery);
      setSessionStats((prev) => ({ ...prev, known: prev.known + 1 }));
      // 首次学习时添加到艾宾浩斯复习计划
      if (!wordProgress[currentWord.id] || wordProgress[currentWord.id].mastery === 0) {
        addToReviewSchedule(currentWord.id);
      }
    }
  };

  const handleMarkWrong = () => {
    if (currentWord) {
      markWordWrong(currentWord.id);
      setSessionStats((prev) => ({ ...prev, unknown: prev.unknown + 1 }));
    }
  };

  const handleRestart = () => {
    if (isReviewMode) {
      handleExitReview();
    } else {
      setStudyState('idle');
      setStudyGroup([]);
      setCurrentIndex(0);
      setSessionStats({ known: 0, unknown: 0 });
    }
  };

  const handleContinue = () => {
    if (isReviewMode) {
      initWrongBookStudy();
    } else {
      initStudyGroup();
    }
  };

  if (studyState === 'summary') {
    return (
      <div className="min-h-screen pb-24 md:pb-0 animate-fade-in-up flex items-center justify-center">
        <div className="glass-card p-8 max-w-md mx-4 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
            {isReviewMode ? <BookMarked className="w-12 h-12 text-white" /> : <Trophy className="w-12 h-12 text-white" />}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isReviewMode ? '错题复习完成！' : '本轮学习完成！'}
          </h2>
          <p className="text-white/70 mb-6">
            {isReviewMode ? `共复习 ${studyGroup.length} 个错题` : `共学习 ${studyGroup.length} 个单词`}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-500/20 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-400">{sessionStats.known}</div>
              <div className="text-white/70 text-sm">已掌握</div>
            </div>
            <div className="bg-red-500/20 rounded-xl p-4">
              <div className="text-3xl font-bold text-red-400">{sessionStats.unknown}</div>
              <div className="text-white/70 text-sm">还需努力</div>
            </div>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000"
              style={{ width: `${studyGroup.length > 0 ? (sessionStats.known / studyGroup.length) * 100 : 0}%` }}
            />
          </div>

          <div className="flex gap-4">
            <button onClick={handleRestart} className="btn-secondary flex-1">
              {isReviewMode ? '返回错题本' : '返回列表'}
            </button>
            <button onClick={handleContinue} className="btn-primary flex-1">
              继续学习
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0 animate-fade-in-up">
      <header className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">
            {isReviewMode ? '复习错题' : '单词学习'}
          </h1>
          {isReviewMode && (
            <button
              onClick={handleExitReview}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/70 hover:bg-white/20 rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              退出复习
            </button>
          )}
        </div>
        {isReviewMode && wrongBook.length > 0 && (
          <div className="glass-card p-4 mb-4 flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-orange-500/20">
            <BookMarked className="w-6 h-6 text-red-400" />
            <p className="text-white/90 flex-1">
              当前复习错题本中的 <span className="text-red-400 font-bold">{wrongBook.length}</span> 个单词
            </p>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="搜索单词或释义..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-glow pl-12"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('card')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'card' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <section className="px-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-5 h-5 text-white/70" />
          <span className="text-white/70">难度筛选</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedDifficulty('all')}
            className={`px-4 py-2 rounded-full transition-all ${selectedDifficulty === 'all' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            全部
          </button>
          {(Object.keys(difficultyLevels) as Word['difficulty'][]).map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedDifficulty === difficulty 
                  ? difficulty === 'cet4' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                    : difficulty === 'cet6'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {difficultyLevels[difficulty].label}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-white/70" />
          <span className="text-white/70">分类筛选</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full transition-all ${selectedCategory === 'all' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            全部
          </button>
          {(Object.keys(wordCategories) as Word['category'][]).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-all ${selectedCategory === category ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
              {wordCategories[category]}
            </button>
          ))}
        </div>
      </section>

      {studyState === 'idle' && !isReviewMode && (
        <section className="px-6 mb-6">
          <button
            onClick={initStudyGroup}
            className="w-full glass-card p-8 text-center card-hover"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">开始学习</h2>
            <p className="text-white/70">本次将学习 {Math.min(WORDS_PER_GROUP, filteredWords.length)} 个单词</p>
          </button>
        </section>
      )}

      {studyState === 'idle' && isReviewMode && (
        <section className="px-6 mb-6">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
              <BookMarked className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">错题复习模式</h2>
            <p className="text-white/70 mb-4">
              共 {wrongBook.length} 个错题等待复习
            </p>
            <button
              onClick={initWrongBookStudy}
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
            >
              开始复习
            </button>
          </div>
        </section>
      )}

      {viewMode === 'card' ? (
        <section className="px-6">
          {studyState === 'studying' && studyGroup.length > 0 ? (
            <>
              <div className="text-center text-white/70 mb-4">
                {currentIndex + 1} / {studyGroup.length}
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full progress-flow rounded-full transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / studyGroup.length) * 100}%` }}
                />
              </div>
              <FlipCard
                word={studyGroup[currentIndex]}
                onNext={handleNext}
                onPrev={handlePrev}
                onMasteryChange={handleMasteryChange}
                onMarkWrong={handleMarkWrong}
                currentMastery={wordProgress[studyGroup[currentIndex].id]?.mastery || 0}
              />
            </>
          ) : studyState === 'idle' && filteredWords.length > 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-white/70">选择分类或点击上方按钮开始学习</p>
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <p className="text-white/70">没有找到匹配的单词</p>
            </div>
          )}
        </section>
      ) : (
        <section className="px-6">
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-4 py-3 text-left text-white/70">单词</th>
                  <th className="px-4 py-3 text-left text-white/70">音标</th>
                  <th className="px-4 py-3 text-left text-white/70">释义</th>
                  <th className="px-4 py-3 text-left text-white/70">分类</th>
                  <th className="px-4 py-3 text-left text-white/70">掌握</th>
                </tr>
              </thead>
              <tbody>
                {filteredWords.map((word) => (
                  <tr key={word.id} className="border-b border-white/10 hover:bg-white/5 transition-all">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-english font-medium">{word.word}</span>
                        <button
                          onClick={() => speak(word.word)}
                          className="p-1 hover:bg-white/10 rounded"
                        >
                          <Volume2 className="w-4 h-4 text-white/50" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60">{word.phonetic}</td>
                    <td className="px-4 py-3 text-white/80">{word.meaning}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-white/10 rounded text-white/70 text-sm">
                        {wordCategories[word.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            onClick={() => updateWordProgress(word.id, level)}
                            className={`w-5 h-5 rounded transition-all ${
                              level <= (wordProgress[word.id]?.mastery || 0)
                                ? 'bg-gradient-to-r from-accent-500 to-primary-500'
                                : 'bg-white/20 hover:bg-white/30'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};