export const colors = {
  glass: {
    dark: 'rgba(18, 18, 18, 0.85)',
    medium: 'rgba(28, 28, 30, 0.88)',
    light: 'rgba(44, 44, 46, 0.92)',
    ultra: 'rgba(58, 58, 60, 0.95)',
  },
  neon: {
    blue: '#0A84FF',
    purple: '#BF5AF2',
    pink: '#FF375F',
    teal: '#5AC8FA',
    green: '#30D158',
    orange: '#FF9F0A',
    yellow: '#FFD60A',
  },
  background: '#000000',
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    tertiary: 'rgba(255, 255, 255, 0.5)',
  },
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const typography = {
  title: { fontSize: 34, fontWeight: '700' as const, letterSpacing: 0.4 },
  subtitle: { fontSize: 28, fontWeight: '600' as const },
  heading: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 17, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
}
