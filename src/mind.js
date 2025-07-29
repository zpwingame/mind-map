import { Graph, Node, Edge, Shape, Cell } from '@antv/x6'

// 定义节点
class TreeNode extends Node {
  constructor(...args) {
    super(...args)
    this.collapsed = false
    this.hasChildren = false
  }

  postprocess() {
    this.toggleCollapse(false)
  }

  isCollapsed() {
    return this.collapsed
  }

  setHasChildren(hasChildren) {
    this.hasChildren = hasChildren
    this.toggleButtonVisibility(hasChildren)
  }

  toggleButtonVisibility(visible) {
    this.attr('buttonGroup', {
      display: visible ? 'block' : 'none',
    })
  }

  toggleCollapse(collapsed) {
    const target = collapsed == null ? !this.collapsed : collapsed
    if (!target) {
      // 展开状态：显示减号 - 居中显示
      this.attr('buttonSign', {
        d: 'M -3 0 3 0',
        strokeWidth: 1.8,
      })
    } else {
      // 收起状态：显示加号 - 居中显示
      this.attr('buttonSign', {
        d: 'M -3 0 3 0 M 0 -3 0 3',
        strokeWidth: 1.6,
      })
    }
    this.collapsed = target
  }
}

TreeNode.config({
  zIndex: 2,
  markup: [
    {
      tagName: 'g',
      selector: 'buttonGroup',
      children: [
        {
          tagName: 'circle',
          selector: 'button',
          attrs: {
            'pointer-events': 'visiblePainted',
          },
        },
        {
          tagName: 'path',
          selector: 'buttonSign',
          attrs: {
            fill: 'none',
            'pointer-events': 'none',
          },
        },
      ],
    },
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 1,
      fill: '#EFF4FF',
      stroke: '#5F95FF',
      rx: 6,
      ry: 6,
    },
    label: {
      textWrap: {
        width: 100, // 固定宽度，文字超长时换行
        height: '100%', // 使用百分比高度，自适应节点高度
        ellipsis: false, // 不使用省略号，允许换行
      },
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      refX: '50%',
      refY: '50%',
      fontSize: 12,
      fill: '#333333',
    },
    buttonGroup: {
      refX: '100%',
      refY: '50%',
    },
    button: {
      fill: '#FFFFFF',
      stroke: '#CCCCCC',
      strokeWidth: 1,
      r: 8,
      cx: 8,
      cy: 0,
      cursor: 'pointer',
      event: 'node:collapse',
    },
    buttonSign: {
      refX: 8,
      refY: 0,
      stroke: '#333333',
      strokeWidth: 1.6,
    },
  },
  // 定义连接点，让连线从按钮位置开始
  ports: {
    groups: {
      right: {
        position: {
          name: 'absolute',
          args: {
            x: '100%',
            y: '50%',
          },
        },
        attrs: {
          circle: {
            r: 0, // 隐藏连接点
            fill: 'transparent',
            stroke: 'transparent',
          },
        },
        markup: [
          {
            tagName: 'circle',
            selector: 'circle',
          },
        ],
      },
      left: {
        position: {
          name: 'absolute',
          args: {
            x: 0,
            y: '50%',
          },
        },
        attrs: {
          circle: {
            r: 0, // 隐藏连接点
            fill: 'transparent',
            stroke: 'transparent',
          },
        },
        markup: [
          {
            tagName: 'circle',
            selector: 'circle',
          },
        ],
      },
    },
  },
})

// 定义边
class TreeEdge extends Shape.Edge {
  isHidden() {
    const node = this.getTargetNode()
    return !node || !node.isVisible()
  }
}

TreeEdge.config({
  zIndex: 1,
  attrs: {
    line: {
      stroke: '#A2B1C3',
      strokeWidth: 1,
      targetMarker: null,
    },
  },
  router: {
    name: 'normal',
  },
  connector: {
    name: 'normal',
  },
})

// 注册
Node.registry.register('tree-node', TreeNode, true)
Edge.registry.register('tree-edge', TreeEdge, true)

// 初始化画布
let graph = null

// 右键菜单相关变量
let contextMenu = null

