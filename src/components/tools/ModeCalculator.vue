<script setup lang="ts">
import { ref, computed } from 'vue'
import { calculateMode } from '@/content/tools/mode-calculator'
import type { JointType, MetalType, WeldPosition, CoatingType } from '@/content/tools/mode-calculator'

const thickness  = ref(4)
const joint      = ref<JointType>('butt')
const metal      = ref<MetalType>('carbon')
const position   = ref<WeldPosition>('flat')
const coating    = ref<CoatingType>('rutile')

const result = computed(() => calculateMode(thickness.value, joint.value, metal.value, position.value, coating.value))

const jointOptions: { value: JointType; label: string }[] = [
  { value: 'butt',   label: 'Стыковое' },
  { value: 'corner', label: 'Угловое' },
  { value: 'lap',    label: 'Нахлёст' },
]

const metalOptions: { value: MetalType; label: string }[] = [
  { value: 'carbon',    label: 'Углеродистая' },
  { value: 'low_alloy', label: 'Низколегированная' },
  { value: 'stainless', label: 'Нержавейка' },
  { value: 'aluminum',  label: 'Алюминий' },
]

const positionOptions: { value: WeldPosition; label: string }[] = [
  { value: 'flat',       label: 'Нижнее' },
  { value: 'horizontal', label: 'Горизонт.' },
  { value: 'vertical',   label: 'Вертикаль' },
  { value: 'overhead',   label: 'Потолочное' },
]

const coatingOptions: { value: CoatingType; label: string }[] = [
  { value: 'rutile', label: 'Рутиловое (МР-3)' },
  { value: 'basic',  label: 'Основное (УОНИ)' },
]
</script>

<template>
  <div class="calculator">
    <div class="gost-tag">ГОСТ 5264-80</div>
    <h3>Калькулятор режимов РДС</h3>

    <div class="inputs">

      <!-- Тип металла -->
      <div class="input-group">
        <label>Тип металла</label>
        <div class="btn-grid btn-grid--2">
          <button
            v-for="opt in metalOptions"
            :key="opt.value"
            class="opt-btn"
            :class="{ active: metal === opt.value }"
            @click="metal = opt.value"
          >{{ opt.label }}</button>
        </div>
      </div>

      <!-- Положение сварки -->
      <div class="input-group">
        <label>Положение сварки</label>
        <div class="btn-grid btn-grid--4">
          <button
            v-for="opt in positionOptions"
            :key="opt.value"
            class="opt-btn"
            :class="{ active: position === opt.value }"
            @click="position = opt.value"
          >{{ opt.label }}</button>
        </div>
      </div>

      <!-- Покрытие электрода -->
      <div class="input-group">
        <label>Покрытие электрода</label>
        <div class="btn-grid btn-grid--2">
          <button
            v-for="opt in coatingOptions"
            :key="opt.value"
            class="opt-btn"
            :class="{ active: coating === opt.value }"
            @click="coating = opt.value"
          >{{ opt.label }}</button>
        </div>
      </div>

      <!-- Толщина металла -->
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

      <!-- Тип соединения -->
      <div class="input-group">
        <label>Тип соединения</label>
        <div class="btn-grid btn-grid--3">
          <button
            v-for="opt in jointOptions"
            :key="opt.value"
            class="opt-btn"
            :class="{ active: joint === opt.value }"
            @click="joint = opt.value"
          >{{ opt.label }}</button>
        </div>
      </div>

    </div>

    <!-- Result -->
    <div v-if="result" class="result">
      <div class="gost-tag" style="margin-bottom: 10px;">РЕЗУЛЬТАТ</div>

      <!-- Primary grid -->
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
        <div class="result-item">
          <span class="result-label">Полярность</span>
          <span class="result-value result-value--sm">{{ result.polarity }}</span>
        </div>
        <div class="result-item">
          <span class="result-label">Скорость</span>
          <span class="result-value result-value--sm">{{ result.weldSpeedMin }}–{{ result.weldSpeedMax }} мм/мин</span>
        </div>
        <div class="result-item">
          <span class="result-label">Марка</span>
          <span class="result-value result-value--sm">{{ result.electrodeGrade }}</span>
        </div>
      </div>

      <!-- Note -->
      <div v-if="result.note" class="result-note">
        <span>⚠️</span> {{ result.note }}
      </div>

      <!-- Extra recommendations -->
      <div class="extra-block">
        <div class="extra-title">Дополнительные рекомендации</div>
        <div class="extra-row">
          <span class="extra-label">Предподогрев</span>
          <span class="extra-val">{{ result.preheat }}</span>
        </div>
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
  gap: 14px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.input-group label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Button grids */
.btn-grid {
  display: grid;
  gap: 6px;
}
.btn-grid--2 { grid-template-columns: repeat(2, 1fr); }
.btn-grid--3 { grid-template-columns: repeat(3, 1fr); }
.btn-grid--4 { grid-template-columns: repeat(4, 1fr); }

.opt-btn {
  padding: 8px 4px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
  line-height: 1.3;
}
.opt-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(233,69,96,0.08);
}

/* Slider */
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

/* Result */
.result {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.result-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
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

.result-value--sm {
  font-size: 12px;
  font-family: inherit;
  font-weight: 700;
}

.result-note {
  font-size: 12px;
  color: var(--text-secondary);
  background: rgba(233,69,96,0.06);
  border-radius: 6px;
  padding: 8px;
  line-height: 1.4;
  margin-bottom: 12px;
}

.extra-block {
  border-top: 1px solid var(--border);
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.extra-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}

.extra-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
  line-height: 1.4;
}

.extra-label {
  color: var(--text-secondary);
  font-weight: 600;
  flex-shrink: 0;
  min-width: 90px;
}

.extra-val {
  color: var(--text-primary);
}

.no-result {
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
  padding: 20px;
}
</style>
