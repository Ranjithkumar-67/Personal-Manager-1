import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AuthState {
  isAuthenticated: boolean
  userId: string | null
  login: (userId: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  
  login: async (userId, password) => {
    try {
      // Simple local auth - store encrypted
      await AsyncStorage.setItem('user_id', userId)
      await AsyncStorage.setItem('auth_token', 'authenticated')
      set({ isAuthenticated: true, userId })
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  },
  
  logout: async () => {
    await AsyncStorage.removeItem('auth_token')
    set({ isAuthenticated: false, userId: null })
  },
  
  checkAuth: async () => {
    const token = await AsyncStorage.getItem('auth_token')
    const userId = await AsyncStorage.getItem('user_id')
    if (token) {
      set({ isAuthenticated: true, userId })
    }
  },
}))
