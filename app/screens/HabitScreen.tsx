import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native'
import { GlassCard } from '../components/GlassCard'
import { colors, spacing, typography } from '../theme'
import { useHabitStore } from '../stores/habitStore'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'

export const HabitScreen = () => {
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<any>('Productivity')
  const { habits, loadHabits, addHabit, toggleHabit } = useHabitStore()

  useEffect(() => {
    loadHabits()
  }, [])

  const handleAdd = async () => {
    if (!name) return
    await addHabit({ name, category, frequency: 'Daily' })
    setName('')
    setShowModal(false)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Today's Habits</Text>
          {habits.map(habit => {
            const completedToday = habit.completedDates.includes(today)
            return (
              <TouchableOpacity
                key={habit.id}
                style={styles.habitItem}
                onPress={() => toggleHabit(habit.id, today)}
              >
                <View style={styles.habitLeft}>
                  <View style={[styles.checkbox, completedToday && styles.checkboxChecked]}>
                    {completedToday && <Icon name="checkmark" size={18} color="#fff" />}
                  </View>
                  <View>
                    <Text style={styles.habitName}>{habit.name}</Text>
                    <Text style={styles.habitCategory}>{habit.category}</Text>
                  </View>
                </View>
                <View style={styles.streakBadge}>
                  <Icon name="flame" size={16} color={colors.neon.orange} />
                  <Text style={styles.streakText}>{habit.streak}</Text>
                </View>
              </TouchableOpacity>
            )
          })}

          {habits.length === 0 && (
            <View style={styles.empty}>
              <Icon name="calendar-outline" size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyText}>No habits yet</Text>
            </View>
          )}
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <LinearGradient colors={[colors.neon.orange, colors.neon.pink]} style={styles.fabGradient}>
          <Icon name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Habit</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Habit name"
              placeholderTextColor={colors.text.tertiary}
              value={name}
              onChangeText={setName}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {['Learning', 'Growth', 'Investment', 'Fitness', 'Productivity'].map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[styles.categoryChip, category === c && { backgroundColor: colors.neon.orange }]}
                >
                  <Text style={styles.categoryText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity onPress={handleAdd}>
              <LinearGradient colors={[colors.neon.orange, colors.neon.pink]} style={styles.submitBtn}>
                <Text style={styles.submitText}>Create Habit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md },
  card: { marginBottom: spacing.md },
  cardTitle: { ...typography.heading, color: colors.text.primary, marginBottom: spacing.md },
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  habitLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.neon.blue, marginRight: spacing.sm, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: colors.neon.blue },
  habitName: { ...typography.body, color: colors.text.primary },
  habitCategory: { ...typography.caption, color: colors.text.secondary, marginTop: 2 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.glass.light, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: 12 },
  streakText: { ...typography.caption, color: colors.neon.orange, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyText: { ...typography.heading, color: colors.text.secondary, marginTop: spacing.md },
  fab: { position: 'absolute', right: spacing.md, bottom: spacing.xl },
  fabGradient: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modal: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  modalTitle: { ...typography.title, color: colors.text.primary },
  input: { backgroundColor: colors.glass.light, borderRadius: 12, padding: spacing.md, ...typography.body, color: colors.text.primary, marginBottom: spacing.md },
  categoryScroll: { marginBottom: spacing.md },
  categoryChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20, backgroundColor: colors.glass.light, marginRight: spacing.sm },
  categoryText: { ...typography.caption, color: '#fff' },
  submitBtn: { padding: spacing.md, borderRadius: 12, alignItems: 'center', marginTop: spacing.md },
  submitText: { ...typography.heading, color: '#fff' },
})
