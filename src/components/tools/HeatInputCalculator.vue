<template>
  <div class="heat-input-calculator">
    <div class="calculator-container">
      <h2>Калькулятор теплового ввода</h2>
      <p class="description">
        Рассчитайте тепловой ввод (Q) для вашего режима сварки. Это помогает предсказать деформацию, риск трещин в ЗТВ и необходимость охлаждения.
      </p>

      <div class="input-section">
        <!-- Process Selection -->
        <div class="form-group">
          <label for="process">Процесс сварки</label>
          <select v-model="process" id="process" @change="updateEfficiency">
            <option value="mma">РДС (MMA) — ручная дуговая</option>
            <option value="mig">МИГ/МАГ — полуавтоматическая</option>
            <option value="tig">TIG (аргонодуговая)</option>
          </select>
          <span class="hint">КПД процесса: {{ (efficiency * 100).toFixed(0) }}%</span>
        </div>

        <!-- Voltage Slider -->
        <div class="form-group">
          <label for="voltage">Напряжение (U)</label>
          <div class="slider-container">
            <input
              v-model.number="voltage"
              id="voltage"
              type="range"
              min="18"
              max="40"
              step="1"
              class="slider"
            />
            <span class="value">{{ voltage }} В</span>
          </div>
        </div>

        <!-- Current Slider -->
        <div class="form-group">
          <label for="current">Ток (I)</label>
          <div class="slider-container">
            <input
              v-model.number="current"
              id="current"
              type="range"
              min="50"
              max="350"
              step="10"
              class="slider"
            />
            <span class="value">{{ current }} A</span>
          </div>
        </div>

        <!-- Travel Speed Slider -->
        <div class="form-group">
          <label for="travelSpeed">Скорость сварки (v)</label>
          <div class="slider-container">
            <input
              v-model.number="travelSpeed"
              id="travelSpeed"
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              class="slider"
            />
            <span class="value">{{ travelSpeed.toFixed(2) }} м/мин</span>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="result-section">
        <div class="result-card" :class="`risk-${riskLevel}`">
          <div class="result-title">Тепловой ввод (Q)</div>
          <div class="result-value">{{ heatInput.toFixed(2) }} MJ/mm</div>
          <div class="result-status">{{ statusText }}</div>
        </div>

        <!-- Risk Assessment -->
        <div class="risk-assessment">
          <h3>⚠️ Оценка риска</h3>
          <ul>
            <li v-if="heatInput < 1.0" class="warning">
              <strong>Слишком быстро:</strong> риск неполного проплавления. Замедлите скорость сварки или проверьте проникновение током.
            </li>
            <li v-else-if="heatInput < 2.5" class="safe">
              <strong>✓ Оптимально для тонких листов</strong> (толщина < 5 мм). Стандартный режим для конструкций.
            </li>
            <li v-else-if="heatInput < 4.0" class="safe">
              <strong>✓ Оптимально для средних толщин</strong> (5–15 мм). Типичный режим производства.
            </li>
            <li v-else-if="heatInput < 6.0" class="warning">
              <strong>⚠️ Риск укрупнения зёрна в ЗТВ</strong> (толщина > 15 мм). Контролируйте охлаждение.
            </li>
            <li v-else class="critical">
              <strong>🔴 КРИТИЧНО:</strong> тепловой ввод > 6.0. Риск охрупчивания, холодных трещин. Ускорьте сварку или снизьте ток.
            </li>
          </ul>
        </div>

        <!-- Practical Tips -->
        <div class="practical-notes">
          <h3>💡 Практические советы</h3>
          <ul>
            <li>Большой Q на тонких листах → больше деформаций и коробления. Уменьшайте ток или ускоряйте.</li>
            <li>На толстом металле (> 20 мм) нужна предварительная подогрев. Большой Q + медленное охлаждение = коробление.</li>
            <li>Нержавейка: минимизируйте Q, чтобы избежать коррозии от межзёренного окисления в ЗТВ.</li>
            <li>Если t8/5 (время охлаждения 800–500 °C) > 30 сек, риск твёрдой и хрупкой структуры. Используйте мягкое охлаждение.</li>
          </ul>
        </div>
      </div>

      <!-- Formula Reference -->
      <details class="formula-details">
        <summary>📐 Формула расчёта</summary>
        <div class="formula-box">
          <p><strong>Q = (U × I × η × 60) / (v × 1000)</strong></p>
          <p>Где:</p>
          <ul>
            <li>Q — тепловой ввод (MJ/mm)</li>
            <li>U — напряжение (V)</li>
            <li>I — ток (A)</li>
            <li>η — КПД процесса</li>
            <li>v — скорость сварки (м/мин)</li>
          </ul>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const process = ref<'mma' | 'mig' | 'tig'>('mma')
