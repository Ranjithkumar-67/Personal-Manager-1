import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { GlassCard } from '../components/GlassCard'
import { AddExpenseModal } from '../components/AddExpenseModal'
import { colors, spacing, typography } from '../theme'
import { useExpenseStore } from '../stores/expenseStore'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'

export const MoneyScreen = () => {
  const [showAddExpense, setShowAddExpense] = useState(false)
  const { expenses, loadExpenses, getTodayTotal, getMonthTotal } = useExpenseStore()

  useEffect(() => {
    loadExpenses()
  }, [])

  const todayTotal = getTodayTotal()
  const monthTotal = getMonthTotal()
  const monthlyBudget = 30000

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Morning Food': 'sunny',
      'Afternoon Food': 'restaurant',
      'Night Food': 'moon',
      'Bus Travel': 'bus',
      'Chennai Local Travel': 'train',
      'Auto': 'car',
      'Shopping': 'cart',
      'Entertainment': 'game-controller',
      'Medical': 'medical',
      'Fuel': 'water',
      'Recharge': 'phone-portrait',
    }
    return icons[category] || 'cash'
  }

  const getCategoryColor = (category: string) => {
    const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const colorOptions = [colors.neon.orange, colors.neon.blue, colors.neon.purple, colors.neon.pink, colors.neon.teal, colors.neon.green]
    return colorOptions[hash % colorOptions.length]
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>This Month</Text>
          <View style={styles.amountRow}>
            <View>
              <Text style={styles.label}>Spent</Text>
              <Text style={[styles.amount, { color: colors.neon.pink }]}>₹{monthTotal.toLocaleString()}</Text>
            </View>
            <View>
              <Text style={styles.label}>Budget</Text>
              <Text style={[styles.amount, { color: colors.neon.green }]}>₹{monthlyBudget.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <LinearGradient
                colors={[colors.neon.blue, colors.neon.teal]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBar, { width: `${Math.min((monthTotal / monthlyBudget) * 100, 100)}%` }]}
              />
            </View>
            <Text style={styles.percentage}>{Math.round((monthTotal / monthlyBudget) * 100)}%</Text>
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Today: ₹{todayTotal.toLocaleString()}</Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Recent Expenses</Text>
          {expenses.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="wallet-outline" size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyText}>No expenses yet</Text>
              <Text style={styles.emptySubtext}>Tap + to add your first expense</Text>
            </View>
          ) : (
            expenses.slice(0, 10).reverse().map((exp) => (
              <View key={exp.id} style={styles.expenseItem}>
                <View style={styles.expenseLeft}>
                  <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(exp.category) }]}>
                    <Icon name={getCategoryIcon(exp.category)} size={20} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.expenseTitle}>{exp.title}</Text>
                    <Text style={styles.expenseCategory}>{exp.category} • {exp.paymentMethod}</Text>
                    <Text style={styles.expenseTime}>{exp.date} {exp.time}</Text>
                  </View>
                </View>
                <Text style={styles.expenseAmount}>-₹{exp.amount.toLocaleString()}</Text>
              </View>
            ))
          )}
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddExpense(true)}
      >
        <LinearGradient
          colors={[colors.neon.blue, colors.neon.teal]}
          style={styles.fabGradient}
        >
          <Icon name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <AddExpenseModal 
        visible={showAddExpense}
        onClose={() => setShowAddExpense(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md },
  card: { marginBottom: spacing.md },
  cardTitle: { ...typography.heading, color: colors.text.primary, marginBottom: spacing.md },
  amountRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.md },
  label: { ...typography.caption, color: colors.text.secondary, marginBottom: 4 },
  amount: { ...typography.title, fontWeight: '700' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', borderRadius: 4 },
  percentage: { ...typography.body, color: colors.neon.blue, fontWeight: '600' },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  expenseLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  expenseTitle: { ...typography.body, color: colors.text.primary },
  expenseCategory: { ...typography.caption, color: colors.text.secondary, marginTop: 2 },
  expenseTime: { ...typography.caption, color: colors.text.tertiary, fontSize: 11, marginTop: 2 },
  expenseAmount: { ...typography.heading, color: colors.neon.pink },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyText: { ...typography.heading, color: colors.text.secondary, marginTop: spacing.md },
  emptySubtext: { ...typography.caption, color: colors.text.tertiary, marginTop: spacing.xs },
  fab: { position: 'absolute', right: spacing.md, bottom: spacing.xl },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.neon.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
})
