<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useContentStore } from '@/stores/content'
import { useProgressStore } from '@/stores/progress'
import TheoryStep from '@/components/lesson/TheoryStep.vue'
import QuizStep from '@/components/lesson/QuizStep.vue'
import DefectChallenge from '@/components/tools/DefectChallenge.vue'

const props = defineProps<{ lessonId: string }>()
const router = useRouter()
const content = useContentStore()
const progress = useProgressStore()

const lesson = computed(() => content.getLesson(props.lessonId))
const mod = computed(() => lesson.value ? content.getLessonModule(props.lessonId) : undefined)

const stepIndex = ref(0)
const quizScore = ref<number | null>(null)
const finished = ref(false)

const currentStep = computed(() => lesson.value?.steps[stepIndex.value])

function onTheoryDone() {
  advance()
}

function onQuizDone(score: number) {
  quizScore.value = score
  const passed = score >= (currentStep.value as any).passingScore
  if (passed) {
    advance()
  }
  // If failed, QuizStep handles retry internally — re-emit when they pass
}

function onDefectDone() {
  advance()
}

function advance() {
  if (!lesson.value) return
  if (stepIndex.value < lesson.value.steps.length - 1) {
    stepIndex.value++
  } else {
    finishLesson()
  }
}

function finishLesson() {
  if (!lesson.value) return
  progress.completeLesson(lesson.value.id, quizScore.value ?? undefined)

  // Check if module is now complete
  if (mod.value) {
    const allDone = mod.value.lessons.every((l) => progress.isLessonCompleted(l.id))
    if (allDone) progress.completeModule(mod.value.id)
  }

  finished.value = true
}

function getDefectChallenge(challengeId: string) {
  return content.getDefectChallenge(challengeId)
}
</script>

<template>
  <div v-if="!lesson" class="page">
    <p>Урок не найден.</p>
  </div>

  <div v-else-if="finished" class="page finish-page">
    <div class="finish-content">
      <div class="finish-icon">🎉</div>
      <h2>Урок пройден!</h2>
      <p class="finish-sub">{{ lesson.title }}</p>
      <button class="btn btn-primary" @click="router.push('/modules')">
        К модулям
      </button>
    </div>
  </div>

  <div v-else class="lesson-view">
    <!-- Шапка -->
    <div class="lesson-header">
      <button class="back-btn" @click="router.back()">← Назад</button>
      <div class="lesson-meta">
        <div class="gost-tag">{{ mod?.title }}</div>
        <h2 class="lesson-title">{{ lesson.title }}</h2>
      </div>
      <div class="step-indicator">
        {{ stepIndex + 1 }}/{{ lesson.steps.length }}
      </div>
    </div>

    <!-- Прогресс шагов -->
    <div class="step-progress">
      <div
        v-for="(_, i) in lesson.steps"
        :key="i"
        class="step-dot"
        :class="{ done: i < stepIndex, active: i === stepIndex }"
      />
    </div>

    <!-- Контент шага -->
    <div class="page step-content">
      <template v-if="currentStep?.type === 'theory'">
        <TheoryStep
          :blocks="currentStep.blocks"
          :sources="currentStep.sources"
          :videos="lesson.videos"
          :practicalNote="lesson.practicalNote"
          @done="onTheoryDone"
        />
      </template>

      <template v-else-if="currentStep?.type === 'quiz'">
        <QuizStep
          :questions="currentStep.questions"
          :passingScore="currentStep.passingScore"
          @done="onQuizDone"
        />
      </template>

      <template v-else-if="currentStep?.type === 'defect-challenge'">
        <DefectChallenge
          v-if="getDefectChallenge(currentStep.challengeId)"
          :challenge="getDefectChallenge(currentStep.challengeId)!"
          @done="onDefectDone"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.lesson-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.lesson-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px 0;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
}

.back-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  padding: 4px 0;
  white-space: nowrap;
  flex-shrink: 0;
  padding-top: 2px;
}

.back-btn:hover { color: var(--text-primary); }

.lesson-meta {
  flex: 1;
  padding-bottom: 12px;
}

.lesson-title {
  font-size: 16px;
  margin-top: 2px;
  line-height: 1.3;
}

.step-indicator {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
  padding-top: 4px;
}

.step-progress {
  display: flex;
  gap: 4px;
  padding: 8px 16px;
  background: var(--bg-secondary);
}

.step-dot {
  flex: 1;
  height: 3px;
  background: var(--border);
  border-radius: 2px;
  transition: background 0.3s;
}

.step-dot.done { background: var(--success); }
.step-dot.active { background: var(--accent); }

.step-content {
  flex: 1;
}

/* Finish screen */
.finish-page {
  display: flex;
  align-items: center;
  justify-content: center;
}

.finish-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.finish-icon { font-size: 64px; }
.finish-sub { color: var(--text-secondary); }
</style>
