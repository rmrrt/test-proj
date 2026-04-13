<script setup lang="ts">
import { ref, computed } from 'vue'

const fields = ref({ C: 0.18, Mn: 0.65, Cr: 0, Mo: 0, V: 0, Ni: 0, Cu: 0 })

const presets = [
  { label: 'Ст3сп',      values: { C: 0.18, Mn: 0.65, Cr: 0,    Mo: 0, V: 0, Ni: 0,   Cu: 0 } },
  { label: '09Г2С',      values: { C: 0.09, Mn: 1.8,  Cr: 0,    Mo: 0, V: 0, Ni: 0,   Cu: 0 } },
  { label: '40Х',        values: { C: 0.40, Mn: 0.65, Cr: 1.0,  Mo: 0, V: 0, Ni: 0,   Cu: 0 } },
  { label: '30ХГСА',     values: { C: 0.30, Mn: 1.0,  Cr: 1.1,  Mo: 0, V: 0, Ni: 0,   Cu: 0 } },
  { label: '12Х18Н10Т', values: { C: 0.12, Mn: 2.0,  Cr: 18.0, Mo: 0, V: 0, Ni: 10.0, Cu: 0 } },
]

function applyPreset(preset: typeof presets[0]) {
  fields.value = { ...preset.values }
}

const ce = computed(() => {
  const { C, Mn, Cr, Mo, V, Ni, Cu } = fields.value
  return +(C + Mn / 6 + (Cr + Mo + V) / 5 + (Ni + Cu) / 15).toFixed(2)
})

const interpretation = computed(() => {
  const v = ce.value
  if (v < 0.35) return {
    color: 'green',
    label: 'Хорошая свариваемость',
    note: 'Подогрев не требуется',
    electrode: 'МР-3 или АНО-21',
  }
  if (v < 0.45) return {
    color: 'yellow',
    label: 'Удовлетворительная свариваемость',
    note: 'Подогрев 100–150°C при толщине > 10 мм',
    electrode: 'УОНИ-13/55 или МР-3',
  }
  if (v < 0.60) return {
    color: 'orange',
    label: 'Ограниченная свариваемость',
    note: 'Подогрев 150–250°C обязателен',
    electrode: 'УОНИ-13/55',
  }
  return {
    color: 'red',
    label: 'Плохая свариваемость',
    note: 'Специальные меры — проконсультируйтесь с технологом',
    electrode: 'УОНИ-13/55, специальные электроды',
  }
})
</script>

<template>
  <div class="ce-calc">
    <h3 class="title">Углеродный эквивалент (Сэ)</h3>
    <p class="formula">Сэ = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15</p>

    <div class="presets">
      <button
        v-for="p in presets"
        :key="p.label"
        class="preset-btn"
        @click="applyPreset(p)"
      >
        {{ p.label }}
      </button>
    </div>

    <div class="inputs">
      <div v-for="(_, key) in fields" :key="key" class="input-row">
        <label class="input-label">{{ key }} <span class="input-unit">%</span></label>
        <input
          v-model.number="fields[key]"
          type="number"
          min="0"
          step="0.01"
          class="input-field"
        />
      </div>
    </div>

    <div class="result">
      <div class="ce-value">Сэ = <span class="ce-num">{{ ce }}</span></div>
      <div class="badge" :class="interpretation.color">
        <div class="badge-label">{{ interpretation.label }}</div>
        <div class="badge-note">{{ interpretation.note }}</div>
      </div>
      <div class="electrode-row">
        <span class="electrode-label">Рекомендуемый электрод:</span>
        <span class="electrode-value">{{ interpretation.electrode }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ce-calc { display: flex; flex-direction: column; gap: 16px; }

.title { font-size: 15px; font-weight: 700; margin: 0; }

.formula {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: monospace;
  background: rgba(255,255,255,0.04);
  padding: 6px 10px;
  border-radius: 6px;
  margin: 0;
}

.presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.preset-btn {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.preset-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(233,69,96,0.08);
}

.inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-unit { font-weight: 400; }

.input-field {
  padding: 7px 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: var(--accent);
}

.result { display: flex; flex-direction: column; gap: 10px; }

.ce-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-secondary);
}

.ce-num {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}

.badge {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid;
}

.badge.green  { background: rgba(46,160,67,0.12);  border-color: rgba(46,160,67,0.4);  }
.badge.yellow { background: rgba(210,153,34,0.12); border-color: rgba(210,153,34,0.4); }
.badge.orange { background: rgba(220,110,30,0.12); border-color: rgba(220,110,30,0.4); }
.badge.red    { background: rgba(233,69,96,0.12);  border-color: rgba(233,69,96,0.4);  }

.badge-label {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 2px;
}

.badge.green  .badge-label { color: #3fb950; }
.badge.yellow .badge-label { color: #d29922; }
.badge.orange .badge-label { color: #e87230; }
.badge.red    .badge-label { color: #e94560; }

.badge-note { font-size: 12px; color: var(--text-secondary); }

.electrode-row {
  display: flex;
  gap: 8px;
  font-size: 13px;
  flex-wrap: wrap;
}

.electrode-label { color: var(--text-secondary); }
.electrode-value { font-weight: 700; color: var(--text-primary); }
</style>
