# 自定义剪贴板

一个基于 Electron + React + Vite 开发的剪贴板管理工具。

## 功能特点

- 🚀 支持多种格式
  - 文本 (纯文本、RTF、HTML)
  - 图片 (PNG、JPEG 等)
  - 文件路径
- 💡 智能识别剪贴板内容类型
- ⌨️ 全局快捷键
  - `Cmd/Ctrl + Shift + V` 快速呼出
  - `ESC` 快速隐藏
- 🌓 自动跟随系统主题(暗色/亮色)
- 📦 自动更新

## 快速开始

```bash
# 克隆项目
git clone <your-repo-url>

# 进入项目目录
cd clipboard-manager

# 安装依赖
npm install

# 开发
npm run dev

# 打包
npm run build
```

## 使用说明

1. 复制任意内容到系统剪贴板
2. 使用快捷键 `Cmd/Ctrl + Shift + V` 呼出管理窗口
3. 点击历史记录即可复制到剪贴板
4. 按 `ESC` 或点击其他区域关闭窗口

## 技术栈

- Electron - 跨平台桌面应用开发框架
- React - 用户界面开发库
- Vite - 现代前端构建工具
- TypeScript - 类型安全的 JavaScript 超集

## 项目结构

```tree
├── electron                                 Electron 源码
│   ├── main                                 主进程代码
│   │   ├── clipboard.ts                     剪贴板监听与处理
│   │   └── register.ts                      快捷键注册
│   └── preload                              预加载脚本
├── src                                      渲染进程源码
│   ├── hooks                                自定义 Hooks
│   │   ├── useClipboardManager.ts           剪贴板管理
│   │   └── useTheme.ts                      主题管理
│   └── App.tsx                              主界面
└── package.json                             项目配置
```

## 开发说明

本项目基于 [electron-vite-react](https://github.com/electron-vite/electron-vite-react) 模板开发，主要修改和添加了以下功能：

1. 剪贴板内容监听和管理
2. 多种格式的内容支持
3. 主题自动切换
4. 快捷键支持

## License

[MIT](./LICENSE)
