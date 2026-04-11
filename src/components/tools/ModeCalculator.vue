<script setup lang="ts">
import { ref, computed } from 'vue'
import { calculateMode, jointLabels } from '@/content/tools/mode-calculator'
import type { JointType } from '@/content/tools/mode-calculator'

const thickness = ref(4)
const joint = ref<JointType>('butt')

const result = computed(() => calculateMode(thickness.value, joint.value))

const jointOptions: { value: JointType; label: string }[] = [
  { value: 'butt', label: 'Стыковое' },
  { value: 'corner', label: 'Угловое' },
  { value: 'lap', label: 'Нахлёсточное' },
]
</script>

<template>
  <div class="calculator">
    <div class="gost-tag">ГОСТ 5264-80</div>
    <h3>Калькулятор режимов РДС</h3>

    <div class="inputs">
      <div class="input-group">
        <label>Толщина металла</label>
        <div class="slider-row">
          <input
            type="range"
            v-model.number="thickness"
            min="1"
            max="12"
            step="1"
          />
          <span class="value-badge">{{ thickness }} мм</span>
        </div>
        <div class="range-labels">
          <span>1 мм</span><span>12 мм</span>
        </div>
      </div>

      <div class="input-group">
        <label>Тип соединения</label>
        <div class="joint-options">
          <button
            v-for="opt in jointOptions"
            :key="opt.value"
            class="joint-btn"
            :class="{ active: joint === opt.value }"
            @click="joint = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="result" class="result">
      <div class="gost-tag" style="margin-bottom: 10px;">РЕЗУЛЬТАТ</div>

      <div class="result-grid">
        <div class="result-item">
          <span class="result-label">Электрод</span>
          <span class="result-value">Ø {{ result.electrodeDiameter }} мм</span>
        </div>
        <div class="result-item">
          <span class="result-label">Ток</span>
          <span class="result-value">{{ result.currentMin }}–{{ result.currentMax }} А</span>
        </div>
        <div class="result-item">
          <span class="result-label">Проходов</span>
          <span class="result-value">{{ result.passes }}</span>
        </div>
      </div>

      <div v-if="result.note" class="result-note">
        <span>⚠️</span> {{ result.note }}
      </div>
    </div>

    <div v-else class="no-result">
      Нет данных для этой комбинации — уточните толщину или тип соединения.
    </div>
  </div>
</template>

<style scoped>
.calculator {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

input[type="range"] {
  flex: 1;
  accent-color: var(--accent);
  height: 4px;
}

.value-badge {
  background: var(--accent);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  min-width: 52px;
  text-align: center;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-secondary);
}

.joint-options {
  display: flex;
  gap: 8px;
}

.joint-btn {
  flex: 1;
  padding: 8px 4px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.joint-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(233,69,96,0.08);
}

.result {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.result-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.result-label {
  font-size: 10px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--accent);
  font-family: monospace;
}

.result-note {
  font-size: 12px;
  color: var(--text-secondary);
  background: rgba(233,69,96,0.06);
  border-radius: 6px;
  padding: 8px;
  line-height: 1.4;
}

.no-result {
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
  padding: 20px;
}
</style>
