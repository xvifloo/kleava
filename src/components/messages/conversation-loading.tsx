'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConversationLoadingProps {
    label?: string;
    className?: string;
}

/**
 * ConversationLoading: Minimal, calm loading indicator for Kleava AI.
 * Used during session transitions and assistant reasoning states without visual noise.
 */
export function ConversationLoading({
    label = 'Thinking...',
    className,
}: ConversationLoadingProps) {
    return (
        <div
            className={cn(
                'w-full flex items-center space-x-2.5 py-3 px-1 my-2 select-none',
                'animate-in fade-in duration-300 ease-out text-kleava-text-secondary',
                className
            )}
        >
            <div className="w-5 h-5 rounded-full bg-kleava-accent/15 flex items-center justify-center text-kleava-accent flex-shrink-0">
                <Sparkles className="w-3 h-3 animate-pulse" />
            </div>

            <div className="flex items-center space-x-1.5 text-xs font-medium">
                <span className="typography-metadata text-xs tracking-tight text-kleava-text-primary/90">
                    {label}
                </span>
                <div className="flex space-x-1 items-center ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-kleava-accent/70 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-kleava-accent/70 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-kleava-accent/70 animate-bounce" />
                </div>
            </div>
        </div>
    );
}

export default ConversationLoading;