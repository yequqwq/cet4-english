export interface ListeningQuestion {
  id: string;
  type: 'short' | 'long' | 'news';
  audioText: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const listeningQuestions: ListeningQuestion[] = [
  {
    id: 'l1',
    type: 'short',
    audioText: 'W: Excuse me, could you tell me where the library is?\nM: Sure, it\'s on the second floor, next to the computer lab.',
    question: 'Where is the library?',
    options: ['On the first floor', 'On the second floor', 'Next to the cafeteria', 'Next to the gym'],
    answer: 1,
    explanation: '男士说图书馆在二楼，在计算机实验室旁边。',
  },
  {
    id: 'l2',
    type: 'short',
    audioText: 'M: I heard you got an A in the English exam. Congratulations!\nW: Thank you. I studied really hard for it.',
    question: 'What did the woman get in the English exam?',
    options: ['A B', 'An A', 'A C', 'An F'],
    answer: 1,
    explanation: '男士祝贺女士在英语考试中获得了A。',
  },
  {
    id: 'l3',
    type: 'short',
    audioText: 'W: Would you like some coffee or tea?\nM: Neither, thanks. I prefer water.',
    question: 'What does the man prefer?',
    options: ['Coffee', 'Tea', 'Water', 'Juice'],
    answer: 2,
    explanation: '男士说他既不要咖啡也不要茶，他更喜欢水。',
  },
  {
    id: 'l4',
    type: 'short',
    audioText: 'M: When is the deadline for the assignment?\nW: It\'s due next Friday at 5 pm.',
    question: 'When is the assignment due?',
    options: ['This Friday', 'Next Friday', 'This Monday', 'Next Monday'],
    answer: 1,
    explanation: '女士说作业在下周五下午5点截止。',
  },
  {
    id: 'l5',
    type: 'short',
    audioText: 'W: I\'m thinking of taking a computer course.\nM: That\'s a good idea. It will help you with your studies.',
    question: 'What does the man think of the woman\'s idea?',
    options: ['He disagrees', 'He thinks it\'s good', 'He is unsure', 'He thinks it\'s too expensive'],
    answer: 1,
    explanation: '男士说这是个好主意，会对学习有帮助。',
  },
  {
    id: 'l6',
    type: 'news',
    audioText: 'Scientists have announced a breakthrough in renewable energy technology. The new solar panel design can convert sunlight into electricity with an efficiency rate of over 40%, which is significantly higher than current models. This development could make solar energy more affordable and accessible for households around the world.',
    question: 'What is the main idea of this news?',
    options: ['A new solar panel design with high efficiency', 'The cost of solar energy has increased', 'Scientists have discovered a new energy source', 'Solar energy is now available worldwide'],
    answer: 0,
    explanation: '新闻主要讲述科学家宣布了可再生能源技术的突破，新的太阳能电池板设计效率超过40%。',
  },
  {
    id: 'l7',
    type: 'news',
    audioText: 'The government has launched a new initiative to promote reading among young people. The program includes building more community libraries, organizing reading clubs, and providing free books to schools. Officials hope this will encourage a love of reading and improve literacy rates.',
    question: 'What is the purpose of the government initiative?',
    options: ['To build more schools', 'To promote reading among young people', 'To provide free computers', 'To improve internet access'],
    answer: 1,
    explanation: '政府发起新倡议的目的是促进年轻人阅读。',
  },
  {
    id: 'l8',
    type: 'long',
    audioText: 'M: Hi, I\'m interested in joining the photography club.\nW: Great! We meet every Wednesday evening at 7 pm in the art room.\nM: What do you usually do at the meetings?\nW: We have workshops, photo contests, and sometimes we go on field trips to take photos.\nM: Do I need to have any experience?\nW: No, beginners are welcome. We have members at all skill levels.\nM: How much does it cost to join?\nW: It\'s free for students. We just ask that you attend regularly.',
    question: 'When does the photography club meet?',
    options: ['Every Monday evening', 'Every Wednesday evening', 'Every Friday evening', 'Every Saturday morning'],
    answer: 1,
    explanation: '女士说摄影俱乐部每周三晚上7点在美术室聚会。',
  },
  {
    id: 'l9',
    type: 'long',
    audioText: 'M: Hi, I\'m interested in joining the photography club.\nW: Great! We meet every Wednesday evening at 7 pm in the art room.\nM: What do you usually do at the meetings?\nW: We have workshops, photo contests, and sometimes we go on field trips to take photos.\nM: Do I need to have any experience?\nW: No, beginners are welcome. We have members at all skill levels.\nM: How much does it cost to join?\nW: It\'s free for students. We just ask that you attend regularly.',
    question: 'Do you need experience to join the photography club?',
    options: ['Yes, you need professional experience', 'Yes, you need some basic experience', 'No, beginners are welcome', 'No, but you need to pay a fee'],
    answer: 2,
    explanation: '女士说不需要经验，初学者也欢迎加入。',
  },
  {
    id: 'l10',
    type: 'long',
    audioText: 'M: Hi, I\'m interested in joining the photography club.\nW: Great! We meet every Wednesday evening at 7 pm in the art room.\nM: What do you usually do at the meetings?\nW: We have workshops, photo contests, and sometimes we go on field trips to take photos.\nM: Do I need to have any experience?\nW: No, beginners are welcome. We have members at all skill levels.\nM: How much does it cost to join?\nW: It\'s free for students. We just ask that you attend regularly.',
    question: 'How much does it cost for students to join?',
    options: ['10 dollars per month', '20 dollars per semester', 'It\'s free', '50 dollars per year'],
    answer: 2,
    explanation: '女士说对学生是免费的，只需要定期参加。',
  },
];

export const getListeningByType = (type: ListeningQuestion['type']): ListeningQuestion[] => {
  return listeningQuestions.filter((q) => q.type === type);
};