// 显示右键菜单
function showContextMenu(e, node) {
  // 移除已存在的菜单
  hideContextMenu()
  
  // 创建菜单
  contextMenu = document.createElement('div')
  contextMenu.style.position = 'absolute'
  contextMenu.style.left = e.clientX + 'px'
  contextMenu.style.top = e.clientY + 'px'
  contextMenu.style.backgroundColor = 'white'
  contextMenu.style.border = '1px solid #ccc'
  contextMenu.style.borderRadius = '4px'
  contextMenu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
  contextMenu.style.zIndex = '1000'
  contextMenu.style.padding = '4px 0'
  
  // 菜单项
  const menuItems = [
    { text: '编辑节点', action: () => editNodeText(node.id) },
    { text: '添加同级节点', action: () => addSiblingNode(node.id) },
    { text: '添加子节点', action: () => addChildNode(node.id) },
    { text: '删除节点', action: () => deleteNode(node.id) }
  ]
  
  menuItems.forEach(item => {
    const menuItem = document.createElement('div')
    menuItem.textContent = item.text
    menuItem.style.padding = '8px 16px'
    menuItem.style.cursor = 'pointer'
    menuItem.style.fontSize = '14px'
    menuItem.style.color = '#333'
    
    menuItem.addEventListener('mouseenter', () => {
      menuItem.style.backgroundColor = '#f5f5f5'
    })
    
    menuItem.addEventListener('mouseleave', () => {
      menuItem.style.backgroundColor = 'white'
    })
    
    menuItem.addEventListener('click', () => {
      item.action()
      hideContextMenu()
    })
    
    if (contextMenu) {
      contextMenu.appendChild(menuItem)
    }
  })
  
  if (contextMenu) {
    document.body.appendChild(contextMenu)
  }
}

// 隐藏右键菜单
function hideContextMenu() {
  if (contextMenu && document.body.contains(contextMenu)) {
    document.body.removeChild(contextMenu)
    contextMenu = null
  }
}

// 生成新的节点ID
function generateNewNodeId() {
  const existingIds = mindmap.nodes.map(node => node.id)
  return Math.max(...existingIds) + 1
}

// 获取节点在mindmap数据中的索引
function getNodeDataIndex(nodeId) {
  return mindmap.nodes.findIndex(node => node.id === parseInt(nodeId))
}

// 获取节点的父节点
function getParentNode(nodeId) {
  const parentEdge = mindmap.edges.find(edge => edge.target === parseInt(nodeId))
  if (parentEdge) {
    return mindmap.nodes.find(node => node.id === parentEdge.source) || null
  }
  return null
}

// 获取节点的子节点
function getChildNodes(nodeId) {
  const childEdges = mindmap.edges.filter(edge => edge.source === parseInt(nodeId))
  return childEdges.map(edge => 
    mindmap.nodes.find(node => node.id === edge.target)
  ).filter(node => node !== undefined)
}

// 自动布局算法 - 优化版本，使用更紧凑的间距
function autoLayout() {
  if (!graph) return
  
  // 找到根节点
  const rootNode = mindmap.nodes.find(node => !mindmap.edges.some(edge => edge.target === node.id))
  if (!rootNode) return
  
  // 计算每个子树需要的高度 - 使用更紧凑的间距
  function calculateSubtreeHeight(nodeId) {
    const children = getChildNodes(nodeId.toString())
    if (children.length === 0) {
      return 50 // 叶子节点高度，从60减少到50
    }
    
    let totalChildrenHeight = 0
    children.forEach(child => {
      totalChildrenHeight += calculateSubtreeHeight(child.id)
    })
    
    // 使用更紧凑的子节点间距，从80减少到50
    const spacing = children.length > 1 ? (children.length - 1) * 50 : 0
    return totalChildrenHeight + spacing
  }
  
  // 递归布局函数
  function layoutSubtree(nodeId, x, startY, level) {
    const node = mindmap.nodes.find(n => n.id === nodeId)
    if (!node) return startY
    
    // 获取子节点
    const children = getChildNodes(nodeId.toString())
    
    if (children.length === 0) {
      // 叶子节点
      node.x = x
      node.y = startY
      return startY + 50 // 返回下一个节点的起始位置，从60减少到50
    }
    
    // 计算所有子节点需要的总高度
    const subtreeHeight = calculateSubtreeHeight(nodeId)
    
    // 当前节点位置设置在子树的中心
    const nodeY = startY + subtreeHeight / 2
    node.x = x
    node.y = nodeY
    
    // 布局子节点
    let currentY = startY
    children.forEach(child => {
      const childHeight = calculateSubtreeHeight(child.id)
      
      // 递归布局子节点，保持200px的横向间距
      layoutSubtree(child.id, x + 200, currentY, level + 1)
      
      currentY += childHeight + 50 // 使用50px的纵向间距
    })
    
    return startY + subtreeHeight
  }
  
  // 计算整个思维导图需要的高度
  const totalHeight = calculateSubtreeHeight(rootNode.id)
  
  // 从适当的起始位置开始布局，确保内容居中
  const startY = Math.max(50, 300 - totalHeight / 2)
  layoutSubtree(rootNode.id, 100, startY, 0)
  
  // 更新图形中的节点位置
  mindmap.nodes.forEach(nodeData => {
    const graphNode = graph.getCellById(nodeData.id.toString())
    if (graphNode) {
      graphNode.setPosition(nodeData.x, nodeData.y)
    }
  })
  
  // 布局完成，使用滚动条查看内容
  
  // 动态调整画布容器大小以显示滚动条
  updateContainerSize()
}

