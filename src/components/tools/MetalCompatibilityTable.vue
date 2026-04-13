<script setup lang="ts">
import { ref } from 'vue'

type Level = 'ok' | 'hard' | 'no'

interface Cell {
  level: Level
  tip: string
}

const metals = [
  'Углеродистая сталь',
  'Низколегированная сталь',
  'Нержавейка',
  'Алюминий',
  'Медь',
  'Чугун',
  'Титан',
]

const shortLabels = ['УС', 'НЛС', 'НЖ', 'Al', 'Cu', 'Чуг', 'Ti']

const tipSelf = 'Стандартная сварка. Подбери присадку по марке металла.'
const tipAlNo = 'Образуются хрупкие интерметаллиды Fe-Al. Используй клёпку или сварку взрывом.'
const tipTiNo = 'Титан несовместим с большинством металлов при сварке плавлением.'

const matrix: Cell[][] = [
  // УС
  [
    { level: 'ok',   tip: tipSelf },
    { level: 'ok',   tip: tipSelf },
    { level: 'hard', tip: 'Присадка ER309L. Контролируй науглероживание шва.' },
    { level: 'no',   tip: tipAlNo },
    { level: 'hard', tip: 'Подогрев меди 300–400°C. Присадка CuSi или медный электрод.' },
    { level: 'hard', tip: 'Электроды МНЧ-2 или ЦЧ-4. Подогрев 400–600°C, медленное охлаждение.' },
    { level: 'no',   tip: tipTiNo },
  ],
  // НЛС
  [
    { level: 'ok',   tip: tipSelf },
    { level: 'ok',   tip: tipSelf },
    { level: 'hard', tip: 'Присадка ER309L. Контролируй науглероживание шва.' },
    { level: 'no',   tip: tipAlNo },
    { level: 'hard', tip: 'Подогрев меди 300–400°C. Присадка CuSi или медный электрод.' },
    { level: 'hard', tip: 'Электроды МНЧ-2 или ЦЧ-4. Подогрев 400–600°C, медленное охлаждение.' },
    { level: 'no',   tip: tipTiNo },
  ],
  // НЖ
  [
    { level: 'hard', tip: 'Присадка ER309L. Контролируй науглероживание шва.' },
    { level: 'hard', tip: 'Присадка ER309L. Контролируй науглероживание шва.' },
    { level: 'ok',   tip: tipSelf },
    { level: 'no',   tip: tipAlNo },
    { level: 'hard', tip: 'Возможна через буферный слой. Консультация технолога.' },
    { level: 'no',   tip: 'Нержавейка и чугун несовместимы при сварке плавлением.' },
    { level: 'no',   tip: tipTiNo },
  ],
  // Al
  [
    { level: 'no',  tip: tipAlNo },
    { level: 'no',  tip: tipAlNo },
    { level: 'no',  tip: tipAlNo },
    { level: 'ok',  tip: tipSelf },
    { level: 'no',  tip: 'Алюминий и медь несовместимы при сварке плавлением.' },
    { level: 'no',  tip: tipAlNo },
    { level: 'no',  tip: 'Алюминий и титан несовместимы при сварке плавлением.' },
  ],
  // Cu
  [
    { level: 'hard', tip: 'Подогрев меди 300–400°C. Присадка CuSi или медный электрод.' },
    { level: 'hard', tip: 'Подогрев меди 300–400°C. Присадка CuSi или медный электрод.' },
    { level: 'hard', tip: 'Возможна через буферный слой. Консультация технолога.' },
    { level: 'no',   tip: 'Алюминий и медь несовместимы при сварке плавлением.' },
    { level: 'ok',   tip: tipSelf },
    { level: 'no',   tip: 'Медь и чугун несовместимы при сварке плавлением.' },
    { level: 'no',   tip: tipTiNo },
  ],
  // Чуг
  [
    { level: 'hard', tip: 'Электроды МНЧ-2 или ЦЧ-4. Подогрев 400–600°C, медленное охлаждение.' },
    { level: 'hard', tip: 'Электроды МНЧ-2 или ЦЧ-4. Подогрев 400–600°C, медленное охлаждение.' },
    { level: 'no',   tip: 'Нержавейка и чугун несовместимы при сварке плавлением.' },
    { level: 'no',   tip: tipAlNo },
    { level: 'no',   tip: 'Медь и чугун несовместимы при сварке плавлением.' },
    { level: 'ok',   tip: tipSelf },
    { level: 'no',   tip: tipTiNo },
  ],
  // Ti
  [
    { level: 'no', tip: tipTiNo },
    { level: 'no', tip: tipTiNo },
    { level: 'no', tip: tipTiNo },
    { level: 'no', tip: 'Алюминий и титан несовместимы при сварке плавлением.' },
    { level: 'no', tip: tipTiNo },
    { level: 'no', tip: tipTiNo },
    { level: 'ok', tip: tipSelf },
  ],
]

