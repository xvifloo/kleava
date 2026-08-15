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
 * SendButton: Soft-faceted rounded-hexagonal control for Kleava AI.
 * Displays an upward arrow in idle mode, and smoothly transitions into
 * a stop/square icon with gentle counter-clockwise rotation during processing.
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
            aria-label={isProcessing ? 'Stop generating' : 'Send message'}
            disabled={!isInteractive}
            onClick={handleClick}
            className={cn(
                'relative w-8 h-8 flex items-center justify-center select-none',
                'transition-all duration-200 ease-out focus-ring-kleava',
                isInteractive ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-60',
                className
            )}
        >
            {/* 1. Soft-faceted Rounded-Hexagonal Background Shape */}
            <svg
                viewBox="0 0 36 36"
                className={cn(
                    'absolute inset-0 w-full h-full transition-transform duration-300',
                    isProcessing ? 'animate-spin-reverse' : ''
                )}
            >
                <path
                    d="M18 3.5 C22.5 3.5 30 7.8 31.8 11 C33.5 14.2 33.5 21.8 31.8 25 C30 28.2 22.5 32.5 18 32.5 C13.5 32.5 6 28.2 4.2 25 C2.5 21.8 2.5 14.2 4.2 11 C6 7.8 13.5 3.5 18 3.5 Z"
                    className={cn(
                        'transition-colors duration-200',
                        isInteractive ? 'fill-kleava-accent' : 'fill-kleava-surface-soft'
                    )}
                />
            </svg>

            {/* 2. Interactive Center Icon (Arrow -> Square Stop Morph) */}
            <div className="relative z-10 flex items-center justify-center pointer-events-none">
                {isProcessing ? (
                    /* Stop Square Icon */
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-white transition-transform duration-150 scale-100" />
                ) : (
                    /* Upward Send Arrow */
                    <ArrowUp
                        className={cn(
                            'w-3.5 h-3.5 stroke-[2.5] transition-colors duration-200',
                            isInteractive ? 'text-white' : 'text-kleava-text-secondary/50'
                        )}
                    />
                )}
            </div>
        </button>
    );
}

export default SendButton;