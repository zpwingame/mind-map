<template>
  <div class="app">
    <h1>思维导图展示</h1>
    <div class="tips">
      💡 操作提示: 鼠标拖动画布 | 鼠标滚轮缩放 | 右键节点打开菜单
    </div>
    <div ref="containerRef" id="container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { initMindMap } from './mind'

const containerRef = ref<HTMLDivElement>()

onMounted(() => {
  // 确保容器元素存在后再初始化思维导图
  if (containerRef.value) {
    // 给DOM一点时间完全渲染
    setTimeout(() => {
      initMindMap()
    }, 100)
  }
})
</script>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.app h1 {
  text-align: center;
  margin: 0;
  padding: 10px 0;
  color: #333;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.tips {
  text-align: center;
  padding: 8px 0;
  background-color: #e3f2fd;
  color: #1565c0;
  font-size: 0.9rem;
  border-bottom: 1px solid #bbdefb;
  flex-shrink: 0;
}

#container {
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: #fafafa;
  overflow: hidden;
  cursor: grab;
}

#container:active {
  cursor: grabbing;
}

/* 思维导图节点样式 */
:deep(.x6-node) {
  cursor: pointer;
}

:deep(.x6-node:hover) {
  filter: brightness(1.1);
}

/* 思维导图边样式 */
:deep(.x6-edge) {
  transition: stroke-opacity 0.3s;
}

:deep(.x6-edge:hover) {
  stroke-opacity: 0.8;
}

/* 拖动相关样式 */
:deep(.x6-graph-panning) {
  cursor: grabbing !important;
}

:deep(.x6-graph-panning .x6-node) {
  cursor: grabbing !important;
}

/* 空白区域拖动提示 */
:deep(.x6-graph svg) {
  cursor: grab;
}

:deep(.x6-graph.x6-graph-panning svg) {
  cursor: grabbing;
}
</style> 