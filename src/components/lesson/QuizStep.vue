<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Question } from '@/types/content'
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
    const score = results.value.filter(Boolean).length / props.questions.length
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
      <span class="gost-tag">ПРОВЕРКА ЗНАНИЙ</span>
      <span class="counter">{{ currentIndex + 1 }} / {{ questions.length }}</span>
    </div>

    <div class="progress-dots">
      <span
        v-for="(_, i) in questions"
        :key="i"
        class="dot"
        :class="{
          done: results[i] !== undefined,
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
            selected: selected === i && !answered,
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

      <Transition name="slide">
        <div v-if="answered && !correct" class="error-explanation">
          <span class="exp-icon">💡</span>
          <p>{{ current.errorExplanation }}</p>
        </div>
      </Transition>

      <Transition name="slide">
        <div v-if="answered && correct" class="correct-feedback">
          <span>✅ Правильно!</span>
        </div>
      </Transition>
    </div>

    <button v-if="answered" class="btn btn-primary" @click="next">
      {{ isLast ? 'Завершить тест' : 'Следующий вопрос →' }}
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
  color: var(--text-secondary);
}

.progress-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border);
  transition: background 0.2s;
}

.dot.active { background: var(--accent); }
.dot.correct { background: var(--success); }
.dot.wrong { background: var(--error); }

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

.options.shake {
  animation: shake 0.4s ease;
}

.option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s;
  color: var(--text-primary);
  width: 100%;
}

.option:hover:not(:disabled) {
  border-color: var(--accent);
}

.option:disabled {
  cursor: default;
}

.option.correct {
  border-color: var(--success);
  background: rgba(63, 185, 80, 0.1);
  animation: pulse-green 0.6s ease;
}

.option.wrong {
  border-color: var(--error);
  background: rgba(248, 81, 73, 0.1);
}

.option-letter {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.option.correct .option-letter { background: var(--success); color: #fff; }
.option.wrong .option-letter { background: var(--error); color: #fff; }

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

.error-explanation {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background: rgba(248,81,73,0.08);
  border: 1px solid rgba(248,81,73,0.25);
  border-radius: 8px;
  padding: 12px;
}

.exp-icon { font-size: 18px; flex-shrink: 0; }

.error-explanation p {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.5;
}

.correct-feedback {
  padding: 10px 14px;
  background: rgba(63,185,80,0.1);
  border: 1px solid rgba(63,185,80,0.3);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--success);
}

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
