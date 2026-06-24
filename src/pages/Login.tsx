import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAppStore';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, login, users } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }

    if (!password.trim()) {
      setError('请输入密码');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (isLogin) {
      const success = login(username.trim(), password);
      if (success) {
        navigate('/');
      } else {
        setError('用户名或密码错误');
      }
    } else {
      const success = register(username.trim(), password);
      if (success) {
        navigate('/');
      } else {
        setError('用户名已存在');
      }
    }
  };

  const handleDemoLogin = () => {
    setUsername('demo');
    setPassword('123456');
    setTimeout(() => {
      login('demo', '123456');
      navigate('/');
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 max-w-md w-full animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">四级英语学习</h1>
          <p className="text-white/60">开始您的英语学习之旅</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-500/20 text-red-300 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">用户名</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                className="input-glow pl-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">密码</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="input-glow pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-white/50" />
                ) : (
                  <Eye className="w-5 h-5 text-white/50" />
                )}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-white/70 text-sm mb-2">确认密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  className="input-glow pl-12"
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            {isLogin ? '登录' : '注册'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white/70 hover:text-white transition-colors"
          >
            {isLogin ? '还没有账号？点击注册' : '已有账号？点击登录'}
          </button>
        </div>

        {users.length === 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <button
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-white/70 rounded-xl hover:bg-white/20 transition-all"
            >
              <span>👤</span>
              使用演示账号登录 (demo / 123456)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
