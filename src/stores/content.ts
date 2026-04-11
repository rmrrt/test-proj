import { defineStore } from 'pinia'
import { module0 } from '@/content/modules/module-0-basics'
import { module1 } from '@/content/modules/module-1-equipment'
import { module2 } from '@/content/modules/module-2-first-weld'
import { module3 } from '@/content/modules/module-3-metallurgy'
import { defectChallenges } from '@/content/tools/defect-challenges'
import type { Module, Lesson, DefectChallenge } from '@/types/content'

export const useContentStore = defineStore('content', () => {
  const modules: Module[] = [module0, module1, module2, module3]

  function getModule(id: string): Module | undefined {
    return modules.find((m) => m.id === id)
  }

  function getLesson(lessonId: string): Lesson | undefined {
    for (const mod of modules) {
      const lesson = mod.lessons.find((l) => l.id === lessonId)
      if (lesson) return lesson
    }
    return undefined
  }

  function getLessonModule(lessonId: string): Module | undefined {
    return modules.find((m) => m.lessons.some((l) => l.id === lessonId))
  }

  function getDefectChallenge(id: string): DefectChallenge | undefined {
    return defectChallenges.find((d) => d.id === id)
  }

  function isModuleUnlocked(moduleId: string, completedModules: string[]): boolean {
    const mod = getModule(moduleId)
    if (!mod) return false
    return mod.unlockedBy.every((dep) => completedModules.includes(dep))
  }

  return { modules, getModule, getLesson, getLessonModule, getDefectChallenge, isModuleUnlocked }
})
