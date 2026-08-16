'use client';

import React from 'react';
import { NavTrigger } from '@/components/core/nav-trigger';
import { XviFlooLogo } from '@/components/core/xvifloo-logo';
import { cn } from '@/lib/utils';

export interface BrandHeaderProps {
    isNavOpen: boolean;
    onToggleNav: (open: boolean) => void;
    triggerRef?: React.Ref<HTMLButtonElement>;
    className?: string;
}

/**
 * BrandHeader: Top navigation composition for Kleava AI.
 * Top-Left: NavTrigger (38x38 Two-Dot Morph Control)
 * Top-Right: Official XviFloo Vector Logo
 */
export function BrandHeader({
    isNavOpen,
    onToggleNav,
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