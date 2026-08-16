'use client';

import React, { useState, useEffect } from 'react';
import { KleavaLogo } from '@/components/core/kleava-logo';
import { useSettings } from '@/state/settings-context';
import { resolveGreeting } from '@/lib/greeting-service';
import { cn } from '@/lib/utils';

export interface WelcomeStateProps {
  userName?: string;
  className?: string;
}

/**
 * WelcomeState: Initial ambient screen for Kleava AI.
 * Vertically balanced composition featuring the Kleava brand anchor,
 * language-aware dynamic greeting, and contextual prompt without layout shifts.
 */
export function WelcomeState({ userName, className }: WelcomeStateProps) {
  const { settings } = useSettings();
  const [mounted, setMounted] = useState(false);

  // Initialize with deterministic base state to eliminate SSR hydration mismatches
  const [resolved, setResolved] = useState(() =>
    resolveGreeting({
      language: settings.language,
      userName,
    })
  );

  // Synchronize on mount and language/user changes
  useEffect(() => {
    setResolved(
      resolveGreeting({
        language: settings.language,
        userName,
        date: new Date(),
      })
    );
    setMounted(true);
  }, [settings.language, userName]);

  return (
    <section
      aria-label="Welcome and initial workspace state"
      className={cn(
        'w-full h-full flex flex-col items-center justify-center',
        'px-4 py-6 text-center select-none',
        'transition-opacity duration-500 ease-out',
        mounted ? 'opacity-100' : 'opacity-95',
        className
      )}
    >
      <div className="w-full max-w-[440px] flex flex-col items-center justify-center space-y-5 md:space-y-6 my-auto">
        {/* 1. Brand Anchor: Kleava Logo with subtle hover scale */}
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] flex items-center justify-center transition-transform duration-300 hover:scale-105">
            <KleavaLogo size={64} className="w-14 h-14 sm:w-16 sm:h-16 md:w-[64px] md:h-[64px] text-kleava-accent drop-shadow-sm pointer-events-none" />
          </div>
        </div>

        {/* 2. Dynamic Contextual Greeting & Supporting Line */}
        <div className="space-y-2 max-w-sm sm:max-w-md mx-auto">
          {/* Main Greeting Heading */}
          <h1
            className={cn(
              'typography-heading sm:text-2xl md:text-[26px] font-medium tracking-tight text-kleava-text-primary leading-snug',
              settings.language === 'bn' ? 'font-bangla' : 'font-ui'
            )}
          >
            {resolved.heading}
          </h1>

          {/* Contextual Supporting Line */}
          <p
            className={cn(
              'typography-body text-xs sm:text-sm text-kleava-text-secondary leading-relaxed max-w-xs sm:max-w-sm mx-auto',
              settings.language === 'bn' ? 'font-bangla' : 'font-ui'
            )}
          >
            {resolved.supporting}
          </p>
        </div>
      </div>
    </section>
  );
}

export default WelcomeState;