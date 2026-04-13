<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Question } from '@/types/content'
import { Lightbulb, CheckCircle2, ChevronRight } from 'lucide-vue-next'
import { useDevMode } from '@/composables/useDevMode'

const { isDevMode } = useDevMode()

const props = defineProps<{
  questions: Question[]
  passingScore: number
}>()

const emit = defineEmits<{
  done: [score: number]
}>()

const currentIndex = ref(0)
const selected = ref<number | null>(null)
const answered = ref(false)
const correct = ref(false)
const results = ref<boolean[]>([])
const shakeKey = ref(0)

const current = computed(() => props.questions[currentIndex.value]!)
const isLast = computed(() => currentIndex.value === props.questions.length - 1)

function answer(optionIndex: number) {
  if (answered.value) return
  selected.value = optionIndex
  answered.value = true
  correct.value = optionIndex === current.value.correctIndex
  results.value[currentIndex.value] = correct.value
  if (!correct.value) shakeKey.value++
}

function next() {
  if (isLast.value) {
    const score = Math.round((results.value.filter(Boolean).length / props.questions.length) * 100)
    emit('done', score)
  } else {
    currentIndex.value++
    selected.value = null
    answered.value = false
    correct.value = false
  }
}
</script>

<template>
  <div class="quiz">
    <div class="quiz-header">
      <span class="gost-tag">Проверка знаний</span>
      <span class="counter">{{ currentIndex + 1 }}&nbsp;/&nbsp;{{ questions.length }}</span>
    </div>

    <!-- Progress dots -->
    <div class="progress-dots">
      <span
        v-for="(_, i) in questions"
        :key="i"
        class="dot"
        :class="{
          correct: results[i] === true,
          wrong: results[i] === false,
          active: i === currentIndex,
        }"
      />
    </div>

    <div class="question-card" :key="currentIndex">
      <p class="question-text">{{ current.text }}</p>

      <div class="options" :class="{ shake: !correct && answered }" :key="shakeKey">
        <button
          v-for="(option, i) in current.options"
          :key="i"
          class="option"
          :class="{
            correct: answered && i === current.correctIndex,
            wrong: answered && selected === i && i !== current.correctIndex,
            'dev-correct': isDevMode && !answered && i === current.correctIndex,
          }"
          :disabled="answered"
          @click="answer(i)"
        >
          <span class="option-letter">{{ ['А', 'Б', 'В', 'Г'][i] }}</span>
          <span class="option-text">{{ option }}</span>
          <span v-if="isDevMode && !answered && i === current.correctIndex" class="dev-hint">✓</span>
        </button>
      </div>

      <!-- Wrong explanation -->
      <Transition name="slide">
        <div v-if="answered && !correct" class="feedback-block error-block">
          <Lightbulb :size="16" class="feedback-icon" />
          <p>{{ current.errorExplanation }}</p>
        </div>
      </Transition>

      <!-- Correct feedback -->
      <Transition name="slide">
        <div v-if="answered && correct" class="feedback-block correct-block">
          <CheckCircle2 :size="16" class="feedback-icon" />
          <p>Правильно!</p>
        </div>
      </Transition>
    </div>

    <button v-if="answered" class="btn btn-primary" @click="next">
      {{ isLast ? 'Завершить тест' : 'Следующий вопрос' }}
      <ChevronRight :size="16" />
    </button>
  </div>
</template>

<style scoped>
.quiz {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.counter {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.progress-dots {
  display: flex;
  gap: 6px;
}

.dot {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  transition: background 0.25s;
}

.dot.active  { background: var(--accent); }
.dot.correct { background: var(--success); }
.dot.wrong   { background: var(--error); }

.question-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-text {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.options.shake { animation: shake 0.4s ease; }

.option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s;
  color: var(--text-primary);
  width: 100%;
}

.option:hover:not(:disabled) {
  border-color: var(--accent-border);
  background: var(--bg-elevated);
}

.option:disabled { cursor: default; }

.option.correct {
  border-color: var(--success);
  background: var(--success-light);
  animation: pulse-green 0.6s ease;
}

.option.wrong {
  border-color: var(--error);
  background: var(--error-light);
}

.option-letter {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--bg-elevated);
  border: 1px solid var(--border-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  transition: background 0.15s, border-color 0.15s;
  color: var(--text-secondary);
}

.option.correct .option-letter { background: var(--success); border-color: var(--success); color: #fff; }
.option.wrong   .option-letter { background: var(--error);   border-color: var(--error);   color: #fff; }

.option.dev-correct {
  border-color: rgba(63, 185, 80, 0.5);
}

.dev-hint {
  margin-left: auto;
  font-size: 14px;
  color: var(--success);
  font-weight: 700;
  flex-shrink: 0;
}

.option-text {
  font-size: 14px;
  line-height: 1.4;
}

/* Feedback blocks */
.feedback-block {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  border-radius: var(--radius);
  padding: 12px 14px;
}

.feedback-icon { flex-shrink: 0; margin-top: 1px; }

.feedback-block p {
  font-size: 13px;
  line-height: 1.5;
}

.error-block {
  background: var(--error-light);
  border: 1px solid rgba(255, 69, 58, 0.3);
  border-left: 3px solid var(--error);
}
.error-block .feedback-icon { color: var(--error); }
.error-block p { color: var(--text-primary); }

.correct-block {
  background: var(--success-light);
  border: 1px solid rgba(48, 209, 88, 0.3);
}
.correct-block .feedback-icon { color: var(--success); }
.correct-block p { color: var(--success); font-weight: 600; }

/* Transition */
.slide-enter-active, .slide-leave-active {
  transition: all 0.25s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.slide-leave-to {
  opacity: 0;
}
</style>
