<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import BottomNav from '@/components/ui/BottomNav.vue'
import { useDevMode } from '@/composables/useDevMode'

const route = useRoute()
const showNav = computed(() => route.path !== '/onboarding')
const { isDevMode } = useDevMode()
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
  <BottomNav v-if="showNav" />
  <div v-if="isDevMode" class="dev-badge">DEV</div>
</template>

<style>
/* Page transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

<style scoped>
.dev-badge {
  position: fixed;
  bottom: 64px;
  right: 12px;
  background: #e94560;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 2px 7px;
  border-radius: 4px;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.85;
}
</style>
