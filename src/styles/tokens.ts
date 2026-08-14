/**
 * KLEAVA AI — CENTRALIZED DESIGN TOKENS
 * 
 * Single source of truth for canonical colors, semantic palettes, 
 * typography roles, radius scales, spacing, elevations, and interaction states.
 */

export const KLEAVA_TOKENS = {
  // 1. Canonical Raw Color Values
  canonicalColors: {
    bgCanvas: '#F1FFF9',
    brandAccent: '#17BC9B',
    textPrimary: '#2D2D2D',
    textSecondary: '#6B8079',
    surfaceBase: '#FFFFFF',
    surfaceSoft: '#E2EEE9',
    surfaceLight: '#E2F5F0',
    destructive: '#E04848',
  },

  // 2. Semantic Color System
  colors: {
    background: {
      primary: 'var(--bg-primary, #F1FFF9)',
      secondary: 'var(--surface-light, #E2F5F0)',
    },
    surface: {
      default: 'var(--surface-base, #FFFFFF)',
      soft: 'var(--surface-soft, #E2EEE9)',
      light: 'var(--surface-light, #E2F5F0)',
    },
    text: {
      primary: 'var(--text-primary, #2D2D2D)',
      secondary: 'var(--text-secondary, #6B8079)',
      inverse: '#FFFFFF',
      disabled: 'rgba(107, 128, 121, 0.45)',
    },
    brand: {
      primary: 'var(--accent-primary, #17BC9B)',
      hover: '#14A587',
      active: '#108E74',
    },
    border: {
      subtle: 'var(--border-subtle, rgba(107, 128, 121, 0.15))',
      default: 'var(--surface-soft, #E2EEE9)',
      strong: 'rgba(107, 128, 121, 0.35)',
    },
    interactive: {
      hover: 'var(--surface-light, #E2F5F0)',
      active: 'var(--surface-soft, #E2EEE9)',
      selected: '#E2F5F0',
      focus: 'var(--accent-primary, #17BC9B)',
    },
    state: {
      success: '#17BC9B',
      warning: '#F59E0B',
      error: 'var(--destructive, #E04848)',
      info: '#3B82F6',
    },
    destructive: 'var(--destructive, #E04848)',
  },

  // 3. Typography Roles & Baseline Specifications
  typography: {
    families: {
      ui: 'var(--font-geist-sans), var(--font-geist), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      bangla: 'var(--font-hind-siliguri), "Noto Sans Bengali", "Kalpurush", sans-serif',
      editorial: 'var(--font-lora), Georgia, serif',
      code: 'var(--font-jetbrains-mono), "Fira Code", "Cascadia Code", Menlo, monospace',
    },
    aiResponse: {
      fontSize: '15px',
      lineHeight: '1.65',
      letterSpacing: '0.3px',
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    scale: {
      display: { fontSize: '2rem', lineHeight: '1.2', fontWeight: '600' },
      heading: { fontSize: '1.5rem', lineHeight: '1.3', fontWeight: '600' },
      subheading: { fontSize: '1.125rem', lineHeight: '1.4', fontWeight: '500' },
      body: { fontSize: '0.9375rem', lineHeight: '1.65', fontWeight: '400' },
      bodySmall: { fontSize: '0.8125rem', lineHeight: '1.5', fontWeight: '400' },
      label: { fontSize: '0.875rem', lineHeight: '1.25', fontWeight: '500' },
      caption: { fontSize: '0.75rem', lineHeight: '1.3', fontWeight: '400' },
      metadata: { fontSize: '0.6875rem', lineHeight: '1.2', fontWeight: '500' },
      button: { fontSize: '0.875rem', lineHeight: '1.2', fontWeight: '500' },
      input: { fontSize: '0.9375rem', lineHeight: '1.4', fontWeight: '400' },
      code: { fontSize: '0.84375rem', lineHeight: '1.6', fontWeight: '400' },
      codeInline: { fontSize: '0.8125rem', lineHeight: '1.4', fontWeight: '500' },
    },
  },

  // 4. Controlled Border Radius Scale
  radius: {
    sm: '6px',        // Chatbox, code surfaces, compact containers
    md: '10px',       // Contextual surfaces, cards
    lg: '16px',       // Floating panels, overlays
    control: '25px',  // 38x38 navigation trigger, pill chips
    full: '9999px',   // Avatars, circular action triggers
  },

  // 5. Spacing Scale (Baseline & Composition Values)
  spacing: {
    4: '4px',
    6: '6px',
    8: '8px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    32: '32px',
    40: '40px',
    48: '48px',
    composition: {
      screenGutterHorizontal: '20px',
      gapCompact: '6px',
      gapNormal: '12px',
      gapSection: '20px',
      gapMajor: '32px',
      composerDefaultHeight: '116px',
      navTriggerSize: '38px',
    },
  },

  // 6. Elevation & Shadows
  elevation: {
    subtle: '0 1px 3px rgba(45, 45, 45, 0.04), 0 1px 2px rgba(45, 45, 45, 0.02)',
    floating: '0 8px 24px rgba(45, 45, 45, 0.06), 0 2px 6px rgba(45, 45, 45, 0.03)',
  },
} as const;

export type KleavaTokens = typeof KLEAVA_TOKENS;