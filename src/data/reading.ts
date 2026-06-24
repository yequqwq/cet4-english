export interface ReadingArticle {
  id: string;
  type: 'fill' | 'skimming' | 'careful';
  title: string;
  content: string;
  blanks?: string[];
  options?: string[];
  questions?: ReadingQuestion[];
}

export interface ReadingQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const readingArticles: ReadingArticle[] = [
  {
    id: 'r1',
    type: 'fill',
    title: 'The Importance of Learning English',
    content: 'Learning English is essential in today\'s globalized world. English is the most widely spoken language internationally, used in business, education, and communication across borders. Mastering English can open up countless opportunities for personal and professional growth.\n\nOne of the main benefits of learning English is improved career prospects. Many international companies require employees to have good English skills, and proficiency in English can lead to better job opportunities and higher salaries.\n\nAdditionally, learning English provides access to a wealth of information and resources. Most scientific research, books, and online content are published in English. Being able to read and understand English allows individuals to stay updated with the latest developments in their fields.\n\nFurthermore, English is the language of international travel. Whether for tourism, study abroad, or business trips, knowing English makes it easier to communicate with people from different countries and cultures.\n\nIn conclusion, investing time and effort in learning English is a wise decision that can yield significant returns throughout one\'s life.',
    blanks: ['international', 'opportunities', 'career', 'information', 'travel'],
    options: ['international', 'national', 'regional', 'local', 'opportunities', 'problems', 'challenges', 'difficulties', 'career', 'education', 'health', 'finance', 'information', 'technology', 'entertainment', 'sports', 'travel', 'work', 'study', 'life'],
  },
  {
    id: 'r2',
    type: 'skimming',
    title: 'Climate Change and Its Effects',
    content: 'Climate change is one of the most pressing issues facing our planet today. The Earth\'s average temperature has been rising steadily over the past century, primarily due to human activities such as burning fossil fuels and deforestation.\n\nThe effects of climate change are wide-ranging and include rising sea levels, more frequent extreme weather events, and changes in precipitation patterns. These changes have significant impacts on ecosystems, agriculture, and human communities.\n\nOne of the most visible effects is the melting of polar ice caps and glaciers. This not only contributes to rising sea levels but also disrupts wildlife habitats. Many species are facing extinction as their natural environments change.\n\nAnother major concern is the impact on agriculture. Changes in temperature and rainfall patterns can affect crop yields, leading to food shortages in vulnerable regions. This could exacerbate poverty and hunger worldwide.\n\nAddressing climate change requires global cooperation and individual action. Governments must implement policies to reduce carbon emissions, while individuals can make sustainable choices in their daily lives.',
    questions: [
      {
        id: 'r2q1',
        question: 'What is the main cause of climate change according to the passage?',
        options: ['Natural disasters', 'Human activities', 'Solar radiation', 'Ocean currents'],
        answer: 1,
        explanation: '文章提到气候变化主要是由于人类活动如燃烧化石燃料和砍伐森林造成的。',
      },
      {
        id: 'r2q2',
        question: 'What is one visible effect of climate change?',
        options: ['Increased biodiversity', 'Melting polar ice caps', 'Decreased sea levels', 'More stable weather'],
        answer: 1,
        explanation: '文章提到气候变化最明显的影响之一是极地冰盖和冰川的融化。',
      },
      {
        id: 'r2q3',
        question: 'How does climate change affect agriculture?',
        options: ['Improves crop yields', 'Stabilizes rainfall patterns', 'Can lead to food shortages', 'Increases soil fertility'],
        answer: 2,
        explanation: '文章提到温度和降雨模式的变化会影响作物产量，导致脆弱地区的粮食短缺。',
      },
    ],
  },
  {
    id: 'r3',
    type: 'careful',
    title: 'The History of the Internet',
    content: 'The Internet has become an integral part of modern life, but its origins date back to the 1960s. The first network, called ARPANET, was developed by the United States Department of Defense as a way to connect computers at different universities and research institutions.\n\nIn the 1970s, the concept of packet switching was developed, which allowed data to be broken down into small packets and sent across multiple paths. This technology became the foundation of the modern Internet.\n\nThe 1980s saw the introduction of the Domain Name System (DNS), which made it easier for users to navigate the Internet using human-readable addresses instead of numerical IP addresses. This was a crucial development that made the Internet accessible to a wider audience.\n\nThe 1990s marked the beginning of the World Wide Web, with the development of HTML and the first web browser. This allowed users to access information through graphical interfaces, transforming the Internet from a primarily text-based system into a multimedia platform.\n\nToday, the Internet connects billions of devices worldwide and continues to evolve with new technologies such as cloud computing, artificial intelligence, and the Internet of Things.',
    questions: [
      {
        id: 'r3q1',
        question: 'When was the first network, ARPANET, developed?',
        options: ['1950s', '1960s', '1970s', '1980s'],
        answer: 1,
        explanation: '文章提到互联网的起源可以追溯到20世纪60年代，第一个网络ARPANET是在那个时期开发的。',
      },
      {
        id: 'r3q2',
        question: 'What technology became the foundation of the modern Internet?',
        options: ['HTML', 'DNS', 'Packet switching', 'Web browsers'],
        answer: 2,
        explanation: '文章提到分组交换技术成为现代互联网的基础。',
      },
      {
        id: 'r3q3',
        question: 'What made the Internet accessible to a wider audience?',
        options: ['ARPANET', 'Packet switching', 'Domain Name System', 'World Wide Web'],
        answer: 2,
        explanation: '文章提到域名系统(DNS)使得用户可以使用人类可读的地址而不是数字IP地址来浏览互联网，这使得互联网对更广泛的受众开放。',
      },
      {
        id: 'r3q4',
        question: 'When did the World Wide Web begin?',
        options: ['1970s', '1980s', '1990s', '2000s'],
        answer: 2,
        explanation: '文章提到20世纪90年代标志着万维网的开始。',
      },
    ],
  },
];

export const getReadingByType = (type: ReadingArticle['type']): ReadingArticle[] => {
  return readingArticles.filter((article) => article.type === type);
};
