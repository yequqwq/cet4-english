import { useState } from 'react';
import { Play, Pause, RotateCcw, Check, X, Volume2 } from 'lucide-react';
import { listeningQuestions, getListeningByType } from '../data/listening';
import { useAppStore } from '../store/useAppStore';

type ListeningType = 'short' | 'long' | 'news';

const typeLabels = {
  short: '短对话',
  long: '长对话',
  news: '新闻听力',
};

export const Listening = () => {
  const [selectedType, setSelectedType] = useState<ListeningType>('short');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const { addWrongAnswer } = useAppStore();

  const questions = getListeningByType(selectedType);
  const currentQuestion = questions[currentIndex];

  const handlePlay = () => {
    if (currentQuestion) {
      const text = currentQuestion.audioText;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), text.length * 100);
    }
  };

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    if (selectedAnswer === currentQuestion.answer) {
      setScore(score + 1);
    } else {
      addWrongAnswer({
        type: 'listening',
        question: currentQuestion.question,
        userAnswer: currentQuestion.options[selectedAnswer],
        correctAnswer: currentQuestion.options[currentQuestion.answer],
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 animate-fade-in-up">
      <header className="p-6 mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">听力训练</h1>
        <div className="flex gap-2">
          {(Object.keys(typeLabels) as ListeningType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedType(type);
                handleReset();
              }}
              className={`px-4 py-2 rounded-full transition-all ${selectedType === type ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
              {typeLabels[type]}
            </button>
          ))}
        </div>
      </header>

      <section className="px-6">
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-white/70">第 {currentIndex + 1} / {questions.length} 题</span>
              <span className="text-white/70">得分: {score}</span>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
          </div>

          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlay}
                disabled={isPlaying}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-green-500' : 'bg-gradient-to-r from-primary-500 to-accent-500 hover:scale-110'}`}
              >
                {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
              </button>
              <div className="flex-1">
                <p className="text-white/70 text-sm mb-2">点击播放音频</p>
                <p className="text-white font-english whitespace-pre-line">{currentQuestion?.audioText}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-white font-medium mb-4">{currentQuestion?.question}</p>
            <div className="space-y-3">
              {currentQuestion?.options.map((option, index) => {
                const isCorrect = index === currentQuestion.answer;
                const isSelected = selectedAnswer === index;
                let optionClass = 'bg-white/5 hover:bg-white/10 border-white/20';
                
                if (showResult) {
                  if (isCorrect) {
                    optionClass = 'bg-green-500/30 border-green-500';
                  } else if (isSelected && !isCorrect) {
                    optionClass = 'bg-red-500/30 border-red-500';
                  }
                } else if (isSelected) {
                  optionClass = 'bg-gradient-to-r from-primary-500/30 to-accent-500/30 border-primary-500';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={showResult}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${optionClass}`}
                  >
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-white flex-1 text-left">{option}</span>
                    {showResult && isCorrect && <Check className="w-6 h-6 text-green-500" />}
                    {showResult && isSelected && !isCorrect && <X className="w-6 h-6 text-red-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {showResult && (
            <div className="bg-white/5 rounded-xl p-4 mb-6 animate-fade-in-up">
              <p className="text-white/70 text-sm mb-2">解析</p>
              <p className="text-white">{currentQuestion?.explanation}</p>
            </div>
          )}

          <div className="flex justify-end gap-4">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className={`btn-primary ${selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                提交答案
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className={`btn-primary ${currentIndex === questions.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {currentIndex === questions.length - 1 ? '完成' : '下一题'}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};