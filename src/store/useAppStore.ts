import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WordProgress {
  [wordId: string]: {
    mastery: number;
    lastStudyDate: string;
    isLearned: boolean;
  };
}

interface WrongAnswer {
  id: string;
  type: 'listening' | 'reading' | 'exam';
  question: string;
  userAnswer: string;
  correctAnswer: string;
  timestamp: number;
}

interface TodayTask {
  id: string;
  title: string;
  completed: boolean;
  progress: number;
  target: number;
  module: 'words' | 'listening' | 'reading' | 'writing' | 'exam' | 'review';
}

interface HistoryRecord {
  date: string;
  minutes: number;
  wordsLearned: number;
  wordsReviewed: number;
}

interface UserProgress {
  learnedWords: number;
  streakDays: number;
  totalStudyTime: number;
  todayStudyTime: number;
  lastCheckInDate: string;
  moduleProgress: {
    words: number;
    listening: number;
    reading: number;
    writing: number;
    exam: number;
    games: number;
  };
}

interface WritingHistory {
  id: string;
  topic: string;
  content: string;
  score: number;
  timestamp: number;
}

interface AppState {
  theme: 'light' | 'dark';
  userProgress: UserProgress;
  wordProgress: WordProgress;
  wrongAnswers: WrongAnswer[];
  isLoading: boolean;
  isFirstTime: boolean;
  todayTasks: TodayTask[];
  history: HistoryRecord[];
  wrongBook: string[];
  translationWrongBook: string[]; // 翻译练习中点击的单词
  writingHistory: WritingHistory[];
  
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setLoading: (loading: boolean) => void;
  
  incrementLearnedWords: () => void;
  addStudyTime: (minutes: number) => void;
  checkIn: () => void;
  updateModuleProgress: (module: keyof UserProgress['moduleProgress'], progress: number) => void;
  
  updateWordProgress: (wordId: string, mastery: number) => void;
  markWordLearned: (wordId: string) => void;
  markWordWrong: (wordId: string) => void;
  addToWrongBook: (word: string) => void;
  removeFromWrongBook: (wordId: string) => void;
  addToTranslationWrongBook: (word: string) => void;
  removeFromTranslationWrongBook: (word: string) => void;
  clearTranslationWrongBook: () => void;
  
  addWrongAnswer: (answer: Omit<WrongAnswer, 'id' | 'timestamp'>) => void;
  removeWrongAnswer: (id: string) => void;
  clearWrongAnswers: () => void;
  
  updateTaskProgress: (taskId: string, progress: number) => void;
  completeTask: (taskId: string) => void;
  resetDailyTasks: () => void;
  
  addHistoryRecord: (record: Omit<HistoryRecord, 'date'>) => void;
  
  addWritingHistory: (history: Omit<WritingHistory, 'id' | 'timestamp'>) => void;
  
  setIsFirstTime: (isFirst: boolean) => void;
  
  exportData: () => string;
  importData: (data: string) => void;
}

const initialUserProgress: UserProgress = {
  learnedWords: 0,
  streakDays: 0,
  totalStudyTime: 0,
  todayStudyTime: 0,
  lastCheckInDate: '',
  moduleProgress: {
    words: 0,
    listening: 0,
    reading: 0,
    writing: 0,
    exam: 0,
    games: 0,
  },
};

