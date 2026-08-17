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
 * SendButton: Prominently sized 40x40px soft-faceted rounded-hexagon send control.
 * High corner-radius with smooth color transitions and no sharp vertices.
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
                // Enhanced 40x40px prominent frame
                'relative w-[40px] h-[40px] min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px]',
                'flex items-center justify-center select-none shrink-0 aspect-square border-0 outline-none ring-0',
                'transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kleava-accent',
                isInteractive ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed',
                className
            )}
        >
            {/* Super-Rounded Hexagonal Vector Silhouette */}
            <svg
                viewBox="0 0 40 40"
                aria-hidden="true"
                className={cn(
                    'absolute inset-0 w-full h-full aspect-square transform-gpu transition-all duration-300 pointer-events-none',
                    isProcessing ? 'animate-spin-reverse' : ''
                )}
            >
                <path
                    d="M 20 3.2 C 24.5 3.2, 33.5 7.5, 35.8 11.5 C 38 15.5, 38 24.5, 35.8 28.5 C 33.5 32.5, 24.5 36.8, 20 36.8 C 15.5 36.8, 6.5 32.5, 4.2 28.5 C 2 24.5, 2 15.5, 4.2 11.5 C 6.5 7.5, 15.5 3.2, 20 3.2 Z"
                    className={cn(
                        'transition-colors duration-200',
                        isInteractive
                            ? 'fill-kleava-accent'
                            : 'fill-kleava-surface-soft dark:fill-[#1E2A27]'
                    )}
                />
            </svg>

            {/* Centered Upward Arrow <-> Stop Square Morph */}
            <div className="relative z-10 flex items-center justify-center pointer-events-none">
                {isProcessing ? (
                    <span
                        className="w-3 h-3 rounded-[2.5px] bg-white transition-all duration-150 scale-100 shadow-xs"
                        aria-hidden="true"
                    />
                ) : (
                    <ArrowUp
                        className={cn(
                            'w-4.5 h-4.5 stroke-[2.7] transition-colors duration-200',
                            isInteractive
                                ? 'text-white'
                                : 'text-kleava-text-secondary/50 dark:text-[#8A9E97]/50'
                        )}
                    />
                )}
            </div>
        </button>
    );
}

export default SendButton;