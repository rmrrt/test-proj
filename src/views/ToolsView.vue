<script setup lang="ts">
import { ref } from 'vue'
import ModeCalculator from '@/components/tools/ModeCalculator.vue'
import DefectChallenge from '@/components/tools/DefectChallenge.vue'
import { defectChallenges } from '@/content/tools/defect-challenges'
import { Calculator, ScanSearch } from 'lucide-vue-next'

const activeTab = ref<'calculator' | 'defects'>('calculator')
const currentDefectIndex = ref(0)
const defectKey = ref(0)

function nextDefect() {
  currentDefectIndex.value = (currentDefectIndex.value + 1) % defectChallenges.length
  defectKey.value++
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div class="gost-tag">Инструменты</div>
      <h2>Инструменты сварщика</h2>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'calculator' }"
        @click="activeTab = 'calculator'"
      >
        <Calculator :size="15" />
        Калькулятор
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'defects' }"
        @click="activeTab = 'defects'"
      >
        <ScanSearch :size="15" />
        Дефекты
      </button>
    </div>

    <!-- Tool content -->
    <div class="tool-content card animate-fade-in">
      <ModeCalculator v-if="activeTab === 'calculator'" />

      <div v-else>
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
    </div>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.tab-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-light);
}

.tab-btn:hover:not(.active) {
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.tool-content { padding: 20px; }

.defect-counter {
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 12px;
}
</style>
