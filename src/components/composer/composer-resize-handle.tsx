'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ComposerResizeHandleProps {
    onMouseDown: (clientY: number) => void;
    onTouchStart: (clientY: number) => void;
    isDragging?: boolean;
    className?: string;
}

/**
 * ComposerResizeHandle: Minimal, accessible top drag-resize affordance
 * allowing purely vertical resizing of the ChatComposer container.
 */
export function ComposerResizeHandle({
    onMouseDown,
    onTouchStart,
    isDragging = false,
    className,
}: ComposerResizeHandleProps) {
    return (
        <div
            role="separator"
            tabIndex={0}
            aria-orientation="horizontal"
            aria-label="Drag vertically to resize composer height"
            onMouseDown={(e) => {
                e.preventDefault();
                onMouseDown(e.clientY);
            }}
            onTouchStart={(e) => {
                if (e.touches[0]) {
                    onTouchStart(e.touches[0].clientY);
                }
            }}
            className={cn(
                'absolute -top-2 left-0 right-0 h-4 flex items-center justify-center cursor-row-resize z-20 group select-none',
                'focus-visible:outline-none',
                className
            )}
        >
            {/* Subtle Visual Grip Pill */}
            <span
                className={cn(
                    'w-10 h-1 rounded-full transition-colors duration-150',
                    isDragging
                        ? 'bg-kleava-accent w-12'
                        : 'bg-kleava-border-subtle/60 group-hover:bg-kleava-accent/70'
                )}
            />
        </div>
    );
}

export default ComposerResizeHandle;