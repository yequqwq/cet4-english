import { useState, useEffect, useCallback } from 'react';
import { Gamepad2, RotateCcw, Check, X, Volume2, Zap, BookMarked, AlertCircle } from 'lucide-react';
import { words } from '../data/words';
import { useAppStore } from '../store/useAppStore';

type GameType = 'matching' | 'spelling' | 'whackamole';

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
  const { wrongBook } = useAppStore();

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft]);

  const handleStartGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
  };

  const handleResetGame = () => {
    setScore(0);
    setTimeLeft(60);
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

      {selectedGame === 'matching' && <MatchingGame score={score} setScore={setScore} gameState={gameState} onStart={handleStartGame} onReset={handleResetGame} gameWords={getGameWords()} wrongBookMode={useWrongBook} />}
      {selectedGame === 'spelling' && <SpellingGame score={score} setScore={setScore} gameState={gameState} onStart={handleStartGame} onReset={handleResetGame} gameWords={getGameWords()} wrongBookMode={useWrongBook} />}
      {selectedGame === 'whackamole' && <WhackamoleGame score={score} setScore={setScore} gameState={gameState} onStart={handleStartGame} onReset={handleResetGame} gameWords={getGameWords()} wrongBookMode={useWrongBook} />}

      {gameState === 'playing' && (
        <div className="fixed top-4 right-4 glass-card px-4 py-2 flex items-center gap-4 z-50">
          <div className="flex items-center gap-2 text-white/70">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-xl font-bold text-white">{score}</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <span className="text-xl font-bold">{timeLeft}s</span>
          </div>
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
}

const MatchingGame = ({ score, setScore, gameState, onStart, onReset, gameWords, wrongBookMode }: MatchingGameProps) => {
  const [cards, setCards] = useState<{ id: string; text: string; type: 'word' | 'meaning'; matched: boolean; animating: string }[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const initGame = useCallback(() => {
    const availableWords = gameWords.length >= 6 ? gameWords : words;
    const selectedWords = availableWords.slice(0, 6);
    const gameCards = [
      ...selectedWords.map((w) => ({ id: `word-${w.id}`, text: w.word, type: 'word' as const, matched: false, animating: '' })),
      ...selectedWords.map((w) => ({ id: `meaning-${w.id}`, text: w.meaning.split('；')[0], type: 'meaning' as const, matched: false, animating: '' })),
    ];
    setCards(gameCards.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
  }, [gameWords]);

  useEffect(() => {
    if (gameState === 'playing') {
      initGame();
    }
  }, [gameState, initGame]);

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
            setScore((prev) => prev + 10);
          }, 500);
        }, 300);
      } else {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, animating: 'shake' }
              : c
          )
        );
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => ({ ...c, animating: '' }))
          );
          setSelectedCards([]);
        }, 500);
      }
    }
  };

  if (gameState === 'idle') {
    return (
      <section className="px-6">
        <div className="glass-card p-8 text-center">
          <Gamepad2 className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-4">单词消消乐</h2>
          {wrongBookMode && (
            <div className="mb-4 flex items-center justify-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>正在使用错题本单词</span>
            </div>
          )}
          <p className="text-white/70 mb-6">点击匹配单词和释义，匹配成功得分！</p>
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
        {cards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70 mb-4">太棒了！所有单词都已消除！</p>
            <button onClick={onStart} className="btn-primary">
              再来一轮
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.matched || card.animating === 'success'}
                className={`aspect-square rounded-xl flex items-center justify-center text-center p-2 transition-all ${
                  card.animating === 'success'
                    ? 'animate-match-success'
                    : card.animating === 'shake'
                    ? 'animate-shake bg-red-500/30 border-red-500'
                    : card.matched
                    ? 'bg-green-500/30 opacity-50'
                    : selectedCards.includes(card.id)
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span className="text-sm font-medium">{card.text}</span>
                {card.matched && <Check className="w-6 h-6 text-green-400 absolute" />}
              </button>
            ))}
          </div>
        )}
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
    const newLetters = [...shuffledLetters];
    newLetters.splice(index, 1);
    setShuffledLetters(newLetters);
    setAnswer([...answer, letter]);
  };

  const handleBackspace = () => {
    if (answer.length === 0 || feedback) return;
    const letter = answer[answer.length - 1];
    setAnswer(answer.slice(0, -1));
    setShuffledLetters([...shuffledLetters, letter]);
  };

  const handleSubmit = () => {
    if (answer.join('') === currentWord) {
      setFeedback('correct');
      setScore((prev) => prev + 10);
      setTimeout(() => {
        initRound();
      }, 1500);
    } else {
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
          <p className="text-white/70 mb-2">请拼出单词</p>
          <div className="flex justify-center gap-2">
            {answer.map((letter, index) => (
              <div
                key={index}
                className={`w-10 h-12 rounded-lg flex items-center justify-center text-xl font-bold text-white ${
                  feedback === 'correct'
                    ? 'bg-green-500 animate-bounce-in'
                    : feedback === 'wrong'
                    ? 'bg-red-500 animate-shake'
                    : 'bg-gradient-to-r from-primary-500 to-accent-500'
                }`}
              >
                {letter}
              </div>
            ))}
            {currentWord.length - answer.length > 0 &&
              Array.from({ length: currentWord.length - answer.length }).map((_, i) => (
                <div key={i} className="w-10 h-12 rounded-lg bg-white/10 border border-white/20" />
              ))}
          </div>
          <button onClick={handleBackspace} disabled={answer.length === 0} className="mt-4 text-white/70 hover:text-white">
            删除最后一个字母
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {shuffledLetters.map((letter, index) => (
            <button
              key={index}
              onClick={() => handleLetterClick(letter, index)}
              disabled={feedback !== null}
              className="w-12 h-12 rounded-lg bg-white/10 text-white text-xl font-bold hover:bg-white/20 transition-all hover:scale-110"
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button onClick={handleSubmit} disabled={answer.length !== currentWord.length} className="btn-primary">
            确认
          </button>
        </div>

        {feedback && (
          <div className={`mt-4 text-center ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
            {feedback === 'correct' ? '✓ 正确！' : '✗ 错误，再试一次'}
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

    const utterance = new SpeechSynthesisUtterance(target.word);
    speechSynthesis.speak(utterance);

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
  }, [gameWords, targetWord]);

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
          <button
            onClick={() => {
              const utterance = new SpeechSynthesisUtterance(targetWord);
              speechSynthesis.speak(utterance);
            }}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-white/10 rounded-full text-white/70 hover:bg-white/20 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            播放发音
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {holes.map((hole, index) => (
            <button
              key={index}
              onClick={() => handleWhack(index)}
              className={`aspect-square rounded-xl flex items-center justify-center transition-all relative overflow-hidden ${
                hole.animating === 'correct'
                  ? 'bg-green-500/50 animate-bounce-in'
                  : hole.animating === 'wrong'
                  ? 'bg-red-500/50 animate-shake'
                  : hole.active
                  ? 'bg-gradient-to-b from-white/20 to-white/5 hover:scale-105'
                  : 'bg-white/5'
              }`}
            >
              {hole.active && !hole.animating && (
                <span className="text-white font-english font-bold">{hole.word}</span>
              )}
              {hole.animating === 'correct' && (
                <Check className="w-12 h-12 text-white" />
              )}
              {hole.animating === 'wrong' && (
                <X className="w-12 h-12 text-white" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};