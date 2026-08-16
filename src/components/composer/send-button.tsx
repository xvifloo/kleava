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
 * SendButton: Fixed-dimension (36x36px) symmetrical circular-hexagonal send control.
 * Perfectly balanced width and height with zero expansion during generation.
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
                // Strictly fixed 36x36px square frame
                'relative w-[36px] h-[36px] min-w-[36px] max-w-[36px] min-h-[36px] max-h-[36px]',
                'flex items-center justify-center select-none shrink-0 aspect-square',
                'transition-all duration-150 ease-out focus-ring-kleava',
                isInteractive ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-50',
                className
            )}
        >
            {/* 1. Symmetrical Soft Rounded-Hexagon Vector Silhouette (1:1 Ratio) */}
            <svg
                viewBox="0 0 40 40"
                aria-hidden="true"
                className={cn(
                    'absolute inset-0 w-full h-full aspect-square transform-gpu transition-transform duration-300 pointer-events-none',
                    isProcessing ? 'animate-spin-reverse' : ''
                )}
            >
                <path
                    d="M 20 3.5 C 23.5 3.5, 33 8.5, 34.5 11.5 C 36 14.5, 36 25.5, 34.5 28.5 C 33 31.5, 23.5 36.5, 20 36.5 C 16.5 36.5, 7 31.5, 5.5 28.5 C 4 25.5, 4 14.5, 5.5 11.5 C 7 8.5, 16.5 3.5, 20 3.5 Z"
                    className={cn(
                        'transition-colors duration-200',
                        isInteractive ? 'fill-kleava-accent' : 'fill-kleava-surface-soft'
                    )}
                />
            </svg>

            {/* 2. Centered Glyph: Arrow Up <-> Stop Square */}
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
                            isInteractive ? 'text-white' : 'text-kleava-text-secondary/50'
                        )}
                    />
                )}
            </div>
        </button>
    );
}

export default SendButton;