import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppProgress } from '@/types/content'

const STORAGE_KEY = 'welding-app-progress'

const defaultProgress = (): AppProgress => ({
  onboardingDone: false,
  experienceLevel: 'beginner',
  completedLessons: [],
  completedModules: [],
  quizScores: {},
  lastVisited: '/modules',
})

export const useProgressStore = defineStore('progress', () => {
  const progress = ref<AppProgress>(loadFromStorage())

  function loadFromStorage(): AppProgress {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return defaultProgress()
      return { ...defaultProgress(), ...JSON.parse(raw) }
    } catch {
      return defaultProgress()
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress.value))
  }

  function completeOnboarding(level: 'beginner' | 'experienced') {
    progress.value.onboardingDone = true
    progress.value.experienceLevel = level
    if (level === 'experienced') {
      progress.value.completedModules = ['module-0']
    }
    save()
  }

  function completeLesson(lessonId: string, score?: number) {
    if (!progress.value.completedLessons.includes(lessonId)) {
      progress.value.completedLessons.push(lessonId)
    }
    if (score !== undefined) {
      progress.value.quizScores[lessonId] = score
    }
    save()
  }

  function completeModule(moduleId: string) {
    if (!progress.value.completedModules.includes(moduleId)) {
      progress.value.completedModules.push(moduleId)
    }
    save()
  }

  function setLastVisited(route: string) {
    progress.value.lastVisited = route
    save()
  }

  function isLessonCompleted(lessonId: string) {
    return progress.value.completedLessons.includes(lessonId)
  }

  function isModuleCompleted(moduleId: string) {
    return progress.value.completedModules.includes(moduleId)
  }

  function getLessonScore(lessonId: string): number | undefined {
    return progress.value.quizScores[lessonId]
  }

  const totalCompleted = computed(() => progress.value.completedLessons.length)

  return {
    progress,
    completeOnboarding,
    completeLesson,
    completeModule,
    setLastVisited,
    isLessonCompleted,
    isModuleCompleted,
    getLessonScore,
    totalCompleted,
  }
})
