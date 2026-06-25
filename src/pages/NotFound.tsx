import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-white/20 mb-4">404</div>
          <h1 className="text-3xl font-bold text-white mb-2">页面未找到</h1>
          <p className="text-white/60 mb-8">抱歉，您访问的页面不存在或已被移除</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <Home className="w-5 h-5" />
            返回首页
          </button>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            返回上一页
          </button>
        </div>

        <div className="mt-12 text-white/30 text-sm">如果你认为这是一个错误，请联系管理员</div>
      </div>
    </div>
  );
};
