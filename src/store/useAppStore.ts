import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

interface AuthState {
  users: User[];
  currentUser: User | null;
  isLoggedIn: boolean;
  
  register: (username: string, password: string) => boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
}

const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      isLoggedIn: false,
      
      register: (username, password) => {
        const { users } = get();
        if (users.some((u) => u.username === username)) {
          return false;
        }
        
        const newUser: User = {
          id: `user-${Date.now()}`,
          username,
          passwordHash: hashPassword(password),
          createdAt: new Date().toISOString(),
        };
        
        set({ users: [...users, newUser], currentUser: newUser, isLoggedIn: true });
        return true;
      },
      
      login: (username, password) => {
        const { users } = get();
        const user = users.find(
          (u) => u.username === username && u.passwordHash === hashPassword(password)
        );
        
        if (user) {
          set({ currentUser: user, isLoggedIn: true });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ currentUser: null, isLoggedIn: false });
      },
      
      switchUser: (userId) => {
        const { users } = get();
        const user = users.find((u) => u.id === userId);
        if (user) {
          set({ currentUser: user });
        }
      },
      
      deleteUser: (userId) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
          ...(state.currentUser?.id === userId && { currentUser: null, isLoggedIn: false }),
        }));
      },
    }),
    {
      name: 'cet4-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface WordProgress {
  [wordId: string]: {
    mastery: number;
    lastStudyDate: string;
    isLearned: boolean;
  };
}

// 艾宾浩斯复习计划
interface ReviewPlan {
  wordId: string;
  level: number; // 1-5级，对应不同的复习间隔
  nextReviewDate: string; // 下次复习日期
  lastReviewDate: string; // 上次复习日期
  reviewCount: number; // 复习次数
  easeFactor: number; // 难度因子，初始2.5
}

interface ReviewSchedule {
  [wordId: string]: ReviewPlan;
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
  translationWrongBook: string[];
  writingHistory: WritingHistory[];
  reviewSchedule: ReviewSchedule; // 艾宾浩斯复习计划
  
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
  
  // 艾宾浩斯复习相关方法
  addToReviewSchedule: (wordId: string) => void;
  getTodayReviewWords: () => string[];
  reviewWord: (wordId: string, quality: number) => void; // quality: 0-5, 0=完全忘记, 5=完全记住
  getReviewStats: () => { overdue: number; today: number; total: number };
  
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
  
  clearAllData: () => void;
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

const getStorageKey = () => {
  const { currentUser } = useAuthStore.getState();
  return currentUser ? `cet4-app-${currentUser.id}` : 'cet4-app';
};

const createDynamicStorage = () => {
  return {
    getItem: (key: string) => {
      const dynamicKey = key === 'cet4-app' ? getStorageKey() : key;
      return localStorage.getItem(dynamicKey);
    },
    setItem: (key: string, value: string) => {
      const dynamicKey = key === 'cet4-app' ? getStorageKey() : key;
      localStorage.setItem(dynamicKey, value);
    },
    removeItem: (key: string) => {
      const dynamicKey = key === 'cet4-app' ? getStorageKey() : key;
      localStorage.removeItem(dynamicKey);
    },
  };
};

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
      reviewSchedule: {}, // 艾宾浩斯复习计划
      
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
      
      // 艾宾浩斯复习计划相关方法
      addToReviewSchedule: (wordId) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          // 如果单词已在复习计划中，不重复添加
          if (state.reviewSchedule[wordId]) {
            return state;
          }
          // 初始复习间隔为1天
          const nextReviewDate = new Date();
          nextReviewDate.setDate(nextReviewDate.getDate() + 1);
          
          return {
            reviewSchedule: {
              ...state.reviewSchedule,
              [wordId]: {
                wordId,
                level: 1,
                nextReviewDate: nextReviewDate.toISOString().split('T')[0],
                lastReviewDate: today,
                reviewCount: 0,
                easeFactor: 2.5,
              },
            },
          };
        });
      },
      
      getTodayReviewWords: () => {
        const { reviewSchedule } = get();
        const today = new Date().toISOString().split('T')[0];
        
        return Object.values(reviewSchedule)
          .filter(plan => plan.nextReviewDate <= today)
          .map(plan => plan.wordId);
      },
      
      reviewWord: (wordId, quality) => {
        set((state) => {
          const plan = state.reviewSchedule[wordId];
          if (!plan) return state;
          
          const today = new Date().toISOString().split('T')[0];
          
          // 根据SM-2算法计算新的间隔
          // quality: 0-5 (0=完全忘记, 3=勉强记住, 5=完全记住)
          let { level, easeFactor, reviewCount } = plan;
          
          // 更新难度因子
          easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
          
          // 根据质量调整复习间隔
          let interval: number;
          if (quality < 3) {
            // 忘记：从头开始
            level = 1;
            interval = 1; // 1天后
          } else {
            // 记住：按照艾宾浩斯曲线复习
            reviewCount += 1;
            if (level === 1) {
              interval = 1; // 第2天
            } else if (level === 2) {
              interval = 3; // 第4天
            } else if (level === 3) {
              interval = 7; // 第7天
            } else if (level === 4) {
              interval = 14; // 第15天
            } else {
              // 已经达到最高等级，使用难度因子计算间隔
              interval = Math.round(interval * easeFactor);
            }
            level = Math.min(5, level + 1);
          }
          
          const nextReviewDate = new Date();
          nextReviewDate.setDate(nextReviewDate.getDate() + interval);
          
          return {
            reviewSchedule: {
              ...state.reviewSchedule,
              [wordId]: {
                ...plan,
                level,
                easeFactor,
                nextReviewDate: nextReviewDate.toISOString().split('T')[0],
                lastReviewDate: today,
                reviewCount,
              },
            },
          };
        });
      },
      
      getReviewStats: () => {
        const { reviewSchedule } = get();
        const today = new Date().toISOString().split('T')[0];
        
        const overdue = Object.values(reviewSchedule).filter(
          plan => plan.nextReviewDate < today
        ).length;
        
        const todayCount = Object.values(reviewSchedule).filter(
          plan => plan.nextReviewDate === today
        ).length;
        
        const total = Object.keys(reviewSchedule).length;
        
        return { overdue, today: todayCount, total };
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
          reviewSchedule: state.reviewSchedule,
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
            reviewSchedule: parsed.reviewSchedule || {},
          });
        } catch {
          console.error('Failed to import data');
        }
      },
      
      clearAllData: () => {
        set({
          userProgress: initialUserProgress,
          wordProgress: {},
          wrongAnswers: [],
          todayTasks: initialTodayTasks,
          history: [],
          wrongBook: [],
          translationWrongBook: [],
          writingHistory: [],
          reviewSchedule: {},
          isFirstTime: true,
        });
      },
    }),
    {
      name: 'cet4-app',
      storage: createJSONStorage(createDynamicStorage),
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
