import { useState, useEffect } from 'react';
import { FileQuestion, Play, Pause, Clock, Check, X, RotateCcw, Trophy } from 'lucide-react';
import { exams, getExamById } from '../data/exams';
import { useAppStore } from '../store/useAppStore';

type ExamState = 'select' | 'in-progress' | 'completed';

export const Exam = () => {
  const [examState, setExamState] = useState<ExamState>('select');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | number)[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const { addWrongAnswer } = useAppStore();

  const exam = selectedExamId ? getExamById(selectedExamId) : null;

  useEffect(() => {
    if (exam && examState === 'in-progress' && !isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [exam, examState, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = (examId: string) => {
    setSelectedExamId(examId);
    const selectedExam = getExamById(examId);
    if (selectedExam) {
      setTimeRemaining(selectedExam.duration * 60);
      setCurrentQuestion(0);
      setAnswers([]);
      setScore(0);
      setIsPaused(false);
    }
    setExamState('in-progress');
  };

  const handleSelectAnswer = (answer: string | number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (exam && currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (!exam) return;
    let correctCount = 0;
    exam.questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        correctCount++;
      } else {
        addWrongAnswer({
          type: 'exam',
          question: q.question,
          userAnswer: String(answers[index] || ''),
          correctAnswer: String(q.answer),
        });
      }
    });
    setScore(Math.round((correctCount / exam.questions.length) * exam.totalScore));
    setExamState('completed');
  };

  const handleReset = () => {
    setExamState('select');
    setSelectedExamId(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setTimeRemaining(0);
    setScore(0);
  };

  if (examState === 'select') {
    return (
      <div className="min-h-screen pb-24 md:pb-0 animate-fade-in-up">
        <header className="p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">真题模拟</h1>
        </header>

        <section className="px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((examItem, index) => (
              <button
                key={examItem.id}
                onClick={() => handleStartExam(examItem.id)}
                className="glass-card p-6 text-left card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h2 className="text-xl font-bold text-white mb-2">{examItem.title}</h2>
                <div className="flex items-center gap-4 text-white/70">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{examItem.duration}分钟</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileQuestion className="w-4 h-4" />
                    <span>{examItem.questions.length}道题</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    <span>{examItem.totalScore}分</span>
                  </div>
                </div>
                <button className="mt-4 btn-primary w-full">开始考试</button>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (examState === 'completed') {
    return (
      <div className="min-h-screen pb-24 md:pb-0 animate-fade-in-up">
        <header className="p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">考试结果</h1>
        </header>

        <section className="px-6">
          <div className="glass-card p-8 text-center mb-6">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">考试完成！</h2>
            <p className="text-white/70 mb-4">{exam?.title}</p>
            <div className="text-6xl font-bold text-white mb-2">{score}</div>
            <p className="text-white/70">总分: {exam?.totalScore}分</p>
            <div className="mt-6 flex justify-center gap-4">
              <button onClick={handleReset} className="btn-primary">
                返回首页
              </button>
              <button onClick={() => handleStartExam(selectedExamId!)} className="btn-secondary">
                再考一次
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">答题详情</h3>
            <div className="space-y-4">
              {exam?.questions.map((q, index) => (
                <div key={q.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${answers[index] === q.answer ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                      {answers[index] === q.answer ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <X className="w-5 h-5 text-white" />
                      )}
                    </span>
                    <span className="text-white font-medium">第 {index + 1} 题</span>
                  </div>
                  <p className="text-white/90 mb-2">{q.question}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-white/70">
                      你的答案:{' '}
                      <span
                        className={answers[index] === q.answer ? 'text-green-400' : 'text-red-400'}
                      >
                        {answers[index]}
                      </span>
                    </span>
                    <span className="text-white/70">
                      正确答案: <span className="text-green-400">{q.answer}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0 animate-fade-in-up">
      <header className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">{exam?.title}</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isPaused ? 'bg-green-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? '继续' : '暂停'}
            </button>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeRemaining < 300 ? 'bg-red-500/30 text-red-300' : 'bg-white/10 text-white/70'}`}
            >
              <Clock className="w-4 h-4" />
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </header>

      {isPaused ? (
        <section className="px-6">
          <div className="glass-card p-12 text-center">
            <Pause className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">考试已暂停</h2>
            <p className="text-white/70 mb-6">点击继续按钮恢复考试</p>
            <button onClick={() => setIsPaused(false)} className="btn-primary">
              继续考试
            </button>
          </div>
        </section>
      ) : (
        <section className="px-6">
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/70">
                第 {currentQuestion + 1} / {exam?.questions.length} 题
              </span>
              <span className="text-white/70">
                已答: {answers.filter((a) => a !== undefined).length} / {exam?.questions.length}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-white font-medium text-lg mb-4">
                {exam?.questions[currentQuestion]?.question}
              </p>
              {exam?.questions[currentQuestion]?.options && (
                <div className="space-y-3">
                  {exam.questions[currentQuestion].options.map((option, index) => {
                    const isSelected = answers[currentQuestion] === index;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectAnswer(index)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${isSelected ? 'bg-gradient-to-r from-primary-500/30 to-accent-500/30 border-primary-500' : 'bg-white/5 hover:bg-white/10 border-white/20'}`}
                      >
                        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-white flex-1 text-left">{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {!exam?.questions[currentQuestion]?.options && (
                <textarea
                  value={String(answers[currentQuestion] || '')}
                  onChange={(e) => handleSelectAnswer(e.target.value)}
                  placeholder="请输入你的答案..."
                  className="input-glow w-full h-32 resize-none"
                />
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className={`btn-secondary ${currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                上一题
              </button>
              {currentQuestion === exam?.questions.length - 1 ? (
                <button onClick={handleSubmit} className="btn-primary">
                  提交试卷
                </button>
              ) : (
                <button onClick={handleNext} className="btn-primary">
                  下一题
                </button>
              )}
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="grid grid-cols-10 gap-2">
              {exam?.questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${answers[index] !== undefined ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
