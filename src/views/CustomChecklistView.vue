<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { checklistService, type Checklist, type ChecklistItem } from '@/services/checklistService'

const router = useRouter()
const route = useRoute()

const routeId = route.params.id as string
const isNew = routeId === 'new'

// Persisted id after first save
const savedId = ref<string>(isNew ? '' : routeId)

type Mode = 'use' | 'edit'
const mode = ref<Mode>(isNew ? 'edit' : 'use')

const loading = ref(!isNew)

// Edit state
const title = ref('Мой чеклист')
const items = ref<(ChecklistItem & { _localId: string })[]>([])
const isDemo = ref(false)
const dragIndex = ref<number | null>(null)
const aiQuery = ref('')
const aiLoading = ref(false)
const saving = ref(false)

// Use state (session only)
const checked = ref<Record<string, boolean>>({})

let nextLocalId = 1
function makeLocalId() { return `local-${nextLocalId++}` }

// Snapshot of items before editing (to restore on cancel)
let editSnapshot: { title: string; items: (ChecklistItem & { _localId: string })[] } | null = null

onMounted(async () => {
  if (!isNew) {
    const cl = await checklistService.getById(routeId)
    if (cl) {
      title.value = cl.title
      items.value = cl.items.map(item => ({ ...item, _localId: makeLocalId() }))
    } else {
      router.replace('/tools/checklists')
    }
  }
  loading.value = false
})

// ── USE mode ──────────────────────────────────────────────────────────────────

const checkedCount = computed(() => items.value.filter(item => checked.value[item._localId]).length)
const total = computed(() => items.value.length)
const progress = computed(() => total.value === 0 ? 0 : Math.round((checkedCount.value / total.value) * 100))
const allDone = computed(() => total.value > 0 && checkedCount.value === total.value)

function toggleItem(localId: string) {
  checked.value[localId] = !checked.value[localId]
}

function resetChecks() {
  checked.value = {}
}

function enterEdit() {
  // snapshot current state so cancel can restore
  editSnapshot = {
    title: title.value,
    items: items.value.map(item => ({ ...item })),
  }
  mode.value = 'edit'
}

// ── EDIT mode ─────────────────────────────────────────────────────────────────

function addItem() {
  items.value.push({ id: '', text: '', _localId: makeLocalId() })
}

function removeItem(index: number) {
  items.value.splice(index, 1)
}

function cancelEdit() {
  if (editSnapshot) {
    title.value = editSnapshot.title
    items.value = editSnapshot.items
    editSnapshot = null
  }
  mode.value = 'use'
}

async function save() {
  saving.value = true
  const clId = savedId.value || `cl-${Date.now()}`
  const now = new Date().toISOString()
  const checklist: Checklist = {
    id: clId,
    title: title.value,
    items: items.value.map((item, i) => ({
      id: item.id || `item-${i}`,
      text: item.text,
      reason: item.reason,
    })),
    createdAt: now,
    updatedAt: now,
  }
  await checklistService.save(checklist)
  savedId.value = clId
  editSnapshot = null
  saving.value = false
  // Re-sync items with assigned ids
  items.value = items.value.map((item, i) => ({
    ...item,
    id: item.id || `item-${i}`,
  }))
  mode.value = 'use'
}

// ── Drag and drop ─────────────────────────────────────────────────────────────

function onDragStart(index: number) {
  dragIndex.value = index
}

function onDragOver(e: DragEvent, index: number) {
  e.preventDefault()
  if (dragIndex.value === null || dragIndex.value === index) return
  const moved = items.value.splice(dragIndex.value, 1)[0]
  items.value.splice(index, 0, moved)
  dragIndex.value = index
}

function onDragEnd() {
  dragIndex.value = null
}

// ── AI mock ───────────────────────────────────────────────────────────────────

const MOCK_ITEMS = [
  { text: 'Проверить целостность кабелей и заземление', reason: 'Обрыв изоляции или плохой контакт заземления — источник поражения током' },
  { text: 'Подобрать электрод по материалу и толщине', reason: 'Неправильный электрод даёт плохое сплавление или дефекты шва' },
  { text: 'Выставить ток по формуле: диаметр × 35А', reason: 'Оптимальный ток обеспечивает стабильную дугу без прожогов' },
  { text: 'Зачистить металл от ржавчины, краски и масла', reason: 'Загрязнения вызывают пористость и включения в шве' },
  { text: 'Надеть СИЗ: маска, краги, спецодежда', reason: 'Ультрафиолет дуги и брызги металла опасны без защиты' },
  { text: 'Обеспечить вентиляцию рабочего места', reason: 'Сварочные аэрозоли токсичны при накоплении в закрытом помещении' },
  { text: 'Закрепить заготовки и сделать прихватки', reason: 'Деформация при нагреве сдвинет незакреплённые детали' },
]

