'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface WelcomeStateProps {
  userName?: string;
  className?: string;
}

/**
 * Deterministic helper to derive time-of-day greeting
 */
function getTimeGreeting(): { en: string; bn: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { en: 'Good morning', bn: 'শুভ সকাল' };
  }
  if (hour >= 12 && hour < 17) {
    return { en: 'Good afternoon', bn: 'শুভ বিকেল' };
  }
  if (hour >= 17 && hour < 22) {
    return { en: 'Good evening', bn: 'শুভ সন্ধ্যা' };
  }
  return { en: 'Good evening', bn: 'শুভ রাত্রি' };
}

/**
 * WelcomeState: Initial ambient screen for Kleava AI.
 * Vertically balanced composition featuring the brand anchor, dynamic greeting, and contextual prompt.
 */
export function WelcomeState({ userName, className }: WelcomeStateProps) {
  // Deterministic greeting state initialized consistently for SSR
  const [greeting, setGreeting] = useState<{ en: string; bn: string }>({
    en: 'Good day',
    bn: 'স্বাগতম',
  });
  const [mounted, setMounted] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setGreeting(getTimeGreeting());
    setMounted(true);
  }, []);

  return (
    <section
      aria-label="Welcome state"
      className={cn(
        'w-full h-full flex flex-col items-center justify-center',
        'px-4 py-8 text-center select-none',
        'transition-opacity duration-700 ease-out',
        mounted ? 'opacity-100' : 'opacity-95',
        className
      )}
    >
      <div className="w-full max-w-[420px] flex flex-col items-center justify-center space-y-6 md:space-y-7">
        {/* Brand Anchor Logo */}
        <div className="relative flex items-center justify-center">
          {!logoError ? (
            <Image
              src="/assets/kleavaCm.svg"
              alt="Kleava AI"
              width={72}
              height={72}
              priority
              onError={() => setLogoError(true)}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
            />
          ) : (
            // Subtle fallback mark if SVG asset is temporarily unmounted
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] rounded-kleava-control bg-kleava-surface-light border border-kleava-accent/30 flex items-center justify-center shadow-kleava-subtle">
              <span className="w-4 h-4 rounded-full bg-kleava-accent" />
            </div>
          )}
        </div>

        {/* Dynamic Contextual Greeting */}
        <div className="space-y-2">
          <h1 className="typography-heading sm:text-2xl md:text-3xl font-medium tracking-tight text-kleava-text-primary">
            {greeting.en}
            {userName ? `, ${userName}` : ''}
          </h1>

          {/* Contextual Supporting Message */}
          <p className="typography-body text-kleava-text-secondary max-w-xs sm:max-w-sm mx-auto leading-relaxed">
            What would you like to explore or build today?
          </p>
        </div>
      </div>
    </section>
  );
}

export default WelcomeState;