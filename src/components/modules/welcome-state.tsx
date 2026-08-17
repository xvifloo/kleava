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
 * WelcomeState: Beautiful, balanced welcome canvas.
 * Perfectly placed at natural upper-middle screen position.
 */
export function WelcomeState({ userName, className }: WelcomeStateProps) {
  const { settings } = useSettings();
  const [mounted, setMounted] = useState(false);

  const [resolved, setResolved] = useState(() =>
    resolveGreeting({
      language: settings.language,
      userName,
    })
  );

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
        'w-full flex-1 flex flex-col items-center justify-start',
        'pt-16 sm:pt-24 md:pt-32 pb-6 px-4 sm:px-6 text-center select-none', // Positioned nicely lower
        'transition-opacity duration-500 ease-out',
        mounted ? 'opacity-100' : 'opacity-95',
        className
      )}
    >
      <div className="w-full max-w-[540px] flex flex-col items-center justify-center space-y-4 sm:space-y-5">
        {/* 1. Kleava Logo */}
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center transition-transform duration-300 hover:scale-105">
            <KleavaLogo
              size={56}
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-kleava-accent drop-shadow-xs pointer-events-none"
            />
          </div>
        </div>

        {/* 2. Refined Greeting Typography */}
        <div className="space-y-2 max-w-md sm:max-w-lg mx-auto">
          <h1
            className={cn(
              'text-2xl sm:text-3xl md:text-[34px] font-medium md:font-semibold tracking-tight text-kleava-text-primary leading-tight',
              isBengali ? 'font-bangla' : 'font-editorial'
            )}
          >
            {resolved.heading}
          </h1>

          <p
            className={cn(
              'text-xs sm:text-sm md:text-[15px] text-kleava-text-secondary leading-relaxed max-w-xs sm:max-w-sm mx-auto',
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