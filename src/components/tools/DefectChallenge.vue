<script setup lang="ts">
import { ref } from 'vue'
import type { DefectChallenge, DefectZone } from '@/types/content'

const props = defineProps<{ challenge: DefectChallenge }>()
const emit = defineEmits<{ done: [] }>()

const found = ref<Set<string>>(new Set())
const active = ref<DefectZone | null>(null)
const missed = ref(false)
const missTimer = ref<ReturnType<typeof setTimeout> | null>(null)

function handleClick(event: MouseEvent) {
  const svg = (event.currentTarget as SVGElement)
  const rect = svg.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 400
  const y = ((event.clientY - rect.top) / rect.height) * 200

  const hit = props.challenge.zones.find(
    (z) => x >= z.x && x <= z.x + z.width && y >= z.y && y <= z.y + z.height,
  )

  if (hit && !found.value.has(hit.id)) {
    found.value.add(hit.id)
    active.value = hit
    missed.value = false
  } else if (!hit) {
    missed.value = true
    if (missTimer.value) clearTimeout(missTimer.value)
    missTimer.value = setTimeout(() => (missed.value = false), 800)
  }
}

const allFound = () => found.value.size === props.challenge.zones.length
</script>

<template>
  <div class="defect">
    <div class="defect-header">
      <span class="gost-tag">ГОСТ 30242-97</span>
      <h3>{{ challenge.title }}</h3>
      <p class="hint">Нажми на дефект шва, чтобы его определить</p>
    </div>

    <div class="svg-container" :class="{ missed }">
      <svg
        viewBox="0 0 400 200"
        @click="handleClick"
        style="cursor: crosshair; width: 100%;"
        v-html="challenge.svgContent.replace(/<svg[^>]*>|<\/svg>/g, '')"
      />

      <!-- Подсветка найденных зон -->
      <svg viewBox="0 0 400 200" class="overlay-svg" style="pointer-events:none;">
        <rect
          v-for="zone in challenge.zones"
          :key="zone.id"
          :x="zone.x"
          :y="zone.y"
          :width="zone.width"
          :height="zone.height"
          :fill="found.has(zone.id) ? 'rgba(233,69,96,0.25)' : 'transparent'"
          :stroke="found.has(zone.id) ? '#e94560' : 'transparent'"
          stroke-width="1.5"
          rx="3"
        />
      </svg>
    </div>

    <div class="found-count">
      Найдено: {{ found.size }} / {{ challenge.zones.length }}
    </div>

    <Transition name="slide">
      <div v-if="active" class="defect-info">
        <div class="defect-info-header">
          <strong>{{ active.label }}</strong>
          <button class="close-btn" @click="active = null">✕</button>
        </div>
        <p>{{ active.description }}</p>
      </div>
    </Transition>

    <div v-if="allFound()" class="all-found">
      <p>✅ Все дефекты найдены!</p>
      <button class="btn btn-primary" @click="emit('done')">Продолжить →</button>
    </div>
  </div>
</template>

<style scoped>
.defect {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.defect-header h3 { margin: 4px 0 2px; }
.hint { font-size: 13px; color: var(--text-secondary); }

.svg-container {
  position: relative;
  background: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: border-color 0.15s;
}

.svg-container.missed {
  border-color: var(--error);
  animation: shake 0.3s ease;
}

.overlay-svg {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
}

.found-count {
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
}

.defect-info {
  background: var(--bg-secondary);
  border: 1px solid var(--accent);
  border-radius: 8px;
  padding: 14px;
}

.defect-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.defect-info-header strong {
  color: var(--accent);
  font-size: 14px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.defect-info p {
  font-size: 13px;
  line-height: 1.55;
}

.all-found {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.all-found p {
  color: var(--success);
  font-weight: 600;
}

.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from { opacity: 0; transform: translateY(-6px); }
.slide-leave-to { opacity: 0; }
</style>
