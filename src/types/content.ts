export type SourceRef = {
  label: string
  url?: string
}

export type ContentBlock =
  | { kind: 'text'; markdown: string }
  | { kind: 'image'; src: string; caption?: string }
  | { kind: 'svg-diagram'; svgId: string; caption?: string }
  | { kind: 'warning'; text: string }

export type Question = {
  text: string
  options: string[]
  correctIndex: number
  errorExplanation: string
  sources?: SourceRef[]
}

export type DefectZone = {
  id: string
  label: string
  description: string
  x: number
  y: number
  width: number
  height: number
}

export type DefectChallenge = {
  id: string
  title: string
  svgContent: string
  zones: DefectZone[]
}

export type Step =
  | { type: 'theory'; blocks: ContentBlock[]; sources?: SourceRef[] }
  | { type: 'quiz'; questions: Question[]; passingScore: number }
  | { type: 'defect-challenge'; challengeId: string }

export type VideoRef = {
  platform: string
  url: string
  title: string
  channel: string
}

export type PracticalNote = {
  summary: string
  examples?: string[]
}

export type Lesson = {
  id: string
  title: string
  moduleId: string
  durationMin: number
  steps: Step[]
  sources?: SourceRef[]
  videos?: VideoRef[]
  practicalNote?: PracticalNote
}

export type Module = {
  id: string
  title: string
  description: string
  icon: string
  skippable: boolean
  lessons: Lesson[]
  unlockedBy: string[]
}

export type GearItem = {
  name: string
  description: string
  budgetRange: string
  tips: string[]
  links: { label: string; url: string }[]
}

export type GearCategory = {
  title: string
  icon: string
  items: GearItem[]
}

export type AppProgress = {
  onboardingDone: boolean
  experienceLevel: 'beginner' | 'experienced'
  completedLessons: string[]
  completedModules: string[]
  quizScores: Record<string, number>
  lastVisited: string
}