function generate() {
  if (!aiQuery.value.trim()) return
  aiLoading.value = true
  setTimeout(() => {
    title.value = 'Сгенерированный чеклист'
    items.value = MOCK_ITEMS.map(i => ({ id: '', text: i.text, reason: i.reason, _localId: makeLocalId() }))
    isDemo.value = true
    aiLoading.value = false
  }, 1500)
}
</script>

<template>
  <div class="page">
    <div class="top-bar">
      <button class="back-btn" @click="router.push('/tools/checklists')">← Назад</button>
      <div class="gost-tag">{{ mode === 'edit' && isNew ? 'НОВЫЙ ЧЕКЛИСТ' : mode === 'edit' ? 'РЕДАКТИРОВАНИЕ' : 'ЧЕКЛИСТ' }}</div>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <template v-else>

      <!-- ═══════════════════════════════════════════ USE MODE ══ -->
      <template v-if="mode === 'use'">

        <!-- Header row -->
        <div class="use-header">
          <h2 class="use-title">{{ title }}</h2>
          <button class="edit-btn" @click="enterEdit" title="Редактировать">✏️</button>
        </div>

        <!-- Progress -->
        <div class="progress-block">
          <div class="progress-label">
            <span>{{ checkedCount }} из {{ total }}</span>
            <span class="progress-pct">{{ progress }}%</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" :style="{ width: progress + '%' }" :class="{ done: allDone }" />
          </div>
        </div>

        <!-- All done banner -->
        <div v-if="allDone" class="done-banner">
          ✅ Все пункты выполнены!
        </div>

        <!-- Checklist items -->
        <div class="use-items">
          <label
            v-for="item in items"
            :key="item._localId"
            class="use-item"
            :class="{ 'use-item--checked': checked[item._localId] }"
          >
            <input
              type="checkbox"
              class="use-checkbox"
              :checked="checked[item._localId]"
              @change="toggleItem(item._localId)"
            />
            <div class="use-item-body">
              <span class="use-item-text">{{ item.text }}</span>
              <span v-if="item.reason" class="use-item-reason">{{ item.reason }}</span>
            </div>
          </label>
        </div>

        <!-- Reset -->
        <button
          v-if="checkedCount > 0"
          class="reset-btn"
          @click="resetChecks"
        >
          ↺ Сбросить
        </button>

      </template>

      <!-- ═══════════════════════════════════════════ EDIT MODE ══ -->
      <template v-else>

        <!-- Demo banner -->
        <div v-if="isDemo" class="demo-banner">
          ⚠️ ДЕМО — результат сгенерирован локально, без подключения к AI
        </div>

        <!-- Title input -->
        <div class="section">
          <input
            v-model="title"
            class="title-input"
            placeholder="Название чеклиста..."
            maxlength="80"
          />
        </div>

        <!-- Items -->
        <div class="section">
          <div class="items-list">
            <div
              v-for="(item, index) in items"
              :key="item._localId"
              class="item-row"
              :class="{ dragging: dragIndex === index }"
              draggable="true"
              @dragstart="onDragStart(index)"
              @dragover="onDragOver($event, index)"
              @dragend="onDragEnd"
            >
              <span class="drag-handle">☰</span>
              <div class="item-fields">
                <input
                  v-model="item.text"
                  class="item-input"
                  placeholder="Текст пункта..."
                />
                <div v-if="item.reason" class="item-reason">{{ item.reason }}</div>
              </div>
              <button class="remove-btn" @click="removeItem(index)">×</button>
            </div>
          </div>

          <button class="add-btn" @click="addItem">+ Добавить пункт</button>
        </div>

        <!-- Save / Cancel -->
        <div class="section save-row">
          <button
            class="btn btn-primary save-btn"
            :disabled="!items.length || saving"
            @click="save"
          >
            {{ saving ? '...' : 'Сохранить' }}
          </button>
          <button
            v-if="!isNew"
            class="cancel-btn"
            @click="cancelEdit"
          >
            Отмена
          </button>
          <span class="items-count" v-if="items.length">{{ items.length }} пунктов</span>
        </div>

        <!-- AI section -->
        <div class="section ai-section">
          <div class="ai-header">
            <span class="ai-title">✨ Сгенерировать с помощью AI</span>
            <span class="ai-badge">DEMO</span>
          </div>
          <p class="ai-desc">Опишите условия сварки — материал, толщину, положение, окружающую среду...</p>
          <textarea
            v-model="aiQuery"
            class="ai-textarea"
            placeholder="Например: нержавейка 3мм, TIG, горизонтальный шов на улице..."
            rows="3"
          />
          <button
            class="btn ai-generate-btn"
            :disabled="!aiQuery.trim() || aiLoading"
            @click="generate"
          >
            <span v-if="aiLoading" class="spinner">⟳</span>
            <span v-else>Сгенерировать</span>
          </button>
        </div>

      </template>

    </template>
  </div>
