import { useState, useEffect, useCallback } from 'react';
import { Volume2, ThumbsUp, ThumbsDown, RotateCcw, Check } from 'lucide-react';
import type { Word } from '../data/words';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface FlipCardProps {
  word: Word;
  onNext: () => void;
  onPrev: () => void;
  onMasteryChange: (mastery: number) => void;
  onMarkWrong: () => void;
  currentMastery: number;
}

export const FlipCard = ({ word, onNext, onPrev, onMasteryChange, onMarkWrong, currentMastery }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [feedback, setFeedback] = useState<'know' | 'dontknow' | null>(null);
  const { playWord, playExample, cancelCurrentAudio } = useAudioPlayer();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    setIsFlipped(false);
    setFeedback(null);
    cancelCurrentAudio();
    setTimeout(() => {
      playWord(word.word);
    }, 100);

    return () => {
      cancelCurrentAudio();
    };
  }, [word, playWord, cancelCurrentAudio]);

  const handleKnow = useCallback(async () => {
    setFeedback('know');
    await playWord(word.word);
    setTimeout(() => {
      setFeedback(null);
      const newMastery = Math.min(5, currentMastery + 1);
      onMasteryChange(newMastery);
      onNext();
    }, 300);
  }, [word.word, currentMastery, playWord, onMasteryChange, onNext]);

  const handleDontKnow = useCallback(async () => {
    setFeedback('dontknow');
    await playExample(word.example);
    setTimeout(() => {
      setFeedback(null);
      onMarkWrong();
      onNext();
    }, 300);
  }, [word.example, playExample, onMarkWrong, onNext]);

  const handleNextDirect = useCallback(() => {
    cancelCurrentAudio();
    onNext();
  }, [cancelCurrentAudio, onNext]);

  const handlePrevDirect = useCallback(() => {
    cancelCurrentAudio();
    onPrev();
  }, [cancelCurrentAudio, onPrev]);

  return (
    <div className="w-full max-w-md mx-auto">
      {feedback && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none transition-all duration-300 ${feedback === 'know' ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
          <div className={`text-9xl animate-bounce-in ${feedback === 'know' ? 'text-green-400' : 'text-red-400'}`}>
            {feedback === 'know' ? <Check className="w-32 h-32" /> : <span className="text-6xl">🔊</span>}
          </div>
          <p className={`absolute bottom-1/3 text-2xl font-bold ${feedback === 'know' ? 'text-green-400' : 'text-red-400'}`}>
            {feedback === 'know' ? '太棒了！' : '播放例句中...'}
          </p>
        </div>
      )}

      <div
        className={`flip-card cursor-pointer h-80 ${isFlipped ? 'flipped' : ''} transition-all duration-300 ${feedback === 'know' ? 'scale-105 shadow-green-500/50' : feedback === 'dontknow' ? 'animate-shake shadow-red-500/50' : ''}`}
        onClick={handleFlip}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front glass-card flex flex-col items-center justify-center p-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playWord(word.word);
              }}
              className="mb-4 p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all hover:scale-110 active:scale-95"
            >
              <Volume2 className="w-6 h-6 text-white" />
            </button>
            <h2 className="text-4xl font-bold text-white mb-2 font-english">{word.word}</h2>
            <p className="text-lg text-white/70 mb-4">{word.phonetic}</p>
            <p className="text-sm text-white/50 mt-auto">点击卡片查看释义</p>
          </div>
          <div className="flip-card-back glass-card flex flex-col items-center justify-center p-8 bg-gradient-to-br from-accent-500/30 to-primary-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">释义</h3>
            <p className="text-lg text-white mb-6 text-center">{word.meaning}</p>
            <div className="w-full space-y-3">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-white/60">例句</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playExample(word.example);
                    }}
                    className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white transition-all"
                    title="播放例句"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-white/90 italic">{word.example}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm text-white/60 mb-1">近义词</p>
                <p className="text-white/90">{word.synonyms}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm text-white/60 mb-1">记忆技巧</p>
                <p className="text-white/90">{word.tip}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevDirect();
          }}
          className="btn-secondary flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          上一个
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDontKnow();
          }}
          className="px-8 py-4 bg-gradient-to-r from-red-500/30 to-red-600/30 border-2 border-red-500/50 text-red-300 font-bold rounded-2xl hover:from-red-500/40 hover:to-red-600/40 hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg"
        >
          <ThumbsDown className="w-6 h-6" />
          不认识
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleKnow();
          }}
          className="px-8 py-4 bg-gradient-to-r from-green-500/30 to-green-600/30 border-2 border-green-500/50 text-green-300 font-bold rounded-2xl hover:from-green-500/40 hover:to-green-600/40 hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg shadow-lg shadow-green-500/20"
        >
          <ThumbsUp className="w-6 h-6" />
          认识
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNextDirect();
          }}
          className="btn-secondary"
        >
          下一个
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              level <= currentMastery
                ? 'bg-gradient-to-r from-accent-500 to-primary-500'
                : 'bg-white/20'
            }`}
          />
        ))}
        <span className="ml-2 text-white/50 text-sm">掌握程度</span>
      </div>
    </div>
  );
};