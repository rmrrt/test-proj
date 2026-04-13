<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ModeCalculator from '@/components/tools/ModeCalculator.vue'
import DefectChallenge from '@/components/tools/DefectChallenge.vue'
import WeldingChecklist from '@/components/tools/WeldingChecklist.vue'
import CarbonEquivalentCalculator from '@/components/tools/CarbonEquivalentCalculator.vue'
import MetalCompatibilityTable from '@/components/tools/MetalCompatibilityTable.vue'
import { defectChallenges } from '@/content/tools/defect-challenges'

const activeTab = ref<'calculator' | 'defects' | 'checklist' | 'ce' | 'compat'>('calculator')
const router = useRouter()
const currentDefectIndex = ref(0)
const defectKey = ref(0)

function nextDefect() {
  currentDefectIndex.value = (currentDefectIndex.value + 1) % defectChallenges.length
  defectKey.value++
}
</script>

<template>
  <div class="page">
    <div class="header">
      <div class="gost-tag">ИНСТРУМЕНТЫ</div>
      <h2>Инструменты сварщика</h2>
    </div>

    <button class="custom-btn" @click="router.push('/tools/checklists')">
      📝 Мой чеклист
    </button>

    <div class="tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'calculator' }"
        @click="activeTab = 'calculator'"
      >
        🔢 Калькулятор
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'defects' }"
        @click="activeTab = 'defects'"
      >
        🔍 Дефекты
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'checklist' }"
        @click="activeTab = 'checklist'"
      >
        ✅ Чеклист
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'ce' }"
        @click="activeTab = 'ce'"
      >
        ⚗️ Углеродный эквивалент
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'compat' }"
        @click="activeTab = 'compat'"
      >
        🔗 Совместимость металлов
      </button>
    </div>

    <div class="tool-content card">
      <ModeCalculator v-if="activeTab === 'calculator'" />

      <div v-else-if="activeTab === 'defects'">
        <DefectChallenge
          v-if="defectChallenges[currentDefectIndex]"
          :key="defectKey"
          :challenge="defectChallenges[currentDefectIndex]!"
          @done="nextDefect"
        />
        <p class="defect-counter">
          Задача {{ currentDefectIndex + 1 }} из {{ defectChallenges.length }}
        </p>
      </div>

      <WeldingChecklist v-else-if="activeTab === 'checklist'" />
      <CarbonEquivalentCalculator v-else-if="activeTab === 'ce'" />
      <MetalCompatibilityTable v-else-if="activeTab === 'compat'" />
    </div>
  </div>
</template>

<style scoped>
.header { margin-bottom: 16px; }
.header h2 { margin-top: 4px; }

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  flex-shrink: 0;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  min-width: 72px;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.tab-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(233,69,96,0.08);
}

.tool-content {
  padding: 20px;
}

.custom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  background: var(--bg-secondary);
  border: 1px dashed var(--accent);
  border-radius: 10px;
  color: var(--accent);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.custom-btn:hover {
  background: rgba(233,69,96,0.08);
}

.defect-counter {
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 12px;
}
</style>
