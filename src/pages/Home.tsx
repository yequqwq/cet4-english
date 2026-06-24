import { useEffect, useState } from 'react';
import { BookOpen, Headphones, FileText, PenTool, FileQuestion, Gamepad2, Flame, Clock, Award, ChevronRight, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ProgressRing } from '../components/ProgressRing';
import { useNavigate } from 'react-router-dom';

const quickAccessItems = [
  { id: '/words', label: '单词学习', icon: BookOpen, color: 'from-primary-500 to-primary-600' },
  { id: '/listening', label: '听力训练', icon: Headphones, color: 'from-accent-500 to-accent-600' },
  { id: '/reading', label: '阅读练习', icon: FileText, color: 'from-green-500 to-green-600' },
  { id: '/writing', label: '写作翻译', icon: PenTool, color: 'from-yellow-500 to-orange-500' },
  { id: '/exam', label: '真题模拟', icon: FileQuestion, color: 'from-blue-500 to-blue-600' },
  { id: '/games', label: '互动游戏', icon: Gamepad2, color: 'from-purple-500 to-purple-600' },
];

const moduleMap: Record<string, string> = {
  words: '/words',
  listening: '/listening',
  reading: '/reading',
  writing: '/writing',
  exam: '/exam',
  review: '/profile',
};

export const Home = () => {
  const { userProgress, todayTasks, checkIn, isFirstTime, setIsFirstTime, wrongBook } = useAppStore();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  // 错题本单词数量
  const wrongBookCount = wrongBook.length;

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setIsCheckedIn(userProgress.lastCheckInDate === today);
  }, [userProgress.lastCheckInDate]);

  useEffect(() => {
    if (isFirstTime) {
      setTimeout(() => {
        setIsFirstTime(false);
      }, 5000);
    }
  }, [isFirstTime, setIsFirstTime]);

  const handleCheckIn = () => {
    checkIn();
    setIsCheckedIn(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleTaskClick = (module: string) => {
    const path = moduleMap[module];
    if (path) {
      navigate(path);
    }
  };

  const progressPercent = Math.min(100, (userProgress.learnedWords / 2000) * 100);
  const completedTasks = todayTasks.filter((t) => t.completed).length;
  const totalTasks = todayTasks.length;

  return (
    <div className="min-h-screen pb-24 md:pb-0 animate-fade-in-up">
      {isFirstTime && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in">
          <div className="glass-card p-8 max-w-md mx-4 text-center animate-bounce-in">
            <h2 className="text-2xl font-bold text-white mb-4">欢迎使用四级英语学习应用！</h2>
            <p className="text-white/80 mb-6">开始您的英语学习之旅，每天进步一点点！</p>
            <button
              onClick={() => setIsFirstTime(false)}
              className="btn-primary"
            >
              开始学习
            </button>
          </div>
        </div>
      )}

      <header className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">早上好！</h1>
            <p className="text-white/70 mt-1">今天也要加油学习哦！</p>
          </div>
          <button
            onClick={handleCheckIn}
            disabled={isCheckedIn}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
              isCheckedIn
                ? 'bg-green-500/30 text-green-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:-translate-y-1'
            }`}
          >
            <Calendar className="w-5 h-5" />
            {isCheckedIn ? '已打卡' : '今日打卡'}
            {showConfetti && (
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(20)].map((_, i) => (
                  <span
                    key={i}
                    className="confetti-piece"
                    style={{
                      backgroundColor: ['#f093fb', '#f5576c', '#667eea', '#ec4899'][i % 4],
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 0.5}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </button>
        </div>
      </header>

      <section className="px-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-8">
              <ProgressRing
                progress={progressPercent}
                label="已学单词"
                value={`${userProgress.learnedWords}/2000`}
              />
              <ProgressRing
                progress={(userProgress.todayStudyTime / 60) * 100}
                label="今日学习"
                value={`${userProgress.todayStudyTime}分钟`}
              />
              <ProgressRing
                progress={userProgress.streakDays * 10}
                label="连续打卡"
                value={`${userProgress.streakDays}天`}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white/70">
                <Flame className="w-6 h-6 text-orange-400" />
                <span>连续 {userProgress.streakDays} 天</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Clock className="w-6 h-6 text-blue-400" />
                <span>累计 {userProgress.totalStudyTime} 分钟</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Award className="w-6 h-6 text-yellow-400" />
                <span>已掌握 {userProgress.learnedWords} 词</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-accent-400" />
          今日任务
          <span className="text-sm font-normal text-white/50">({completedTasks}/{totalTasks})</span>
        </h2>
        <div className="glass-card p-4 space-y-4">
          {todayTasks.map((task, index) => (
            <div
              key={task.id}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleTaskClick(task.module)}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${task.completed ? 'bg-green-500' : 'bg-white/20'}`}>
                {task.completed && <span className="text-white text-sm">✓</span>}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${task.completed ? 'text-white/50 line-through' : 'text-white'}`}>
                  {task.title}
                </p>
                <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full progress-flow rounded-full transition-all duration-1000"
                    style={{ width: `${(task.progress / task.target) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/50 text-sm">{task.progress}/{task.target}</span>
                <ArrowRight className={`w-5 h-5 ${task.completed ? 'text-white/30' : 'text-white/50'}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 错题本入口 */}
      {wrongBookCount > 0 && (
        <section className="px-6 mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="w-full glass-card p-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 hover:border-red-500/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-1">错题本</h3>
                  <p className="text-white/70">
                    有 <span className="text-red-400 font-bold text-lg">{wrongBookCount}</span> 个单词需要复习
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-red-500/30 text-red-300 rounded-lg font-medium">
                  立即复习
                </span>
                <ChevronRight className="w-6 h-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </button>
        </section>
      )}

      <section className="px-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-accent-400" />
          快速入口
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickAccessItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="glass-card p-6 flex flex-col items-center gap-3 card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-medium">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-white/50" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};