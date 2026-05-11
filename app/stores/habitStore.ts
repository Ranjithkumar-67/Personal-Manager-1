import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface Habit {
  id: string
  name: string
  category: 'Learning' | 'Growth' | 'Investment' | 'SIP' | 'Loan' | 'Fitness' | 'Productivity' | 'Custom'
  frequency: 'Daily' | 'Weekly' | 'Monthly'
  completedDates: string[]
  createdAt: string
  streak: number
}

interface HabitState {
  habits: Habit[]
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt' | 'streak'>) => Promise<void>
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  toggleHabit: (id: string, date: string) => Promise<void>
  loadHabits: () => Promise<void>
  calculateStreak: (id: string) => number
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  
  addHabit: async (habit) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      completedDates: [],
      createdAt: new Date().toISOString(),
      streak: 0,
    }
    
    const updated = [...get().habits, newHabit]
    set({ habits: updated })
    await AsyncStorage.setItem('habits', JSON.stringify(updated))
  },
  
  updateHabit: async (id, updates) => {
    const updated = get().habits.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    )
    set({ habits: updated })
    await AsyncStorage.setItem('habits', JSON.stringify(updated))
  },
  
  deleteHabit: async (id) => {
    const updated = get().habits.filter(habit => habit.id !== id)
    set({ habits: updated })
    await AsyncStorage.setItem('habits', JSON.stringify(updated))
  },
  
  toggleHabit: async (id, date) => {
    const updated = get().habits.map(habit => {
      if (habit.id === id) {
        const completedDates = habit.completedDates.includes(date)
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date]
        
        const streak = get().calculateStreak(id)
        
        return { ...habit, completedDates, streak }
      }
      return habit
    })
    
    set({ habits: updated })
    await AsyncStorage.setItem('habits', JSON.stringify(updated))
  },
  
  loadHabits: async () => {
    const data = await AsyncStorage.getItem('habits')
    if (data) {
      set({ habits: JSON.parse(data) })
    }
  },
  
  calculateStreak: (id) => {
    const habit = get().habits.find(h => h.id === id)
    if (!habit || habit.completedDates.length === 0) return 0
    
    const sorted = [...habit.completedDates].sort().reverse()
    let streak = 0
    let currentDate = new Date()
    
    for (const dateStr of sorted) {
      const date = new Date(dateStr)
      const diffDays = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === streak) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  },
}))
