# 思维导图展示项目

这是一个基于 React + TypeScript + AntV X6 的思维导图展示项目，用于展示"创U速赢"销售流程的思维导图。

## 功能特性

- 🎯 基于 AntV X6 图形库构建
- 🌳 支持树形结构的思维导图展示
- 🎨 不同分支使用不同颜色区分
- 📱 响应式设计，支持缩放和拖拽
- 🔄 支持节点折叠/展开功能

## 思维导图结构

### 根节点：创U速赢

#### 主分支1：电联加微（红色）
- **邀约加微**
  - 老客户
  - 官方企业微信
  - 邀请您加一下
  - 添加链接
  - 专属福利

- **异议处理1:客户没时间**
  - 特别快
  - 专属福利

- **异议处理2:担心信息骚扰**
  - 官方企业微信
  - 服务通知
  - 老客户福利
  - 不会乱发广告

#### 主分支2：企微介绍（绿色）
- **企业介绍**
  - 官方企业微信

## 技术栈

- React 18
- TypeScript
- AntV X6
- Vite
- CSS3

## 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── App.tsx          # 主应用组件
├── App.css          # 应用样式
├── mind.ts          # 思维导图数据和逻辑
├── main.tsx         # 应用入口
└── index.css        # 全局样式
```

## 使用方法

1. 启动开发服务器后，访问 `http://localhost:5173`
2. 思维导图会自动加载并显示
3. 可以拖拽画布进行平移
4. 使用鼠标滚轮进行缩放
5. 点击节点可以折叠/展开子节点

## 自定义

要修改思维导图内容，请编辑 `src/mind.ts` 文件中的 `mindmap` 对象：

- `nodes`: 定义节点位置、样式和内容
- `edges`: 定义节点之间的连接关系

每个节点包含以下属性：
- `id`: 唯一标识符
- `shape`: 节点形状（使用 'tree-node'）
- `width/height`: 节点尺寸
- `leaf`: 是否为叶子节点
- `attrs`: 节点样式和文本内容
- `x/y`: 节点位置坐标
