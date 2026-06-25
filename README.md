# CET-4 AI 自适应英语学习系统

> 面向四六级考生的 AI 自适应学习平台，支持培训机构私有化部署

## 项目简介

CET-4 AI 自适应英语学习系统是一套完整的英语备考解决方案，专为四六级考生设计。系统融合 **AI 智能批改**、**艾宾浩斯记忆算法**、**多维度学习数据追踪**，帮助考生高效备考。

### 核心亮点

- 🤖 **AI 智能批改**：接入通义千问大模型，写作/翻译多维度评分 + 改进建议
- 🧠 **艾宾浩斯记忆曲线**：科学复习调度，告别死记硬背
- 📊 **学习数据可视化**：7 天趋势图、打卡记录、模块进度
- 🎮 **互动游戏**：单词配对、拼写挑战、听力打地鼠
- 📱 **PWA 离线可用**：支持离线学习，安装到手机桌面
- 🔐 **用户系统**：注册/登录，数据持久化到后端
- 🌙 **响应式设计**：适配桌面/平板/手机，支持深色模式

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + TailwindCSS + Zustand |
| 后端 | Node.js + Express + Drizzle ORM + SQLite |
| AI | 通义千问 (Qwen-Max) API |
| 部署 | Vercel (前端) + 阿里云函数计算 (后端) |

## 核心功能

### 1. 单词学习
- 卡片模式 + 列表模式学习
- 艾宾浩斯记忆曲线复习调度
- 发音朗读（Web Speech API）
- 四级/六级/考研词汇分类
- 错题本功能

### 2. AI 写作批改
- 五维度评分：词汇丰富度、语法准确性、句式多样性、段落连贯性、内容长度
- 智能改进建议
- 支持离线本地评分（无 API Key 时自动降级）
- 写作历史追踪

### 3. AI 翻译练习
- 中英互译评分
- 准确性/流畅度/用词三维度评分
- 参考译文 + 发音朗读

### 4. 听力/阅读训练
- 真题听力音频练习
- 阅读理解专项训练
- 错题自动收录

### 5. 真题模拟
- 限时模拟考试
- 自动阅卷评分
- 答题详情回顾

### 6. 互动游戏
- 单词配对消消乐（50 关卡）
- 拼写挑战
- 听力打地鼠
- 错题本模式

### 7. 学习数据
- 7 天学习趋势图
- 连续打卡记录
- 各模块进度追踪
- 数据导出/导入（JSON）

## 项目截图

> 以下是关键页面截图（部署后补充）

1. **首页** — 学习概览 + 7 天趋势 + 今日任务
2. **单词学习** — 卡片模式 + 发音 + 进度
3. **AI 写作批改** — 五维度评分 + 改进建议
4. **互动游戏** — 单词配对消消乐
5. **学习中心** — 数据统计 + 错题本 + 设置

## 快速开始

### 前置要求
- Node.js 18+
- npm 或 pnpm

### 安装

```bash
# 克隆项目
git clone https://github.com/your-username/cet4-english-learning.git
cd cet4-english-learning

# 安装依赖
npm install

# 配置环境变量（可选）
cp .env.example .env
# 编辑 .env，填入通义千问 API Key（不填也能用本地评分）
```

### 开发

```bash
# 仅启动前端（含本地评分）
npm run dev

# 启动前端 + 后端服务（含 AI 评分）
npm run dev:all
```

### 构建

```bash
# 构建前端
npm run build

# 构建后端
npm run build:server
```

### 部署

```bash
# 预览构建结果
npm run preview

# 启动后端服务
npm run start:server
```

## 环境变量配置

| 变量 | 说明 | 默认值 |
|---|---|---|
| `PORT` | 后端端口 | `3001` |
| `JWT_SECRET` | JWT 密钥 | `cet4-learning-secret-key-change-in-production` |
| `DB_PATH` | SQLite 数据库路径 | `./cet4.db` |
| `DASHSCOPE_API_KEY` | 通义千问 API Key | 空（使用本地评分） |
| `VITE_API_URL` | 前端 API 地址 | `http://localhost:3001` |

## 架构说明

```
┌─────────────────────────────────────────────────────────────┐
│                         前端 (React 18)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ 单词学习  │  │ AI 批改  │  │ 真题模拟  │  │ 互动游戏  │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │              │              │              │         │
│       └──────────────┴──────────────┴──────────────┘        │
│                          │                                   │
│              ┌───────────┴───────────┐                      │
│              │   Zustand Store       │                      │
│              │   (localStorage + API)│                      │
│              └───────────┬───────────┘                      │
└──────────────────────────┼──────────────────────────────────┘
                           │ fetch()
┌──────────────────────────┼──────────────────────────────────┐
│                         后端 (Express)                       │
│              ┌───────────┴───────────┐                      │
│              │   API Routes          │                      │
│              │  ├── /auth            │                      │
│              │  ├── /writing/score   │                      │
│              │  ├── /translation/score│                     │
│              │  └── /stats           │                      │
│              └───────────┬───────────┘                      │
│                          │                                  │
│  ┌──────────────┐  ┌─────┴──────┐  ┌──────────────┐        │
│  │  SQLite      │  │ 通义千问    │  │  JWT Auth    │        │
│  │  (Drizzle)   │  │  Qwen-Max  │  │              │        │
│  └──────────────┘  └────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## 数据库设计

| 表名 | 说明 |
|---|---|
| `users` | 用户表（id, username, email, password_hash, created_at）|
| `writing_submissions` | 写作提交（user_id, topic, content, score, 各维度分数, suggestions_json）|
| `translation_submissions` | 翻译提交（user_id, original_text, user_translation, score, 各维度分数）|
| `study_records` | 学习记录（user_id, action, words_count, minutes, score）|
| `wrong_words` | 错词本（user_id, word, meaning, error_count, last_error_at）|

## 开发规范

- TypeScript 严格模式
- ESLint + Prettier 代码规范
- React.lazy() 路由级代码分割
- Zustand 状态管理 + localStorage 持久化
- 后端 API 支持 JWT 认证（兼容 Demo 模式）

## 演示账号

- 演示账号: `demo` / `123456`（首次启动自动创建）
- 或使用访客模式（无需登录，数据保存在浏览器本地）

## License

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

- 问题反馈: [GitHub Issues](https://github.com/your-username/cet4-english-learning/issues)
- 商业合作: contact@example.com
