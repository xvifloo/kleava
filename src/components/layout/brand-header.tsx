'use client';

import React from 'react';
import Image from 'next/image';
import { NavTrigger } from '@/components/core/nav-trigger';
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
 * Top-Right: xviFlooPm.svg brand anchor
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
                'w-full flex items-center justify-between select-none',
                className
            )}
        >
            {/* Top-Left: Two-Dot Navigation Trigger */}
            <NavTrigger
                ref={triggerRef}
                isOpen={isNavOpen}
                onToggle={onToggleNav}
            />

            {/* Top-Right: XviFlooPM Brand Logo Asset */}
            <div className="flex items-center justify-center flex-shrink-0">
                <div className="w-[34px] h-[34px] relative flex items-center justify-center">
                    <Image
                        src="/assets/xviFlooPm.svg"
                        alt="XviFloo"
                        width={30}
                        height={30}
                        priority
                        className="object-contain drop-shadow-sm opacity-90 hover:opacity-100 transition-opacity"
                        onError={(e) => {
                            // Graceful fallback badge if SVG asset is unmounted
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            if (target.parentElement) {
                                target.parentElement.innerHTML =
                                    '<div class="w-7 h-7 rounded-kleava-sm bg-kleava-surface-soft border border-kleava-border-subtle flex items-center justify-center text-[10px] font-semibold text-kleava-text-secondary">XF</div>';
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default BrandHeader;