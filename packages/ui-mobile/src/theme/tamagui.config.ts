import { createTamagui, type TamaguiInternalConfig } from 'tamagui';

export const tamaguiConfig: TamaguiInternalConfig = createTamagui({
  themes: {
    light: {
      background: '#ffffff',
      color: '#111111',
      primary: '#2563eb',
      muted: '#f1f5f9'
    },
    dark: {
      background: '#0f172a',
      color: '#e2e8f0',
      primary: '#60a5fa',
      muted: '#1e293b'
    }
  },
  tokens: {
    color: {
      primary: '#2563eb'
    },
    radius: {
      sm: 4,
      md: 8,
      lg: 16
    },
    space: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24
    }
  },
  shorthands: {}
});


