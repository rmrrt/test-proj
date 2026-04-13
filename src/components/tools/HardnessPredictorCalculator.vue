<template>
  <div class="hardness-predictor">
    <div class="calculator-container">
      <h2>Прогноз твёрдости в ЗТВ</h2>
      <p class="description">
        Оцените максимальную твёрдость (HV) в зоне термического влияния. Это критично для оценки риска холодных трещин и необходимости предварительного подогрева.
      </p>

      <div class="input-section">
        <!-- Carbon Equivalent -->
        <div class="form-group">
          <label for="ce">Углеродный эквивалент (CE)</label>
          <div class="input-with-info">
            <input
              v-model.number="carbonEquivalent"
              id="ce"
              type="number"
              min="0.2"
              max="1.5"
              step="0.01"
              placeholder="0.4–0.8 для конструкционной стали"
              class="number-input"
            />
            <span class="steel-grade">{{ steelGradeEstimate }}</span>
          </div>
          <span class="hint">Типичные значения: 0.3–0.4 (мягкая сталь), 0.4–0.6 (конструкционная), 0.6–1.0 (высокопрочная)</span>
        </div>

        <!-- Cooling Time or Calculate -->
        <div class="form-group">
          <label>
            <input
              v-model="coolingMode"
              type="radio"
              value="manual"
            />
            Ввести время охлаждения t8/5 (измеренное)
          </label>
          <label style="margin-top: 8px">
            <input
              v-model="coolingMode"
              type="radio"
              value="estimate"
            />
            Рассчитать из параметров сварки
          </label>
        </div>

        <!-- Manual t8/5 Input -->
        <div v-if="coolingMode === 'manual'" class="form-group">
          <label for="t8-5">Время охлаждения t8/5 (сек)</label>
          <div class="slider-container">
            <input
              v-model.number="coolingTimeManual"
              id="t8-5"
              type="range"
              min="5"
              max="100"
              step="5"
              class="slider"
            />
            <span class="value">{{ coolingTimeManual }} сек</span>
          </div>
          <span class="hint">t8/5 = время охлаждения от 800 °C до 500 °C. Можно измерить термопарой или взять из технических данных.</span>
        </div>

        <!-- Estimated t8/5 from weld parameters -->
        <div v-else class="form-group">
          <label for="heat-input">Тепловой ввод (Q, MJ/mm)</label>
          <div class="slider-container">
            <input
              v-model.number="heatInput"
              id="heat-input"
              type="range"
              min="0.5"
              max="8"
              step="0.1"
              class="slider"
            />
            <span class="value">{{ heatInput.toFixed(2) }} MJ/mm</span>
          </div>

          <label for="thickness" style="margin-top: 16px">Толщина металла (мм)</label>
          <div class="slider-container">
            <input
              v-model.number="plateThickness"
              id="thickness"
              type="range"
              min="1"
              max="100"
              step="1"
              class="slider"
            />
            <span class="value">{{ plateThickness }} мм</span>
          </div>

          <label for="preheat-calc" style="margin-top: 16px">Температура подогрева (°C)</label>
          <div class="slider-container">
            <input
              v-model.number="preheatTemp"
              id="preheat-calc"
              type="range"
              min="0"
              max="300"
              step="10"
              class="slider"
            />
            <span class="value">{{ preheatTemp }} °C</span>
          </div>

          <div class="estimated-info">
            <strong>Расчётное t8/5:</strong> {{ estimatedCoolingTime.toFixed(1) }} сек
          </div>
        </div>

        <!-- Preheat Temperature (if manual mode) -->
        <div v-if="coolingMode === 'manual'" class="form-group">
          <label for="preheat">Температура подогрева (°C)</label>
          <div class="slider-container">
            <input
              v-model.number="preheatTemp"
              id="preheat"
              type="range"
              min="0"
              max="300"
              step="10"
              class="slider"
            />
            <span class="value">{{ preheatTemp }} °C</span>
          </div>
          <span class="hint">Подогрев замедляет охлаждение, снижая пиковую твёрдость</span>
        </div>
      </div>

      <!-- Results -->
      <div class="result-section">
        <div class="result-card" :class="`risk-${crackingRiskLevel}`">
          <div class="result-title">Максимальная твёрдость ЗТВ</div>
          <div class="result-value">{{ maxHardness.toFixed(0) }} HV</div>
          <div class="result-status">{{ hardnessStatus }}</div>
        </div>

        <!-- Hardness Scale Visualization -->
        <div class="hardness-scale">
          <div class="scale-track">
            <div
              class="scale-indicator"
              :style="{ left: hardnessPercentage + '%' }"
            >
              {{ maxHardness.toFixed(0) }}
            </div>
          </div>
          <div class="scale-labels">
            <span>200 HV</span>
            <span>350 HV ⚠️</span>
            <span>450 HV 🔴</span>
            <span>500+ HV</span>
          </div>
        </div>

        <!-- Risk Assessment -->
        <div class="risk-assessment">
          <h3>⚠️ Оценка риска холодных трещин</h3>
          <ul>
            <li v-if="maxHardness < 250" class="safe">
              <strong>✓ Безопасно:</strong> стандартное охлаждение на воздухе приемлемо.
            </li>
            <li v-else-if="maxHardness < 350" class="warning">
              <strong>⚠️ Осторожность:</strong> контролируйте охлаждение, рекомендуется UT или испытание на твёрдость.
            </li>
            <li v-else-if="maxHardness < 450" class="critical">
              <strong>🔴 Высокий риск:</strong> обязателен подогрев до {{ recommendedPreheat }} °C, медленное охлаждение.
            </li>
            <li v-else class="critical">
              <strong>🔴 КРИТИЧНО:</strong> холодные трещины вероятны. Подогрев {{ recommendedPreheat }} °C + термообработка (PWHT) обязательны.
            </li>
          </ul>
        </div>

        <!-- Mitigating Actions -->
        <div class="mitigation-box" :class="{ active: maxHardness > 300 }">
          <h3>🛡️ Меры по снижению риска</h3>
          <ul>
            <li v-if="maxHardness > 350">
              <strong>Подогрев:</strong> нагрейте металл до {{ recommendedPreheat }} °C перед сваркой. Это снизит скорость охлаждения.
            </li>
            <li v-if="maxHardness > 300">
              <strong>Теплоизоляция:</strong> после сварки оберните шов одеялом или листом асбеста для замедления охлаждения.
            </li>
            <li v-if="maxHardness > 350">
              <strong>PWHT (термообработка):</strong> отжиг при {{ (preheatTemp > 0 ? Math.min(maxHardness * 2, 650) : 600).toFixed(0) }} °C×30 мин.
            </li>
            <li v-if="maxHardness < 350">
              <strong>Контроль качества:</strong> проверьте шов ультразвуком (UT) на скрытые трещины.
            </li>
          </ul>
        </div>

        <!-- Practical Notes -->
        <div class="practical-notes">
          <h3>💡 Практические советы</h3>
          <ul>
            <li>CE > 0.5 на толстом металле → обязательно изучите IIW диаграммы для вашей марки стали.</li>
            <li>Холодные условия (< 0 °C окружающей среды) → усилить подогрев. Охрупчивание работает в два раза сильнее.</li>
            <li>Многопроходная сварка → каждый проход переотжигает предыдущий, снижая риск. Одиночный проход самый опасный.</li>
            <li>Нержавейка и никелевые сплавы → обычно имеют высокий CE, требуют осторожного контроля охлаждения.</li>
          </ul>
        </div>
      </div>

      <!-- Formula Reference -->
      <details class="formula-details">
        <summary>📐 Формула расчёта</summary>
        <div class="formula-box">
          <p><strong>HV_max ≈ 980 × CE + 70 × ln(t8/5) + 360</strong></p>
          <p><strong>Поправка на подогрев:</strong></p>
          <p>Если Tp > 200 °C: HV_max -= 0.5 × (Tp - 200)</p>
          <p><strong>Расчёт t8/5 из параметров:</strong></p>
          <p><strong>t8/5 ≈ (2000 × Q × t) / (Tp + 20)²</strong></p>
          <p>Где:</p>
          <ul>
            <li>CE — углеродный эквивалент</li>
            <li>t8/5 — время охлаждения 800–500 °C (сек)</li>
            <li>Tp — температура подогрева (°C)</li>
            <li>Q — тепловой ввод (MJ/mm)</li>
            <li>t — толщина металла (мм)</li>
          </ul>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const carbonEquivalent = ref(0.45)
