import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Headphones,
  FileText,
  PenTool,
  Languages,
  FileQuestion,
  Gamepad2,
  User,
} from 'lucide-react';

const navItems = [
  { id: '/', label: '首页', icon: Home },
  { id: '/words', label: '单词', icon: BookOpen },
  { id: '/listening', label: '听力', icon: Headphones },
  { id: '/writing', label: '写作', icon: PenTool },
  { id: '/exam', label: '真题', icon: FileQuestion },
  { id: '/games', label: '游戏', icon: Gamepad2 },
  { id: '/profile', label: '我的', icon: User },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/20 z-50 md:hidden safe-area-bottom">
      <div className="flex justify-around items-center py-1 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.id;
          return (
            <Link
              key={item.id}
              to={item.id}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-300 min-w-0 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white scale-105'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-bounce' : ''}`} />
              <span className="text-[10px] truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
