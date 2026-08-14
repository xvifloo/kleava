import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        kleava: {
          bg: 'var(--bg-primary, #F1FFF9)',
          accent: 'var(--accent-primary, #17BC9B)',
          'accent-hover': '#14A587',
          'accent-active': '#108E74',
          'text-primary': 'var(--text-primary, #2D2D2D)',
          'text-secondary': 'var(--text-secondary, #6B8079)',
          surface: 'var(--surface-base, #FFFFFF)',
          'surface-soft': 'var(--surface-soft, #E2EEE9)',
          'surface-light': 'var(--surface-light, #E2F5F0)',
          destructive: 'var(--destructive, #E04848)',
          'border-subtle': 'var(--border-subtle, rgba(107, 128, 121, 0.15))',
        },
      },
      fontFamily: {
        ui: [
          'var(--font-geist-sans)',
          'var(--font-geist)',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        bangla: [
          'var(--font-hind-siliguri)',
          '"Noto Sans Bengali"',
          '"Kalpurush"',
          'sans-serif',
        ],
        editorial: ['var(--font-lora)', 'Georgia', 'serif'],
        code: [
          'var(--font-jetbrains-mono)',
          '"Fira Code"',
          '"Cascadia Code"',
          'Menlo',
          'monospace',
        ],
      },
      fontSize: {
        'ai-base': ['15px', { lineHeight: '1.65', letterSpacing: '0.3px' }],
      },
      borderRadius: {
        'kleava-sm': '6px',
        'kleava-md': '10px',
        'kleava-lg': '16px',
        'kleava-control': '25px',
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
        '116px': '116px',
        'gutter-h': '20px',
      },
      boxShadow: {
        'kleava-subtle': '0 1px 3px rgba(45, 45, 45, 0.04), 0 1px 2px rgba(45, 45, 45, 0.02)',
        'kleava-floating': '0 8px 24px rgba(45, 45, 45, 0.06), 0 2px 6px rgba(45, 45, 45, 0.03)',
      },
    },
  },
  plugins: [],
};

export default config;