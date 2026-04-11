<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { useContentStore } from '@/stores/content'

const progress = useProgressStore()
const content = useContentStore()

const totalLessons = computed(() => content.modules.reduce((acc, m) => acc + m.lessons.length, 0))
const completedLessons = computed(() => progress.progress.completedLessons.length)
const completedModules = computed(() => progress.progress.completedModules.length)
const overallPct = computed(() =>
  totalLessons.value ? Math.round((completedLessons.value / totalLessons.value) * 100) : 0,
)

const moduleStats = computed(() =>
  content.modules.map((mod) => ({
    ...mod,
    completed: progress.isModuleCompleted(mod.id),
    lessonsDone: mod.lessons.filter((l) => progress.isLessonCompleted(l.id)).length,
    total: mod.lessons.length,
  })),
)
</script>

<template>
  <div class="page">
    <div class="header">
      <div class="gost-tag">СТАТИСТИКА</div>
      <h2>Мой прогресс</h2>
    </div>
    <div class="overall card">
      <div class="overall-numbers">
        <div class="stat"><span class="stat-value">{{ completedLessons }}</span><span class="stat-label">уроков пройдено</span></div>
        <div class="stat"><span class="stat-value">{{ completedModules }}</span><span class="stat-label">модулей завершено</span></div>
        <div class="stat"><span class="stat-value">{{ overallPct }}%</span><span class="stat-label">курса пройдено</span></div>
      </div>
      <div class="progress-bar-big"><div class="progress-fill-big" :style="{ width: overallPct + '%' }" /></div>
    </div>
    <div class="module-stats">
      <div v-for="mod in moduleStats" :key="mod.id" class="mod-stat card">
        <div class="mod-stat-header">
          <span>{{ mod.icon }}</span><h3>{{ mod.title }}</h3>
          <span v-if="mod.completed" class="done-badge">✅</span>
        </div>
        <div class="mod-progress-row">
          <div class="progress-bar"><div class="progress-fill" :style="{ width: mod.total ? `${(mod.lessonsDone / mod.total) * 100}%` : '0%' }" /></div>
          <span class="prog-text">{{ mod.lessonsDone }}/{{ mod.total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header { margin-bottom: 16px; }
.header h2 { margin-top: 4px; }
.overall { margin-bottom: 16px; }
.overall-numbers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 14px; text-align: center; }
.stat-value { display: block; font-size: 28px; font-weight: 800; color: var(--accent); }
.stat-label { display: block; font-size: 11px; color: var(--text-secondary); margin-top: 2px; }
.progress-bar-big { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
.progress-fill-big { height: 100%; background: var(--accent); border-radius: 4px; transition: width 0.5s ease; }
.module-stats { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.mod-stat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.mod-stat-header h3 { flex: 1; font-size: 15px; }
.done-badge { font-size: 16px; }
.mod-progress-row { display: flex; align-items: center; gap: 8px; }
.progress-bar { flex: 1; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.3s; }
.prog-text { font-size: 11px; color: var(--text-secondary); }
</style>
