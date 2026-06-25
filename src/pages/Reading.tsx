import { useState } from 'react';
import { BookOpen, Check, X, RotateCcw } from 'lucide-react';
import { readingArticles, getReadingByType } from '../data/reading';
import { useAppStore } from '../store/useAppStore';

type ReadingType = 'fill' | 'skimming' | 'careful';

const typeLabels = {
  fill: '选词填空',
  skimming: '长篇阅读',
  careful: '仔细阅读',
};

export const Reading = () => {
  const [selectedType, setSelectedType] = useState<ReadingType>('fill');
  const [selectedArticle, setSelectedArticle] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { addWrongAnswer } = useAppStore();

  const articles = getReadingByType(selectedType);
  const currentArticle = articles[selectedArticle];

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    if (showResult) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (!currentArticle?.questions) return;
    let correctCount = 0;
    currentArticle.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        correctCount++;
      } else {
        addWrongAnswer({
          type: 'reading',
          question: q.question,
          userAnswer: q.options[selectedAnswers[index]] || '',
          correctAnswer: q.options[q.answer],
        });
      }
    });
    setScore(correctCount);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedAnswers([]);
    setShowResult(false);
    setScore(0);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 animate-fade-in-up">
      <header className="p-6 mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">阅读练习</h1>
        <div className="flex gap-2">
          {(Object.keys(typeLabels) as ReadingType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedType(type);
                setSelectedArticle(0);
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">{currentArticle?.title}</h2>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
          </div>

          <div className="bg-white/5 rounded-xl p-6 mb-6 max-h-96 overflow-y-auto">
            <p className="text-white/90 leading-relaxed whitespace-pre-line">
              {currentArticle?.content}
            </p>
          </div>

          {currentArticle?.questions && (
            <div className="space-y-6">
              {currentArticle.questions.map((question, qIndex) => (
                <div key={question.id}>
                  <p className="text-white font-medium mb-3">
                    {qIndex + 1}. {question.question}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.options.map((option, oIndex) => {
                      const isCorrect = oIndex === question.answer;
                      const isSelected = selectedAnswers[qIndex] === oIndex;
                      let optionClass = 'bg-white/5 hover:bg-white/10 border-white/20';

                      if (showResult) {
                        if (isCorrect) {
                          optionClass = 'bg-green-500/30 border-green-500';
                        } else if (isSelected && !isCorrect) {
                          optionClass = 'bg-red-500/30 border-red-500';
                        }
                      } else if (isSelected) {
                        optionClass =
                          'bg-gradient-to-r from-primary-500/30 to-accent-500/30 border-primary-500';
                      }

                      return (
                        <button
                          key={oIndex}
                          onClick={() => handleSelectAnswer(qIndex, oIndex)}
                          disabled={showResult}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${optionClass}`}
                        >
                          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-sm">
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          <span className="text-white text-sm">{option}</span>
                          {showResult && isCorrect && (
                            <Check className="w-4 h-4 text-green-500 ml-auto" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <X className="w-4 h-4 text-red-500 ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showResult && (
                    <div className="mt-3 p-3 bg-white/5 rounded-lg animate-fade-in-up">
                      <p className="text-white/70 text-sm">解析: {question.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-between items-center">
            {showResult && (
              <div className="text-white/70">
                得分: {score} / {currentArticle?.questions?.length || 0}
              </div>
            )}
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={
                  currentArticle?.questions &&
                  selectedAnswers.length < currentArticle.questions.length
                }
                className={`btn-primary ${currentArticle?.questions && selectedAnswers.length < currentArticle.questions.length ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                提交答案
              </button>
            ) : (
              <button onClick={handleReset} className="btn-secondary">
                再做一次
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