const coolingMode = ref<'manual' | 'estimate'>('manual')
const coolingTimeManual = ref(20)
const heatInput = ref(2.5)
const plateThickness = ref(10)
const preheatTemp = ref(0)

const steelGradeEstimate = computed(() => {
  if (carbonEquivalent.value < 0.35) return '→ мягкая сталь'
  if (carbonEquivalent.value < 0.50) return '→ конструкционная (ОСТ, ГОСТ 380/4543)'
  if (carbonEquivalent.value < 0.70) return '→ высокопрочная'
  return '→ специальные сплавы, требует спецмер'
})

const coolingTime = computed(() => {
  if (coolingMode.value === 'manual') {
    return coolingTimeManual.value
  }
  return estimatedCoolingTime.value
})

const estimatedCoolingTime = computed(() => {
  // t8/5 ≈ (2000 × Q × t) / (Tp + 20)²
  const numerator = 2000 * heatInput.value * plateThickness.value
  const denominator = (preheatTemp.value + 20) ** 2
  return numerator / denominator
})

const maxHardness = computed(() => {
  // HV_max ≈ 980 × CE + 70 × ln(t8/5) + 360
  const baseHardness = 980 * carbonEquivalent.value + 70 * Math.log(coolingTime.value) + 360

  // Adjust for preheat
  let adjusted = baseHardness
  if (preheatTemp.value > 200) {
    adjusted -= 0.5 * (preheatTemp.value - 200)
  }

  return Math.max(200, Math.min(550, adjusted)) // Clamp to reasonable range
})

