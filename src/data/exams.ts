export interface ExamQuestion {
  id: string;
  type: 'listening' | 'reading' | 'translation' | 'writing';
  question: string;
  options?: string[];
  answer: string | number;
  explanation: string;
}

export interface Exam {
  id: string;
  title: string;
  duration: number;
  questions: ExamQuestion[];
  totalScore: number;
}

export const exams: Exam[] = [
  {
    id: 'exam1',
    title: '四级模拟考试一',
    duration: 130,
    totalScore: 710,
    questions: [
      {
        id: 'e1-1',
        type: 'listening',
        question:
          'W: How often do you exercise?\nM: I try to exercise three times a week, usually on Monday, Wednesday, and Friday.\n\nQ: How often does the man exercise?',
        options: ['Once a week', 'Twice a week', 'Three times a week', 'Four times a week'],
        answer: 2,
        explanation: '男士说他每周锻炼三次，通常在周一、周三和周五。',
      },
      {
        id: 'e1-2',
        type: 'listening',
        question:
          'M: What time does the movie start?\nW: It starts at 7:30, but we should arrive at least 15 minutes early to get good seats.\n\nQ: When should they arrive?',
        options: ['7:00', '7:15', '7:30', '7:45'],
        answer: 1,
        explanation: '电影7:30开始，女士说他们应该至少提前15分钟到达，所以应该7:15到达。',
      },
      {
        id: 'e1-3',
        type: 'reading',
        question: 'According to the passage, what is the main benefit of learning English?',
        options: [
          'Improved career prospects',
          'Better physical health',
          'More travel opportunities',
          'Stronger family relationships',
        ],
        answer: 0,
        explanation: '文章提到学习英语的主要好处之一是改善职业前景。',
      },
      {
        id: 'e1-4',
        type: 'reading',
        question: 'Which of the following words can best replace "essential" in the sentence?',
        options: ['Optional', 'Important', 'Difficult', 'Interesting'],
        answer: 1,
        explanation: 'essential的意思是"必不可少的"，与important意思最接近。',
      },
      {
        id: 'e1-5',
        type: 'translation',
        question: '翻译句子：随着科技的发展，人们的生活变得越来越便捷。',
        answer:
          "With the development of technology, people's lives have become increasingly convenient.",
        explanation:
          '注意"随着"翻译为"with"，"科技的发展"翻译为"the development of technology"，"越来越便捷"翻译为"increasingly convenient"。',
      },
    ],
  },
  {
    id: 'exam2',
    title: '四级模拟考试二',
    duration: 130,
    totalScore: 710,
    questions: [
      {
        id: 'e2-1',
        type: 'listening',
        question:
          'W: I need to buy a new laptop. Do you have any recommendations?\nM: I think the latest model from TechCorp is a good choice. It has a fast processor and a long battery life.\n\nQ: What does the man recommend?',
        options: [
          'A desktop computer',
          'The latest TechCorp laptop',
          'A tablet',
          'A second-hand laptop',
        ],
        answer: 1,
        explanation: '男士推荐TechCorp的最新款笔记本电脑。',
      },
      {
        id: 'e2-2',
        type: 'listening',
        question:
          "M: How much does this textbook cost?\nW: It's $45, but students get a 20% discount.\n\nQ: How much will a student pay for the textbook?",
        options: ['$36', '$40', '$45', '$54'],
        answer: 0,
        explanation: '原价$45，学生打8折，所以是$45 * 0.8 = $36。',
      },
      {
        id: 'e2-3',
        type: 'reading',
        question: "What is the author's attitude towards artificial intelligence?",
        options: ['Completely positive', 'Completely negative', 'Neutral', 'Cautiously optimistic'],
        answer: 3,
        explanation: '作者既提到了人工智能的好处，也提到了潜在的风险，因此是谨慎乐观的态度。',
      },
      {
        id: 'e2-4',
        type: 'reading',
        question: 'The word "erosion" in the passage most probably means:',
        options: ['Growth', 'Destruction', 'Protection', 'Expansion'],
        answer: 1,
        explanation: 'erosion的意思是"侵蚀、破坏"，与destruction意思最接近。',
      },
      {
        id: 'e2-5',
        type: 'translation',
        question: '翻译句子：保护环境是我们每个人的责任。',
        answer: "Protecting the environment is everyone's responsibility.",
        explanation:
          '注意"保护环境"翻译为"protecting the environment"，"每个人的责任"翻译为"everyone\'s responsibility"。',
      },
    ],
  },
];

export const getExamById = (id: string): Exam | undefined => {
  return exams.find((exam) => exam.id === id);
};
