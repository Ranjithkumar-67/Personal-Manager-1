import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native'
import { GlassCard } from '../components/GlassCard'
import { colors, spacing, typography } from '../theme'
import { useGoalStore } from '../stores/noteGoalStore'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'

export const GoalsScreen = () => {
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'Short-term' | 'Long-term'>('Short-term')
  const { goals, loadGoals, addGoal, updateProgress } = useGoalStore()

  useEffect(() => {
    loadGoals()
  }, [])

  const handleAdd = async () => {
    if (!title) return
    const now = new Date()
    const end = new Date(now.setMonth(now.getMonth() + (type === 'Short-term' ? 3 : 12)))
    
    await addGoal({
      title,
      description,
      type,
      startDate: new Date().toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      progress: 0,
      milestones: [],
      notes: '',
    })
    setTitle('')
    setDescription('')
    setShowModal(false)
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {['Short-term', 'Long-term'].map(t => {
          const typeGoals = goals.filter(g => g.type === t)
          if (typeGoals.length === 0) return null
          
          return (
            <View key={t}>
              <Text style={styles.sectionTitle}>{t} Goals</Text>
              {typeGoals.map(goal => (
                <GlassCard key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalHeader}>
                    <View style={styles.iconBadge}>
                      <Icon name="trophy" size={24} color={colors.neon.green} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={styles.goalDesc}>{goal.description}</Text>
                    </View>
                  </View>

                  <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Progress</Text>
                      <Text style={styles.progressValue}>{goal.progress}%</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <LinearGradient
                        colors={[colors.neon.green, colors.neon.teal]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBar, { width: `${goal.progress}%` }]}
                      />
                    </View>
                  </View>

                  <View style={styles.dateRow}>
                    <Text style={styles.dateText}>Started: {goal.startDate}</Text>
                    <Text style={styles.dateText}>Target: {goal.endDate}</Text>
                  </View>
                </GlassCard>
              ))}
            </View>
          )
        })}

        {goals.length === 0 && (
          <GlassCard>
            <View style={styles.empty}>
              <Icon name="trophy-outline" size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyText}>No goals yet</Text>
            </View>
          </GlassCard>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <LinearGradient colors={[colors.neon.green, colors.neon.teal]} style={styles.fabGradient}>
          <Icon name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Goal</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Goal title"
              placeholderTextColor={colors.text.tertiary}
              value={title}
              onChangeText={setTitle}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              placeholderTextColor={colors.text.tertiary}
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <View style={styles.buttonRow}>
              {(['Short-term', 'Long-term'] as const).map(t => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  style={[styles.optionBtn, type === t && { backgroundColor: colors.neon.green }]}
                >
                  <Text style={styles.optionText}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={handleAdd}>
              <LinearGradient colors={[colors.neon.green, colors.neon.teal]} style={styles.submitBtn}>
                <Text style={styles.submitText}>Create Goal</Text>
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
  sectionTitle: { ...typography.heading, color: colors.text.primary, marginBottom: spacing.sm, marginTop: spacing.sm },
  goalCard: { marginBottom: spacing.md },
  goalHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  iconBadge: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.glass.light, justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm },
  goalTitle: { ...typography.heading, color: colors.text.primary },
  goalDesc: { ...typography.body, color: colors.text.secondary, marginTop: 4 },
  progressSection: { marginBottom: spacing.md },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  progressLabel: { ...typography.caption, color: colors.text.secondary },
  progressValue: { ...typography.caption, color: colors.neon.green, fontWeight: '600' },
  progressTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 4 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dateText: { ...typography.caption, color: colors.text.tertiary },
  empty: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyText: { ...typography.heading, color: colors.text.secondary, marginTop: spacing.md },
  fab: { position: 'absolute', right: spacing.md, bottom: spacing.xl },
  fabGradient: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modal: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  modalTitle: { ...typography.title, color: colors.text.primary },
  input: { backgroundColor: colors.glass.light, borderRadius: 12, padding: spacing.md, ...typography.body, color: colors.text.primary, marginBottom: spacing.md },
  textArea: { height: 80, textAlignVertical: 'top' },
  buttonRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  optionBtn: { flex: 1, padding: spacing.sm, borderRadius: 8, backgroundColor: colors.glass.light, alignItems: 'center' },
  optionText: { ...typography.caption, color: '#fff' },
  submitBtn: { padding: spacing.md, borderRadius: 12, alignItems: 'center' },
  submitText: { ...typography.heading, color: '#fff' },
})
