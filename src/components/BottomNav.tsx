import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Headphones, FileText, Languages, FileQuestion, Gamepad2, User } from 'lucide-react';

const navItems = [
  { id: '/', label: '首页', icon: Home },
  { id: '/words', label: '单词', icon: BookOpen },
  { id: '/listening', label: '听力', icon: Headphones },
  { id: '/reading', label: '阅读', icon: FileText },
  { id: '/translation', label: '翻译', icon: Languages },
  { id: '/exam', label: '真题', icon: FileQuestion },
  { id: '/games', label: '游戏', icon: Gamepad2 },
  { id: '/profile', label: '我的', icon: User },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/20 z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.id;
          return (
            <Link
              key={item.id}
              to={item.id}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-bounce' : ''}`} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};