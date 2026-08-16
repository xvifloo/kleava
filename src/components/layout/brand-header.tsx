'use client';

import React from 'react';
import { EyeOff, X } from 'lucide-react';
import { NavTrigger } from '@/components/core/nav-trigger';
import { XviFlooLogo } from '@/components/core/xvifloo-logo';
import { cn } from '@/lib/utils';

export interface BrandHeaderProps {
    isNavOpen: boolean;
    onToggleNav: (open: boolean) => void;
    isIncognito?: boolean;
    onExitIncognito?: () => void;
    triggerRef?: React.Ref<HTMLButtonElement>;
    className?: string;
}

/**
 * BrandHeader: Top navigation composition for Kleava AI.
 * Displays NavTrigger on the left, Incognito status pill in center if active,
 * and the official XviFloo Logo on the right.
 */
export function BrandHeader({
    isNavOpen,
    onToggleNav,
    isIncognito = false,
    onExitIncognito,
    triggerRef,
    className,
}: BrandHeaderProps) {
    return (
        <div
            className={cn(
                'w-full flex items-center justify-between select-none font-ui',
                className
            )}
        >
            {/* Top-Left: Two-Dot Navigation Trigger */}
            <NavTrigger
                ref={triggerRef}
                isOpen={isNavOpen}
                onToggle={onToggleNav}
            />

            {/* Center: Active Incognito Mode Pill Indicator */}
            {isIncognito && (
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-kleava-control bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs shadow-2xs animate-in fade-in duration-200">
                    <EyeOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="typography-metadata text-[10.5px] font-semibold tracking-wide">
                        Incognito Session
                    </span>
                    {onExitIncognito && (
                        <button
                            type="button"
                            aria-label="Exit incognito mode"
                            title="Exit and clear temporary session"
                            onClick={onExitIncognito}
                            className="ml-1 p-0.5 rounded-full hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
            )}

            {/* Top-Right: Official XviFloo Logo */}
            <div className="flex items-center justify-center shrink-0">
                <a
                    href="https://xvifloo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="XviFloo Home"
                    className="w-[34px] h-[34px] flex items-center justify-center rounded-kleava-sm hover:opacity-85 transition-opacity focus-ring-kleava"
                >
                    <XviFlooLogo size={28} className="drop-shadow-xs" />
                </a>
            </div>
        </div>
    );
}

export default BrandHeader;