const icons: Record<Level, string> = { ok: '✅', hard: '⚠️', no: '❌' }

const tooltip = ref<{ text: string; row: number; col: number } | null>(null)

function showTip(row: number, col: number, tip: string) {
  if (tooltip.value?.row === row && tooltip.value?.col === col) {
    tooltip.value = null
  } else {
    tooltip.value = { text: tip, row, col }
  }
}

function hideTip() {
  tooltip.value = null
}
</script>

<template>
  <div class="compat">
    <h3 class="title">Совместимость металлов при сварке</h3>
    <p class="hint">Нажми на ячейку для подробностей</p>

    <div class="table-wrap">
      <table class="compat-table">
        <thead>
          <tr>
            <th class="corner"></th>
            <th v-for="(label, i) in shortLabels" :key="i" class="col-head">{{ label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, ri) in matrix" :key="ri">
            <td class="row-head">{{ shortLabels[ri] }}</td>
            <td
              v-for="(cell, ci) in row"
              :key="ci"
              class="cell"
              :class="cell.level"
              @click="showTip(ri, ci, cell.tip)"
            >
              {{ icons[cell.level] }}
              <div
                v-if="tooltip?.row === ri && tooltip?.col === ci"
                class="tooltip"
                @click.stop
              >
                <div class="tooltip-metals">{{ metals[ri] }} + {{ metals[ci] }}</div>
                <div class="tooltip-text">{{ tooltip.text }}</div>
                <button class="tooltip-close" @click="hideTip">✕</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="legend">
      <span class="legend-item ok">✅ Хорошо</span>
      <span class="legend-item hard">⚠️ Сложно</span>
      <span class="legend-item no">❌ Нельзя</span>
    </div>
  </div>
</template>

<style scoped>
.compat { display: flex; flex-direction: column; gap: 12px; }

.title { font-size: 15px; font-weight: 700; margin: 0; }

.hint { font-size: 12px; color: var(--text-secondary); margin: 0; }

.table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.compat-table {
  border-collapse: collapse;
  min-width: 420px;
  width: 100%;
}

.corner { width: 36px; }

.col-head {
  padding: 6px 4px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  text-align: center;
  white-space: nowrap;
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid var(--border);
}

.row-head {
  padding: 6px 8px 6px 0;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  white-space: nowrap;
  border-right: 1px solid var(--border);
}

.cell {
  padding: 0;
  text-align: center;
  font-size: 16px;
  width: 40px;
  height: 36px;
  cursor: pointer;
  position: relative;
  border: 1px solid rgba(255,255,255,0.04);
  transition: background 0.1s;
}

.cell.ok   { background: rgba(46,160,67,0.08); }
.cell.hard { background: rgba(210,153,34,0.08); }
.cell.no   { background: rgba(233,69,96,0.06); }

.cell.ok:hover   { background: rgba(46,160,67,0.18); }
.cell.hard:hover { background: rgba(210,153,34,0.18); }
.cell.no:hover   { background: rgba(233,69,96,0.14); }

.tooltip {
  position: absolute;
  z-index: 100;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: #1e2a3a;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px 10px 12px;
  width: 220px;
  text-align: left;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

.tooltip-metals {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.tooltip-text {
  font-size: 12px;
  color: var(--text-primary);
  line-height: 1.5;
}

.tooltip-close {
  position: absolute;
  top: 6px;
  right: 8px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 11px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.legend {
  display: flex;
  gap: 16px;
  font-size: 12px;
}

.legend-item { color: var(--text-secondary); }
</style>
