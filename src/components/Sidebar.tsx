import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Headphones, FileText, PenTool, Languages, FileQuestion, Gamepad2, User, Sun, Moon, Brain } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const navItems = [
  { id: '/', label: '首页', icon: Home },
  { id: '/words', label: '单词学习', icon: BookOpen },
  { id: '/vocab-book', label: '单词本', icon: BookOpen },
  { id: '/review', label: '艾宾浩斯复习', icon: Brain },
  { id: '/listening', label: '听力训练', icon: Headphones },
  { id: '/reading', label: '阅读练习', icon: FileText },
  { id: '/writing', label: '写作翻译', icon: PenTool },
  { id: '/translation', label: '翻译练习', icon: Languages },
  { id: '/exam', label: '真题模拟', icon: FileQuestion },
  { id: '/games', label: '互动游戏', icon: Gamepad2 },
  { id: '/profile', label: '学习中心', icon: User },
];

export const Sidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useAppStore();

  return (
    <aside className="hidden md:flex flex-col w-64 glass-card h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-white/20">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-accent-400" />
          四级英语
        </h1>
        <p className="text-white/60 text-sm mt-1">CET-4 Learning App</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.id;
          return (
            <Link
              key={item.id}
              to={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/20">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-5 h-5" />
              <span>切换到暗黑模式</span>
            </>
          ) : (
            <>
              <Sun className="w-5 h-5" />
              <span>切换到亮色模式</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};