</template>

<style scoped>
/* ── Shared ────────────────────────────────────────────────────── */
.top-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.back-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}
.back-btn:hover { color: var(--text-primary); }

.loading {
  text-align: center;
  color: var(--text-secondary);
  padding: 40px;
  font-size: 14px;
}

.section { margin-bottom: 16px; }

/* ── USE mode ──────────────────────────────────────────────────── */
.use-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.use-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.3;
  flex: 1;
}

.edit-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 5px 8px;
  font-size: 14px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: border-color 0.15s, color 0.15s;
  flex-shrink: 0;
  line-height: 1;
}
.edit-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.progress-block {
  margin-bottom: 14px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.progress-pct {
  font-weight: 700;
  color: var(--text-primary);
}

.progress-bar-track {
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 3px;
  transition: width 0.25s ease, background 0.25s;
}

.progress-bar-fill.done {
  background: #3fb950;
}

.done-banner {
  background: rgba(63, 185, 80, 0.1);
  border: 1px solid rgba(63, 185, 80, 0.35);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #3fb950;
  font-weight: 700;
  margin-bottom: 14px;
  text-align: center;
}

.use-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.use-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  user-select: none;
}

.use-item:hover {
  border-color: var(--accent);
}

.use-item--checked {
  background: rgba(63, 185, 80, 0.06);
  border-color: rgba(63, 185, 80, 0.3);
}

.use-checkbox {
  margin: 2px 0 0;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  accent-color: #3fb950;
  cursor: pointer;
}

.use-item-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
}

.use-item-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  transition: opacity 0.15s;
}

.use-item--checked .use-item-text {
  opacity: 0.5;
  text-decoration: line-through;
}

.use-item-reason {
  font-size: 11px;
  color: var(--text-secondary);
  font-style: italic;
  line-height: 1.4;
}

.reset-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 7px;
  color: var(--text-secondary);
  font-size: 12px;
  padding: 7px 12px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  margin-bottom: 4px;
}
.reset-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* ── EDIT mode ─────────────────────────────────────────────────── */
.demo-banner {
  background: rgba(210, 140, 30, 0.1);
  border: 1px solid rgba(210, 140, 30, 0.35);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #d28c1e;
  font-weight: 600;
  margin-bottom: 12px;
}

.title-input {
  width: 100%;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  box-sizing: border-box;
}
.title-input:focus {
  outline: none;
  border-color: var(--accent);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.item-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px;
  transition: opacity 0.15s, border-color 0.15s;
  cursor: grab;
}
.item-row:active { cursor: grabbing; }
.item-row.dragging {
  opacity: 0.45;
  border-color: var(--accent);
}

.drag-handle {
  color: var(--text-secondary);
  font-size: 14px;
  padding-top: 2px;
  flex-shrink: 0;
  user-select: none;
}

.item-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.item-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 13px;
  padding: 2px 0 4px;
  width: 100%;
}
.item-input:focus {
  outline: none;
  border-bottom-color: var(--accent);
}

.item-reason {
  font-size: 11px;
  color: var(--text-secondary);
  font-style: italic;
  line-height: 1.4;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 18px;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  flex-shrink: 0;
  transition: color 0.15s;
}
.remove-btn:hover { color: var(--error, #f85149); }

.add-btn {
  background: none;
  border: 1px dashed var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.add-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.save-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.save-btn {
  min-width: 120px;
}
.save-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cancel-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  padding: 9px 14px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.cancel-btn:hover {
  border-color: var(--text-secondary);
  color: var(--text-primary);
}

.items-count {
  font-size: 12px;
  color: var(--text-secondary);
  margin-left: auto;
}

.ai-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.ai-badge {
  font-size: 9px;
  font-weight: 700;
  background: rgba(233, 69, 96, 0.15);
  color: var(--accent);
  border: 1px solid rgba(233, 69, 96, 0.3);
  border-radius: 4px;
  padding: 1px 5px;
  letter-spacing: 0.05em;
}

.ai-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.ai-textarea {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 13px;
  padding: 10px 12px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}
.ai-textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.ai-generate-btn {
  background: linear-gradient(135deg, rgba(233,69,96,0.15), rgba(233,69,96,0.05));
  border: 1px solid rgba(233,69,96,0.4);
  border-radius: 8px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 700;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  align-self: flex-start;
}
.ai-generate-btn:hover:not(:disabled) {
  background: rgba(233,69,96,0.2);
  border-color: var(--accent);
}
.ai-generate-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
