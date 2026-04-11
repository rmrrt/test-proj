<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import BottomNav from '@/components/ui/BottomNav.vue'

const route = useRoute()
const showNav = computed(() => route.path !== '/onboarding')
</script>

<template>
  <RouterView />
  <BottomNav v-if="showNav" />
</template>
