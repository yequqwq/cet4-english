import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Words } from './pages/Words';
import { Listening } from './pages/Listening';
import { Reading } from './pages/Reading';
import { Writing } from './pages/Writing';
import { Translation } from './pages/Translation';
import { Exam } from './pages/Exam';
import { Games } from './pages/Games';
import { Profile } from './pages/Profile';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { useAppStore } from './store/useAppStore';

function AppContent() {
  const location = useLocation();
  const { setLoading } = useAppStore();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <div className="min-h-screen">
      <Sidebar />

      <main className="md:ml-64">
        <div className="animate-fade-in-up">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/words" element={<Words />} />
            <Route path="/listening" element={<Listening />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/translation" element={<Translation />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/games" element={<Games />} />
            <Route path="/profile" element={<Profile />} />
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