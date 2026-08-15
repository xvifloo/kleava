'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SendButtonProps {
    canSend: boolean;
    isProcessing: boolean;
    onSend: () => void;
    onCancel?: () => void;
    disabled?: boolean;
    className?: string;
}

/**
 * SendButton: Canonical soft-faceted rounded-hexagonal send control for Kleava AI.
 * - Idle state: Displays a crisp white upward arrow
 * - Active state: Vibrant #17BC9B accent fill with subtle hover feedback
 * - Processing state: Smoothly morphs into a stop/square icon with gentle CCW rotation
 * - Fully accessible with dynamic aria-labels and keyboard focus management
 */
export function SendButton({
    canSend,
    isProcessing,
    onSend,
    onCancel,
    disabled = false,
    className,
}: SendButtonProps) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (isProcessing) {
            onCancel?.();
        } else if (canSend && !disabled) {
            onSend();
        }
    };

    const isInteractive = (canSend && !disabled) || isProcessing;

    return (
        <button
            type="button"
            role="button"
            aria-label={
                isProcessing
                    ? 'Stop generating response'
                    : canSend
                        ? 'Send message'
                        : 'Send message (disabled: enter a prompt or attach a file)'
            }
            aria-live="polite"
            disabled={!isInteractive}
            onClick={handleClick}
            className={cn(
                // Outer 38x38 rounded-control frame rhythm
                'relative w-[38px] h-[38px] flex items-center justify-center select-none flex-shrink-0',
                'transition-all duration-200 ease-out focus-ring-kleava',
                isInteractive
                    ? 'cursor-pointer active:scale-95'
                    : 'cursor-not-allowed opacity-60',
                className
            )}
        >
            {/* 1. Soft-Faceted Rounded-Hexagon Vector Silhouette */}
            <svg
                viewBox="0 0 38 38"
                aria-hidden="true"
                className={cn(
                    'absolute inset-0 w-full h-full transform-gpu transition-transform duration-300 pointer-events-none',
                    isProcessing ? 'animate-spin-reverse' : ''
                )}
            >
                <path
                    d="M19 3.8 C24 3.8 32.2 8.2 34 11.8 C35.8 15.4 35.8 22.6 34 26.2 C32.2 29.8 24 34.2 19 34.2 C14 34.2 5.8 29.8 4 26.2 C2.2 22.6 2.2 15.4 4 11.8 C5.8 8.2 14 3.8 19 3.8 Z"
                    className={cn(
                        'transition-colors duration-200',
                        isInteractive ? 'fill-kleava-accent' : 'fill-kleava-surface-soft'
                    )}
                />
            </svg>

            {/* 2. Interactive Icon: Upward Arrow <-> Stop Square Morph */}
            <div className="relative z-10 flex items-center justify-center pointer-events-none">
                {isProcessing ? (
                    /* Stop Square Glyph */
                    <span
                        className="w-3 h-3 rounded-[2.5px] bg-white transition-all duration-150 scale-100 shadow-xs"
                        aria-hidden="true"
                    />
                ) : (
                    /* Upward Send Arrow */
                    <ArrowUp
                        className={cn(
                            'w-4 h-4 stroke-[2.7] transition-all duration-200',
                            isInteractive ? 'text-white' : 'text-kleava-text-secondary/50'
                        )}
                    />
                )}
            </div>
        </button>
    );
}

export default SendButton;