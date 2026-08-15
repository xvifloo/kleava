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
 * SettingsContent: Reusable settings body container equipped with clean
 * empty content shells and foundational layout primitives.
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
                'w-full flex-1 flex flex-col min-h-0 overflow-y-auto pr-0.5 scrollbar-none select-none',
                'animate-in fade-in duration-150 ease-out',
                className
            )}
        >
            {/* Category Heading & Description */}
            <div className="pb-2.5 mb-2 border-b border-kleava-border-subtle/50 flex-shrink-0">
                <h3 className="typography-label font-semibold text-xs text-kleava-text-primary">
                    {title}
                </h3>
                <p className="typography-metadata text-[10.5px] text-kleava-text-secondary mt-0.5 leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Content Form Area */}
            <div className="flex-1 flex flex-col space-y-3">
                {children ? (
                    children
                ) : (
                    /* Clean Empty Content Foundation Shell */
                    <div className="py-6 px-3 rounded-kleava-md bg-kleava-surface-soft/40 border border-kleava-border-subtle/50 text-center flex flex-col items-center justify-center space-y-1.5 my-auto">
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

// Reusable Form Layout Primitives for upcoming settings modules
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
        <div className={cn('flex flex-col space-y-2', className)}>
            {title && (
                <span className="typography-metadata uppercase tracking-wider text-[10px] font-semibold text-kleava-text-secondary/80">
                    {title}
                </span>
            )}
            <div className="flex flex-col space-y-1">{children}</div>
        </div>
    );
}

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
                'w-full flex items-center justify-between p-2 rounded-kleava-md bg-kleava-surface-light/30 border border-kleava-border-subtle/40',
                className
            )}
        >
            <div className="flex flex-col min-w-0 pr-2">
                <span className="typography-label text-xs font-medium text-kleava-text-primary">
                    {label}
                </span>
                {description && (
                    <span className="typography-metadata text-[10px] text-kleava-text-secondary">
                        {description}
                    </span>
                )}
            </div>
            {control && <div className="flex-shrink-0">{control}</div>}
        </div>
    );
}

export function SettingsDivider({ className }: { className?: string }) {
    return <div className={cn('my-1 border-t border-kleava-border-subtle/50', className)} />;
}

export default SettingsContent;