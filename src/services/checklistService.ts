// TODO: replace localStorage implementation with API calls when backend is ready
// Expected API endpoints:
//   GET    /api/checklists
//   GET    /api/checklists/:id
//   POST   /api/checklists       (create)
//   PUT    /api/checklists/:id   (update)
//   DELETE /api/checklists/:id

const STORAGE_KEY = 'weld-checklists'

export interface ChecklistItem {
  id: string
  text: string
  reason?: string
  checked?: boolean
}

export interface Checklist {
  id: string
  title: string
  items: ChecklistItem[]
  createdAt: string
  updatedAt: string
}

function readAll(): Checklist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeAll(lists: Checklist[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
}

export const checklistService = {
  async getAll(): Promise<Checklist[]> {
    return readAll()
  },

  async getById(id: string): Promise<Checklist | null> {
    return readAll().find((c) => c.id === id) ?? null
  },

  async save(checklist: Checklist): Promise<Checklist> {
    const lists = readAll()
    const now = new Date().toISOString()
    const existing = lists.findIndex((c) => c.id === checklist.id)
    if (existing >= 0) {
      lists[existing] = { ...checklist, updatedAt: now }
      writeAll(lists)
      return lists[existing]
    } else {
      const created = { ...checklist, createdAt: now, updatedAt: now }
      lists.push(created)
      writeAll(lists)
      return created
    }
  },

  async delete(id: string): Promise<void> {
    writeAll(readAll().filter((c) => c.id !== id))
  },
}