// 动态调整画布容器大小以适应内容
function updateContainerSize() {
  if (!graph) return
  
  // 计算所有节点的边界
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  
  mindmap.nodes.forEach(node => {
    const x1 = node.x
    const y1 = node.y
    const x2 = node.x + node.width
    const y2 = node.y + node.height
    
    minX = Math.min(minX, x1)
    minY = Math.min(minY, y1)
    maxX = Math.max(maxX, x2)
    maxY = Math.max(maxY, y2)
  })
  
  // 添加边距
  const padding = 100
  const contentWidth = Math.max(maxX - minX + padding * 2, 800) // 最小宽度800px
  const contentHeight = Math.max(maxY - minY + padding * 2, 600) // 最小高度600px
  
  // 调整Graph实例的大小
  graph.resize(contentWidth, contentHeight)
  
  // 确保网格背景覆盖整个画布
  const container = document.getElementById('container')
  if (container) {
    const svgElement = container.querySelector('svg')
    if (svgElement) {
      svgElement.style.width = contentWidth + 'px'
      svgElement.style.height = contentHeight + 'px'
      // 确保SVG占满容器并正确显示网格
      svgElement.setAttribute('width', contentWidth.toString())
      svgElement.setAttribute('height', contentHeight.toString())
      svgElement.setAttribute('viewBox', `0 0 ${contentWidth} ${contentHeight}`)
    }
  }
}

// 根据文本长度计算节点高度
function calculateNodeHeight(text) {
  const baseHeight = 40
  const maxWidth = 100 // 与textWrap width保持一致
  const fontSize = 12
  const charWidth = fontSize * 0.6 // 估算字符宽度
  const charsPerLine = Math.floor(maxWidth / charWidth)
  const estimatedLines = Math.ceil(text.length / charsPerLine)
  
  // 每行约16px高度，最小40px
  return Math.max(baseHeight, estimatedLines * 20 + 20)
}

// 计算新节点的位置（临时位置，会被布局算法重新计算）
function calculateNewNodePosition(parentNode, isChild = true) {
  if (isChild) {
    // 添加子节点：在父节点右侧
    const existingChildren = getChildNodes(parentNode.id.toString())
    const baseY = parentNode.y + (existingChildren.length * 60) - ((existingChildren.length - 1) * 30)
    return {
      x: parentNode.x + 200,
      y: baseY
    }
  } else {
    // 添加同级节点：在当前节点下方
    return {
      x: parentNode.x,
      y: parentNode.y + 80
    }
  }
}

// 编辑节点文本
function editNodeText(nodeId) {
  const nodeIndex = getNodeDataIndex(nodeId)
  if (nodeIndex === -1) return
  
  const currentText = mindmap.nodes[nodeIndex].attrs.label.textWrap.text
  const newText = prompt('请输入新的节点文本:', currentText.toString())
  
  if (newText !== null && newText.trim() !== '') {
    const trimmedText = newText.trim()
    // 更新数据
    mindmap.nodes[nodeIndex].attrs.label.textWrap.text = trimmedText
    
    // 计算新的节点高度
    const newHeight = calculateNodeHeight(trimmedText)
    mindmap.nodes[nodeIndex].height = newHeight
    
    // 更新图形
    const graphNode = graph?.getCellById(nodeId)
    if (graphNode) {
      graphNode.attr('label/textWrap/text', trimmedText)
      graphNode.resize(mindmap.nodes[nodeIndex].width, newHeight)
    }
    
    // 重新布局以适应新的节点尺寸
    autoLayout()
    
    // 保存到localStorage
    saveMindMapToStorage()
  }
}

