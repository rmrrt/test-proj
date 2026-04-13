<script setup lang="ts">
import { computed, ref } from 'vue'
import { useContentStore } from '@/stores/content'
import { useProgressStore } from '@/stores/progress'
import { useDevMode } from '@/composables/useDevMode'
import { useRouter } from 'vue-router'
import { Lock, CheckCircle2, ChevronRight, Search, X } from 'lucide-vue-next'

const content = useContentStore()
const progress = useProgressStore()
const { isDevMode } = useDevMode()
const router = useRouter()

const searchQuery = ref('')

const modulesList = computed(() =>
  content.modules.map((mod) => ({
    ...mod,
    completed: progress.isModuleCompleted(mod.id),
    unlocked: isDevMode.value || content.isModuleUnlocked(mod.id, progress.progress.completedModules),
    completedLessons: mod.lessons.filter((l) => progress.isLessonCompleted(l.id)).length,
  })),
)

const filteredResults = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []
  return content.modules
    .map((mod) => ({
      mod,
      lessons: mod.lessons.filter((l) => l.title.toLowerCase().includes(q)),
    }))
    .filter((r) => r.lessons.length > 0)
})

function openFirstLesson(moduleId: string) {
  const mod = content.getModule(moduleId)
  if (!mod) return
  const firstIncomplete = mod.lessons.find((l) => !progress.isLessonCompleted(l.id))
  const target = firstIncomplete ?? mod.lessons[0]
  if (!target) return
  router.push(`/lesson/${target.id}`)
}

function openLesson(lessonId: string) {
  router.push(`/lesson/${lessonId}`)
}

function clearSearch() {
  searchQuery.value = ''
}
</script>

<template>
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <div class="gost-tag">Программа обучения</div>
      <h2>Модули</h2>
    </div>

    <!-- Search -->
    <div class="search-wrap">
      <Search class="search-icon" :size="16" />
      <input
        v-model="searchQuery"
        class="search-input"
        type="search"
        placeholder="Поиск по урокам..."
      />
      <button v-if="searchQuery" class="search-clear" @click="clearSearch">
        <X :size="14" />
      </button>
    </div>

    <!-- Search results -->
    <template v-if="searchQuery.trim()">
      <div v-if="filteredResults.length === 0" class="search-empty">
        Ничего не найдено
      </div>
      <div v-else class="search-results animate-fade-in">
        <div v-for="result in filteredResults" :key="result.mod.id" class="search-group">
          <div class="search-group-title">
            <span>{{ result.mod.icon }}</span>
            {{ result.mod.title }}
          </div>
          <div
            v-for="lesson in result.lessons"
            :key="lesson.id"
            class="search-lesson"
            @click="openLesson(lesson.id)"
          >
            <CheckCircle2
              v-if="progress.isLessonCompleted(lesson.id)"
              :size="15"
              class="lesson-check done"
            />
            <span v-else class="lesson-check-empty" />
            <span class="search-lesson-title">{{ lesson.title }}</span>
            <ChevronRight :size="15" class="search-arrow" />
          </div>
        </div>
      </div>
    </template>

    <!-- Modules list -->
    <template v-else>
      <div class="modules-list">
        <div
          v-for="(mod, idx) in modulesList"
          :key="mod.id"
          class="module-card animate-fade-in-up"
          :class="{ locked: !mod.unlocked, completed: mod.completed }"
          :style="{ animationDelay: `${idx * 50}ms` }"
          @click="mod.unlocked && openFirstLesson(mod.id)"
        >
          <!-- Left accent bar -->
          <div class="module-accent-bar" />

          <!-- Icon -->
          <div class="module-icon-wrap">
            <Lock v-if="!mod.unlocked" :size="20" class="icon-locked" />
            <CheckCircle2 v-else-if="mod.completed" :size="22" class="icon-done" />
            <span v-else class="module-emoji">{{ mod.icon }}</span>
          </div>

          <!-- Content -->
          <div class="module-info">
            <div class="module-title-row">
              <h3>{{ mod.title }}</h3>
              <span v-if="mod.skippable" class="skip-badge">пропускаемый</span>
            </div>
            <p class="module-desc">{{ mod.description }}</p>
            <div class="module-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{
                    width: mod.lessons.length
                      ? `${(mod.completedLessons / mod.lessons.length) * 100}%`
                      : '0%',
                  }"
                />
              </div>
              <span class="progress-text">{{ mod.completedLessons }}/{{ mod.lessons.length }}</span>
            </div>
          </div>

          <!-- Arrow -->
          <ChevronRight v-if="mod.unlocked" :size="18" class="module-arrow" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 11px 36px 11px 36px;
  font-size: 15px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-light);
}

.search-input::-webkit-search-cancel-button { display: none; }

.search-clear {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 50%;
  transition: color 0.15s;
}
.search-clear:hover { color: var(--text-primary); }

.search-empty {
  text-align: center;
  color: var(--text-secondary);
  padding: 40px 0;
  font-size: 15px;
}

.search-results { display: flex; flex-direction: column; gap: 16px; }
.search-group { display: flex; flex-direction: column; gap: 6px; }

.search-group-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.search-lesson {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  font-size: 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.search-lesson:hover {
  border-color: var(--accent);
  background: var(--bg-elevated);
}

.lesson-check { color: var(--success); flex-shrink: 0; }
.lesson-check-empty {
  width: 15px;
  height: 15px;
  border: 1.5px solid var(--border-strong);
  border-radius: 50%;
  flex-shrink: 0;
}
.search-lesson-title { flex: 1; }
.search-arrow { color: var(--text-muted); flex-shrink: 0; }

/* Modules list */
.modules-list { display: flex; flex-direction: column; gap: 10px; }

.module-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px 16px 16px 0;
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s, transform 0.12s;
  overflow: hidden;
}

.module-card:hover:not(.locked) {
  border-color: var(--accent-border);
  background: var(--bg-elevated);
  transform: translateY(-1px);
}

.module-card.locked {
  opacity: 0.45;
  cursor: not-allowed;
}

.module-card.completed {
  border-color: rgba(48, 209, 88, 0.3);
}

.module-accent-bar {
  width: 4px;
  align-self: stretch;
  border-radius: 0 2px 2px 0;
  flex-shrink: 0;
  background: var(--border);
  transition: background 0.18s;
}

.module-card:not(.locked):not(.completed) .module-accent-bar { background: var(--accent); }
.module-card.completed .module-accent-bar { background: var(--success); }

.module-icon-wrap {
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.module-emoji { font-size: 26px; line-height: 1; }
.icon-locked { color: var(--text-muted); }
.icon-done { color: var(--success); }

.module-info { flex: 1; min-width: 0; }

.module-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
}

.module-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 10px;
  line-height: 1.4;
}

.skip-badge {
  font-size: 9px;
  font-weight: 700;
  background: var(--accent-light);
  color: var(--accent);
  border: 1px solid var(--accent-border);
  border-radius: var(--radius-sm);
  padding: 2px 6px;
  white-space: nowrap;
  letter-spacing: 0.3px;
}

.module-progress { display: flex; align-items: center; gap: 8px; }

.progress-bar {
  flex: 1;
  height: 3px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.4s ease;
}

.module-card.completed .progress-fill { background: var(--success); }

.progress-text {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.module-arrow { color: var(--text-muted); flex-shrink: 0; }
.module-card:hover:not(.locked) .module-arrow { color: var(--accent); }
</style>
