import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { BlurView } from '@react-native-community/blur'
import { colors, spacing } from '../theme'

interface GlassCardProps {
  children: React.ReactNode
  style?: ViewStyle
  intensity?: number
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  style, 
  intensity = 10 
}) => {
  return (
    <View style={[styles.container, style]}>
      <BlurView
        style={styles.blur}
        blurType="dark"
        blurAmount={intensity}
        reducedTransparencyFallbackColor={colors.glass.dark}
      />
      <View style={styles.content}>{children}</View>
      <View style={styles.border} />
      <View style={styles.glow} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.glass.dark,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: spacing.md,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    shadowColor: colors.neon.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
})
