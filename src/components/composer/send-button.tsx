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
 * SendButton: Soft-faceted rounded-hexagonal send control for Kleava AI.
 * - Symmetrical 36x36px clickable area perfectly matching the microphone button
 * - Highly rounded vertices (almost circular silhouette with subtle hexagonal character)
 * - Zero hard outline borders
 * - Upward Arrow <-> Stop Square morphing with smooth CCW rotation during generation
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
                        : 'Send message (disabled)'
            }
            aria-live="polite"
            disabled={!isInteractive}
            onClick={handleClick}
            className={cn(
                // Strictly matched 36x36px frame with microphone button
                'relative w-[36px] h-[36px] min-w-[36px] max-w-[36px] min-h-[36px] max-h-[36px]',
                'flex items-center justify-center select-none shrink-0 aspect-square border-0 outline-none ring-0',
                'transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kleava-accent',
                isInteractive ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-50',
                className
            )}
        >
            {/* 1. Symmetrical Soft-Faceted Rounded-Hexagon Vector Silhouette */}
            <svg
                viewBox="0 0 38 38"
                aria-hidden="true"
                className={cn(
                    'absolute inset-0 w-full h-full aspect-square transform-gpu transition-transform duration-300 pointer-events-none',
                    isProcessing ? 'animate-spin-reverse' : ''
                )}
            >
                <path
                    d="M 19 3.5 C 23.8 3.5, 32.2 7.8, 34.2 11.6 C 36.2 15.4, 36.2 22.6, 34.2 26.4 C 32.2 30.2, 23.8 34.5, 19 34.5 C 14.2 34.5, 5.8 30.2, 3.8 26.4 C 1.8 22.6, 1.8 15.4, 3.8 11.6 C 5.8 7.8, 14.2 3.5, 19 3.5 Z"
                    className={cn(
                        'transition-colors duration-200',
                        isInteractive ? 'fill-kleava-accent' : 'fill-kleava-surface-soft dark:fill-[#1E2A27]'
                    )}
                />
            </svg>

            {/* 2. Centered Glyph: Arrow Up <-> Stop Square Morph */}
            <div className="relative z-10 flex items-center justify-center pointer-events-none">
                {isProcessing ? (
                    <span
                        className="w-2.5 h-2.5 rounded-[2px] bg-white transition-all duration-150 scale-100 shadow-xs"
                        aria-hidden="true"
                    />
                ) : (
                    <ArrowUp
                        className={cn(
                            'w-4 h-4 stroke-[2.7] transition-all duration-200',
                            isInteractive ? 'text-white' : 'text-kleava-text-secondary/50 dark:text-[#8A9E97]/50'
                        )}
                    />
                )}
            </div>
        </button>
    );
}

export default SendButton;