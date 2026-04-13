<script setup lang="ts">
import { ref, computed } from 'vue'

type ChecklistItem = { id: string; text: string }
type Scenario = { key: string; label: string; icon: string; items: ChecklistItem[] }

const scenarios: Scenario[] = [
  {
    key: 'first',
    label: 'Первая сварка',
    icon: '🔰',
    items: [
      { id: 'f1', text: 'Сварочный аппарат исправен, кабели без повреждений' },
      { id: 'f2', text: 'Электрод подобран по толщине металла' },
      { id: 'f3', text: 'Ток выставлен по таблице (диаметр электрода × 30–40 А)' },
      { id: 'f4', text: 'Маска с нужным затемнением (DIN 9–11 для РДС)' },
      { id: 'f5', text: 'Кожаные перчатки (краги)' },
      { id: 'f6', text: 'Одежда из натуральных тканей (хлопок, брезент)' },
      { id: 'f7', text: 'Закрытая обувь с кожаной подошвой' },
      { id: 'f8', text: 'Рабочее место очищено от горючих материалов (>5 м)' },
      { id: 'f9', text: 'Вентиляция обеспечена' },
      { id: 'f10', text: 'Металл зачищен от ржавчины, краски, масла' },
      { id: 'f11', text: 'Заготовки надёжно закреплены' },
      { id: 'f12', text: 'Огнетушитель в зоне досягаемости' },
    ],
  },
  {
    key: 'outdoor',
    label: 'На улице',
    icon: '🌤️',
    items: [
      { id: 'o1', text: 'Скорость ветра допустима (<10 м/с, иначе нужна защитная ширма)' },
      { id: 'o2', text: 'Без осадков и росы (дождь, роса — нельзя работать)' },
      { id: 'o3', text: 'Металл сухой (прогрей горелкой при необходимости)' },
      { id: 'o4', text: 'Заземление обеспечено (не на мёрзлую землю)' },
      { id: 'o5', text: 'Ток увеличен на 10–15% (ветер охлаждает металл)' },
      { id: 'o6', text: 'Электроды сухие (хранились в сухом месте или прокалены)' },
      { id: 'o7', text: 'Защита от прямых солнечных бликов (мешают видеть дугу)' },
      { id: 'o8', text: 'Есть помощник или средства связи' },
      { id: 'o9', text: 'Все базовые пункты из «Первой сварки» выполнены' },
    ],
  },
  {
    key: 'stainless',
    label: 'Нержавейка',
    icon: '✨',
    items: [
      { id: 's1', text: 'Электрод для нержавейки (ОЗЛ-8, ЦЛ-11 или аналог)' },
      { id: 's2', text: 'Ток снижен на 10–20% по сравнению с углеродистой сталью' },
      { id: 's3', text: 'Обратная полярность (DCEP)' },
      { id: 's4', text: 'Металл тщательно обезжирен (нержавейка не прощает загрязнений)' },
      { id: 's5', text: 'Инструмент отдельный (щётка, болгарка — только для нержавейки)' },
      { id: 's6', text: 'Короткая дуга (нержавейка хуже теплопроводит — легко перегреть)' },
      { id: 's7', text: 'Прерывистый шов или охлаждение между проходами (деформация!)' },
      { id: 's8', text: 'Усиленная вентиляция (пары хрома токсичны)' },
      { id: 's9', text: 'Защитный газ если TIG (аргон, чистота 99,99%)' },
    ],
  },
  {
    key: 'pipe',
    label: 'Сварка трубы',
    icon: '🔧',
    items: [
      { id: 'p1', text: 'Торцы трубы подготовлены (обрезаны перпендикулярно, кромки сняты)' },
      { id: 'p2', text: 'Трубы выровнены по оси (смещение <1 мм)' },
      { id: 'p3', text: 'Выполнены прихватки (минимум 3 равномерно по окружности)' },
      { id: 'p4', text: 'Порядок проходов определён (корень → заполнение → облицовка)' },
      { id: 'p5', text: 'Электрод для корня шва (целлюлозный или основной)' },
      { id: 'p6', text: 'Положения сварки учтены (труба = все положения сразу)' },
      { id: 'p7', text: 'Контроль деформации (трубы прихвачены к стапелю)' },
      { id: 'p8', text: 'После сварки — охлаждение естественное (не водой)' },
      { id: 'p9', text: 'Визуальный контроль шва по всей окружности' },
    ],
  },
]

