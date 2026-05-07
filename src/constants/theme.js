export const DARK_COLORS = {
  surface: '#131313',
  surfaceDim: '#131313',
  surfaceBright: '#3a3939',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainer: '#201f1f',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerHighest: '#353534',
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#d2c5ab',
  inverseSurface: '#e5e2e1',
  inverseOnSurface: '#313030',
  outline: '#9a9078',
  outlineVariant: '#4e4632',
  surfaceTint: '#f1c100',
  primary: '#ffedc3',
  onPrimary: '#3d2f00',
  primaryContainer: '#ffcc00',
  onPrimaryContainer: '#6f5700',
  inversePrimary: '#745b00',
  secondary: '#c6c6c7',
  onSecondary: '#2f3131',
  secondaryContainer: '#454747',
  onSecondaryContainer: '#b4b5b5',
  tertiary: '#e9eeff',
  onTertiary: '#002e69',
  tertiaryContainer: '#bfd2ff',
  onTertiaryContainer: '#0056b8',
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
  primaryFixed: '#ffe08b',
  primaryFixedDim: '#f1c100',
  onPrimaryFixed: '#241a00',
  onPrimaryFixedVariant: '#584400',
  secondaryFixed: '#e2e2e2',
  secondaryFixedDim: '#c6c6c7',
  onSecondaryFixed: '#1a1c1c',
  onSecondaryFixedVariant: '#454747',
  tertiaryFixed: '#d8e2ff',
  tertiaryFixedDim: '#adc6ff',
  onTertiaryFixed: '#001a41',
  onTertiaryFixedVariant: '#004493',
  background: '#131313',
  onBackground: '#e5e2e1',
  surfaceVariant: '#353534',
};

export const LIGHT_COLORS = {
  ...DARK_COLORS, // fallback to dark if not defined
  background: '#f8f9fa',
  surface: '#ffffff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f8f9fa',
  surfaceContainer: '#f1f3f5',
  surfaceContainerHigh: '#e9ecef',
  surfaceContainerHighest: '#dee2e6',
  onSurface: '#212529',
  onSurfaceVariant: '#495057',
  // primaryContainer is yellow in both themes for brand consistency
  primaryContainer: '#ffcc00',
  onPrimaryContainer: '#212529',
  outline: '#ced4da',
  outlineVariant: '#adb5bd',
  surfaceVariant: '#e9ecef',
};

// Export fallback for screens not yet refactored
export const COLORS = DARK_COLORS;

export const TYPOGRAPHY = {
  headlineXL: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -0.8, // -0.02em
  },
  headlineLG: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.32, // -0.01em
  },
  headlineMD: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 24,
    lineHeight: 30,
  },
  bodyLG: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    lineHeight: 28,
  },
  bodyMD: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  labelMD: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.7, // 0.05em
  },
  labelSM: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  taglineMD: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
};

export const SPACING = {
  unit: 4,
  gutter: 12,
  margin: 20,
  bentoGap: 12,
};
