import React, { useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { GlassCard } from '../components/GlassCard'
import { colors, spacing, typography } from '../theme'
import { useExpenseStore } from '../stores/expenseStore'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'

const { width } = Dimensions.get('window')

export const DashboardScreen = () => {
  const { loadExpenses, getTodayTotal, getMonthTotal, expenses } = useExpenseStore()

  useEffect(() => {
    loadExpenses()
  }, [])

  const todaySpent = getTodayTotal()
  const monthSpent = getMonthTotal()
  const monthlyBudget = 30000
  const remaining = monthlyBudget - monthSpent

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    if (hour < 22) return 'Good Evening'
    return 'Good Night'
  }

  const getCategoryTotals = () => {
    const totals: Record<string, number> = {}
    expenses.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount
    })
    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([name, amount], idx) => ({
        name,
        amount: amount.toString(),
        color: [colors.neon.orange, colors.neon.blue, colors.neon.purple, colors.neon.pink][idx]
      }))
  }

  const topCategories = getCategoryTotals()

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>Personal Manager</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Icon name="person-circle-outline" size={50} color={colors.neon.blue} />
            </TouchableOpacity>
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Today's Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹{todaySpent.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Spent Today</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.neon.green }]}>
                ₹{remaining.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Monthly Budget</Text>
            <Text style={styles.percentage}>{Math.round((monthSpent / monthlyBudget) * 100)}%</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <LinearGradient
                colors={[colors.neon.blue, colors.neon.teal]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBar, { width: `${Math.min((monthSpent / monthlyBudget) * 100, 100)}%` }]}
              />
            </View>
          </View>
          <View style={styles.budgetInfo}>
            <Text style={styles.budgetText}>₹{monthSpent.toLocaleString()} of ₹{monthlyBudget.toLocaleString()}</Text>
            <Text style={styles.budgetRemaining}>₹{remaining.toLocaleString()} left</Text>
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionItem}>
              <LinearGradient
                colors={action.gradient}
                style={styles.actionGradient}
              >
                <Icon name={action.icon} size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {topCategories.length > 0 && (
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>Top Categories</Text>
            {topCategories.map((cat, idx) => (
              <View key={idx} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </View>
                <Text style={styles.categoryAmount}>₹{parseFloat(cat.amount).toLocaleString()}</Text>
              </View>
            ))}
          </GlassCard>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const quickActions = [
  { icon: 'add-circle', label: 'Expense', gradient: [colors.neon.blue, colors.neon.teal] },
  { icon: 'checkbox', label: 'Task', gradient: [colors.neon.purple, colors.neon.pink] },
  { icon: 'document', label: 'Note', gradient: [colors.neon.orange, colors.neon.yellow] },
  { icon: 'trophy', label: 'Goal', gradient: [colors.neon.green, colors.neon.teal] },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
  },
  welcomeCard: {
    marginBottom: spacing.md,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  userName: {
    ...typography.title,
    color: colors.text.primary,
  },
  profileButton: {
    padding: 4,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.heading,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  percentage: {
    ...typography.heading,
    color: colors.neon.blue,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.subtitle,
    color: colors.neon.blue,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressContainer: {
    marginBottom: spacing.sm,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  budgetRemaining: {
    ...typography.caption,
    color: colors.neon.green,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.md,
  },
  actionItem: {
    width: (width - spacing.md * 2 - spacing.xs * 6) / 4,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },
  actionGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  categoryName: {
    ...typography.body,
    color: colors.text.primary,
  },
  categoryAmount: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '600',
  },
})
