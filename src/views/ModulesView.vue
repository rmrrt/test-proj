<script setup lang="ts">
import { computed } from 'vue'
import { useContentStore } from '@/stores/content'
import { useProgressStore } from '@/stores/progress'
import { useDevMode } from '@/composables/useDevMode'
import { useRouter } from 'vue-router'

const content = useContentStore()
const progress = useProgressStore()
const { isDevMode } = useDevMode()
const router = useRouter()

const modulesList = computed(() =>
  content.modules.map((mod) => ({
    ...mod,
    completed: progress.isModuleCompleted(mod.id),
    unlocked: isDevMode.value || content.isModuleUnlocked(mod.id, progress.progress.completedModules),
    completedLessons: mod.lessons.filter((l) => progress.isLessonCompleted(l.id)).length,
  })),
)

function openFirstLesson(moduleId: string) {
  const mod = content.getModule(moduleId)
  if (!mod) return
  const firstIncomplete = mod.lessons.find((l) => !progress.isLessonCompleted(l.id))
  const target = firstIncomplete ?? mod.lessons[0]
  if (!target) return
  router.push(`/lesson/${target.id}`)
}
</script>

<template>
  <div class="page">
    <div class="header">
      <div class="gost-tag">ПРОГРАММА ОБУЧЕНИЯ</div>
      <h2>Модули</h2>
    </div>

    <div class="modules-list">
      <div
        v-for="mod in modulesList"
        :key="mod.id"
        class="module-card"
        :class="{ locked: !mod.unlocked, completed: mod.completed }"
        @click="mod.unlocked && openFirstLesson(mod.id)"
      >
        <div class="module-icon">
          <span v-if="!mod.unlocked">🔒</span>
          <span v-else-if="mod.completed">✅</span>
          <span v-else>{{ mod.icon }}</span>
        </div>
        <div class="module-info">
          <div class="module-title-row">
            <h3>{{ mod.title }}</h3>
            <span v-if="mod.skippable" class="skip-badge">пропускаемый</span>
          </div>
          <p class="module-desc">{{ mod.description }}</p>
          <div class="module-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: mod.lessons.length ? `${(mod.completedLessons / mod.lessons.length) * 100}%` : '0%' }" />
            </div>
            <span class="progress-text">{{ mod.completedLessons }}/{{ mod.lessons.length }} уроков</span>
          </div>
        </div>
        <span v-if="mod.unlocked" class="module-arrow">→</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header { margin-bottom: 20px; }
.header h2 { margin-top: 4px; }
.modules-list { display: flex; flex-direction: column; gap: 12px; }
.module-card {
  display: flex; align-items: center; gap: 14px;
  background: var(--bg-secondary); border: 1px solid var(--border);
  border-radius: 12px; padding: 16px; cursor: pointer;
  transition: border-color 0.15s, opacity 0.15s;
}
.module-card:hover:not(.locked) { border-color: var(--accent); }
.module-card.locked { opacity: 0.5; cursor: not-allowed; }
.module-card.completed { border-color: var(--success); }
.module-icon { font-size: 28px; flex-shrink: 0; width: 44px; text-align: center; }
.module-info { flex: 1; min-width: 0; }
.module-title-row { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
.module-desc { font-size: 13px; color: var(--text-secondary); margin-bottom: 10px; }
.skip-badge { font-size: 10px; background: rgba(233,69,96,0.15); color: var(--accent); border: 1px solid rgba(233,69,96,0.3); border-radius: 4px; padding: 1px 6px; white-space: nowrap; }
.module-progress { display: flex; align-items: center; gap: 8px; }
.progress-bar { flex: 1; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.3s; }
.progress-text { font-size: 11px; color: var(--text-secondary); white-space: nowrap; }
.module-arrow { color: var(--accent); font-size: 18px; flex-shrink: 0; }
</style>