const activeKey = ref(scenarios[0].key)
const checked = ref<Record<string, Set<string>>>(
  Object.fromEntries(scenarios.map((s) => [s.key, new Set<string>()])),
)

const activeScenario = computed(() => scenarios.find((s) => s.key === activeKey.value)!)

const checkedSet = computed(() => checked.value[activeKey.value])

const progress = computed(() => ({
  done: checkedSet.value.size,
  total: activeScenario.value.items.length,
  pct: Math.round((checkedSet.value.size / activeScenario.value.items.length) * 100),
}))

const allDone = computed(() => progress.value.done === progress.value.total)

function toggle(id: string) {
  if (checkedSet.value.has(id)) {
    checkedSet.value.delete(id)
  } else {
    checkedSet.value.add(id)
  }
}

function reset() {
  checked.value[activeKey.value] = new Set()
}
</script>

<template>
  <div class="checklist">
    <div class="gost-tag">ГОСТ 12.3.003-86</div>
    <h3>Чеклист сварщика</h3>

    <div class="scenario-tabs">
      <button
        v-for="s in scenarios"
        :key="s.key"
        class="scenario-btn"
        :class="{ active: activeKey === s.key }"
        @click="activeKey = s.key"
      >
        {{ s.icon }} {{ s.label }}
      </button>
    </div>

    <div class="progress-row">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress.pct + '%' }" :class="{ complete: allDone }" />
      </div>
      <span class="progress-label">{{ progress.done }}/{{ progress.total }}</span>
    </div>

    <Transition name="done">
      <div v-if="allDone" class="all-done">
        ✅ Готов к сварке!
      </div>
    </Transition>

    <ul class="items">
      <li
        v-for="item in activeScenario.items"
        :key="item.id"
        class="item"
        :class="{ checked: checkedSet.has(item.id) }"
        @click="toggle(item.id)"
      >
        <span class="checkbox">
          <span v-if="checkedSet.has(item.id)" class="check-icon">✓</span>
        </span>
        <span class="item-text">{{ item.text }}</span>
      </li>
    </ul>

    <button v-if="progress.done > 0" class="reset-btn" @click="reset">
      Сбросить
    </button>
  </div>
</template>

<style scoped>
.checklist {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.scenario-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.scenario-btn {
  padding: 8px 6px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}

.scenario-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(233, 69, 96, 0.08);
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 3px;
  transition: width 0.3s ease, background 0.3s;
}

.progress-fill.complete {
  background: var(--success);
}

.progress-label {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  min-width: 32px;
  text-align: right;
}

.all-done {
  background: rgba(63, 185, 80, 0.12);
  border: 1px solid rgba(63, 185, 80, 0.35);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 700;
  color: var(--success);
  text-align: center;
}

.done-enter-active {
  transition: all 0.3s ease;
}

.done-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}

.items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, opacity 0.15s;
  background: var(--bg-secondary);
}

.item:hover {
  border-color: var(--accent);
}

.item.checked {
  background: rgba(63, 185, 80, 0.07);
  border-color: rgba(63, 185, 80, 0.3);
  opacity: 0.75;
}

.checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border);
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, background 0.15s;
  margin-top: 1px;
}

.item.checked .checkbox {
  background: var(--success);
  border-color: var(--success);
}

.check-icon {
  font-size: 11px;
  color: #fff;
  font-weight: 700;
  line-height: 1;
}

.item-text {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.5;
}

.item.checked .item-text {
  color: var(--text-secondary);
  text-decoration: line-through;
}

.reset-btn {
  align-self: flex-start;
  padding: 6px 14px;
  font-size: 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.reset-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
</style>