// 添加子节点
function addChildNode(parentId) {
  const parentIndex = getNodeDataIndex(parentId)
  if (parentIndex === -1) return
  
  const parentNode = mindmap.nodes[parentIndex]
  const newNodeId = generateNewNodeId()
  const position = calculateNewNodePosition(parentNode, true)
  
  const newText = prompt('请输入子节点文本:', '新节点')
  if (newText === null) return
  
  // 创建新节点数据
  const newNodeData = {
    id: newNodeId,
    shape: 'tree-node',
    width: 120,
    height: calculateNodeHeight(newText.trim() || '新节点'),
    leaf: true,
    attrs: {
      label: {
        textWrap: {
          text: newText.trim() || '新节点'
        }
      }
    },
    x: position.x,
    y: position.y
  }
  
  // 确定新节点的样式（继承父节点的颜色系统）
  const parentBodyFill = parentNode.attrs.body?.fill || '#FFFFFF'
  const parentBodyStroke = parentNode.attrs.body?.stroke || '#5F95FF'
  
  if (parentBodyFill === '#FFFFFF') {
    // 父节点是白色背景（叶子节点），保持样式
    newNodeData.attrs = {
      ...newNodeData.attrs,
      body: {
        fill: '#FFFFFF',
        stroke: parentBodyStroke
      },
      label: {
        ...newNodeData.attrs.label,
        fill: '#333333'
      }
    }
  } else {
    // 父节点有颜色，子节点使用白色背景
    newNodeData.attrs = {
      ...newNodeData.attrs,
      body: {
        fill: '#FFFFFF',
        stroke: parentBodyFill
      },
      label: {
        ...newNodeData.attrs.label,
        fill: '#333333'
      }
    }
  }
  
  // 添加到数据
  mindmap.nodes.push(newNodeData)
  mindmap.edges.push({
    source: parseInt(parentId),
    target: newNodeId,
    shape: 'tree-edge'
  })
  
  // 更新父节点为非叶子节点
  mindmap.nodes[parentIndex].leaf = false
  
  // 创建新的图形节点
  const newGraphNode = new TreeNode({
    ...newNodeData,
    id: newNodeData.id.toString(),
    ports: {
      items: [
        {
          id: 'right',
          group: 'right',
        },
        {
          id: 'left',
          group: 'left',
        },
      ],
    },
  })
  
  // 检查节点是否有子节点
  const hasChildren = mindmap.edges.some(edge => edge.source === newNodeData.id)
  newGraphNode.setHasChildren(hasChildren)
  
  // 添加节点到图形
  graph.addNode(newGraphNode)
  
  // 创建新的连线
  const sourceNode = mindmap.nodes.find(node => node.id === parseInt(parentId))
  if (sourceNode) {
    let strokeColor = '#A2B1C3' // 默认颜色
    const bodyFill = sourceNode.attrs.body?.fill
    if (bodyFill === '#FF6B6B') {
      strokeColor = '#FF6B6B' // 红色分支
    } else if (bodyFill === '#4ECDC4') {
      strokeColor = '#4ECDC4' // 青色分支
    } else if (bodyFill === '#5F95FF') {
      strokeColor = '#5F95FF' // 蓝色根节点
    }
    
    const newEdge = new TreeEdge({
      source: { cell: parentId, port: 'right' },
      target: { cell: newNodeData.id.toString(), port: 'left' },
      attrs: {
        line: {
          stroke: strokeColor,
          strokeWidth: 1,
          targetMarker: null,
        },
      },
    })
    
    graph.addEdge(newEdge)
  }
  
  // 更新父节点的展开按钮显示
  const parentGraphNode = graph.getCellById(parentId)
  if (parentGraphNode) {
    parentGraphNode.setHasChildren(true)
  }
  
  // 执行自动布局
  autoLayout()
  
  // 保存到localStorage
  saveMindMapToStorage()
}

