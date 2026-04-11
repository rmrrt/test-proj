<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useProgressStore } from '@/stores/progress'

const router = useRouter()
const progressStore = useProgressStore()

function choose(level: 'beginner' | 'experienced') {
  progressStore.completeOnboarding(level)
  router.push('/modules')
}
</script>

<template>
  <div class="onboarding">
    <div class="hero">
      <div class="gost-tag">НАЧАЛО ОБУЧЕНИЯ</div>
      <h1>Сварка с нуля</h1>
      <p class="subtitle">Обучение по российским ГОСТ-стандартам. Выбери с чего начать.</p>
    </div>

    <div class="choices">
      <button class="choice-card" @click="choose('beginner')">
        <div class="choice-icon">🔰</div>
        <div class="choice-content">
          <h3>Я новичок</h3>
          <p>Начать с самых азов: что такое сварка, как работает, техника безопасности</p>
        </div>
        <span class="choice-arrow">→</span>
      </button>

      <button class="choice-card" @click="choose('experienced')">
        <div class="choice-icon">⚡</div>
        <div class="choice-content">
          <h3>Уже варил</h3>
          <p>Пропустить основы и перейти сразу к оборудованию и технике</p>
        </div>
        <span class="choice-arrow">→</span>
      </button>
    </div>

    <p class="disclaimer">Контент основан на ГОСТ 5264-80, ГОСТ 12.3.003-86 и другой нормативной документации</p>
  </div>
</template>

<style scoped>
.onboarding {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px 20px;
  gap: 40px;
}
.hero { text-align: center; }
.hero h1 { font-size: 32px; margin: 12px 0 8px; }
.subtitle { color: var(--text-secondary); font-size: 15px; line-height: 1.6; }
.choices { display: flex; flex-direction: column; gap: 12px; }
.choice-card {
  display: flex; align-items: center; gap: 16px;
  background: var(--bg-secondary); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px; cursor: pointer; text-align: left;
  transition: border-color 0.15s, transform 0.1s; color: var(--text-primary); width: 100%;
}
.choice-card:hover { border-color: var(--accent); transform: translateY(-1px); }
.choice-card:active { transform: scale(0.98); }
.choice-icon { font-size: 32px; flex-shrink: 0; }
.choice-content h3 { margin-bottom: 4px; }
.choice-content p { font-size: 13px; color: var(--text-secondary); line-height: 1.4; }
.choice-arrow { margin-left: auto; color: var(--accent); font-size: 20px; flex-shrink: 0; }
.disclaimer { text-align: center; font-size: 11px; color: var(--text-secondary); line-height: 1.5; }
</style>
