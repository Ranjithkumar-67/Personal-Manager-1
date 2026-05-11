import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { colors, spacing, typography } from '../theme'
import { useAuthStore } from '../stores/authStore'
import Icon from 'react-native-vector-icons/Ionicons'

export const LoginScreen = () => {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuthStore()

  const handleLogin = async () => {
    await login(userId, password)
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.neon.blue, colors.neon.purple]}
        style={styles.header}
      >
        <Icon name="shield-checkmark" size={80} color="#fff" />
        <Text style={styles.title}>Personal Manage Pro</Text>
        <Text style={styles.subtitle}>Your Premium Life Manager</Text>
      </LinearGradient>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Icon name="person-outline" size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.input}
            placeholder="User ID"
            placeholderTextColor={colors.text.tertiary}
            value={userId}
            onChangeText={setUserId}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.text.tertiary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity onPress={handleLogin}>
          <LinearGradient
            colors={[colors.neon.blue, colors.neon.teal]}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.faceIdButton}>
          <Icon name="finger-print" size={40} color={colors.neon.blue} />
          <Text style={styles.faceIdText}>Use Face ID</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  title: { ...typography.title, color: '#fff', marginTop: spacing.md },
  subtitle: { ...typography.body, color: 'rgba(255,255,255,0.8)', marginTop: spacing.xs },
  form: { padding: spacing.xl },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass.dark,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    paddingVertical: spacing.md,
    marginLeft: spacing.sm,
  },
  button: {
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: { ...typography.heading, color: '#fff' },
  faceIdButton: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  faceIdText: { ...typography.body, color: colors.neon.blue, marginTop: spacing.sm },
})
