export interface WritingTemplate {
  id: string;
  topic: string;
  category: 'education' | 'tech' | 'environment' | 'culture';
  templates: string[];
  examples: WritingExample[];
}

export interface WritingExample {
  title: string;
  content: string;
}

export const writingTemplates: WritingTemplate[] = [
  {
    id: 'w1',
    topic: '教育',
    category: 'education',
    templates: [
      'Nowadays, there is a growing concern about ______. Some people believe that ______, while others argue that ______. In my opinion, ______.',
      'The importance of ______ cannot be overemphasized. It plays a crucial role in ______. However, there are still many challenges that need to be addressed.',
      'With the development of ______, ______ has become increasingly important. This essay will discuss the benefits and drawbacks of ______.',
    ],
    examples: [
      {
        title: 'The Importance of Higher Education',
        content:
          "Nowadays, higher education has become increasingly important in today's competitive job market. A college degree not only provides students with specialized knowledge and skills but also helps them develop critical thinking and problem-solving abilities.\n\nThere are several reasons why higher education is valuable. First, it opens up better career opportunities. Many employers require a minimum of a bachelor's degree for entry-level positions. Second, higher education helps individuals grow personally and intellectually, exposing them to new ideas and perspectives.\n\nHowever, the rising cost of tuition has made higher education unaffordable for many students. Governments and educational institutions should work together to make education more accessible.\n\nIn conclusion, investing in higher education is a wise decision that can yield long-term benefits for individuals and society as a whole.",
      },
    ],
  },
  {
    id: 'w2',
    topic: '科技',
    category: 'tech',
    templates: [
      'The rapid development of ______ has had a profound impact on ______. While it brings many benefits, it also raises concerns about ______.',
      'In recent years, ______ has transformed the way we ______. This technological advancement has both positive and negative implications.',
      'With the advent of ______, our lives have become more convenient. However, we must also consider the potential risks associated with ______.',
    ],
    examples: [
      {
        title: 'The Impact of Artificial Intelligence',
        content:
          'Artificial intelligence (AI) is rapidly transforming various aspects of our lives, from healthcare to transportation. AI-powered systems can analyze large amounts of data, automate complex tasks, and provide personalized services.\n\nThe benefits of AI are undeniable. In healthcare, AI can help diagnose diseases more accurately and develop personalized treatment plans. In transportation, self-driving cars have the potential to reduce accidents and traffic congestion.\n\nHowever, there are concerns about the ethical implications of AI, such as job displacement and privacy issues. As AI continues to develop, it is important to establish regulations and guidelines to ensure its responsible use.\n\nIn conclusion, AI has the potential to greatly improve our lives, but we must approach its development with caution and responsibility.',
      },
    ],
  },
  {
    id: 'w3',
    topic: '环保',
    category: 'environment',
    templates: [
      'Environmental protection has become a pressing issue in recent years. Human activities have caused significant damage to ______, and immediate action is needed to ______.',
      'The importance of protecting the environment cannot be overstated. We must take steps to ______ before it is too late.',
      'Climate change poses a serious threat to our planet. Governments, organizations, and individuals all have a role to play in ______.',
    ],
    examples: [
      {
        title: 'Protecting Our Environment',
        content:
          'Environmental protection is one of the most important issues facing our planet today. Human activities such as pollution, deforestation, and overfishing have caused significant damage to ecosystems worldwide.\n\nThere are several steps we can take to protect the environment. First, we should reduce our carbon footprint by using public transportation, conserving energy, and recycling. Second, governments should implement stricter environmental regulations and promote sustainable practices.\n\nIndividuals also have a responsibility to protect the environment. Simple actions like using reusable bags, conserving water, and planting trees can make a big difference.\n\nIn conclusion, protecting the environment is not just a choice but a necessity. We must act now to ensure a sustainable future for generations to come.',
      },
    ],
  },
  {
    id: 'w4',
    topic: '文化',
    category: 'culture',
    templates: [
      'Cultural diversity is a valuable asset that enriches our society. Each culture has its unique traditions, values, and customs that contribute to ______.',
      "In today's globalized world, cultural exchange has become more important than ever. It allows people to ______ and appreciate different ways of life.",
      'Preserving cultural heritage is essential for maintaining our identity. We should take steps to ______ and pass them on to future generations.',
    ],
    examples: [
      {
        title: 'The Importance of Cultural Diversity',
        content:
          'Cultural diversity is one of the greatest strengths of our global society. Each culture brings unique traditions, values, and perspectives that enrich our understanding of the world.\n\nCultural diversity promotes creativity and innovation. When people from different backgrounds come together, they bring new ideas and approaches to problem-solving. It also fosters tolerance and understanding, helping to break down stereotypes and prejudices.\n\nHowever, globalization has led to the erosion of some traditional cultures. It is important to preserve cultural heritage while embracing modernization.\n\nIn conclusion, cultural diversity is essential for a vibrant and inclusive society. We should celebrate our differences and learn from one another.',
      },
    ],
  },
];

export const translationExamples = [
  {
    id: 't1',
    chinese: '随着经济的发展，越来越多的人开始关注环境保护问题。',
    english:
      'With the development of the economy, more and more people are beginning to pay attention to environmental protection.',
  },
  {
    id: 't2',
    chinese: '教育是一个国家发展的基石，政府应该加大对教育的投入。',
    english:
      "Education is the cornerstone of a country's development, and the government should increase investment in education.",
  },
  {
    id: 't3',
    chinese: '科技的进步改变了我们的生活方式，让我们的生活更加便捷。',
    english:
      'Advancements in technology have changed our way of life, making our lives more convenient.',
  },
  {
    id: 't4',
    chinese: '文化交流有助于增进不同国家人民之间的理解和友谊。',
    english:
      'Cultural exchange helps promote understanding and friendship between people from different countries.',
  },
  {
    id: 't5',
    chinese: '保护环境是每个人的责任，我们应该从身边的小事做起。',
    english:
      "Protecting the environment is everyone's responsibility, and we should start with small things around us.",
  },
];
