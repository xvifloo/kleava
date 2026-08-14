import type { Metadata } from 'next';
import { fontVariables } from '@/styles/fonts';
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
        {children}
      </body>
    </html>
  );
}