// 添加同级节点
function addSiblingNode(nodeId) {
  const nodeIndex = getNodeDataIndex(nodeId)
  if (nodeIndex === -1) return
  
  const currentNode = mindmap.nodes[nodeIndex]
  const parentNode = getParentNode(nodeId)
  
  if (!parentNode) {
    alert('根节点不能添加同级节点')
    return
  }
  
  const newNodeId = generateNewNodeId()
  const position = calculateNewNodePosition(currentNode, false)
  
  const newText = prompt('请输入同级节点文本:', '新节点')
  if (newText === null) return
  
  // 创建新节点数据（复制当前节点的样式）
  const newNodeData = {
    id: newNodeId,
    shape: 'tree-node',
    width: currentNode.width,
    height: currentNode.height,
    leaf: true,
    attrs: {
      ...currentNode.attrs,
      label: {
        textWrap: {
          text: newText.trim() || '新节点'
        }
      }
    },
    x: position.x,
    y: position.y
  }
  
  // 添加到数据
  mindmap.nodes.push(newNodeData)
  mindmap.edges.push({
    source: parentNode.id,
    target: newNodeId,
    shape: 'tree-edge'
  })
  
  // 创建新的图形节点
  const newGraphNode = new TreeNode({
    ...newNodeData,
    id: newNodeData.id.toString(),
    ports: {
      items: [
        {
          id: 'right',
          group: 'right',
        },
        {
          id: 'left',
          group: 'left',
        },
      ],
    },
  })
  
  // 检查节点是否有子节点
  const hasChildren = mindmap.edges.some(edge => edge.source === newNodeData.id)
  newGraphNode.setHasChildren(hasChildren)
  
  // 添加节点到图形
  graph.addNode(newGraphNode)
  
  // 创建新的连线
  if (parentNode) {
    let strokeColor = '#A2B1C3' // 默认颜色
    const bodyFill = parentNode.attrs.body?.fill
    if (bodyFill === '#FF6B6B') {
      strokeColor = '#FF6B6B' // 红色分支
    } else if (bodyFill === '#4ECDC4') {
      strokeColor = '#4ECDC4' // 青色分支
    } else if (bodyFill === '#5F95FF') {
      strokeColor = '#5F95FF' // 蓝色根节点
    }
    
    const newEdge = new TreeEdge({
      source: { cell: parentNode.id.toString(), port: 'right' },
      target: { cell: newNodeData.id.toString(), port: 'left' },
      attrs: {
        line: {
          stroke: strokeColor,
          strokeWidth: 1,
          targetMarker: null,
        },
      },
    })
    
    graph.addEdge(newEdge)
  }
  
  // 执行自动布局
  autoLayout()
  
  // 保存到localStorage
  saveMindMapToStorage()
}

// 删除节点
function deleteNode(nodeId) {
  // 检查是否为根节点
  const nodeIndex = getNodeDataIndex(nodeId)
  if (nodeIndex === -1) return
  
  const parentNode = getParentNode(nodeId)
  if (!parentNode) {
    alert('不能删除根节点')
    return
  }
  
  const confirmDelete = confirm('确定要删除此节点及其所有子节点吗？')
  if (!confirmDelete) return
  
  // 递归收集要删除的节点（包括所有子节点）
  function collectNodesToDelete(id) {
    const children = getChildNodes(id)
    let toDelete = [id]
    
    children.forEach(child => {
      toDelete = toDelete.concat(collectNodesToDelete(child.id.toString()))
    })
    
    return toDelete
  }
  
  const nodesToDelete = collectNodesToDelete(nodeId)
  
  // 删除节点数据
  mindmap.nodes = mindmap.nodes.filter(node => 
    !nodesToDelete.includes(node.id.toString())
  )
  
  // 删除相关边
  mindmap.edges = mindmap.edges.filter(edge => 
    !nodesToDelete.includes(edge.source.toString()) && 
    !nodesToDelete.includes(edge.target.toString())
  )
  
  // 从图形中删除节点和边
  nodesToDelete.forEach(id => {
    const node = graph.getCellById(id)
    if (node) {
      graph.removeCell(node)
    }
  })
  
  // 检查父节点是否还有其他子节点，如果没有则设为叶子节点
  const remainingChildren = getChildNodes(parentNode.id.toString())
  if (remainingChildren.length === 0) {
    const parentIndex = getNodeDataIndex(parentNode.id.toString())
    if (parentIndex !== -1) {
      mindmap.nodes[parentIndex].leaf = true
    }
    
    // 更新父节点的展开按钮显示
    const parentGraphNode = graph.getCellById(parentNode.id.toString())
    if (parentGraphNode) {
      parentGraphNode.setHasChildren(false)
    }
  }
  
  // 更新容器大小以显示滚动条
  updateContainerSize()
  
  // 保存到localStorage
  saveMindMapToStorage()
}

