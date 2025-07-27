# 思维导图展示项目

这是一个基于 React + TypeScript + Vite 的思维导图展示项目，使用 AntV X6 图形库来渲染交互式思维导图。

## 功能特性

- 🎯 交互式思维导图展示
- 🔄 节点折叠/展开功能
- 🎨 美观的节点和连线样式
- 📱 响应式设计
- ⚡ 基于 Vite 的快速开发体验

## 技术栈

- **React 19** - 用户界面框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速构建工具
- **AntV X6** - 图形可视化库
- **pnpm** - 包管理器

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

项目将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## 项目结构

```
ming3/
├── src/
│   ├── App.tsx          # 主应用组件
│   ├── App.css          # 应用样式
│   ├── mind.ts          # 思维导图逻辑
│   └── main.tsx         # 应用入口
├── public/              # 静态资源
├── index.html           # HTML 模板
└── package.json         # 项目配置
```

## 思维导图功能

### 节点交互

- 点击节点右侧的折叠按钮可以展开/折叠子节点
- 节点支持悬停效果
- 自动布局和缩放适配

### 数据结构

思维导图数据包含：
- **节点 (nodes)**: 包含 id、位置、大小、标签等信息
- **边 (edges)**: 定义节点之间的连接关系

### 自定义样式

可以通过修改 `src/App.css` 来自定义：
- 节点样式
- 连线样式
- 整体布局

## 开发说明

### 添加新节点

在 `src/mind.ts` 中的 `mindmap` 对象中添加新的节点数据：

```typescript
{
  "id": 103,
  "shape": "tree-node",
  "width": 70,
  "height": 26,
  "leaf": true,
  "attrs": {
    "label": {
      "textWrap": {
        "text": "新节点"
      }
    }
  },
  "x": 100,
  "y": 100
}
```

### 添加新连接

在 `edges` 数组中添加新的连接：

```typescript
{
  "source": 父节点ID,
  "target": 子节点ID,
  "shape": "tree-edge"
}
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License
