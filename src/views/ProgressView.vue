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

const isAllCompleted = computed(
  () => content.modules.length > 0 && progress.progress.completedModules.length >= content.modules.length,
)

const averageQuizScore = computed(() => {
  const vals = Object.values(progress.progress.quizScores)
  if (!vals.length) return 0
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100)
})

const completionDate = new Date().toLocaleDateString('ru-RU')

async function shareAchievement() {
  const text = `🏆 Я прошёл базовый курс по сварке!\n${completedLessons.value} уроков, средний балл ${averageQuizScore.value}%`
  if (navigator.share) {
    await navigator.share({ title: 'Базовый курс по сварке', text })
  } else {
    await navigator.clipboard.writeText(text)
    alert('Скопировано в буфер обмена!')
  }
}

function scoreClass(score: number) {
  if (score >= 0.8) return 'score-green'
  if (score >= 0.6) return 'score-orange'
  return 'score-red'
}

const moduleStats = computed(() =>
  content.modules.map((mod) => ({
    ...mod,
    completed: progress.isModuleCompleted(mod.id),
    lessonsDone: mod.lessons.filter((l) => progress.isLessonCompleted(l.id)).length,
    total: mod.lessons.length,
    lessons: mod.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      completed: progress.isLessonCompleted(l.id),
      score: progress.progress.quizScores[l.id] as number | undefined,
    })),
  })),
)
</script>

<template>
  <div class="page">
    <div class="header">
      <div class="gost-tag">СТАТИСТИКА</div>
      <h2>Мой прогресс</h2>
    </div>

    <div v-if="isAllCompleted" class="certificate card">
      <div class="cert-heading">🏆 Базовый курс по сварке пройден!</div>
      <div class="cert-stats">
        <span>{{ completedLessons }} уроков пройдено</span>
        <span class="cert-dot">·</span>
        <span>средний балл {{ averageQuizScore }}%</span>
        <span class="cert-dot">·</span>
        <span>{{ completionDate }}</span>
      </div>
      <button class="cert-btn" @click="shareAchievement">Поделиться достижением</button>
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
        <ul class="lesson-list">
          <li v-for="lesson in mod.lessons" :key="lesson.id" class="lesson-row">
            <span class="lesson-check">{{ lesson.completed ? '✅' : '○' }}</span>
            <span class="lesson-title">{{ lesson.title }}</span>
            <span
              v-if="lesson.score !== undefined"
              class="score-badge"
              :class="scoreClass(lesson.score)"
            >{{ Math.round(lesson.score * 100) }}%</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header { margin-bottom: 16px; }
.header h2 { margin-top: 4px; }

.certificate {
  margin-bottom: 16px;
  background: linear-gradient(135deg, #b8860b 0%, #ffd700 50%, #daa520 100%);
  border: 1px solid #c9a227;
  color: #1a1200;
}
.cert-heading { font-size: 18px; font-weight: 800; margin-bottom: 8px; }
.cert-stats { font-size: 13px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; margin-bottom: 12px; opacity: 0.85; }
.cert-dot { opacity: 0.5; }
.cert-btn {
  background: rgba(0,0,0,0.18); border: 1px solid rgba(0,0,0,0.25);
  color: #1a1200; border-radius: 8px; padding: 8px 16px;
  font-size: 14px; font-weight: 600; cursor: pointer;
  transition: background 0.15s;
}
.cert-btn:hover { background: rgba(0,0,0,0.28); }

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
.mod-progress-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.progress-bar { flex: 1; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.3s; }
.prog-text { font-size: 11px; color: var(--text-secondary); }

.lesson-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; }
.lesson-row { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.lesson-check { font-size: 13px; flex-shrink: 0; }
.lesson-title { flex: 1; color: var(--text-secondary); }
.score-badge {
  font-size: 11px; font-weight: 700; padding: 1px 6px;
  border-radius: 10px; flex-shrink: 0;
}
.score-green { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
.score-orange { background: rgba(249, 115, 22, 0.15); color: #f97316; }
.score-red { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
</style>
