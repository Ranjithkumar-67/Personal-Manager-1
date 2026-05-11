import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Notes Store
export interface Note {
  id: string
  title: string
  content: string
  category: 'Official' | 'Personal'
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

interface NoteState {
  notes: Note[]
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'isPinned'>) => Promise<void>
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  togglePin: (id: string) => Promise<void>
  loadNotes: () => Promise<void>
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  
  addNote: async (note) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    const updated = [...get().notes, newNote]
    set({ notes: updated })
    await AsyncStorage.setItem('notes', JSON.stringify(updated))
  },
  
  updateNote: async (id, updates) => {
    const updated = get().notes.map(note => 
      note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
    )
    set({ notes: updated })
    await AsyncStorage.setItem('notes', JSON.stringify(updated))
  },
  
  deleteNote: async (id) => {
    const updated = get().notes.filter(note => note.id !== id)
    set({ notes: updated })
    await AsyncStorage.setItem('notes', JSON.stringify(updated))
  },
  
  togglePin: async (id) => {
    const updated = get().notes.map(note => 
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    )
    set({ notes: updated })
    await AsyncStorage.setItem('notes', JSON.stringify(updated))
  },
  
  loadNotes: async () => {
    const data = await AsyncStorage.getItem('notes')
    if (data) {
      set({ notes: JSON.parse(data) })
    }
  },
}))

// Goals Store
export interface Goal {
  id: string
  title: string
  description: string
  type: 'Short-term' | 'Long-term'
  startDate: string
  endDate: string
  progress: number
  milestones: string[]
  notes: string
}

interface GoalState {
  goals: Goal[]
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
  updateProgress: (id: string, progress: number) => Promise<void>
  loadGoals: () => Promise<void>
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  
  addGoal: async (goal) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
    }
    
    const updated = [...get().goals, newGoal]
    set({ goals: updated })
    await AsyncStorage.setItem('goals', JSON.stringify(updated))
  },
  
  updateGoal: async (id, updates) => {
    const updated = get().goals.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    )
    set({ goals: updated })
    await AsyncStorage.setItem('goals', JSON.stringify(updated))
  },
  
  deleteGoal: async (id) => {
    const updated = get().goals.filter(goal => goal.id !== id)
    set({ goals: updated })
    await AsyncStorage.setItem('goals', JSON.stringify(updated))
  },
  
  updateProgress: async (id, progress) => {
    const updated = get().goals.map(goal => 
      goal.id === id ? { ...goal, progress } : goal
    )
    set({ goals: updated })
    await AsyncStorage.setItem('goals', JSON.stringify(updated))
  },
  
  loadGoals: async () => {
    const data = await AsyncStorage.getItem('goals')
    if (data) {
      set({ goals: JSON.parse(data) })
    }
  },
}))