const mindmap = {
  "nodes": [
    // 根节点：创U速赢 (第0层)
    {
      "id": 1,
      "shape": "tree-node",
      "width": 120,
      "height": 50,
      "leaf": false,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "创U速赢"
          },
          "fill": "#FFFFFF"
        },
        "body": {
          "fill": "#5F95FF",
          "stroke": "#5F95FF"
        }
      },
      "x": 100,
      "y": 300
    },
    // 主分支1：电联加微 (第1层) - 红色分支
    {
      "id": 2,
      "shape": "tree-node",
      "width": 120,
      "height": 40,
      "leaf": false,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "电联加微"
          },
          "fill": "#FFFFFF"
        },
        "body": {
          "fill": "#FF6B6B",
          "stroke": "#FF6B6B"
        }
      },
      "x": 300,
      "y": 200
    },
    // 主分支2：企微介绍 (第1层) - 青色分支
    {
      "id": 17,
      "shape": "tree-node",
      "width": 120,
      "height": 40,
      "leaf": false,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "企微介绍"
          },
          "fill": "#FFFFFF"
        },
        "body": {
          "fill": "#4ECDC4",
          "stroke": "#4ECDC4"
        }
      },
      "x": 300,
      "y": 400
    },
    // 电联加微子分支：邀约加微 (第2层) - 保持红色
    {
      "id": 3,
      "shape": "tree-node",
      "width": 120,
      "height": 40,
      "leaf": false,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "邀约加微"
          },
          "fill": "#FFFFFF"
        },
        "body": {
          "fill": "#FF6B6B",
          "stroke": "#FF6B6B"
        }
      },
      "x": 500,
      "y": 100
    },
    // 电联加微子分支：异议处理1 (第2层) - 保持红色
    {
      "id": 9,
      "shape": "tree-node",
      "width": 120,
      "height": 60,
      "leaf": false,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "异议处理1:客户没时间"
          },
          "fill": "#333333"
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 500,
      "y": 200
    },
    // 电联加微子分支：异议处理2 (第2层) - 保持红色
    {
      "id": 12,
      "shape": "tree-node",
      "width": 120,
      "height": 60,
      "leaf": false,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "异议处理2:担心信息骚扰"
          },
          "fill": "#333333"
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 500,
      "y": 300
    },
    // 企微介绍子分支：企业介绍 (第2层) - 保持青色
    {
      "id": 18,
      "shape": "tree-node",
      "width": 120,
      "height": 40,
      "leaf": false,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "企业介绍"
          },
          "fill": "#FFFFFF"
        },
        "body": {
          "fill": "#4ECDC4",
          "stroke": "#4ECDC4"
        }
      },
      "x": 500,
      "y": 400
    },
    // 邀约加微的详细信息 (第3层) - 白色背景，红色边框
    {
      "id": 4,
      "shape": "tree-node",
      "width": 120,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "老客户"
          },
          "fill": "#333333"
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 700,
      "y": 50
    },
    {
      "id": 5,
      "shape": "tree-node",
      "width": 120,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "官方企业微信"
          },
          "fill": "#333333"
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 700,
      "y": 100
    },
    {
      "id": 6,
      "shape": "tree-node",
      "width": 120,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "邀请您加一下"
          },
          "fill": "#333333"
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 700,
      "y": 150
    },
    {
      "id": 7,
      "shape": "tree-node",
      "width": 120,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "添加链接"
          },
          "fill": "#333333"
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 700,
      "y": 200
    },
    {
      "id": 8,
      "shape": "tree-node",
      "width": 120,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "专属福利"
          },
          "fill": "#333333"
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 700,
      "y": 250
    },
    // 异议处理1的详细信息 (第3层) - 白色背景，红色边框
    {
      "id": 10,
      "shape": "tree-node",
      "width": 120,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "特别快"
          },
          "fill": "#333333"
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 700,
      "y": 300
    },
    {
      "id": 11,
      "shape": "tree-node",
      "width": 120,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "专属福利"
          },
          "fill": "#333333"
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 700,
      "y": 350
    },
    // 异议处理2的详细信息 (第3层) - 白色背景，红色边框
    {
      "id": 13,
      "shape": "tree-node",
      "width": 120,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "官方企业微信"
          },
          "fill": "#333333"
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 700,
      "y": 400
    },
    {
      "id": 14,
      "shape": "tree-node",
      "width": 120,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "服务通知"
          },
          "fill": "#333333"
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 700,
      "y": 450
    },
    {
      "id": 15,
      "shape": "tree-node",
      "width": 120,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "老客户福利"
          },
          "fill": "#333333"
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 700,
      "y": 500
    },
    {
      "id": 16,
      "shape": "tree-node",
      "width": 120,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "不会乱发广告"
          },
          "fill": "#333333"
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 700,
      "y": 550
    },
    // 企业介绍的详细信息 (第3层) - 白色背景，青色边框
    {
      "id": 19,
      "shape": "tree-node",
      "width": 120,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "官方企业微信"
          },
          "fill": "#333333"
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#4ECDC4"
        }
      },
      "x": 700,
      "y": 600
    }
  ],
  "edges": [
    // 根节点到主分支的连接
    {
      "source": 1,
      "target": 2,
      "shape": "tree-edge"
    },
    {
      "source": 1,
      "target": 17,
      "shape": "tree-edge"
    },
    // 电联加微分支的连接
    {
      "source": 2,
      "target": 3,
      "shape": "tree-edge"
    },
    {
      "source": 2,
      "target": 9,
      "shape": "tree-edge"
    },
    {
      "source": 2,
      "target": 12,
      "shape": "tree-edge"
    },
    // 企微介绍分支的连接
    {
      "source": 17,
      "target": 18,
      "shape": "tree-edge"
    },
    // 邀约加微的详细信息连接
    {
      "source": 3,
      "target": 4,
      "shape": "tree-edge"
    },
    {
      "source": 3,
      "target": 5,
      "shape": "tree-edge"
    },
    {
      "source": 3,
      "target": 6,
      "shape": "tree-edge"
    },
    {
      "source": 3,
      "target": 7,
      "shape": "tree-edge"
    },
    {
      "source": 3,
      "target": 8,
      "shape": "tree-edge"
    },
    // 异议处理1的详细信息连接
    {
      "source": 9,
      "target": 10,
      "shape": "tree-edge"
    },
    {
      "source": 9,
      "target": 11,
      "shape": "tree-edge"
    },
    // 异议处理2的详细信息连接
    {
      "source": 12,
      "target": 13,
      "shape": "tree-edge"
    },
    {
      "source": 12,
      "target": 14,
      "shape": "tree-edge"
    },
    {
      "source": 12,
      "target": 15,
      "shape": "tree-edge"
    },
    {
      "source": 12,
      "target": 16,
      "shape": "tree-edge"
    },
    // 企业介绍的详细信息连接
    {
      "source": 18,
      "target": 19,
      "shape": "tree-edge"
    }
  ]
}