const voltage = ref(24)
const current = ref(150)
const travelSpeed = ref(0.4)
const efficiency = ref(0.75)

const efficiencyMap = {
  mma: 0.75,
  mig: 0.85,
  tig: 0.65,
}

const updateEfficiency = () => {
  efficiency.value = efficiencyMap[process.value]
}

const heatInput = computed(() => {
  // Q = (U × I × η × 60) / (v × 1000) [MJ/mm]
  return (voltage.value * current.value * efficiency.value * 60) / (travelSpeed.value * 1000)
})

const riskLevel = computed(() => {
  if (heatInput.value < 1.0) return 'too-fast'
  if (heatInput.value < 2.5) return 'safe-thin'
  if (heatInput.value < 4.0) return 'safe-medium'
  if (heatInput.value < 6.0) return 'warning'
  return 'critical'
})

const statusText = computed(() => {
  if (heatInput.value < 1.0) return '⚠️ Слишком быстро'
  if (heatInput.value < 2.5) return '✓ Оптимально для тонких'
  if (heatInput.value < 4.0) return '✓ Оптимально для средних'
  if (heatInput.value < 6.0) return '⚠️ Риск укрупнения зёрна'
  return '🔴 Критически высокий'
})
</script>

<style scoped>
.heat-input-calculator {
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
}

.calculator-container {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.5rem;
  margin: 0 0 12px;
  color: #1f2937;
}

.description {
  color: #6b7280;
  margin-bottom: 24px;
  line-height: 1.5;
}

.input-section {
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

select:hover,
select:focus {
  border-color: #3b82f6;
  outline: none;
}

.hint {
  display: block;
  font-size: 0.85rem;
  color: #9ca3af;
  margin-top: 4px;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  transition: background 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  background: #2563eb;
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}

.value {
  font-weight: 600;
  color: #1f2937;
  min-width: 70px;
  text-align: right;
  font-size: 0.95rem;
}

.result-section {
  margin-bottom: 32px;
}

.result-card {
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  border-left: 4px solid;
}

.result-card.risk-too-fast {
  background: #fef08a;
  border-color: #eab308;
}

.result-card.risk-safe-thin,
.result-card.risk-safe-medium {
  background: #d1fae5;
  border-color: #10b981;
}

.result-card.risk-warning {
  background: #fed7aa;
  border-color: #f97316;
}

.result-card.risk-critical {
  background: #fee2e2;
  border-color: #ef4444;
}

.result-title {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.result-status {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.risk-assessment,
.practical-notes {
  margin-bottom: 24px;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

h3 {
  margin: 0 0 12px;
  font-size: 1rem;
  color: #1f2937;
}

.risk-assessment ul,
.practical-notes ul {
  margin: 0;
  padding-left: 20px;
}

.risk-assessment li,
.practical-notes li {
  margin-bottom: 12px;
  line-height: 1.6;
  color: #374151;
}

.risk-assessment li.safe {
  color: #059669;
  font-weight: 500;
}

.risk-assessment li.warning {
  color: #d97706;
  font-weight: 500;
}

.risk-assessment li.critical {
  color: #dc2626;
  font-weight: 600;
}

.formula-details {
  cursor: pointer;
  margin-top: 24px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 6px;
  border-left: 3px solid #0284c7;
}

.formula-details summary {
  font-weight: 600;
  color: #0284c7;
  user-select: none;
}

.formula-details summary:hover {
  color: #0369a1;
}

.formula-box {
  margin-top: 12px;
  padding: 12px;
  background: white;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

.formula-box p:first-child {
  margin: 0 0 12px;
  font-weight: 600;
  color: #1f2937;
}

.formula-box ul {
  margin: 0;
  padding-left: 20px;
  color: #374151;
}

.formula-box li {
  margin-bottom: 4px;
}
</style>
