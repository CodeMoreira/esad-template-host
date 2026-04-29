/**
 * Modern Dark Mode Design Tokens
 */
export const Colors = {
  // Neutral
  black: '#000000',
  darker: '#0A0A0A',
  dark: '#121212',
  medium: '#1F1F1F',
  light: '#2C2C2C',
  white: '#FFFFFF',
  
  // Accents (Deep Slate & Navy)
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#00D2FF',
  
  // States
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  
  // Grays
  gray1: '#8E8E93',
  gray2: '#AEAEB2',
  gray3: '#C7C7CC',
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 20 },
};

export const Theme = {
  colors: Colors,
  spacing: Spacing,
  typography: Typography,
  radius: {
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
  }
};
