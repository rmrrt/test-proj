<script setup lang="ts">
import { ref } from 'vue'
import ModeCalculator from '@/components/tools/ModeCalculator.vue'
import DefectChallenge from '@/components/tools/DefectChallenge.vue'
import { defectChallenges } from '@/content/tools/defect-challenges'

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
    <div class="header">
      <div class="gost-tag">ИНСТРУМЕНТЫ</div>
      <h2>Инструменты сварщика</h2>
    </div>

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
    </div>

    <div class="tool-content card">
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
.header { margin-bottom: 16px; }
.header h2 { margin-top: 4px; }

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-btn {
  flex: 1;
  padding: 10px;
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

.defect-counter {
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 12px;
}
</style>
