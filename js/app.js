/**
 * CET-4 英语学习系统 - 主应用入口
 * 负责初始化、数据绑定和全局功能
 */

// 全局函数：显示指定页面
function showPage(pageId) {
  if (typeof Router !== 'undefined') {
    Router.showPage(pageId);
  } else {
    console.error('Router 模块未加载');
  }
}

// 全局函数：获取当前页面
function getCurrentPage() {
  if (typeof Router !== 'undefined') {
    return Router.getCurrentPage();
  }
  return null;
}

// 全局函数：获取学习统计
function getStudyStats() {
  return {
    totalWords: Data.getMasteredCount(),
    totalMinutes: Data.get('user.totalMinutes') || 0,
    streakDays: Data.get('user.streakDays') || 1,
    todayMinutes: Data.get('user.todayMinutes') || 0
  };
}

// 全局函数：更新今日任务
function updateTaskProgress(taskId, progress) {
  Data.updateTaskProgress(taskId, progress);
  // 刷新页面任务显示
  if (typeof renderTasks === 'function') {
    renderTasks();
  }
}

// 全局函数：完成任务
function completeTask(taskId) {
  Data.completeTask(taskId);
  // 刷新页面任务显示
  if (typeof renderTasks === 'function') {
    renderTasks();
  }
}

// 全局函数：记录学习
function recordStudy(minutes, wordCount = 0) {
  Data.recordTime(minutes);
  // 更新单词学习进度
  if (wordCount > 0) {
    const tasks = Data.getTodayTasks();
    if (tasks && tasks[0]) {
      updateTaskProgress(1, (tasks[0].progress || 0) + wordCount);
    }
  }
}

// 全局函数：添加错题
function addToWrongBook(wordId) {
  Data.addWrong(wordId);
}

// 全局函数：获取错题本
function getWrongBookWords() {
  return Data.getWrongBook();
}

// 全局函数：获取单词
function getWord(wordId) {
  return Data.getWord(wordId);
}

// 全局函数：更新单词状态
function updateWordStatus(wordId, status) {
  Data.updateWordStatus(wordId, status);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 初始化数据
  Data.init();

  // 初始化路由
  if (typeof Router !== 'undefined') {
    Router.init();
  }

  // 渲染首页统计数据
  renderDashboardStats();

  // 渲染今日任务
  if (typeof renderTasks === 'function') {
    renderTasks();
  }

  // 绑定快速入口点击事件
  bindQuickActions();

  console.log('CET-4 学习系统初始化完成');
});

/**
 * 渲染首页统计数据
 */
function renderDashboardStats() {
  const stats = getStudyStats();

  // 更新统计卡片
  const masteredEl = document.getElementById('stat-mastered');
  if (masteredEl) {
    masteredEl.textContent = stats.totalWords;
  }

  const minutesEl = document.getElementById('stat-minutes');
  if (minutesEl) {
    minutesEl.textContent = stats.totalMinutes;
  }

  const streakEl = document.getElementById('stat-streak');
  if (streakEl) {
    streakEl.textContent = stats.streakDays;
  }
}

/**
 * 绑定快速入口点击事件
 */
function bindQuickActions() {
  // 单词学习入口
  const vocabCard = document.querySelector('[data-action="vocabulary"]');
  if (vocabCard) {
    vocabCard.addEventListener('click', () => showPage('vocabulary'));
  }

  // 听力训练入口
  const listenCard = document.querySelector('[data-action="listening"]');
  if (listenCard) {
    listenCard.addEventListener('click', () => showPage('listening'));
  }

  // 阅读练习入口
  const readCard = document.querySelector('[data-action="reading"]');
  if (readCard) {
    readCard.addEventListener('click', () => showPage('reading'));
  }

  // 写作翻译入口
  const writeCard = document.querySelector('[data-action="writing"]');
  if (writeCard) {
    writeCard.addEventListener('click', () => showPage('writing'));
  }

  // 真题模拟入口
  const examCard = document.querySelector('[data-action="exam"]');
  if (examCard) {
    examCard.addEventListener('click', () => showPage('exam'));
  }

  // 互动游戏入口
  const gameCard = document.querySelector('[data-action="games"]');
  if (gameCard) {
    gameCard.addEventListener('click', () => showPage('games'));
  }
}

/**
 * 渲染今日任务列表
 */
function renderTasks() {
  const tasks = Data.getTodayTasks();
  const container = document.getElementById('tasks-list');
  if (!container || !tasks) return;

  container.innerHTML = tasks.map(task => {
    const progressPercent = task.target > 0 ? (task.progress / task.target) * 100 : 0;
    return `
      <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
        <div class="task-header">
          <span class="task-title">${task.title}</span>
          <span class="task-status">${task.completed ? '✓' : `${task.progress}/${task.target}`}</span>
        </div>
        <div class="task-progress">
          <div class="task-progress-bar" style="width: ${progressPercent}%"></div>
        </div>
        ${!task.completed ? `<button class="task-action" onclick="goToTask('${task.type}')">去完成</button>` : ''}
      </div>
    `;
  }).join('');
}

/**
 * 跳转到任务对应的页面
 * @param {string} type - 任务类型
 */
function goToTask(type) {
  const pageMap = {
    'vocabulary': 'vocabulary',
    'listening': 'listening',
    'reading': 'reading',
    'writing': 'writing',
    'review': 'wrongbook'
  };
  const pageId = pageMap[type] || 'dashboard';
  showPage(pageId);
}
