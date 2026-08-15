'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSettings } from '@/state/settings-context';
import { resolveGreeting } from '@/lib/greeting-service';
import { cn } from '@/lib/utils';

export interface WelcomeStateProps {
  userName?: string;
  className?: string;
}

/**
 * WelcomeState: Initial ambient screen for Kleava AI.
 * Vertically balanced composition featuring the brand anchor,
 * language-aware dynamic greeting, and contextual prompt without layout shifts.
 */
export function WelcomeState({ userName, className }: WelcomeStateProps) {
  const { settings } = useSettings();
  const [mounted, setMounted] = useState(false);
  const [logoError, setLogoError] = useState(false);

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
        {/* 1. Brand Anchor: kleavaCm.svg with restrained sequence animation */}
        <div className="relative flex items-center justify-center">
          {!logoError ? (
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] transition-transform duration-300 hover:scale-105">
              <Image
                src="/assets/kleavaCm.svg"
                alt="Kleava AI Logo"
                fill
                sizes="(max-width: 640px) 56px, 72px"
                priority
                onError={() => setLogoError(true)}
                className="object-contain drop-shadow-sm pointer-events-none"
              />
            </div>
          ) : (
            /* Graceful Fallback Anchor if physical SVG is missing */
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] rounded-kleava-control bg-kleava-surface-light border border-kleava-accent/30 flex items-center justify-center shadow-kleava-subtle">
              <span className="w-4 h-4 rounded-full bg-kleava-accent" />
            </div>
          )}
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