import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { GlassCard } from '../components/GlassCard'
import { colors, spacing, typography } from '../theme'
import { useAuthStore } from '../stores/authStore'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'

export const SettingsScreen = () => {
  const { logout } = useAuthStore()

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ])
  }

  const handleExport = () => {
    Alert.alert('Export Data', 'Export all data to Excel (Coming Soon)')
  }

  const handleBackup = () => {
    Alert.alert('Backup', 'Create local backup (Coming Soon)')
  }

  const settingSections = [
    {
      title: 'Account',
      items: [
        { icon: 'person', label: 'Profile', onPress: () => {} },
        { icon: 'finger-print', label: 'Face ID', onPress: () => {} },
        { icon: 'lock-closed', label: 'Security', onPress: () => {} },
      ]
    },
    {
      title: 'Data',
      items: [
        { icon: 'download', label: 'Export to Excel', onPress: handleExport },
        { icon: 'save', label: 'Backup Data', onPress: handleBackup },
        { icon: 'refresh', label: 'Restore Backup', onPress: () => {} },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'moon', label: 'Dark Mode', onPress: () => {} },
        { icon: 'notifications', label: 'Notifications', onPress: () => {} },
        { icon: 'language', label: 'Language', onPress: () => {} },
      ]
    },
    {
      title: 'About',
      items: [
        { icon: 'information-circle', label: 'App Version', subtitle: 'v1.0.0' },
        { icon: 'shield-checkmark', label: 'Privacy Policy', onPress: () => {} },
        { icon: 'document-text', label: 'Terms of Service', onPress: () => {} },
      ]
    },
  ]

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <GlassCard style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Icon name="person" size={40} color={colors.neon.blue} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Personal Manager</Text>
              <Text style={styles.profileEmail}>user@personalmangepro.app</Text>
            </View>
          </View>
        </GlassCard>

        {settingSections.map((section, idx) => (
          <View key={idx}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <GlassCard style={styles.card}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.settingItem}
                  onPress={item.onPress}
                  disabled={!item.onPress}
                >
                  <View style={styles.settingLeft}>
                    <View style={styles.iconContainer}>
                      <Icon name={item.icon} size={20} color={colors.neon.blue} />
                    </View>
                    <View>
                      <Text style={styles.settingLabel}>{item.label}</Text>
                      {item.subtitle && (
                        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                      )}
                    </View>
                  </View>
                  {item.onPress && (
                    <Icon name="chevron-forward" size={20} color={colors.text.tertiary} />
                  )}
                </TouchableOpacity>
              ))}
            </GlassCard>
          </View>
        ))}

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LinearGradient
            colors={[colors.neon.pink, colors.neon.orange]}
            style={styles.logoutGradient}
          >
            <Icon name="log-out" size={24} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md },
  profileCard: { marginBottom: spacing.md },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.glass.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  profileInfo: { flex: 1 },
  profileName: { ...typography.title, color: colors.text.primary, fontSize: 24 },
  profileEmail: { ...typography.body, color: colors.text.secondary, marginTop: 4 },
  sectionTitle: { ...typography.heading, color: colors.text.primary, marginBottom: spacing.sm, marginTop: spacing.md },
  card: { marginBottom: spacing.md },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.glass.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  settingLabel: { ...typography.body, color: colors.text.primary },
  settingSubtitle: { ...typography.caption, color: colors.text.tertiary, marginTop: 2 },
  logoutButton: { marginTop: spacing.md },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 16,
    gap: spacing.sm,
  },
  logoutText: { ...typography.heading, color: '#fff' },
})
