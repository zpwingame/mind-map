import { Graph, Node, Edge, Shape, Cell } from '@antv/x6'

// 定义节点
class TreeNode extends Node {
  private collapsed: boolean = false

  protected postprocess() {
    this.toggleCollapse(false)
  }

  isCollapsed() {
    return this.collapsed
  }

  toggleButtonVisibility(visible: boolean) {
    this.attr('buttonGroup', {
      display: visible ? 'block' : 'none',
    })
  }

  toggleCollapse(collapsed?: boolean) {
    const target = collapsed == null ? !this.collapsed : collapsed
    if (!target) {
      this.attr('buttonSign', {
        d: 'M 1 5 9 5 M 5 1 5 9',
        strokeWidth: 1.6,
      })
    } else {
      this.attr('buttonSign', {
        d: 'M 2 5 8 5',
        strokeWidth: 1.8,
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
          tagName: 'rect',
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
    },
    label: {
      textWrap: {
        ellipsis: true,
        width: -10,
      },
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      refX: '50%',
      refY: '50%',
      fontSize: 12,
    },
    buttonGroup: {
      refX: '100%',
      refY: '50%',
    },
    button: {
      fill: '#5F95FF',
      stroke: 'none',
      x: -10,
      y: -10,
      height: 20,
      width: 30,
      rx: 10,
      ry: 10,
      cursor: 'pointer',
      event: 'node:collapse',
    },
    buttonSign: {
      refX: 5,
      refY: -5,
      stroke: '#FFFFFF',
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
    const node = this.getTargetNode() as TreeNode
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
let graph: Graph | null = null

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
    // 主分支1：电联加微 (第1层)
    {
      "id": 2,
      "shape": "tree-node",
      "width": 100,
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
    // 主分支2：企微介绍 (第1层)
    {
      "id": 17,
      "shape": "tree-node",
      "width": 100,
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
    // 电联加微子分支：邀约加微 (第2层)
    {
      "id": 3,
      "shape": "tree-node",
      "width": 100,
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
    // 电联加微子分支：异议处理1 (第2层)
    {
      "id": 9,
      "shape": "tree-node",
      "width": 120,
      "height": 40,
      "leaf": false,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "异议处理1:客户没时间"
          },
          "fill": "#FFFFFF"
        },
        "body": {
          "fill": "#FF6B6B",
          "stroke": "#FF6B6B"
        }
      },
      "x": 500,
      "y": 200
    },
    // 电联加微子分支：异议处理2 (第2层)
    {
      "id": 12,
      "shape": "tree-node",
      "width": 140,
      "height": 40,
      "leaf": false,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "异议处理2:担心信息骚扰"
          },
          "fill": "#FFFFFF"
        },
        "body": {
          "fill": "#FF6B6B",
          "stroke": "#FF6B6B"
        }
      },
      "x": 500,
      "y": 300
    },
    // 企微介绍子分支：企业介绍 (第2层)
    {
      "id": 18,
      "shape": "tree-node",
      "width": 100,
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
    // 邀约加微的详细信息 (第3层)
    {
      "id": 4,
      "shape": "tree-node",
      "width": 80,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "老客户"
          }
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
      "width": 100,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "官方企业微信"
          }
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
      "width": 80,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "邀请您加一下"
          }
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
      "width": 80,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "添加链接"
          }
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
      "width": 80,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "专属福利"
          }
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 700,
      "y": 250
    },
    // 异议处理1的详细信息 (第3层)
    {
      "id": 10,
      "shape": "tree-node",
      "width": 80,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "特别快"
          }
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
      "width": 80,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "专属福利"
          }
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 700,
      "y": 350
    },
    // 异议处理2的详细信息 (第3层)
    {
      "id": 13,
      "shape": "tree-node",
      "width": 100,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "官方企业微信"
          }
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
      "width": 80,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "服务通知"
          }
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
      "width": 80,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "老客户福利"
          }
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
      "width": 100,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "不会乱发广告"
          }
        },
        "body": {
          "fill": "#FFFFFF",
          "stroke": "#FF6B6B"
        }
      },
      "x": 700,
      "y": 550
    },
    // 企业介绍的详细信息 (第3层)
    {
      "id": 19,
      "shape": "tree-node",
      "width": 100,
      "height": 30,
      "leaf": true,
      "attrs": {
        "label": {
          "textWrap": {
            "text": "官方企业微信"
          }
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

// 定义类型
interface MindMapNode {
  id: number
  shape: string
  width: number
  height: number
  leaf: boolean
  attrs: {
    label: {
      textWrap: {
        text: string | number | boolean
      }
    }
  }
  x: number
  y: number
}

interface MindMapEdge {
  source: number
  target: number
  shape: string
}

  // 初始化思维导图
export function initMindMap() {
  const container = document.getElementById('container')
  if (!container) {
    console.error('Container element not found')
    return
  }

  // 创建Graph实例
  graph = new Graph({
    container: container,
    async: true,
    interacting: false,
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
  })

  // 添加节点折叠事件监听
  graph.on('node:collapse', ({ node }: { node: TreeNode }) => {
    node.toggleCollapse()
    const collapsed = node.isCollapsed()
    const run = (pre: TreeNode) => {
      const succ = graph!.getSuccessors(pre, { distance: 1 })
      if (succ) {
        succ.forEach((node: Cell) => {
          const treeNode = node as TreeNode
          treeNode.toggleVisible(!collapsed)
          if (!treeNode.isCollapsed()) {
            run(treeNode)
          }
        })
      }
    }
    run(node)
  })

  const start = new Date().getTime()
  const nodes = mindmap.nodes.map(({ leaf, ...metadata }: MindMapNode) => {
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
    if (leaf) {
      node.toggleButtonVisibility(!leaf) // 修复逻辑
    }
    return node
  })
  const edges = mindmap.edges.map(
    (edge: MindMapEdge) =>
      new TreeEdge({
        source: { cell: edge.source.toString(), port: 'right' },
        target: { cell: edge.target.toString(), port: 'left' },
        attrs: {
          line: {
            stroke: '#A2B1C3',
            strokeWidth: 1,
            targetMarker: null,
          },
        },
      }),
  )

  graph.resetCells([...nodes, ...edges])

  // 使用setTimeout来模拟异步加载
  setTimeout(() => {
    const time = new Date().getTime() - start
    console.log(`Mind map loaded in ${time}ms`)
    graph!.zoomToFit({ padding: 24 })
  }, 100)
}

// 导出graph实例供外部使用
export { graph }
