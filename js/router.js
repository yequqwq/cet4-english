/**
 * CET-4 英语学习系统 - 路由模块
 * 实现单页路由切换，管理和页面切换逻辑
 */

const Router = (() => {
  // 当前页面ID
  let currentPage = 'dashboard';

  // 所有页面配置
  const pages = {
    dashboard: 'page-dashboard',
    vocabulary: 'page-vocabulary',
    listening: 'page-listening',
    reading: 'page-reading',
    writing: 'page-writing',
    exam: 'page-exam',
    games: 'page-games',
    center: 'page-center',
    wrongbook: 'page-wrongbook'
  };

  // 菜单项配置
  const menuItems = [
    { id: 'dashboard', label: '首页', icon: 'home' },
    { id: 'vocabulary', label: '单词学习', icon: 'book' },
    { id: 'listening', label: '听力训练', icon: 'headphones' },
    { id: 'reading', label: '阅读练习', icon: 'file-text' },
    { id: 'writing', label: '写作翻译', icon: 'edit' },
    { id: 'exam', label: '真题模拟', icon: 'clipboard' },
    { id: 'games', label: '互动游戏', icon: 'gamepad' },
    { id: 'center', label: '学习中心', icon: 'user' },
    { id: 'wrongbook', label: '错题本', icon: 'alert-circle' }
  ];

  /**
   * 初始化路由监听
   */
  function init() {
    // 绑定左侧菜单点击事件
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      const menuButtons = sidebar.querySelectorAll('[data-page]');
      menuButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const pageId = btn.getAttribute('data-page');
          if (pageId) {
            showPage(pageId);
          }
        });
      });
    }

    // 绑定移动端底部导航点击事件
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
      const navButtons = bottomNav.querySelectorAll('[data-page]');
      navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const pageId = btn.getAttribute('data-page');
          if (pageId) {
            showPage(pageId);
          }
        });
      });
    }

    // 从URL hash读取初始页面
    const hash = window.location.hash.replace('#', '');
    if (hash && pages[hash]) {
      showPage(hash);
    } else {
      showPage('dashboard');
    }

    // 监听hash变化
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && pages[hash]) {
        showPage(hash);
      }
    });
  }

  /**
   * 显示指定页面
   * @param {string} pageId - 页面ID
   */
  function showPage(pageId) {
    if (!pages[pageId]) {
      console.error('页面不存在:', pageId);
      return;
    }

    // 更新当前页面
    currentPage = pageId;

    // 隐藏所有页面
    Object.values(pages).forEach(pageName => {
      const page = document.getElementById(pageName);
      if (page) {
        page.classList.add('hidden');
        page.classList.remove('active');
      }
    });

    // 显示目标页面（带动画）
    const targetPage = document.getElementById(pages[pageId]);
    if (targetPage) {
      targetPage.classList.remove('hidden');
      targetPage.classList.add('active', 'page-enter');
      setTimeout(() => {
        targetPage.classList.remove('page-enter');
      }, 300);
    }

    // 更新菜单高亮
    updateMenuHighlight(pageId);

    // 更新URL hash
    window.location.hash = pageId;

    // 触发页面切换事件
    const event = new CustomEvent('pageChange', { detail: { page: pageId } });
    document.dispatchEvent(event);
  }

  /**
   * 更新菜单高亮状态
   * @param {string} pageId - 当前页面ID
   */
  function updateMenuHighlight(pageId) {
    // 更新侧边栏菜单
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      const buttons = sidebar.querySelectorAll('[data-page]');
      buttons.forEach(btn => {
        if (btn.getAttribute('data-page') === pageId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // 更新底部导航
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
      const buttons = bottomNav.querySelectorAll('[data-page]');
      buttons.forEach(btn => {
        if (btn.getAttribute('data-page') === pageId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  /**
   * 获取当前页面ID
   * @returns {string} 当前页面ID
   */
  function getCurrentPage() {
    return currentPage;
  }

  /**
   * 获取菜单项配置
   * @returns {Array} 菜单项数组
   */
  function getMenuItems() {
    return menuItems;
  }

  return {
    init,
    showPage,
    getCurrentPage,
    getMenuItems
  };
})();

// 页面加载完成后初始化路由
document.addEventListener('DOMContentLoaded', () => {
  Router.init();
});
