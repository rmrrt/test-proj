<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Home, Wrench, HardHat, BarChart3, Info } from 'lucide-vue-next'

const route = useRoute()

const tabs = [
  { path: '/modules',  Icon: Home,       label: 'Модули' },
  { path: '/tools',    Icon: Wrench,      label: 'Инструменты' },
  { path: '/gear',     Icon: HardHat,     label: 'Снаряжение' },
  { path: '/progress', Icon: BarChart3,   label: 'Прогресс' },
  { path: '/about',    Icon: Info,        label: 'О нас' },
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
      <span class="tab-icon-wrap">
        <component :is="tab.Icon" :size="20" :stroke-width="route.path === tab.path ? 2.2 : 1.7" />
      </span>
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
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-decoration: none;
  color: var(--text-muted);
  transition: color 0.18s;
  padding: 6px 0 4px;
  position: relative;
}

.tab::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 24px;
  height: 2px;
  background: var(--accent);
  border-radius: 0 0 2px 2px;
  transition: transform 0.2s ease;
}

.tab.active {
  color: var(--accent);
}

.tab.active::after {
  transform: translateX(-50%) scaleX(1);
}

.tab-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s;
}

.tab.active .tab-icon-wrap {
  transform: translateY(-1px);
}

.tab-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
</style>
