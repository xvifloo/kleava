import { GeistSans } from 'geist/font/sans';
import { Hind_Siliguri, Lora, JetBrains_Mono } from 'next/font/google';

export const fontGeist = GeistSans;

export const fontHindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
  display: 'swap',
  fallback: ['Noto Sans Bengali', 'Kalpurush', 'sans-serif'],
});

export const fontLora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

export const fontJetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  fallback: ['Fira Code', 'Cascadia Code', 'Menlo', 'monospace'],
});

export const fontVariables = `${fontGeist.variable} ${fontHindSiliguri.variable} ${fontLora.variable} ${fontJetBrainsMono.variable}`;