const crackingRiskLevel = computed(() => {
  if (maxHardness.value < 250) return 'safe'
  if (maxHardness.value < 350) return 'caution'
  if (maxHardness.value < 450) return 'high-risk'
  return 'critical'
})

const hardnessStatus = computed(() => {
  if (maxHardness.value < 250) return '✓ Безопасно'
  if (maxHardness.value < 350) return '⚠️ Требует контроля'
  if (maxHardness.value < 450) return '🔴 Высокий риск'
  return '🔴 КРИТИЧНО'
})

const hardnessPercentage = computed(() => {
  return ((maxHardness.value - 200) / 350) * 100
})

const recommendedPreheat = computed(() => {
  if (maxHardness.value < 300) return 0
  if (maxHardness.value < 400) return 150
  return 250
})
</script>

<style scoped>
.hardness-predictor {
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

input[type='radio'] {
  margin-right: 8px;
}

.input-with-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.number-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.number-input:focus {
  border-color: #3b82f6;
  outline: none;
}

.steel-grade {
  font-size: 0.85rem;
  color: #9ca3af;
  white-space: nowrap;
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
  min-width: 100px;
  text-align: right;
  font-size: 0.95rem;
}

.estimated-info {
  margin-top: 12px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 6px;
  border-left: 3px solid #0284c7;
  font-size: 0.9rem;
  color: #0369a1;
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

.result-card.risk-safe {
  background: #d1fae5;
  border-color: #10b981;
}

.result-card.risk-caution {
  background: #fef08a;
  border-color: #eab308;
}

.result-card.risk-high-risk {
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

.hardness-scale {
  margin-bottom: 24px;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 8px;
}

.scale-track {
  position: relative;
  height: 24px;
  background: linear-gradient(
    to right,
    #10b981 0%,
    #eab308 35%,
    #f97316 60%,
    #ef4444 100%
  );
  border-radius: 4px;
  margin-bottom: 12px;
}

.scale-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 2px solid #1f2937;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #1f2937;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #6b7280;
}

.risk-assessment,
.mitigation-box,
.practical-notes {
  margin-bottom: 24px;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.mitigation-box.active {
  background: #fef3c7;
  border-left-color: #f97316;
}

h3 {
  margin: 0 0 12px;
  font-size: 1rem;
  color: #1f2937;
}

.risk-assessment ul,
.mitigation-box ul,
.practical-notes ul {
  margin: 0;
  padding-left: 20px;
}

.risk-assessment li,
.mitigation-box li,
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

.formula-box p {
  margin: 0 0 8px;
}

.formula-box p:first-child {
  font-weight: 600;
  color: #1f2937;
}

.formula-box ul {
  margin: 8px 0 0;
  padding-left: 20px;
  color: #374151;
}

.formula-box li {
  margin-bottom: 4px;
}
</style>
