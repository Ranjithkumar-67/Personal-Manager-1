import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native'
import { GlassCard } from '../components/GlassCard'
import { colors, spacing, typography } from '../theme'
import { useNoteStore } from '../stores/noteGoalStore'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'

export const NotesScreen = () => {
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<'Official' | 'Personal'>('Personal')
  const { notes, loadNotes, addNote, togglePin } = useNoteStore()

  useEffect(() => {
    loadNotes()
  }, [])

  const handleAdd = async () => {
    if (!title) return
    await addNote({ title, content, category })
    setTitle('')
    setContent('')
    setShowModal(false)
  }

  const pinnedNotes = notes.filter(n => n.isPinned)
  const regularNotes = notes.filter(n => !n.isPinned)

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {pinnedNotes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Pinned</Text>
            {pinnedNotes.map(note => (
              <GlassCard key={note.id} style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <Text style={styles.noteTitle}>{note.title}</Text>
                  <TouchableOpacity onPress={() => togglePin(note.id)}>
                    <Icon name="pin" size={20} color={colors.neon.yellow} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.noteContent} numberOfLines={3}>{note.content}</Text>
                <Text style={styles.noteDate}>{new Date(note.updatedAt).toLocaleDateString()}</Text>
              </GlassCard>
            ))}
          </>
        )}

        <Text style={styles.sectionTitle}>All Notes</Text>
        {regularNotes.map(note => (
          <GlassCard key={note.id} style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <View>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.noteCategory}>{note.category}</Text>
              </View>
              <TouchableOpacity onPress={() => togglePin(note.id)}>
                <Icon name="pin-outline" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.noteContent} numberOfLines={3}>{note.content}</Text>
            <Text style={styles.noteDate}>{new Date(note.updatedAt).toLocaleDateString()}</Text>
          </GlassCard>
        ))}

        {notes.length === 0 && (
          <GlassCard>
            <View style={styles.empty}>
              <Icon name="document-text-outline" size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyText}>No notes yet</Text>
            </View>
          </GlassCard>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <LinearGradient colors={[colors.neon.orange, colors.neon.yellow]} style={styles.fabGradient}>
          <Icon name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Note</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Note title"
              placeholderTextColor={colors.text.tertiary}
              value={title}
              onChangeText={setTitle}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write your note..."
              placeholderTextColor={colors.text.tertiary}
              value={content}
              onChangeText={setContent}
              multiline
            />

            <View style={styles.buttonRow}>
              {(['Official', 'Personal'] as const).map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[styles.optionBtn, category === c && { backgroundColor: colors.neon.orange }]}
                >
                  <Text style={styles.optionText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={handleAdd}>
              <LinearGradient colors={[colors.neon.orange, colors.neon.yellow]} style={styles.submitBtn}>
                <Text style={styles.submitText}>Save Note</Text>
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
  noteCard: { marginBottom: spacing.md },
  noteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  noteTitle: { ...typography.heading, color: colors.text.primary },
  noteCategory: { ...typography.caption, color: colors.text.tertiary, marginTop: 2 },
  noteContent: { ...typography.body, color: colors.text.secondary, marginBottom: spacing.sm },
  noteDate: { ...typography.caption, color: colors.text.tertiary },
  empty: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyText: { ...typography.heading, color: colors.text.secondary, marginTop: spacing.md },
  fab: { position: 'absolute', right: spacing.md, bottom: spacing.xl },
  fabGradient: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modal: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  modalTitle: { ...typography.title, color: colors.text.primary },
  input: { backgroundColor: colors.glass.light, borderRadius: 12, padding: spacing.md, ...typography.body, color: colors.text.primary, marginBottom: spacing.md },
  textArea: { height: 150, textAlignVertical: 'top' },
  buttonRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  optionBtn: { flex: 1, padding: spacing.sm, borderRadius: 8, backgroundColor: colors.glass.light, alignItems: 'center' },
  optionText: { ...typography.caption, color: '#fff' },
  submitBtn: { padding: spacing.md, borderRadius: 12, alignItems: 'center' },
  submitText: { ...typography.heading, color: '#fff' },
})
