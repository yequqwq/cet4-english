import { useState, useEffect, useCallback, useRef } from 'react';
import { Gamepad2, RotateCcw, Check, X, Volume2, Zap, BookMarked, AlertCircle, Star, Target } from 'lucide-react';
import { words } from '../data/words';
import { useAppStore } from '../store/useAppStore';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

type GameType = 'matching' | 'spelling' | 'whackamole';

// 音效生成Hook
const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSuccess = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [getAudioContext]);

  const playError = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [getAudioContext]);

  const playClick = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [getAudioContext]);

  const playMatch = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);
      oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.08);
      oscillator.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.16);
      
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [getAudioContext]);

  const playWhack = useCallback((isCorrect: boolean) => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      if (isCorrect) {
        oscillator.frequency.setValueAtTime(880, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
      } else {
        oscillator.frequency.setValueAtTime(220, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      }
      
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [getAudioContext]);

  return { playSuccess, playError, playClick, playMatch, playWhack };
};

const gameLabels = {
  matching: '单词消消乐',
  spelling: '拼写挑战',
  whackamole: '听力打地鼠',
};

export const Games = () => {
  const [selectedGame, setSelectedGame] = useState<GameType>('matching');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [useWrongBook, setUseWrongBook] = useState(false);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const { wrongBook } = useAppStore();
  const { speak } = useAudioPlayer();
  const { playSuccess, playError, playClick, playMatch } = useSoundEffects();

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('finished');
            playError();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft, playError]);

  useEffect(() => {
    if (showCombo) {
      const timer = setTimeout(() => setShowCombo(false), 500);
      return () => clearTimeout(timer);
    }
  }, [showCombo]);

  const handleStartGame = () => {
    playClick();
    setScore(0);
    setTimeLeft(60);
    setCombo(0);
    setGameState('playing');
  };

  const handleResetGame = () => {
    playClick();
    setScore(0);
    setTimeLeft(60);
    setCombo(0);
    setGameState('idle');
  };

  // 获取游戏使用的单词
  const getGameWords = useCallback(() => {
    if (useWrongBook && wrongBook.length > 0) {
      return wrongBook
        .map(id => words.find(w => w.id === id))
        .filter(Boolean) as typeof words;
    }
    return words;
  }, [useWrongBook, wrongBook]);

  return (
    <div className="min-h-screen pb-24 md:pb-0 animate-fade-in-up">
      <header className="p-6 mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">互动游戏</h1>

        {/* 错题本模式切换 */}
        {wrongBook.length > 0 && selectedGame === 'matching' && gameState === 'idle' && (
          <div className="mb-4 flex items-center gap-4">
            <button
              onClick={() => setUseWrongBook(!useWrongBook)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                useWrongBook
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">
                {useWrongBook ? `错题本模式 (${wrongBook.length}个单词)` : '使用全部单词'}
              </span>
            </button>
          </div>
        )}

        <div className="flex gap-2">
          {(Object.keys(gameLabels) as GameType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedGame(type);
                handleResetGame();
              }}
              className={`px-4 py-2 rounded-full transition-all ${selectedGame === type ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
              {gameLabels[type]}
            </button>
          ))}
        </div>
      </header>

      {selectedGame === 'matching' && <MatchingGame score={score} setScore={setScore} gameState={gameState} onStart={handleStartGame} onReset={handleResetGame} gameWords={getGameWords()} wrongBookMode={useWrongBook} combo={combo} setCombo={setCombo} setShowCombo={setShowCombo} />}
      {selectedGame === 'spelling' && <SpellingGame score={score} setScore={setScore} gameState={gameState} onStart={handleStartGame} onReset={handleResetGame} gameWords={getGameWords()} wrongBookMode={useWrongBook} />}
      {selectedGame === 'whackamole' && <WhackamoleGame score={score} setScore={setScore} gameState={gameState} onStart={handleStartGame} onReset={handleResetGame} gameWords={getGameWords()} wrongBookMode={useWrongBook} />}

      {gameState === 'playing' && (
        <div className="fixed top-4 right-4 glass-card px-6 py-3 flex items-center gap-6 z-50">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
            <span className="text-2xl font-bold text-white">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-red-400" />
            <span className="text-xl font-bold text-white">{timeLeft}s</span>
          </div>
          {combo > 1 && (
            <div className="flex items-center gap-1 animate-bounce">
              <Star className="w-5 h-5 text-orange-400" />
              <span className="text-lg font-bold text-orange-400">{combo}连击</span>
            </div>
          )}
        </div>
      )}

      {gameState === 'finished' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="glass-card p-8 text-center max-w-md mx-4">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
              <Gamepad2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">游戏结束！</h2>
            <p className="text-white/70 mb-4">你的得分</p>
            <div className="text-5xl font-bold text-white mb-6">{score}</div>
            <div className="flex gap-4 justify-center">
              <button onClick={handleResetGame} className="btn-secondary">
                返回
              </button>
              <button onClick={handleStartGame} className="btn-primary">
                再玩一次
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface MatchingGameProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  gameState: 'idle' | 'playing' | 'finished';
  onStart: () => void;
  onReset: () => void;
  gameWords: typeof words;
  wrongBookMode: boolean;
  combo: number;
  setCombo: React.Dispatch<React.SetStateAction<number>>;
  setShowCombo: React.Dispatch<React.SetStateAction<boolean>>;
}

// 关卡配置：每个关卡16个单词
const TOTAL_LEVELS = 50;
const WORDS_PER_LEVEL = 16;

const MatchingGame = ({ score, setScore, gameState, onStart, onReset, gameWords, wrongBookMode, combo, setCombo, setShowCombo }: MatchingGameProps) => {
  const [cards, setCards] = useState<{ id: string; text: string; type: 'word' | 'meaning'; matched: boolean; animating: string }[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0); // 已完成的配对数
  const [wrongAttempts, setWrongAttempts] = useState(0); // 当前关卡错误次数
  const [levelBestScore, setLevelBestScore] = useState<number[]>([]); // 每关最佳分数
  const { playMatch, playError, playSuccess } = useSoundEffects();

  // 打乱单词顺序（确保每关体验不同）
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 初始化关卡
  const initLevel = useCallback((level: number) => {
    const availableWords = gameWords.length >= WORDS_PER_LEVEL ? gameWords : words;
    // 根据关卡数选择不同的单词起始位置（循环）
    const startIndex = ((level - 1) * WORDS_PER_LEVEL) % availableWords.length;
    const selectedWords: typeof words = [];

    for (let i = 0; i < WORDS_PER_LEVEL; i++) {
      const index = (startIndex + i) % availableWords.length;
      selectedWords.push(availableWords[index]);
    }

    // 再次打乱确保每关体验不同
    const shuffledWords = shuffleArray(selectedWords);

    const gameCards = [
      ...shuffledWords.map((w) => ({ id: `word-${w.id}`, text: w.word, type: 'word' as const, matched: false, animating: '' })),
      ...shuffledWords.map((w) => ({ id: `meaning-${w.id}`, text: w.meaning.split('；')[0], type: 'meaning' as const, matched: false, animating: '' })),
    ];

    setCards(shuffleArray(gameCards));
    setSelectedCards([]);
    setLevelProgress(0);
    setWrongAttempts(0);
  }, [gameWords]);

  // 开始游戏
  useEffect(() => {
    if (gameState === 'playing') {
      initLevel(currentLevel);
    }
  }, [gameState, currentLevel, initLevel]);

  // 处理卡牌点击
  const handleCardClick = (cardId: string) => {
    if (selectedCards.length >= 2) return;
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.matched || card.animating || selectedCards.includes(cardId)) return;

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [firstId, secondId] = newSelected;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (
        firstCard &&
        secondCard &&
        firstCard.type !== secondCard.type &&
        firstCard.id.split('-')[1] === secondCard.id.split('-')[1]
      ) {
        // 匹配成功
        playMatch();
        const newCombo = combo + 1;
        setCombo(newCombo);
        setShowCombo(true);
        const bonusPoints = newCombo > 1 ? 10 + newCombo * 2 : 10;

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, matched: true, animating: 'success' }
                : c
            )
          );
          setTimeout(() => {
            setCards((prev) =>
              prev.filter((c) => c.id !== firstId && c.id !== secondId)
            );
            setSelectedCards([]);
            setScore((prev) => prev + bonusPoints);
            setLevelProgress((prev) => prev + 1);
          }, 300);
        }, 200);
      } else {
        // 匹配失败 - 错了重来
        playError();
        setCombo(0);
        const newWrongAttempts = wrongAttempts + 1;
        setWrongAttempts(newWrongAttempts);

        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, animating: 'shake' }
              : c
          )
        );

        setTimeout(() => {
          // 重置当前关卡
          initLevel(currentLevel);
        }, 600);
      }
    }
  };

  // 检查是否通关
  useEffect(() => {
    if (levelProgress >= WORDS_PER_LEVEL && cards.length === 0 && gameState === 'playing') {
      // 通关了！
      playSuccess();
      const newBestScores = [...levelBestScore];
      const levelIndex = currentLevel - 1;
      if (!newBestScores[levelIndex] || score > newBestScores[levelIndex]) {
        newBestScores[levelIndex] = score;
        setLevelBestScore(newBestScores);
      }

      if (currentLevel < TOTAL_LEVELS) {
        // 进入下一关
        setTimeout(() => {
          setCurrentLevel((prev) => prev + 1);
          setScore((prev) => prev + 50); // 通关奖励
        }, 1000);
      } else {
        // 全部通关
        setTimeout(() => {
          setGameState('finished');
        }, 1000);
      }
    }
  }, [levelProgress, cards.length, gameState, currentLevel, score, playSuccess]);

  const setGameState = (state: 'idle' | 'playing' | 'finished') => {
    // 这个会在父组件中处理
  };

  // 空闲状态界面
  if (gameState === 'idle') {
    return (
      <section className="px-6">
        <div className="glass-card p-8 text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold text-white mb-2">单词消消乐</h2>
          <p className="text-white/70 mb-4">每个关卡16个单词，匹配成功即通关</p>
          <p className="text-white/50 mb-6 text-sm">注意：匹配错误将重试当前关卡！</p>

          {wrongBookMode && (
            <div className="mb-4 flex items-center justify-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>正在使用错题本单词</span>
            </div>
          )}

          {/* 关卡选择 */}
          <div className="grid grid-cols-5 gap-2 mb-6 max-h-48 overflow-y-auto">
            {Array.from({ length: Math.min(25, TOTAL_LEVELS) }, (_, i) => i + 1).map((level) => (
              <button
                key={level}
                onClick={() => {
                  setCurrentLevel(level);
                  onStart();
                }}
                className={`py-2 px-3 rounded-lg font-bold transition-all ${
                  level === currentLevel
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                    : levelBestScore[level - 1]
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {levelBestScore[level - 1] ? '⭐' : ''}{level}
              </button>
            ))}
          </div>
          {TOTAL_LEVELS > 25 && (
            <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
              {Array.from({ length: TOTAL_LEVELS - 25 }, (_, i) => i + 26).map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setCurrentLevel(level);
                    onStart();
                  }}
                  className={`py-2 px-3 rounded-lg font-bold transition-all ${
                    level === currentLevel
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                      : levelBestScore[level - 1]
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {levelBestScore[level - 1] ? '⭐' : ''}{level}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => {
                setCurrentLevel(1);
                onStart();
              }}
              className="btn-primary"
            >
              从第1关开始
            </button>
            <button
              onClick={() => {
                onStart();
              }}
              className="btn-secondary"
            >
              继续第{currentLevel}关
            </button>
          </div>

          {levelBestScore.length > 0 && (
            <div className="mt-4 text-white/50 text-sm">
              已通关: {levelBestScore.filter(Boolean).length}/{TOTAL_LEVELS} 关
            </div>
          )}
        </div>
      </section>
    );
  }

  // 游戏进行中
  return (
    <section className="px-6">
      {/* 关卡进度条 */}
      <div className="glass-card p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">第 {currentLevel} 关</span>
            {wrongAttempts > 0 && (
              <span className="text-red-400 text-sm">
                ❌ 错误: {wrongAttempts}次
              </span>
            )}
          </div>
          <div className="text-white/70 text-sm">
            进度: {levelProgress}/{WORDS_PER_LEVEL}
          </div>
        </div>
        {/* 进度条 */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300"
            style={{ width: `${(levelProgress / WORDS_PER_LEVEL) * 100}%` }}
          />
        </div>
      </div>

      <div className="glass-card p-4">
        {cards.length === 0 && levelProgress < WORDS_PER_LEVEL ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 animate-bounce">⏳</div>
            <p className="text-white/70">加载中...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-2xl font-bold text-white mb-2">第 {currentLevel} 关通关！</p>
            <p className="text-white/70 mb-4">+50 通关奖励</p>
            {currentLevel < TOTAL_LEVELS ? (
              <p className="text-white/50">即将进入第 {currentLevel + 1} 关...</p>
            ) : (
              <p className="text-white/50">恭喜！全部通关！</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.matched || card.animating === 'success'}
                className={`aspect-square rounded-lg flex items-center justify-center text-center p-1 transition-all relative overflow-hidden ${
                  card.animating === 'success'
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/50 animate-match-success'
                    : card.animating === 'shake'
                    ? 'bg-gradient-to-r from-red-400 to-rose-500 shadow-lg shadow-red-500/50 animate-shake'
                    : card.matched
                    ? 'bg-green-500/30 opacity-50'
                    : selectedCards.includes(card.id)
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white scale-110 shadow-lg shadow-primary-500/50 animate-pulse'
                    : 'bg-gradient-to-br from-white/15 to-white/5 text-white hover:from-white/25 hover:to-white/15 hover:scale-105 hover:shadow-lg'
                }`}
              >
                <span className={`text-xs font-medium relative z-10 ${card.animating === 'success' || card.animating === 'shake' ? 'text-white' : ''}`}>
                  {card.text.length > 8 ? card.text.slice(0, 6) + '..' : card.text}
                </span>
                {card.animating === 'success' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-6 h-6 text-white animate-bounce-in" />
                  </div>
                )}
                {card.animating === 'shake' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <X className="w-6 h-6 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 底部提示 */}
      <div className="mt-4 text-center text-white/40 text-sm">
        点击单词和释义进行匹配 · 匹配错误将重试当前关卡
      </div>
    </section>
  );
};

interface SpellingGameProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  gameState: 'idle' | 'playing' | 'finished';
  onStart: () => void;
  onReset: () => void;
  gameWords: typeof words;
  wrongBookMode: boolean;
}

const SpellingGame = ({ score, setScore, gameState, onStart, onReset, gameWords, wrongBookMode }: SpellingGameProps) => {
  const [currentWord, setCurrentWord] = useState('');
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const { playSuccess, playError, playClick } = useSoundEffects();

  const initRound = useCallback(() => {
    const availableWords = gameWords.length > 0 ? gameWords : words;
    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(word.word);
    const letters = word.word.split('').sort(() => Math.random() - 0.5);
    setShuffledLetters(letters);
    setAnswer([]);
    setFeedback(null);
  }, [gameWords]);

  useEffect(() => {
    if (gameState === 'playing') {
      initRound();
    }
  }, [gameState, initRound]);

  const handleLetterClick = (letter: string, index: number) => {
    if (feedback) return;
    playClick();
    const newLetters = [...shuffledLetters];
    newLetters.splice(index, 1);
    setShuffledLetters(newLetters);
    setAnswer([...answer, letter]);
  };

  const handleBackspace = () => {
    if (answer.length === 0 || feedback) return;
    playClick();
    const letter = answer[answer.length - 1];
    setAnswer(answer.slice(0, -1));
    setShuffledLetters([...shuffledLetters, letter]);
  };

  const handleSubmit = () => {
    if (answer.join('') === currentWord) {
      playSuccess();
      setFeedback('correct');
      setScore((prev) => prev + 10);
      setTimeout(() => {
        initRound();
      }, 1500);
    } else {
      playError();
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setAnswer([]);
        setShuffledLetters(currentWord.split('').sort(() => Math.random() - 0.5));
      }, 1500);
    }
  };

  if (gameState === 'idle') {
    return (
      <section className="px-6">
        <div className="glass-card p-8 text-center">
          <Gamepad2 className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-4">拼写挑战</h2>
          {wrongBookMode && (
            <div className="mb-4 flex items-center justify-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>正在使用错题本单词</span>
            </div>
          )}
          <p className="text-white/70 mb-6">点击字母拼出正确的单词！</p>
          <button onClick={onStart} className="btn-primary">
            开始游戏
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6">
      <div className="glass-card p-6">
        <div className="text-center mb-6">
          <p className="text-white/70 mb-4 text-lg">请拼出单词</p>
          <div className="flex justify-center gap-3">
            {answer.map((letter, index) => (
              <div
                key={index}
                className={`w-14 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg transition-all ${
                  feedback === 'correct'
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-bounce-in scale-110'
                    : feedback === 'wrong'
                    ? 'bg-gradient-to-r from-red-400 to-rose-500 animate-shake'
                    : 'bg-gradient-to-r from-primary-500 to-accent-500'
                }`}
              >
                {letter}
              </div>
            ))}
            {currentWord.length - answer.length > 0 &&
              Array.from({ length: currentWord.length - answer.length }).map((_, i) => (
                <div key={i} className="w-14 h-16 rounded-xl bg-white/5 border-2 border-dashed border-white/20" />
              ))}
          </div>
          <button onClick={handleBackspace} disabled={answer.length === 0} className="mt-6 px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all">
            ← 删除
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {shuffledLetters.map((letter, index) => (
            <button
              key={index}
              onClick={() => handleLetterClick(letter, index)}
              disabled={feedback !== null}
              className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/20 to-white/5 text-white text-2xl font-bold hover:from-white/30 hover:to-white/10 transition-all hover:scale-110 hover:shadow-lg active:scale-95"
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button onClick={handleSubmit} disabled={answer.length !== currentWord.length} className={`px-8 py-3 rounded-xl font-bold transition-all ${
            answer.length === currentWord.length
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50'
              : 'bg-white/10 text-white/50 cursor-not-allowed'
          }`}>
            确认答案
          </button>
        </div>

        {feedback && (
          <div className={`mt-6 text-center text-xl font-bold ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
            {feedback === 'correct' ? '🎉 太棒了！' : '❌ 再试一次'}
          </div>
        )}
      </div>
    </section>
  );
};

