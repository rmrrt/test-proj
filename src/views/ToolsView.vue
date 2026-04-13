<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ModeCalculator from '@/components/tools/ModeCalculator.vue'
import DefectChallenge from '@/components/tools/DefectChallenge.vue'
import WeldingChecklist from '@/components/tools/WeldingChecklist.vue'
import CarbonEquivalentCalculator from '@/components/tools/CarbonEquivalentCalculator.vue'
import MetalCompatibilityTable from '@/components/tools/MetalCompatibilityTable.vue'
import HeatInputCalculator from '@/components/tools/HeatInputCalculator.vue'
import HardnessPredictorCalculator from '@/components/tools/HardnessPredictorCalculator.vue'
import { defectChallenges } from '@/content/tools/defect-challenges'
import { Calculator, ScanSearch, ClipboardCheck, FlaskConical, Layers, ClipboardList, Zap, Flame } from 'lucide-vue-next'

const activeTab = ref<'calculator' | 'defects' | 'checklist' | 'ce' | 'compat' | 'heat' | 'hardness'>('calculator')
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
    <div class="page-header">
      <div class="gost-tag">Инструменты</div>
      <h2>Инструменты сварщика</h2>
    </div>

    <button class="custom-btn" @click="router.push('/tools/checklists')">
      <ClipboardList :size="16" />
      Мой чеклист
    </button>

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
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'checklist' }"
        @click="activeTab = 'checklist'"
      >
        <ClipboardCheck :size="15" />
        Чеклист
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'ce' }"
        @click="activeTab = 'ce'"
      >
        <FlaskConical :size="15" />
        Углерод
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'compat' }"
        @click="activeTab = 'compat'"
      >
        <Layers :size="15" />
        Металлы
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'heat' }"
        @click="activeTab = 'heat'"
      >
        <Zap :size="15" />
        Тепловой ввод
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'hardness' }"
        @click="activeTab = 'hardness'"
      >
        <Flame :size="15" />
        Твёрдость ЗТВ
      </button>
    </div>

    <!-- Tool content -->
    <div class="tool-content card animate-fade-in">
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
      <HeatInputCalculator v-else-if="activeTab === 'heat'" />
      <HardnessPredictorCalculator v-else-if="activeTab === 'hardness'" />
    </div>
  </div>
</template>

<style scoped>
.custom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  background: var(--bg-secondary);
  border: 1px dashed var(--accent-border);
  border-radius: var(--radius);
  color: var(--accent);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.custom-btn:hover {
  background: var(--accent-light);
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  white-space: nowrap;
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
