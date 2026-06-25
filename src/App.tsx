import { lazy, Suspense, useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';

const Words = lazy(() => import('./pages/Words').then(m => ({ default: m.Words })));
const Listening = lazy(() => import('./pages/Listening').then(m => ({ default: m.Listening })));
const Reading = lazy(() => import('./pages/Reading').then(m => ({ default: m.Reading })));
const Writing = lazy(() => import('./pages/Writing').then(m => ({ default: m.Writing })));
const Translation = lazy(() => import('./pages/Translation').then(m => ({ default: m.Translation })));
const Exam = lazy(() => import('./pages/Exam').then(m => ({ default: m.Exam })));
const Games = lazy(() => import('./pages/Games').then(m => ({ default: m.Games })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const VocabBook = lazy(() => import('./pages/VocabBook').then(m => ({ default: m.VocabBook })));
const Review = lazy(() => import('./pages/Review').then(m => ({ default: m.Review })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { useAppStore } from './store/useAppStore';
import { useAuthStore } from './store/useAppStore';
import { Menu, X } from 'lucide-react';

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="loader-dots">
      <div className="loader-dot" />
      <div className="loader-dot" />
      <div className="loader-dot" />
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();
  if (!isLoggedIn && location.pathname !== '/login') {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function AppContent() {
  const { setLoading } = useAppStore();
  const { isLoggedIn } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(false);
    setMobileMenuOpen(false);
  }, [setLoading, location.pathname]);

  if (!isLoggedIn && location.pathname === '/login') {
    return <Login />;
  }

  return (
    <div className="min-h-screen relative">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 md:hidden transition-colors"
      >
        {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar />
      </div>
      <main className="md:ml-64">
        <div className="animate-fade-in-up pt-16 md:pt-0">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/words" element={<ProtectedRoute><Words /></ProtectedRoute>} />
              <Route path="/listening" element={<ProtectedRoute><Listening /></ProtectedRoute>} />
              <Route path="/reading" element={<ProtectedRoute><Reading /></ProtectedRoute>} />
              <Route path="/writing" element={<ProtectedRoute><Writing /></ProtectedRoute>} />
              <Route path="/translation" element={<ProtectedRoute><Translation /></ProtectedRoute>} />
              <Route path="/exam" element={<ProtectedRoute><Exam /></ProtectedRoute>} />
              <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/vocab-book" element={<ProtectedRoute><VocabBook /></ProtectedRoute>} />
              <Route path="/review" element={<ProtectedRoute><Review /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        <BottomNav />
      </main>
    </div>
  );
}

function App() {
  const { isLoading, setLoading } = useAppStore();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader-dots">
          <div className="loader-dot" />
          <div className="loader-dot" />
          <div className="loader-dot" />
        </div>
      </div>
    );
  }
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
