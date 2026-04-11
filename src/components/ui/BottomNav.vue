<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { path: '/modules',  icon: '🏠', label: 'Модули' },
  { path: '/tools',    icon: '🔧', label: 'Инструменты' },
  { path: '/gear',     icon: '🛒', label: 'Снаряжение' },
  { path: '/progress', icon: '📊', label: 'Прогресс' },
  { path: '/about',    icon: 'ℹ️',  label: 'О нас' },
]
</script>

<template>
  <nav class="bottom-nav">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="tab"
      :class="{ active: route.path === tab.path }"
    >
      <span class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  height: var(--nav-height);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: stretch;
  z-index: 100;
}

.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  text-decoration: none;
  color: var(--text-secondary);
  transition: color 0.15s;
  padding: 4px 0;
}

.tab.active {
  color: var(--accent);
}

.tab-icon {
  font-size: 18px;
  line-height: 1;
}

.tab-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}
</style>
