import { useEffect, useRef } from 'react'
import './App.css'
import { initMindMap } from './mind'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 确保容器元素存在后再初始化思维导图
    if (containerRef.current) {
      // 给DOM一点时间完全渲染
      setTimeout(() => {
        initMindMap()
      }, 100)
    }
  }, [])

  return (
    <div className="app">
      <h1>思维导图展示</h1>
      <div className="tips">
        💡 操作提示: 鼠标拖动画布 | 鼠标滚轮缩放 | 右键节点打开菜单
      </div>
      <div ref={containerRef} id="container" ></div>
    </div>
  )
}

export default App
