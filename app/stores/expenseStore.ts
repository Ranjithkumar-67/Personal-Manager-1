import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface Expense {
  id: string
  title: string
  amount: number
  category: string
  description: string
  date: string
  time: string
  paymentMethod: 'Cash' | 'Card' | 'UPI'
  sourceAccount: string
}

interface ExpenseState {
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  loadExpenses: () => Promise<void>
  getExpensesByCategory: (category: string) => Expense[]
  getTodayTotal: () => number
  getMonthTotal: () => number
}

export const EXPENSE_CATEGORIES = [
  'Morning Food', 'Afternoon Food', 'Night Food',
  'Bus Travel', 'Chennai Local Travel', 'Monthly Train Pass', 'Auto',
  'EMI Mobile', 'EMI Education Loan',
  'SIP', 'Stocks', 'Emergency Fund', 'Investments',
  'Shopping', 'Entertainment', 'Medical', 'Fuel', 'Recharge', 'Others'
]

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  
  addExpense: async (expense) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    }
    
    const updated = [...get().expenses, newExpense]
    set({ expenses: updated })
    await AsyncStorage.setItem('expenses', JSON.stringify(updated))
  },
  
  updateExpense: async (id, updates) => {
    const updated = get().expenses.map(exp => 
      exp.id === id ? { ...exp, ...updates } : exp
    )
    set({ expenses: updated })
    await AsyncStorage.setItem('expenses', JSON.stringify(updated))
  },
  
  deleteExpense: async (id) => {
    const updated = get().expenses.filter(exp => exp.id !== id)
    set({ expenses: updated })
    await AsyncStorage.setItem('expenses', JSON.stringify(updated))
  },
  
  loadExpenses: async () => {
    const data = await AsyncStorage.getItem('expenses')
    if (data) {
      set({ expenses: JSON.parse(data) })
    }
  },
  
  getExpensesByCategory: (category) => {
    return get().expenses.filter(exp => exp.category === category)
  },
  
  getTodayTotal: () => {
    const today = new Date().toISOString().split('T')[0]
    return get().expenses
      .filter(exp => exp.date === today)
      .reduce((sum, exp) => sum + exp.amount, 0)
  },
  
  getMonthTotal: () => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()
    
    return get().expenses
      .filter(exp => {
        const expDate = new Date(exp.date)
        return expDate.getMonth() === month && expDate.getFullYear() === year
      })
      .reduce((sum, exp) => sum + exp.amount, 0)
  },
}))
