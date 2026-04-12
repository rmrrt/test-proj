import { createRouter, createWebHistory } from 'vue-router'
import { useProgressStore } from '@/stores/progress'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        const progress = useProgressStore()
        return progress.progress.onboardingDone ? '/modules' : '/onboarding'
      },
    },
    { path: '/onboarding', component: () => import('@/views/OnboardingView.vue') },
    { path: '/modules', component: () => import('@/views/ModulesView.vue') },
    { path: '/lesson/:lessonId', component: () => import('@/views/LessonView.vue'), props: true },
    { path: '/tools', component: () => import('@/views/ToolsView.vue') },
    { path: '/tools/checklists', component: () => import('@/views/ChecklistListView.vue') },
    { path: '/tools/checklists/:id', component: () => import('@/views/CustomChecklistView.vue'), props: true },
    { path: '/gear', component: () => import('@/views/GearView.vue') },
    { path: '/progress', component: () => import('@/views/ProgressView.vue') },
    { path: '/about', component: () => import('@/views/AboutView.vue') },
  ],
})

export default router
