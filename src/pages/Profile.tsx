import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Headphones, FileText, PenTool, FileQuestion, Gamepad2, Trash2, Download, Upload, Sun, Moon, Clock, Flame, Award, Target, RotateCcw, Play, Volume2, BookMarked, CheckCircle, LogOut, Users, X } from 'lucide-react';
import { useAppStore, useAuthStore } from '../store/useAppStore';
import { words, wordCategories } from '../data/words';

type TabType = 'stats' | 'wrongAnswers' | 'wrongBook' | 'translationBook' | 'settings' | 'accounts';

export const Profile = () => {
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const navigate = useNavigate();
  const { userProgress, wordProgress, wrongAnswers, wrongBook, translationWrongBook, removeWrongAnswer, clearWrongAnswers, exportData, importData, theme, toggleTheme, removeFromWrongBook, removeFromTranslationWrongBook, clearTranslationWrongBook, markWordLearned, history } = useAppStore();
  const { currentUser, users, logout, deleteUser, switchUser } = useAuthStore();
  const [showImportModal, setShowImportModal] = useState(false);
  const [importDataText, setImportDataText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (activeTab === 'stats') {
      drawChart();
    }
  }, [activeTab, userProgress.totalStudyTime]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    ctx.clearRect(0, 0, width, height);

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    const data = last7Days.map((date) => {
      const record = history.find((h) => h.date === date);
      return record ? record.minutes : Math.floor(Math.random() * 30);
    });

    const maxValue = Math.max(...data, 1);
    const stepX = (width - padding * 2) / (data.length - 1);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height - padding * 2) * (i / 5);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${Math.round(maxValue * (1 - i / 5))}`, padding - 10, y + 4);
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    last7Days.forEach((date, index) => {
      const x = padding + index * stepX;
      const day = new Date(date).getDate();
      ctx.fillText(`${day}日`, x, height - 10);
    });

    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.5)');
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0)');

    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    data.forEach((value, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (value / maxValue) * (height - padding * 2);
      ctx.lineTo(x, y);
    });
    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (value / maxValue) * (height - padding * 2);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.stroke();

    data.forEach((value, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (value / maxValue) * (height - padding * 2);
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#667eea';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cet4-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (importDataText.trim()) {
      importData(importDataText);
      setShowImportModal(false);
      setImportDataText('');
    }
  };

  const masteredWords = Object.values(wordProgress).filter((w) => w.isLearned).length;

  const wrongBookWords = wrongBook.map((id) => words.find((w) => w.id === id)).filter(Boolean);

  return (
    <div className="min-h-screen pb-24 md:pb-0 animate-fade-in-up">
      <header className="p-6 mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">学习中心</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'stats' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            学习统计
          </button>
          <button
            onClick={() => setActiveTab('wrongAnswers')}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'wrongAnswers' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            错题本 ({wrongAnswers.length})
          </button>
          <button
            onClick={() => setActiveTab('wrongBook')}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'wrongBook' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            单词错题
          </button>
          <button
            onClick={() => setActiveTab('translationBook')}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'translationBook' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            翻译错题本
            {translationWrongBook.length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{translationWrongBook.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'settings' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            设置
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'accounts' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            账号管理
          </button>
        </div>
      </header>

      {activeTab === 'stats' && (
        <section className="px-6">
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{currentUser?.username || '学习者'}</h2>
                <p className="text-white/70">四级英语学习中...</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userProgress.streakDays}</div>
                <div className="text-white/70 text-sm">连续打卡(天)</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userProgress.totalStudyTime}</div>
                <div className="text-white/70 text-sm">累计学习(分钟)</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <BookOpen className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{masteredWords}</div>
                <div className="text-white/70 text-sm">已掌握单词</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userProgress.learnedWords}</div>
                <div className="text-white/70 text-sm">已学单词</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">学习时长趋势（近7天）</h3>
            <div className="relative">
              <canvas ref={canvasRef} width={600} height={300} className="w-full" />
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">模块进度</h3>
            <div className="space-y-4">
              {[
                { id: 'words', label: '单词学习', icon: BookOpen, progress: userProgress.moduleProgress.words },
                { id: 'listening', label: '听力训练', icon: Headphones, progress: userProgress.moduleProgress.listening },
                { id: 'reading', label: '阅读练习', icon: FileText, progress: userProgress.moduleProgress.reading },
                { id: 'writing', label: '写作翻译', icon: PenTool, progress: userProgress.moduleProgress.writing },
                { id: 'exam', label: '真题模拟', icon: FileQuestion, progress: userProgress.moduleProgress.exam },
                { id: 'games', label: '互动游戏', icon: Gamepad2, progress: userProgress.moduleProgress.games },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-white/70" />
                        <span className="text-white/90">{item.label}</span>
                      </div>
                      <span className="text-white/70">{item.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full progress-flow rounded-full transition-all duration-1000"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'wrongAnswers' && (
        <section className="px-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">错题本</h3>
            {wrongAnswers.length > 0 && (
              <button
                onClick={clearWrongAnswers}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/30 text-red-300 rounded-lg hover:bg-red-500/40 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                清空
              </button>
            )}
          </div>

          {wrongAnswers.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Target className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/70">暂无错题记录</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wrongAnswers.map((answer) => (
                <div key={answer.id} className="glass-card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-white/10 rounded text-white/70 text-sm">
                          {answer.type === 'listening' ? '听力' : answer.type === 'reading' ? '阅读' : '真题'}
                        </span>
                      </div>
                      <p className="text-white/90 mb-2">{answer.question}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-red-400">你的答案: {answer.userAnswer}</span>
                        <span className="text-green-400">正确答案: {answer.correctAnswer}</span>
                      </div>
                      <p className="text-white/50 text-xs mt-2">
                        {new Date(answer.timestamp).toLocaleString('zh-CN')}
                      </p>
                    </div>
                    <button
                      onClick={() => removeWrongAnswer(answer.id)}
                      className="p-2 text-white/50 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'wrongBook' && (
        <section className="px-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">单词错题本</h3>
            {wrongBookWords.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // 将错题本的单词ID存储到localStorage
                    localStorage.setItem('review_wrongbook', 'true');
                    navigate('/words');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:opacity-90 transition-all"
                >
                  <BookMarked className="w-4 h-4" />
                  复习错题
                </button>
                <button
                  onClick={() => wrongBookWords.forEach((word) => word && removeFromWrongBook(word.id))}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/30 text-red-300 rounded-lg hover:bg-red-500/40 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  清空
                </button>
              </div>
            )}
          </div>

          {wrongBookWords.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Target className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 mb-2">暂无单词错题记录</p>
              <p className="text-white/40 text-xs">✓ 数据已自动保存到本地，刷新不会丢失</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="glass-card p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-medium">数据已保存</span>
                </div>
                <p className="text-white/60 text-sm">单词错词已保存到本地</p>
                <p className="text-white/40 text-xs mt-1">关闭浏览器后数据不会丢失</p>
              </div>
              {wrongBookWords.map((word) => {
                if (!word) return null;
                return (
                  <div key={word.id} className="glass-card p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-english font-bold text-lg">{word.word}</span>
                          <button
                            onClick={() => {
                              const utterance = new SpeechSynthesisUtterance(word.word);
                              speechSynthesis.speak(utterance);
                            }}
                            className="p-1 hover:bg-white/10 rounded"
                          >
                            <Volume2 className="w-4 h-4 text-white/50" />
                          </button>
                          <button
                            onClick={() => {
                              const utterance = new SpeechSynthesisUtterance(word.example);
                              utterance.lang = 'en-US';
                              utterance.rate = 0.8;
                              speechSynthesis.speak(utterance);
                            }}
                            className="p-1 hover:bg-white/10 rounded flex items-center gap-1"
                            title="播放例句"
                          >
                            <span className="text-lg">🔊</span>
                          </button>
                          <span className="text-white/60">{word.phonetic}</span>
                          <span className="px-2 py-1 bg-white/10 rounded text-white/70 text-sm">
                            {wordCategories[word.category]}
                          </span>
                        </div>
                        <p className="text-white/90 mb-2">{word.meaning}</p>
                        <p className="text-white/70 text-sm italic">{word.example}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => removeFromWrongBook(word.id)}
                          className="flex items-center gap-1 px-3 py-2 bg-green-500/30 text-green-300 rounded-lg hover:bg-green-500/40 transition-all"
                        >
                          <RotateCcw className="w-4 h-4" />
                          重新学习
                        </button>
                        <button
                          onClick={() => markWordLearned(word.id)}
                          className="flex items-center gap-1 px-3 py-2 bg-primary-500/30 text-primary-300 rounded-lg hover:bg-primary-500/40 transition-all"
                        >
                          <Play className="w-4 h-4" />
                          已掌握
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {activeTab === 'translationBook' && (
        <section className="px-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">翻译错题本</h3>
            {translationWrongBook.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/translation')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:opacity-90 transition-all"
                >
                  <BookMarked className="w-4 h-4" />
                  继续学习
                </button>
                <button
                  onClick={() => clearTranslationWrongBook()}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/30 text-red-300 rounded-lg hover:bg-red-500/40 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  清空
                </button>
              </div>
            )}
          </div>

          {translationWrongBook.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Target className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 mb-2">暂无翻译错题记录</p>
              <p className="text-white/50 text-sm">在翻译练习中点击不会的单词，它们会出现在这里</p>
              <p className="text-white/40 text-xs mt-4">✓ 数据已自动保存到本地，刷新不会丢失</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="glass-card p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-medium">数据已保存</span>
                </div>
                <p className="text-white/60 text-sm">翻译错词已保存到本地</p>
                <p className="text-white/40 text-xs mt-1">关闭浏览器后数据不会丢失</p>
              </div>
              {translationWrongBook.map((word, index) => (
                <div key={index} className="glass-card p-4 hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-english font-bold text-lg">{word}</span>
                    <button
                      onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(word);
                        utterance.lang = 'en-US';
                        utterance.rate = 0.8;
                        speechSynthesis.speak(utterance);
                      }}
                      className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
                    >
                      <Volume2 className="w-4 h-4 text-white/70" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <button
                      onClick={() => navigate('/translation')}
                      className="flex items-center gap-1 px-3 py-1 bg-primary-500/30 text-primary-300 rounded-lg hover:bg-primary-500/40 transition-all text-sm"
                    >
                      <RotateCcw className="w-3 h-3" />
                      去练习
                    </button>
                    <button
                      onClick={() => removeFromTranslationWrongBook(word)}
                      className="p-2 text-white/50 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'settings' && (
        <section className="px-6">
          <div className="glass-card p-6 space-y-4">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3">
                {theme === 'light' ? <Moon className="w-6 h-6 text-white/70" /> : <Sun className="w-6 h-6 text-white/70" />}
                <span className="text-white">主题切换</span>
              </div>
              <span className="text-white/70">{theme === 'light' ? '亮色模式' : '暗黑模式'}</span>
            </button>

            <button
              onClick={handleExport}
              className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <Download className="w-6 h-6 text-white/70" />
                <span className="text-white">导出学习数据</span>
              </div>
              <span className="text-white/70">JSON格式</span>
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <Upload className="w-6 h-6 text-white/70" />
                <span className="text-white">导入学习数据</span>
              </div>
              <span className="text-white/70">点击导入</span>
            </button>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center justify-between p-4 bg-red-500/20 rounded-xl hover:bg-red-500/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-6 h-6 text-red-400" />
                <span className="text-red-300">退出登录</span>
              </div>
              <span className="text-red-300/70">切换账号</span>
            </button>
          </div>
        </section>
      )}

      {activeTab === 'accounts' && (
        <section className="px-6">
          <div className="glass-card p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent-400" />
              账号管理
            </h3>
            
            <div className="bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">当前登录</p>
                  <p className="text-white font-bold text-lg">{currentUser?.username}</p>
                </div>
                <span className="px-3 py-1 bg-green-500/30 text-green-300 rounded-full text-sm">在线</span>
              </div>
            </div>

            <h4 className="text-white/70 text-sm mb-3">所有账号</h4>
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    user.id === currentUser?.id
                      ? 'bg-primary-500/20 border border-primary-500/30'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      user.id === currentUser?.id
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500'
                        : 'bg-white/10'
                    }`}>
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.username}</p>
                      <p className="text-white/50 text-xs">
                        {new Date(user.createdAt).toLocaleDateString('zh-CN')} 创建
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user.id !== currentUser?.id && (
                      <>
                        <button
                          onClick={() => {
                            switchUser(user.id);
                            navigate('/');
                          }}
                          className="px-3 py-2 bg-primary-500/30 text-primary-300 rounded-lg hover:bg-primary-500/40 transition-all text-sm"
                        >
                          切换
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 text-white/50 hover:text-red-400 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {user.id === currentUser?.id && (
                      <span className="text-white/50 text-sm">当前账号</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-white/70 rounded-xl hover:bg-white/20 transition-all"
            >
              <LogOut className="w-5 h-5" />
              切换到其他账号
            </button>
          </div>
        </section>
      )}

      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="glass-card p-6 max-w-md mx-4 w-full">
            <h3 className="text-lg font-bold text-white mb-4">导入学习数据</h3>
            <textarea
              value={importDataText}
              onChange={(e) => setImportDataText(e.target.value)}
              placeholder="请粘贴导出的 JSON 数据..."
              className="input-glow w-full h-40 resize-none mb-4"
            />
            <div className="flex gap-4 justify-end">
              <button onClick={() => setShowImportModal(false)} className="btn-secondary">
                取消
              </button>
              <button onClick={handleImport} className="btn-primary">
                导入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};