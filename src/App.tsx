import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Words } from './pages/Words';
import { Listening } from './pages/Listening';
import { Reading } from './pages/Reading';
import { Writing } from './pages/Writing';
import { Translation } from './pages/Translation';
import { Exam } from './pages/Exam';
import { Games } from './pages/Games';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { VocabBook } from './pages/VocabBook';
import { Review } from './pages/Review';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { useAppStore } from './store/useAppStore';
import { useAuthStore } from './store/useAppStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn && location.pathname !== '/login') {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function AppContent() {
  const location = useLocation();
  const { setLoading } = useAppStore();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  if (!isLoggedIn && location.pathname === '/login') {
    return <Login />;
  }

  return (
    <div className="min-h-screen">
      <Sidebar />

      <main className="md:ml-64">
        <div className="animate-fade-in-up">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/words"
              element={
                <ProtectedRoute>
                  <Words />
                </ProtectedRoute>
              }
            />
            <Route
              path="/listening"
              element={
                <ProtectedRoute>
                  <Listening />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reading"
              element={
                <ProtectedRoute>
                  <Reading />
                </ProtectedRoute>
              }
            />
            <Route
              path="/writing"
              element={
                <ProtectedRoute>
                  <Writing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/translation"
              element={
                <ProtectedRoute>
                  <Translation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam"
              element={
                <ProtectedRoute>
                  <Exam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/games"
              element={
                <ProtectedRoute>
                  <Games />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vocab-book"
              element={
                <ProtectedRoute>
                  <VocabBook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review"
              element={
                <ProtectedRoute>
                  <Review />
                </ProtectedRoute>
              }
            />
          </Routes>
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
