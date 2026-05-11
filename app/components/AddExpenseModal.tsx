import React, { useState } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native'
import { GlassCard } from './GlassCard'
import { colors, spacing, typography } from '../theme'
import { EXPENSE_CATEGORIES, useExpenseStore } from '../stores/expenseStore'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'

interface AddExpenseModalProps {
  visible: boolean
  onClose: () => void
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ visible, onClose }) => {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI'>('Card')
  const [sourceAccount, setSourceAccount] = useState('Bank 1')
  
  const { addExpense } = useExpenseStore()

  const handleSubmit = async () => {
    if (!title || !amount) return
    
    await addExpense({
      title,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      paymentMethod,
      sourceAccount,
    })
    
    // Reset form
    setTitle('')
    setAmount('')
    setDescription('')
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <GlassCard style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Add Expense</Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close-circle" size={32} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Lunch, Coffee, etc."
                  placeholderTextColor={colors.text.tertiary}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Amount (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={colors.text.tertiary}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipContainer}>
                    {EXPENSE_CATEGORIES.slice(0, 8).map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setCategory(cat)}
                        style={[
                          styles.chip,
                          category === cat && styles.chipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            category === cat && styles.chipTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Payment Method</Text>
                <View style={styles.buttonRow}>
                  {(['Cash', 'Card', 'UPI'] as const).map((method) => (
                    <TouchableOpacity
                      key={method}
                      onPress={() => setPaymentMethod(method)}
                      style={[
                        styles.optionButton,
                        paymentMethod === method && styles.optionButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          paymentMethod === method && styles.optionTextActive,
                        ]}
                      >
                        {method}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add notes..."
                  placeholderTextColor={colors.text.tertiary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity onPress={handleSubmit}>
                <LinearGradient
                  colors={[colors.neon.blue, colors.neon.teal]}
                  style={styles.submitButton}
                >
                  <Icon name="checkmark-circle" size={24} color="#fff" />
                  <Text style={styles.submitText}>Add Expense</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </GlassCard>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '90%',
  },
  card: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.title,
    color: colors.text.primary,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.glass.light,
    borderRadius: 12,
    padding: spacing.md,
    ...typography.body,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  chipContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.glass.light,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chipActive: {
    backgroundColor: colors.neon.blue,
    borderColor: colors.neon.blue,
  },
  chipText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.glass.light,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionButtonActive: {
    backgroundColor: colors.neon.purple,
    borderColor: colors.neon.purple,
  },
  optionText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 16,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  submitText: {
    ...typography.heading,
    color: '#fff',
  },
})
