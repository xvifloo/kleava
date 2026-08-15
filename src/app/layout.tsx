import type { Metadata } from 'next';
import { fontVariables } from '@/styles/fonts';
import { SettingsProvider } from '@/state/settings-context';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Kleava AI',
  description: 'Calm, minimal, multi-model AI workspace and context engine.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-screen bg-kleava-bg text-kleava-text-primary font-ui antialiased">
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}