import type { Metadata } from 'next';
import { fontVariables } from '@/styles/fonts';
import { SettingsProvider } from '@/state/settings-context';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Kleava AI',
  description: 'Calm, minimal, multi-model AI workspace and context engine.',
};

/**
 * Early Theme & Setting Initialization Script
 * Injected immediately in <head> to prevent FOUC (Flash of Unstyled Color Theme)
 */
const themeInitScript = `
  (function() {
    try {
      var storedGeneral = localStorage.getItem('kleava_general_settings');
      if (storedGeneral) {
        var parsed = JSON.parse(storedGeneral);
        var theme = parsed.theme || 'light';
        var accent = parsed.accentColor || '#17BC9B';
        var fontSize = parsed.fontSize || 'medium';
        var compact = parsed.compactMode;
        var reduceMotion = parsed.reduceMotion;

        var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }

        document.documentElement.style.setProperty('--accent-primary', accent);

        if (fontSize === 'small') {
          document.documentElement.style.setProperty('--font-size-multiplier', '0.90');
        } else if (fontSize === 'large') {
          document.documentElement.style.setProperty('--font-size-multiplier', '1.12');
        } else {
          document.documentElement.style.setProperty('--font-size-multiplier', '1.0');
        }

        if (compact) document.documentElement.setAttribute('data-density', 'compact');
        if (reduceMotion) document.documentElement.setAttribute('data-reduce-motion', 'true');
      }
    } catch(e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-kleava-bg text-kleava-text-primary font-ui antialiased">
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}