// localStorage相关常量
const MINDMAP_STORAGE_KEY = 'mindmap_data'

// 保存mindmap数据到localStorage
function saveMindMapToStorage() {
  try {
    const data = {
      nodes: [...mindmap.nodes],
      edges: [...mindmap.edges]
    }
    localStorage.setItem(MINDMAP_STORAGE_KEY, JSON.stringify(data))
    console.log('Mind map data saved to localStorage')
  } catch (error) {
    console.error('Failed to save mind map data to localStorage:', error)
  }
}

// 从localStorage加载mindmap数据
function loadMindMapFromStorage() {
  try {
    const savedData = localStorage.getItem(MINDMAP_STORAGE_KEY)
    if (savedData) {
      const data = JSON.parse(savedData)
      console.log('Mind map data loaded from localStorage')
      return data
    }
  } catch (error) {
    console.error('Failed to load mind map data from localStorage:', error)
  }
  return null
}

// 初始化思维导图数据（优先从localStorage加载）
function initMindMapData() {
  const savedData = loadMindMapFromStorage()
  if (savedData) {
    // 使用保存的数据覆盖默认数据
    mindmap.nodes = savedData.nodes
    mindmap.edges = savedData.edges
    console.log('Using saved mind map data from localStorage')
  } else {
    console.log('Using default mind map data')
    // 首次加载时保存默认数据
    saveMindMapToStorage()
  }
}

