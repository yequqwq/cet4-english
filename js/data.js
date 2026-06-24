/**
 * CET-4 英语学习系统 - 数据层
 * 封装 LocalStorage 数据操作，提供统一的数据访问接口
 */

const Data = (() => {
  // 数据存储键名
  const STORAGE_KEY = 'cet4_data';

  // 默认数据结构模板（首次访问时自动初始化）
  const defaultData = {
    user: {
      name: '学习者',
      streakDays: 1,
      totalMinutes: 0,
      totalWords: 0,
      todayMinutes: 0,
      lastStudyDate: new Date().toISOString().split('T')[0]
    },
    words: [
      // 四级高频词汇 - 50个
      { id: 1, word: 'abandon', phonetic: '/əˈbændən/', meaning: '放弃，遗弃', example: 'He abandoned his car and ran for help.', translation: '他弃车跑去求救。', category: '高频动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 2, word: 'ability', phonetic: '/əˈbɪləti/', meaning: '能力，才能', example: 'She has the ability to speak three languages.', translation: '她有说三种语言的能力。', category: '名词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 3, word: 'able', phonetic: '/ˈeɪbl/', meaning: '能够的，有能力的', example: 'He is able to finish the task on time.', translation: '他能够按时完成任务。', category: '形容词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 4, word: 'about', phonetic: '/əˈbaʊt/', meaning: '关于，大约', example: 'What is the book about?', translation: '这本书是关于什么的？', category: '介词/副词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 5, word: 'above', phonetic: '/əˈbʌv/', meaning: '在...上面', example: 'The bird flew above the tree.', translation: '鸟从树上方飞过。', category: '介词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 6, word: 'abroad', phonetic: '/əˈbrɔːd/', meaning: '在国外，到海外', example: 'She studied abroad for two years.', translation: '她在国外留学了两年。', category: '副词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 7, word: 'absence', phonetic: '/ˈæbsəns/', meaning: '缺席，缺乏', example: 'His absence was noticed by everyone.', translation: '每个人都注意到了他的缺席。', category: '名词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 8, word: 'absolute', phonetic: '/ˈæbsəluːt/', meaning: '绝对的，完全的', example: 'This is an absolute necessity.', translation: '这是绝对必要的。', category: '形容词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 9, word: 'absorb', phonetic: '/əbˈzɔːrb/', meaning: '吸收，理解', example: 'Plants absorb water from the soil.', translation: '植物从土壤中吸收水分。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 10, word: 'abstract', phonetic: '/ˈæbstrækt/', meaning: '抽象的，摘要', example: 'The concept is too abstract for children.', translation: '这个概念对儿童来说太抽象了。', category: '形容词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 11, word: 'academic', phonetic: '/ˌækəˈdemɪk/', meaning: '学术的，大学教师', example: 'He has excellent academic achievements.', translation: '他有出色的学术成就。', category: '形容词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 12, word: 'accept', phonetic: '/əkˈsept/', meaning: '接受，承认', example: 'Please accept my sincere apologies.', translation: '请接受我真诚的道歉。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 13, word: 'access', phonetic: '/ˈækses/', meaning: '进入，访问', example: 'You need a password to access the system.', translation: '你需要密码来访问系统。', category: '名词/动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 14, word: 'accident', phonetic: '/ˈæksɪdənt/', meaning: '事故，意外', example: 'The accident caused a traffic jam.', translation: '这起事故造成了交通堵塞。', category: '名词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 15, word: 'accomplish', phonetic: '/əˈkʌmplɪʃ/', meaning: '完成，达到', example: 'We accomplished our goal ahead of schedule.', translation: '我们提前完成了目标。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 16, word: 'according', phonetic: '/əˈkɔːrdɪŋ/', meaning: '相符的，一致的', example: 'According to the weather forecast, it will rain.', translation: '根据天气预报，将会下雨。', category: '介词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 17, word: 'account', phonetic: '/əˈkaʊnt/', meaning: '账户，说明', example: 'I opened a bank account yesterday.', translation: '我昨天开了个银行账户。', category: '名词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 18, word: 'accurate', phonetic: '/ˈækjərət/', meaning: '准确的，精确的', example: 'The data needs to be accurate.', translation: '数据需要准确。', category: '形容词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 19, word: 'achieve', phonetic: '/əˈtʃiːv/', meaning: '完成，达到，成功', example: 'She achieved excellent results in the exam.', translation: '她在考试中取得了优异的成绩。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 20, word: 'acknowledge', phonetic: '/əkˈnɒlɪdʒ/', meaning: '承认，确认', example: 'I acknowledge my mistakes.', translation: '我承认我的错误。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 21, word: 'acquire', phonetic: '/əˈkwaɪər/', meaning: '获得，学到', example: 'The company acquired new technology.', translation: '这家公司获得了新技术。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 22, word: 'adapt', phonetic: '/əˈdæpt/', meaning: '使适应，改编', example: 'We need to adapt to the new environment.', translation: '我们需要适应新环境。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 23, word: 'adequate', phonetic: '/ˈædɪkwət/', meaning: '足够的，适当的', example: 'The food is adequate for everyone.', translation: '食物对每个人来说都足够。', category: '形容词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 24, word: 'adjust', phonetic: '/əˈdʒʌst/', meaning: '调整，适应', example: 'Please adjust your seat belt.', translation: '请调整你的安全带。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 25, word: 'administration', phonetic: '/ədˌmɪnɪˈstreɪʃn/', meaning: '管理，行政', example: 'The school administration approved the plan.', translation: '学校管理层批准了这个计划。', category: '名词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 26, word: 'admire', phonetic: '/ədˈmaɪər/', meaning: '钦佩，欣赏', example: 'I admire your courage.', translation: '我钦佩你的勇气。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 27, word: 'admit', phonetic: '/ədˈmɪt/', meaning: '承认，准许进入', example: 'He admitted his fault.', translation: '他承认了自己的错误。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 28, word: 'adopt', phonetic: '/əˈdɒpt/', meaning: '采用，收养', example: 'The committee adopted a new policy.', translation: '委员会通过了一项新政策。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 29, word: 'adult', phonetic: '/ˈædʌlt/', meaning: '成年人，成年的', example: 'This movie is for adults only.', translation: '这部电影仅限成人观看。', category: '名词/形容词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 30, word: 'advance', phonetic: '/ədˈvæns/', meaning: '前进，进展', example: 'Technology continues to advance rapidly.', translation: '科技持续快速发展。', category: '动词/名词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 31, word: 'advantage', phonetic: '/ədˈvæntɪdʒ/', meaning: '优势，好处', example: 'There are many advantages to living in the city.', translation: '住在城市有很多好处。', category: '名词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 32, word: 'adventure', phonetic: '/ədˈventʃər/', meaning: '冒险，奇遇', example: 'The journey was an exciting adventure.', translation: '这趟旅程是一次刺激的冒险。', category: '名词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 33, word: 'advertise', phonetic: '/ˈædvərtaɪz/', meaning: '宣传，做广告', example: 'They decided to advertise the product.', translation: '他们决定为这个产品做广告。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 34, word: 'advice', phonetic: '/ədˈvaɪs/', meaning: '建议，劝告', example: 'Thank you for your advice.', translation: '谢谢你的建议。', category: '名词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 35, word: 'advise', phonetic: '/ədˈvaɪz/', meaning: '建议，劝告', example: 'I advise you to start early.', translation: '我建议你早点开始。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 36, word: 'affect', phonetic: '/əˈfekt/', meaning: '影响，感动', example: 'The weather will affect our plans.', translation: '天气会影响我们的计划。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 37, word: 'afford', phonetic: '/əˈfɔːrd/', meaning: '负担得起，提供', example: 'I cannot afford to buy a new car.', translation: '我买不起新车。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 38, word: 'afraid', phonetic: '/əˈfreɪd/', meaning: '害怕的，担心', example: 'She is afraid of heights.', translation: '她恐高。', category: '形容词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 39, word: 'after', phonetic: '/ˈæftər/', meaning: '在...之后', example: 'We will leave after lunch.', translation: '我们午饭后离开。', category: '介词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 40, word: 'afternoon', phonetic: '/ˌæftərˈnuːn/', meaning: '下午', example: 'See you this afternoon.', translation: '下午见。', category: '名词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 41, word: 'again', phonetic: '/əˈɡen/', meaning: '再一次', example: 'Please try again.', translation: '请再试一次。', category: '副词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 42, word: 'against', phonetic: '/əˈɡenst/', meaning: '反对，靠着', example: 'No one is against this proposal.', translation: '没有人反对这个提议。', category: '介词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 43, word: 'age', phonetic: '/eɪdʒ/', meaning: '年龄，时代', example: 'What is your age?', translation: '你多大了？', category: '名词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 44, word: 'agency', phonetic: '/ˈeɪdʒənsi/', meaning: '代理，机构', example: 'I booked the hotel through a travel agency.', translation: '我通过旅行社订的酒店。', category: '名词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 45, word: 'agent', phonetic: '/ˈeɪdʒənt/', meaning: '代理人，经纪人', example: 'The insurance agent helped us.', translation: '保险经纪人帮助了我们。', category: '名词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 46, word: 'agree', phonetic: '/əˈɡriː/', meaning: '同意，一致', example: 'I agree with your opinion.', translation: '我同意你的观点。', category: '动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 47, word: 'agreement', phonetic: '/əˈɡriːmənt/', meaning: '协议，同意', example: 'We reached an agreement yesterday.', translation: '我们昨天达成了协议。', category: '名词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 48, word: 'ahead', phonetic: '/əˈhed/', meaning: '在前面，提前', example: 'Go straight ahead.', translation: '一直往前走。', category: '副词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 49, word: 'aid', phonetic: '/eɪd/', meaning: '援助，帮助', example: 'First aid is important.', translation: '急救很重要。', category: '名词/动词', status: 'new', wrongCount: 0, lastReview: null },
      { id: 50, word: 'aim', phonetic: '/eɪm/', meaning: '瞄准，旨在', example: 'We aim to finish the project by December.', translation: '我们的目标是在十二月前完成项目。', category: '动词/名词', status: 'new', wrongCount: 0, lastReview: null }
    ],
    todayTasks: [
      { id: 1, title: '学习20个新单词', type: 'vocabulary', completed: false, progress: 0, target: 20 },
      { id: 2, title: '完成1篇听力练习', type: 'listening', completed: false, progress: 0, target: 1 },
      { id: 3, title: '阅读1篇文章', type: 'reading', completed: false, progress: 0, target: 1 },
      { id: 4, title: '复习错题本', type: 'review', completed: false, progress: 0, target: 10 }
    ],
    history: [],
    wrongBook: [],
    settings: {
      darkMode: false,
      dailyGoal: 20
    }
  };

  // 内部存储
  let data = null;

  /**
   * 深度合并对象
   */
  function deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  /**
   * 从 LocalStorage 加载数据
   */
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load data from localStorage:', e);
    }
    return null;
  }

  /**
   * 保存数据到 LocalStorage
   */
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data to localStorage:', e);
    }
  }

  /**
   * 检查并重置每日数据
   */
  function checkDailyReset() {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = data.user.lastStudyDate;

    if (lastDate !== today) {
      // 重置今日学习时间
      data.user.todayMinutes = 0;
      data.user.lastStudyDate = today;

      // 检查连续打卡
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastDate === yesterdayStr) {
        data.user.streakDays += 1;
      } else if (lastDate && lastDate !== today) {
        data.user.streakDays = 1;
      }

      // 重置今日任务
      data.todayTasks = defaultData.todayTasks.map(task => ({ ...task }));

      saveToStorage();
    }
  }

  /**
   * 更新学习历史记录
   */
  function updateHistory(minutes, wordsLearned) {
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = data.history.findIndex(h => h.date === today);

    if (existingIndex >= 0) {
      data.history[existingIndex].minutes += minutes;
      data.history[existingIndex].wordsLearned += wordsLearned;
    } else {
      data.history.push({
        date: today,
        minutes: minutes,
        wordsLearned: wordsLearned,
        wordsReviewed: 0
      });
    }

    // 保持最近30天的历史记录
    if (data.history.length > 30) {
      data.history = data.history.slice(-30);
    }
  }

  return {
    /**
     * 初始化数据（首次访问时调用）
     */
    init() {
      const stored = loadFromStorage();
      if (stored) {
        data = deepMerge(JSON.parse(JSON.stringify(defaultData)), stored);
      } else {
        data = JSON.parse(JSON.stringify(defaultData));
      }
      checkDailyReset();
      saveToStorage();
      return data;
    },

    /**
     * 读取数据
     * @param {string} key - 要读取的键名（支持点号分隔的嵌套路径，如 'user.name'）
     * @returns {*} 对应的值
     */
    get(key) {
      if (!data) this.init();

      if (!key) return data;

      // 支持点号分隔的嵌套路径
      const keys = key.split('.');
      let value = data;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return undefined;
        }
      }

      return value;
    },

    /**
     * 保存数据
     * @param {string} key - 键名（支持点号分隔的嵌套路径）
     * @param {*} value - 要保存的值
     */
    set(key, value) {
      if (!data) this.init();

      if (!key) return;

      const keys = key.split('.');
      let target = data;

      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!(k in target) || typeof target[k] !== 'object') {
          target[k] = {};
        }
        target = target[k];
      }

      target[keys[keys.length - 1]] = value;
      saveToStorage();
    },

    /**
     * 更新数据（深度合并）
     * @param {string} key - 键名
     * @param {*} updates - 要更新的值
     */
    update(key, updates) {
      if (!data) this.init();

      const current = this.get(key);
      if (typeof current === 'object' && typeof updates === 'object') {
        this.set(key, deepMerge(current, updates));
      } else {
        this.set(key, updates);
      }
    },

    /**
     * 加入错题本
     * @param {number} wordId - 单词ID
     */
    addWrong(wordId) {
      if (!data) this.init();

      if (!data.wrongBook.includes(wordId)) {
        data.wrongBook.push(wordId);

        // 更新单词的错题次数
        const word = data.words.find(w => w.id === wordId);
        if (word) {
          word.wrongCount = (word.wrongCount || 0) + 1;
        }

        saveToStorage();
      }
    },

    /**
     * 从错题本移除
     * @param {number} wordId - 单词ID
     */
    removeWrong(wordId) {
      if (!data) this.init();

      const index = data.wrongBook.indexOf(wordId);
      if (index > -1) {
        data.wrongBook.splice(index, 1);

        // 重置单词的错题次数
        const word = data.words.find(w => w.id === wordId);
        if (word) {
          word.wrongCount = 0;
        }

        saveToStorage();
      }
    },

    /**
     * 记录学习时长
     * @param {number} minutes - 分钟数
     */
    recordTime(minutes) {
      if (!data) this.init();

      data.user.totalMinutes += minutes;
      data.user.todayMinutes += minutes;
      updateHistory(minutes, 0);
      saveToStorage();
    },

    /**
     * 标记任务完成
     * @param {number} taskId - 任务ID
     */
    completeTask(taskId) {
      if (!data) this.init();

      const task = data.todayTasks.find(t => t.id === taskId);
      if (task) {
        task.completed = true;
        task.progress = task.target;
        saveToStorage();
      }
    },

    /**
     * 更新任务进度
     * @param {number} taskId - 任务ID
     * @param {number} progress - 当前进度
     */
    updateTaskProgress(taskId, progress) {
      if (!data) this.init();

      const task = data.todayTasks.find(t => t.id === taskId);
      if (task) {
        task.progress = Math.min(progress, task.target);
        if (task.progress >= task.target) {
          task.completed = true;
        }
        saveToStorage();
      }
    },

    /**
     * 获取今日任务
     * @returns {Array} 今日任务列表
     */
    getTodayTasks() {
      if (!data) this.init();
      if (!data.todayTasks || !Array.isArray(data.todayTasks)) {
        return [];
      }
      return data.todayTasks;
    },

    /**
     * 获取已掌握单词数
     * @returns {number} 已掌握单词数量
     */
    getMasteredCount() {
      if (!data) this.init();
      if (!data.words || !Array.isArray(data.words)) return 0;
      return data.words.filter(w => w.status === 'mastered').length;
    },

    /**
     * 按状态筛选单词
     * @param {string} status - 状态：new, learning, mastered
     * @returns {Array} 符合条件的单词列表
     */
    getWordsByStatus(status) {
      if (!data) this.init();
      if (!data.words || !Array.isArray(data.words)) return [];

      if (!status || status === 'all') {
        return data.words;
      }

      return data.words.filter(w => w.status === status);
    },

    /**
     * 更新单词状态
     * @param {string} wordId - 单词ID
     * @param {string} status - 新状态：new, learning, mastered
     */
    updateWordStatus(wordId, status) {
      if (!data) this.init();

      const word = data.words.find(w => w.id === wordId);
      if (word) {
        const oldStatus = word.status;
        word.status = status;

        // 如果标记为掌握，增加已学单词数
        if (status === 'mastered' && oldStatus !== 'mastered') {
          data.user.totalWords += 1;
        }

        saveToStorage();
      }
    },

    /**
     * 获取单词详情
     * @param {string} wordId - 单词ID
     * @returns {Object|null} 单词对象
     */
    getWord(wordId) {
      if (!data) this.init();
      return data.words.find(w => w.id === wordId) || null;
    },

    /**
     * 获取错题本单词列表
     * @returns {Array} 错题本中的单词
     */
    getWrongBook() {
      if (!data) this.init();
      if (!data.wrongBook || !Array.isArray(data.wrongBook)) {
        return [];
      }
      if (!data.words || !Array.isArray(data.words)) {
        return [];
      }
      return data.wrongBook.map(id => data.words.find(w => w.id === id)).filter(Boolean);
    },

    /**
     * 获取学习历史
     * @param {number} days - 获取最近几天的历史
     * @returns {Array} 历史记录
     */
    getHistory(days = 7) {
      if (!data) this.init();
      return data.history.slice(-days);
    },

    /**
     * 重置所有数据
     */
    reset() {
      data = JSON.parse(JSON.stringify(defaultData));
      saveToStorage();
    },

    /**
     * 导出数据
     * @returns {string} JSON字符串
     */
    export() {
      if (!data) this.init();
      return JSON.stringify(data, null, 2);
    },

    /**
     * 导入数据
     * @param {string} jsonString - JSON字符串
     */
    import(jsonString) {
      try {
        const imported = JSON.parse(jsonString);
        data = deepMerge(JSON.parse(JSON.stringify(defaultData)), imported);
        saveToStorage();
        return true;
      } catch (e) {
        console.error('Failed to import data:', e);
        return false;
      }
    }
  };
})();

// 页面加载时自动初始化
document.addEventListener('DOMContentLoaded', () => {
  Data.init();
});
