<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { checklistService, type Checklist, type ChecklistItem } from '@/services/checklistService'

const router = useRouter()
const route = useRoute()

const id = route.params.id as string
const isNew = id === 'new'

const title = ref('Мой чеклист')
const items = ref<(ChecklistItem & { _localId: string })[]>([])
const isDemo = ref(false)
const dragIndex = ref<number | null>(null)
const aiQuery = ref('')
const aiLoading = ref(false)
const saved = ref(false)
const loading = ref(!isNew)

let nextLocalId = 1
function makeLocalId() { return `local-${nextLocalId++}` }

onMounted(async () => {
  if (!isNew) {
    const cl = await checklistService.getById(id)
    if (cl) {
      title.value = cl.title
      items.value = cl.items.map(item => ({ ...item, _localId: makeLocalId() }))
    } else {
      router.replace('/tools/checklists')
    }
  }
  loading.value = false
})

function addItem() {
  items.value.push({ id: '', text: '', _localId: makeLocalId() })
}

function removeItem(index: number) {
  items.value.splice(index, 1)
}

async function save() {
  const now = new Date().toISOString()
  const checklist: Checklist = {
    id: isNew ? `cl-${Date.now()}` : id,
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
  saved.value = true
  setTimeout(() => router.push('/tools/checklists'), 800)
}

// Drag and drop
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

// AI mock
const MOCK_RESPONSE = {
  title: 'Сгенерированный чеклист',
  items: [
    { text: 'Проверить целостность кабелей и заземление', reason: 'Обрыв изоляции или плохой контакт заземления — источник поражения током' },
    { text: 'Подобрать электрод по материалу и толщине', reason: 'Неправильный электрод даёт плохое сплавление или дефекты шва' },
    { text: 'Выставить ток по формуле: диаметр × 35А', reason: 'Оптимальный ток обеспечивает стабильную дугу без прожогов' },
    { text: 'Зачистить металл от ржавчины, краски и масла', reason: 'Загрязнения вызывают пористость и включения в шве' },
    { text: 'Надеть СИЗ: маска, краги, спецодежда', reason: 'Ультрафиолет дуги и брызги металла опасны без защиты' },
    { text: 'Обеспечить вентиляцию рабочего места', reason: 'Сварочные аэрозоли токсичны при накоплении в закрытом помещении' },
    { text: 'Закрепить заготовки и сделать прихватки', reason: 'Деформация при нагреве сдвинет незакреплённые детали' },
  ],
}

function generate() {
  if (!aiQuery.value.trim()) return
  aiLoading.value = true
  setTimeout(() => {
    title.value = MOCK_RESPONSE.title
    items.value = MOCK_RESPONSE.items.map(i => ({ id: '', text: i.text, reason: i.reason, _localId: makeLocalId() }))
    isDemo.value = true
    aiLoading.value = false
  }, 1500)
}
</script>

<template>
  <div class="page">
    <div class="top-bar">
      <button class="back-btn" @click="router.push('/tools/checklists')">← Назад</button>
      <div class="gost-tag">{{ isNew ? 'НОВЫЙ ЧЕКЛИСТ' : 'РЕДАКТИРОВАНИЕ' }}</div>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <template v-else>
      <!-- Demo banner -->
      <div v-if="isDemo" class="demo-banner">
        ⚠️ ДЕМО — результат сгенерирован локально, без подключения к AI
      </div>

      <!-- Title -->
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

      <!-- Save -->
      <div class="section save-row">
        <button class="btn btn-primary save-btn" :disabled="!items.length || saved" @click="save">
          {{ saved ? '✓ Сохранено!' : 'Сохранить' }}
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
  </div>
</template>

<style scoped>
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

.section {
  margin-bottom: 16px;
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
  gap: 12px;
}

.save-btn {
  min-width: 130px;
}

.save-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.items-count {
  font-size: 12px;
  color: var(--text-secondary);
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