const initialTodayTasks: TodayTask[] = [
  { id: '1', title: '学习20个新单词', completed: false, progress: 0, target: 20, module: 'words' },
  { id: '2', title: '完成1篇听力练习', completed: false, progress: 0, target: 1, module: 'listening' },
  { id: '3', title: '阅读1篇文章', completed: false, progress: 0, target: 1, module: 'reading' },
  { id: '4', title: '复习错题本', completed: false, progress: 0, target: 1, module: 'review' },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      userProgress: initialUserProgress,
      wordProgress: {},
      wrongAnswers: [],
      isLoading: true,
      isFirstTime: true,
      todayTasks: initialTodayTasks,
      history: [],
      wrongBook: [],
      translationWrongBook: [],
      writingHistory: [],
      
      setTheme: (theme) => {
        set({ theme });
        document.body.className = theme === 'dark' ? 'dark' : '';
      },
      
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      incrementLearnedWords: () => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            learnedWords: state.userProgress.learnedWords + 1,
          },
        }));
      },
      
      addStudyTime: (minutes) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            totalStudyTime: state.userProgress.totalStudyTime + minutes,
            todayStudyTime: state.userProgress.todayStudyTime + minutes,
          },
        }));
      },
      
      checkIn: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          const lastDate = state.userProgress.lastCheckInDate;
          let streakDays = state.userProgress.streakDays;
          
          if (lastDate !== today) {
            const last = new Date(lastDate);
            const current = new Date(today);
            const diffDays = Math.floor((current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              streakDays++;
            } else if (diffDays > 1) {
              streakDays = 1;
            } else {
              streakDays = 1;
            }
          }
          
          return {
            userProgress: {
              ...state.userProgress,
              streakDays,
              lastCheckInDate: today,
            },
          };
        });
      },
      
      updateModuleProgress: (module, progress) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            moduleProgress: {
              ...state.userProgress.moduleProgress,
              [module]: Math.min(100, Math.max(0, progress)),
            },
          },
        }));
      },
      
      updateWordProgress: (wordId, mastery) => {
        set((state) => ({
          wordProgress: {
            ...state.wordProgress,
            [wordId]: {
              mastery: Math.min(5, Math.max(1, mastery)),
              lastStudyDate: new Date().toISOString().split('T')[0],
              isLearned: mastery >= 5,
            },
          },
        }));
        
        if (mastery >= 5) {
          get().incrementLearnedWords();
        }
      },
      
      markWordLearned: (wordId) => {
        get().updateWordProgress(wordId, 5);
        get().removeFromWrongBook(wordId);
      },
      
      markWordWrong: (wordId) => {
        set((state) => {
          if (!state.wrongBook.includes(wordId)) {
            return { wrongBook: [...state.wrongBook, wordId] };
          }
          return state;
        });
      },

      addToWrongBook: (word) => {
        const wordLower = word.toLowerCase().trim();
        set((state) => {
          if (!state.wrongBook.includes(wordLower)) {
            return { wrongBook: [...state.wrongBook, wordLower] };
          }
          return state;
        });
      },

      removeFromWrongBook: (wordId) => {
        set((state) => ({
          wrongBook: state.wrongBook.filter((id) => id !== wordId),
        }));
      },

      addToTranslationWrongBook: (word) => {
        const wordLower = word.toLowerCase().trim();
        set((state) => {
          if (!state.translationWrongBook.includes(wordLower)) {
            return { translationWrongBook: [...state.translationWrongBook, wordLower] };
          }
          return state;
        });
      },

      removeFromTranslationWrongBook: (word) => {
        set((state) => ({
          translationWrongBook: state.translationWrongBook.filter((w) => w !== word),
        }));
      },

      clearTranslationWrongBook: () => {
        set({ translationWrongBook: [] });
      },
      
      addWrongAnswer: (answer) => {
        set((state) => ({
          wrongAnswers: [
            ...state.wrongAnswers,
            {
              ...answer,
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              timestamp: Date.now(),
            },
          ],
        }));
      },
      
      removeWrongAnswer: (id) => {
        set((state) => ({
          wrongAnswers: state.wrongAnswers.filter((wa) => wa.id !== id),
        }));
      },
      
      clearWrongAnswers: () => set({ wrongAnswers: [] }),
      
      updateTaskProgress: (taskId, progress) => {
        set((state) => ({
          todayTasks: state.todayTasks.map((task) =>
            task.id === taskId
              ? { ...task, progress: Math.min(task.target, progress) }
              : task
          ),
        }));
        
        const task = get().todayTasks.find((t) => t.id === taskId);
        if (task && progress >= task.target && !task.completed) {
          get().completeTask(taskId);
        }
      },
      
      completeTask: (taskId) => {
        set((state) => ({
          todayTasks: state.todayTasks.map((task) =>
            task.id === taskId ? { ...task, completed: true, progress: task.target } : task
          ),
        }));
      },
      
      resetDailyTasks: () => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        set((state) => {
          const lastDate = state.userProgress.lastCheckInDate;
          if (lastDate === yesterday || (!lastDate && new Date().getDay() !== new Date(state.userProgress.lastCheckInDate).getDay())) {
            return {
              todayTasks: initialTodayTasks.map((task) => ({ ...task, completed: false, progress: 0 })),
            };
          }
          return state;
        });
      },
      
      addHistoryRecord: (record) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          const existingIndex = state.history.findIndex((h) => h.date === today);
          if (existingIndex >= 0) {
            const newHistory = [...state.history];
            newHistory[existingIndex] = {
              ...newHistory[existingIndex],
              minutes: newHistory[existingIndex].minutes + record.minutes,
              wordsLearned: newHistory[existingIndex].wordsLearned + record.wordsLearned,
              wordsReviewed: newHistory[existingIndex].wordsReviewed + record.wordsReviewed,
            };
            return { history: newHistory };
          }
          return {
            history: [...state.history, { date: today, ...record }],
          };
        });
      },
      
      addWritingHistory: (history) => {
        set((state) => ({
          writingHistory: [
            ...state.writingHistory,
            {
              ...history,
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              timestamp: Date.now(),
            },
          ],
        }));
      },
      
      setIsFirstTime: (isFirst) => set({ isFirstTime: isFirst }),
      
      exportData: () => {
        const state = get();
        return JSON.stringify({
          userProgress: state.userProgress,
          wordProgress: state.wordProgress,
          wrongAnswers: state.wrongAnswers,
          theme: state.theme,
          todayTasks: state.todayTasks,
          history: state.history,
          wrongBook: state.wrongBook,
          translationWrongBook: state.translationWrongBook,
          writingHistory: state.writingHistory,
        }, null, 2);
      },
      
      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set({
            userProgress: parsed.userProgress || initialUserProgress,
            wordProgress: parsed.wordProgress || {},
            wrongAnswers: parsed.wrongAnswers || [],
            theme: parsed.theme || 'light',
            todayTasks: parsed.todayTasks || initialTodayTasks,
            history: parsed.history || [],
            wrongBook: parsed.wrongBook || [],
            translationWrongBook: parsed.translationWrongBook || [],
            writingHistory: parsed.writingHistory || [],
          });
        } catch {
          console.error('Failed to import data');
        }
      },
    }),
    {
      name: 'cet4-app',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false);
          document.body.className = state.theme === 'dark' ? 'dark' : '';
          state.resetDailyTasks();
        }
      },
    }
  )
);