// 初始化思维导图
export function initMindMap() {
  const container = document.getElementById('container')
  if (!container) {
    console.error('Container element not found')
    return
  }

  // 初始化数据（优先使用localStorage中的数据）
  initMindMapData()

  // 获取容器尺寸
  const containerRect = container.getBoundingClientRect()
  const containerWidth = container.clientWidth || 800
  const containerHeight = container.clientHeight || 600

  // 创建Graph实例
  graph = new Graph({
    container: container,
    width: containerWidth,
    height: containerHeight,
    async: true,
    interacting: {
      nodeMovable: false,
      edgeMovable: false,
      arrowheadMovable: false,
      vertexMovable: false,
      vertexAddable: false,
      vertexDeletable: false,
    },
    // 禁用画布拖动，使用滚动条代替
    panning: {
      enabled: false,
    },
    connecting: {
      anchor: 'center',
      connector: 'normal',
      connectionPoint: 'anchor',
      router: {
        name: 'normal',
      },
      // 配置连线从源节点的右侧连接点开始
      sourceAnchor: {
        name: 'right',
      },
      targetAnchor: {
        name: 'left',
      },
    },
    grid: {
      visible: true,
      type: 'dot',
      size: 10,
    },
    background: {
      color: '#FAFAFA',
    },
    // 完全禁用缩放功能
    mousewheel: {
      enabled: false,
    },
    // 启用自动调整以适应容器
    autoResize: true,
  })

  // 添加节点折叠事件监听
  graph.on('node:collapse', ({ node }) => {
    node.toggleCollapse()
    const collapsed = node.isCollapsed()
    const run = (pre) => {
      const succ = graph.getSuccessors(pre, { distance: 1 })
      if (succ) {
        succ.forEach((node) => {
          const treeNode = node
          treeNode.toggleVisible(!collapsed)
          if (!treeNode.isCollapsed()) {
            run(treeNode)
          }
        })
      }
    }
    run(node)
  })

  // 添加右键菜单事件监听
  graph.on('node:contextmenu', ({ e, node }) => {
    e.preventDefault()
    showContextMenu(e, node)
  })

  // 点击其他地方隐藏右键菜单
  graph.on('blank:click', () => {
    hideContextMenu()
  })

  const start = new Date().getTime()
  const nodes = mindmap.nodes.map(({ ...metadata }) => {
    const node = new TreeNode({
      ...metadata,
      id: metadata.id.toString(), // 将number转换为string
      ports: {
        items: [
          {
            id: 'right',
            group: 'right',
          },
          {
            id: 'left',
            group: 'left',
          },
        ],
      },
    })
    
    // 检查节点是否有子节点
    const hasChildren = mindmap.edges.some(edge => edge.source === metadata.id)
    node.setHasChildren(hasChildren)
    
    return node
  })
  const edges = mindmap.edges.map(
    (edge) => {
      // 根据源节点确定连线颜色
      let strokeColor = '#A2B1C3' // 默认颜色
      
      // 获取源节点的颜色
      const sourceNode = mindmap.nodes.find(node => node.id === edge.source)
      if (sourceNode && sourceNode.attrs.body) {
        const bodyFill = sourceNode.attrs.body.fill
        if (bodyFill === '#FF6B6B') {
          strokeColor = '#FF6B6B' // 红色分支
        } else if (bodyFill === '#4ECDC4') {
          strokeColor = '#4ECDC4' // 青色分支
        } else if (bodyFill === '#5F95FF') {
          strokeColor = '#5F95FF' // 蓝色根节点
        }
      }
      
      return new TreeEdge({
        source: { cell: edge.source.toString(), port: 'right' },
        target: { cell: edge.target.toString(), port: 'left' },
        attrs: {
          line: {
            stroke: strokeColor,
            strokeWidth: 1,
            targetMarker: null,
          },
        },
      })
    }
  )

  graph.resetCells([...nodes, ...edges])

  // 使用setTimeout来模拟异步加载
  setTimeout(() => {
    const time = new Date().getTime() - start
    console.log(`Mind map loaded in ${time}ms`)
    // 初始化时更新容器大小
    updateContainerSize()
  }, 100)
}

// 导出graph实例供外部使用
export { graph } 