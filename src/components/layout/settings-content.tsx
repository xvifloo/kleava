'use client';

import React from 'react';
import { SettingsSection } from '@/types';
import { cn } from '@/lib/utils';

export interface SettingsContentProps {
    sectionId: SettingsSection;
    title: string;
    description: string;
    children?: React.ReactNode;
    className?: string;
}

/**
 * SettingsContent: Borderless, clean settings body container.
 * Eliminates harsh card outlines and excessive divider lines.
 */
export function SettingsContent({
    title,
    description,
    children,
    className,
}: SettingsContentProps) {
    return (
        <div
            role="tabpanel"
            className={cn(
                'w-full flex-1 flex flex-col min-h-0 overflow-y-auto pr-0.5 scrollbar-none select-none font-ui',
                'animate-in fade-in duration-150 ease-out',
                className
            )}
        >
            {/* Category Sub-header (Borderless) */}
            <div className="pb-2 mb-2 flex-shrink-0">
                <h3 className="typography-label font-semibold text-xs text-kleava-text-primary">
                    {title}
                </h3>
                <p className="typography-metadata text-[10.5px] text-kleava-text-secondary mt-0.5 leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Content Form Area */}
            <div className="flex-1 flex flex-col space-y-3.5 pt-0.5">
                {children ? (
                    children
                ) : (
                    /* Empty Foundation Shell */
                    <div className="py-8 px-3 rounded-kleava-md bg-kleava-surface-soft/40 text-center flex flex-col items-center justify-center space-y-1.5 my-auto">
                        <span className="w-2 h-2 rounded-full bg-kleava-accent/60" />
                        <span className="typography-label text-xs font-medium text-kleava-text-primary">
                            {title} Configuration
                        </span>
                        <p className="typography-metadata text-[10px] text-kleava-text-secondary max-w-[200px]">
                            Settings controls for this section will be configured in subsequent modules.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Borderless Section Block
export function SettingsSectionBlock({
    title,
    children,
    className,
}: {
    title?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex flex-col space-y-1.5', className)}>
            {title && (
                <span className="typography-metadata uppercase tracking-wider text-[10px] font-semibold text-kleava-text-secondary/70 px-0.5">
                    {title}
                </span>
            )}
            <div className="flex flex-col space-y-1">{children}</div>
        </div>
    );
}

// Borderless Settings Row with Subtle Surface Contrast
export function SettingsRow({
    label,
    description,
    control,
    className,
}: {
    label: string;
    description?: string;
    control?: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'w-full flex items-center justify-between p-2 rounded-kleava-md',
                'bg-kleava-surface-light/40 dark:bg-[#1E2A27]/40',
                'transition-colors duration-150',
                className
            )}
        >
            <div className="flex flex-col min-w-0 pr-2">
                <span className="typography-label text-xs font-medium text-kleava-text-primary">
                    {label}
                </span>
                {description && (
                    <span className="typography-metadata text-[10px] text-kleava-text-secondary mt-0.5 leading-snug">
                        {description}
                    </span>
                )}
            </div>
            {control && <div className="shrink-0">{control}</div>}
        </div>
    );
}

// Subtle Spacing Divider (No harsh line)
export function SettingsDivider({ className }: { className?: string }) {
    return <div className={cn('my-1.5', className)} />;
}

export default SettingsContent;