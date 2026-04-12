<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { checklistService, type Checklist } from '@/services/checklistService'

const router = useRouter()
const lists = ref<Checklist[]>([])
const confirmDeleteId = ref<string | null>(null)

onMounted(async () => {
  lists.value = await checklistService.getAll()
})

async function remove(id: string) {
  await checklistService.delete(id)
  lists.value = lists.value.filter((c) => c.id !== id)
  confirmDeleteId.value = null
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="page">
    <div class="top-bar">
      <button class="back-btn" @click="router.push('/tools')">← Назад</button>
      <div class="gost-tag">МОИ ЧЕКЛИСТЫ</div>
    </div>

    <div class="header-row">
      <h2>Мои чеклисты</h2>
      <button class="btn btn-primary create-btn" @click="router.push('/tools/checklists/new')">
        + Создать
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="lists.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <p class="empty-title">Нет сохранённых чеклистов</p>
      <p class="empty-sub">Создайте свой чеклист или сгенерируйте с помощью AI</p>
      <button class="btn btn-primary" @click="router.push('/tools/checklists/new')">
        + Создать первый чеклист
      </button>
    </div>

    <!-- List -->
    <div v-else class="checklist-cards">
      <div v-for="cl in lists" :key="cl.id" class="checklist-card">
        <div class="card-info">
          <div class="card-title">{{ cl.title }}</div>
          <div class="card-meta">
            <span>{{ cl.items.length }} пунктов</span>
            <span class="meta-dot">·</span>
            <span>{{ formatDate(cl.updatedAt) }}</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="open-btn" @click="router.push(`/tools/checklists/${cl.id}`)">
            Открыть →
          </button>
          <button
            v-if="confirmDeleteId !== cl.id"
            class="delete-btn"
            @click="confirmDeleteId = cl.id"
          >×</button>
          <button
            v-else
            class="confirm-delete-btn"
            @click="remove(cl.id)"
          >Удалить?</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
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

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.header-row h2 { margin: 0; }

.create-btn {
  font-size: 13px;
  padding: 8px 14px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon { font-size: 48px; }

.empty-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.empty-sub {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}

.checklist-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checklist-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  transition: border-color 0.15s;
}

.checklist-card:hover {
  border-color: var(--accent);
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 3px;
}

.meta-dot { opacity: 0.4; }

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.open-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 10px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  white-space: nowrap;
}

.open-btn:hover {
  border-color: var(--accent);
  background: rgba(233,69,96,0.08);
}

.delete-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
  transition: color 0.15s;
  line-height: 1;
}

.delete-btn:hover { color: var(--error, #f85149); }

.confirm-delete-btn {
  background: rgba(248,81,73,0.12);
  border: 1px solid rgba(248,81,73,0.4);
  border-radius: 6px;
  color: var(--error, #f85149);
  font-size: 11px;
  font-weight: 700;
  padding: 5px 8px;
  cursor: pointer;
  white-space: nowrap;
}
</style>