interface WhackamoleGameProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  gameState: 'idle' | 'playing' | 'finished';
  onStart: () => void;
  onReset: () => void;
  gameWords: typeof words;
  wrongBookMode: boolean;
}

const WhackamoleGame = ({ score, setScore, gameState, onStart, onReset, gameWords, wrongBookMode }: WhackamoleGameProps) => {
  const [holes, setHoles] = useState<{ word: string; active: boolean; correct: boolean; animating: string }[]>([]);
  const [targetWord, setTargetWord] = useState('');
  const { playWhack } = useSoundEffects();
  const { speak } = useAudioPlayer();

  const initGame = useCallback(() => {
    const availableWords = gameWords.length > 0 ? gameWords : words;
    const newHoles = Array(9).fill(null).map(() => ({
      word: availableWords[Math.floor(Math.random() * availableWords.length)].word,
      active: false,
      correct: false,
      animating: '',
    }));
    setHoles(newHoles);
    const target = availableWords[Math.floor(Math.random() * availableWords.length)];
    setTargetWord(target.word);

    speak(target.word);

    setTimeout(() => {
      const activeIndices = new Set<number>();
      while (activeIndices.size < 3) {
        activeIndices.add(Math.floor(Math.random() * 9));
      }
      setHoles((prev) =>
        prev.map((hole, index) => ({
          ...hole,
          active: activeIndices.has(index),
          correct: activeIndices.has(index) && hole.word === targetWord,
        }))
      );
    }, 500);
  }, [gameWords, targetWord, speak]);

  useEffect(() => {
    if (gameState === 'playing') {
      initGame();
    }
  }, [gameState, initGame]);

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        initGame();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [gameState, initGame]);

  const handleWhack = (index: number) => {
    const hole = holes[index];
    if (!hole.active || hole.animating) return;

    const isCorrect = hole.word === targetWord;
    playWhack(isCorrect);

    setHoles((prev) =>
      prev.map((h, i) =>
        i === index ? { ...h, animating: isCorrect ? 'correct' : 'wrong' } : h
      )
    );

    if (isCorrect) {
      setScore((prev) => prev + 15);
      setTimeout(() => {
        setHoles((prev) =>
          prev.map((h, i) =>
            i === index ? { ...h, active: false, animating: '' } : h
          )
        );
      }, 500);
    } else {
      setTimeout(() => {
        setHoles((prev) =>
          prev.map((h, i) => ({ ...h, animating: '' }))
        );
      }, 500);
    }
  };

  if (gameState === 'idle') {
    return (
      <section className="px-6">
        <div className="glass-card p-8 text-center">
          <Gamepad2 className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-4">听力打地鼠</h2>
          {wrongBookMode && (
            <div className="mb-4 flex items-center justify-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>正在使用错题本单词</span>
            </div>
          )}
          <p className="text-white/70 mb-6">听发音，点击正确的单词！</p>
          <button onClick={onStart} className="btn-primary">
            开始游戏
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6">
      <div className="glass-card p-6">
        <div className="text-center mb-6">
          <p className="text-white/70 mb-4">听发音，点击正确的单词</p>
          <button
            onClick={() => {
              const utterance = new SpeechSynthesisUtterance(targetWord);
              speechSynthesis.speak(utterance);
            }}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-white hover:shadow-lg hover:shadow-primary-500/50 transition-all"
          >
            <Volume2 className="w-5 h-5" />
            <span className="font-medium">播放发音</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {holes.map((hole, index) => (
            <button
              key={index}
              onClick={() => handleWhack(index)}
              className={`aspect-square rounded-2xl flex items-center justify-center transition-all relative overflow-hidden ${
                hole.animating === 'correct'
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/50 animate-bounce-in'
                  : hole.animating === 'wrong'
                  ? 'bg-gradient-to-r from-red-400 to-rose-500 shadow-lg shadow-red-500/50 animate-shake'
                  : hole.active
                  ? 'bg-gradient-to-br from-amber-400/80 to-orange-500/80 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/30 hover:scale-105 animate-pulse'
                  : 'bg-gradient-to-br from-gray-700/50 to-gray-800/50'
              }`}
            >
              {hole.active && !hole.animating && (
                <div className="text-center">
                  <span className="text-white font-english font-bold text-lg">{hole.word}</span>
                </div>
              )}
              {hole.animating === 'correct' && (
                <div className="flex flex-col items-center">
                  <Check className="w-14 h-14 text-white" />
                  <span className="text-white text-sm mt-1">正确!</span>
                </div>
              )}
              {hole.animating === 'wrong' && (
                <div className="flex flex-col items-center">
                  <X className="w-14 h-14 text-white" />
                  <span className="text-white text-sm mt-1">错误</span>
                </div>
              )}
              {!hole.active && !hole.animating && (
                <div className="w-3 h-3 rounded-full bg-gray-600/50" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};