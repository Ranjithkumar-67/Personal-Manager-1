import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar, View } from 'react-native'
import { colors } from './theme'

// Screens
import { DashboardScreen } from './screens/DashboardScreen'
import { MoneyScreen } from './screens/MoneyScreen'
import { TasksScreen } from './screens/TasksScreen'
import { NotesScreen } from './screens/NotesScreen'
import { GoalsScreen } from './screens/GoalsScreen'
import { HabitScreen } from './screens/HabitScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { LoginScreen } from './screens/LoginScreen'
import { useAuthStore } from './stores/authStore'

// Icons
import Icon from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator()

const TabIcon = ({ name, color, size }: any) => (
  <Icon name={name} size={size} color={color} />
)

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.glass.dark,
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          height: 90,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.neon.blue,
        tabBarInactiveTintColor: colors.text.tertiary,
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: { fontWeight: '600', fontSize: 20 },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarIcon: (props) => <TabIcon name="grid-outline" {...props} />,
        }}
      />
      <Tab.Screen 
        name="Money" 
        component={MoneyScreen}
        options={{
          tabBarIcon: (props) => <TabIcon name="wallet-outline" {...props} />,
        }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen}
        options={{
          tabBarIcon: (props) => <TabIcon name="checkbox-outline" {...props} />,
        }}
      />
      <Tab.Screen 
        name="Notes" 
        component={NotesScreen}
        options={{
          tabBarIcon: (props) => <TabIcon name="document-text-outline" {...props} />,
        }}
      />
      <Tab.Screen 
        name="Goals" 
        component={GoalsScreen}
        options={{
          tabBarIcon: (props) => <TabIcon name="trophy-outline" {...props} />,
        }}
      />
      <Tab.Screen 
        name="Habits" 
        component={HabitScreen}
        options={{
          tabBarIcon: (props) => <TabIcon name="calendar-outline" {...props} />,
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: (props) => <TabIcon name="settings-outline" {...props} />,
        }}
      />
    </Tab.Navigator>
  )
}

export function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <NavigationContainer>
        {isAuthenticated ? <MainTabs /> : <LoginScreen />}
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
