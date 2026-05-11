import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native'
import { GlassCard } from '../components/GlassCard'
import { colors, spacing, typography } from '../theme'
import { useTaskStore } from '../stores/taskStore'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'

export const TasksScreen = () => {
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium')
  const [category, setCategory] = useState<'Official' | 'Personal'>('Personal')
  
  const { tasks, loadTasks, toggleTask, addTask } = useTaskStore()

  useEffect(() => {
    loadTasks()
  }, [])

  const handleAdd = async () => {
    if (!title) return
    await addTask({
      title,
      description,
      priority,
      category,
      dueDate: new Date().toISOString().split('T')[0],
    })
    setTitle('')
    setDescription('')
    setShowModal(false)
  }

  const getPriorityColor = (p: string) => {
    if (p === 'High') return colors.neon.pink
    if (p === 'Medium') return colors.neon.orange
    return colors.neon.green
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {['Official', 'Personal'].map(cat => {
          const catTasks = tasks.filter(t => t.category === cat)
          if (catTasks.length === 0) return null
          
          return (
            <View key={cat}>
              <Text style={styles.categoryTitle}>{cat} Tasks</Text>
              <GlassCard style={styles.card}>
                {catTasks.map(task => (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.taskItem}
                    onPress={() => toggleTask(task.id)}
                  >
                    <View style={styles.taskLeft}>
                      <View style={[
                        styles.checkbox,
                        task.completed && styles.checkboxChecked
                      ]}>
                        {task.completed && <Icon name="checkmark" size={18} color="#fff" />}
                      </View>
                      <View style={styles.taskContent}>
                        <Text style={[
                          styles.taskTitle,
                          task.completed && styles.taskCompleted
                        ]}>
                          {task.title}
                        </Text>
                        {task.description && (
                          <Text style={styles.taskDesc}>{task.description}</Text>
                        )}
                        <View style={styles.taskMeta}>
                          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                            <Text style={styles.priorityText}>{task.priority}</Text>
                          </View>
                          <Text style={styles.taskDate}>{task.dueDate}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </GlassCard>
            </View>
          )
        })}

        {tasks.length === 0 && (
          <GlassCard>
            <View style={styles.empty}>
              <Icon name="checkbox-outline" size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyText}>No tasks yet</Text>
            </View>
          </GlassCard>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <LinearGradient colors={[colors.neon.purple, colors.neon.pink]} style={styles.fabGradient}>
          <Icon name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Task</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Task title"
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
              {(['High', 'Medium', 'Low'] as const).map(p => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPriority(p)}
                  style={[styles.optionBtn, priority === p && { backgroundColor: getPriorityColor(p) }]}
                >
                  <Text style={styles.optionText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={handleAdd}>
              <LinearGradient colors={[colors.neon.purple, colors.neon.pink]} style={styles.submitBtn}>
                <Text style={styles.submitText}>Add Task</Text>
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
  categoryTitle: { ...typography.heading, color: colors.text.primary, marginBottom: spacing.sm, marginTop: spacing.md },
  card: { marginBottom: spacing.md },
  taskItem: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  taskLeft: { flexDirection: 'row', alignItems: 'flex-start' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neon.blue,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: colors.neon.blue },
  taskContent: { flex: 1 },
  taskTitle: { ...typography.body, color: colors.text.primary },
  taskCompleted: { textDecorationLine: 'line-through', color: colors.text.tertiary },
  taskDesc: { ...typography.caption, color: colors.text.secondary, marginTop: 4 },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  priorityText: { ...typography.caption, color: '#fff', fontSize: 11, fontWeight: '600' },
  taskDate: { ...typography.caption, color: colors.text.tertiary, fontSize: 11 },
  empty: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyText: { ...typography.heading, color: colors.text.secondary, marginTop: spacing.md },
  fab: { position: 'absolute', right: spacing.md, bottom: spacing.xl },
  fabGradient: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modal: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  modalTitle: { ...typography.title, color: colors.text.primary },
  input: {
    backgroundColor: colors.glass.light,
    borderRadius: 12,
    padding: spacing.md,
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  buttonRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  optionBtn: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.glass.light,
    alignItems: 'center',
  },
  optionText: { ...typography.caption, color: '#fff' },
  submitBtn: { padding: spacing.md, borderRadius: 12, alignItems: 'center' },
  submitText: { ...typography.heading, color: '#fff' },
})
