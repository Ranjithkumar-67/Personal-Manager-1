import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface Task {
  id: string
  title: string
  description: string
  category: 'Official' | 'Personal'
  priority: 'High' | 'Medium' | 'Low'
  dueDate: string
  dueTime?: string
  completed: boolean
  createdAt: string
}

interface TaskState {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  loadTasks: () => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  
  addTask: async (task) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
    }
    
    const updated = [...get().tasks, newTask]
    set({ tasks: updated })
    await AsyncStorage.setItem('tasks', JSON.stringify(updated))
  },
  
  updateTask: async (id, updates) => {
    const updated = get().tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    )
    set({ tasks: updated })
    await AsyncStorage.setItem('tasks', JSON.stringify(updated))
  },
  
  deleteTask: async (id) => {
    const updated = get().tasks.filter(task => task.id !== id)
    set({ tasks: updated })
    await AsyncStorage.setItem('tasks', JSON.stringify(updated))
  },
  
  toggleTask: async (id) => {
    const updated = get().tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    )
    set({ tasks: updated })
    await AsyncStorage.setItem('tasks', JSON.stringify(updated))
  },
  
  loadTasks: async () => {
    const data = await AsyncStorage.getItem('tasks')
    if (data) {
      set({ tasks: JSON.parse(data) })
    }
  },
}))
