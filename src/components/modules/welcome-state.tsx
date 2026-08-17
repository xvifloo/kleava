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
 * WelcomeState: Bold Editorial Welcome Canvas for Kleava AI.
 * - Bold Lora Editorial Typography (2x visual prominence)
 * - Dynamic Contextual Greeting & Natural Supporting Line
 * - Fluid W520xH1090 compositional balance
 */
export function WelcomeState({ userName, className }: WelcomeStateProps) {
  const { settings } = useSettings();
  const [mounted, setMounted] = useState(false);

  // Initialize with deterministic base state to prevent SSR hydration mismatches
  const [resolved, setResolved] = useState(() =>
    resolveGreeting({
      language: settings.language,
      userName,
    })
  );

  // Synchronize on client mount and settings change
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

  const isBengali = settings.language === 'bn';

  return (
    <section
      aria-label="Welcome and initial workspace state"
      className={cn(
        'w-full h-full flex flex-col items-center justify-center',
        'px-4 sm:px-6 py-6 text-center select-none',
        'transition-opacity duration-500 ease-out',
        mounted ? 'opacity-100' : 'opacity-95',
        className
      )}
    >
      <div className="w-full max-w-[540px] flex flex-col items-center justify-center space-y-6 md:space-y-7 my-auto">
        {/* 1. Kleava Logo Anchor */}
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] flex items-center justify-center transition-transform duration-300 hover:scale-105">
            <KleavaLogo
              size={64}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-[64px] md:h-[64px] text-kleava-accent drop-shadow-sm pointer-events-none"
            />
          </div>
        </div>

        {/* 2. Bold Editorial Welcome Typography (2x Prominence) */}
        <div className="space-y-2.5 max-w-md sm:max-w-lg mx-auto">
          {/* Main Welcome Message: Bold, 2x Size, Lora/Hind Siliguri */}
          <h1
            className={cn(
              'text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-bold tracking-tight text-kleava-text-primary leading-[1.15]',
              isBengali ? 'font-bangla font-semibold' : 'font-editorial'
            )}
          >
            {resolved.heading}
          </h1>

          {/* Dynamic Supporting Context Line */}
          <p
            className={cn(
              'text-sm sm:text-base md:text-lg text-kleava-text-secondary leading-relaxed max-w-xs sm:max-w-md mx-auto',
              isBengali ? 'font-bangla' : 'font-ui'
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