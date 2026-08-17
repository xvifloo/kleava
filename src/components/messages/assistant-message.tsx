'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Copy,
    Check,
    Volume2,
    VolumeX,
    Heart,
    HeartCrack,
    RotateCcw,
} from 'lucide-react';
import { ChatMessage, MessageFeedback } from '@/types';
import { KleavaLogo } from '@/components/core/kleava-logo';
import { formatRelativeTime } from '@/lib/date-utils';
import { extractCleanSpeechText } from '@/lib/text-utils';
import { MarkdownContent } from '@/components/messages/markdown-content';
import { cn } from '@/lib/utils';

export interface AssistantMessageProps {
    message: ChatMessage;
    currentlySpeakingId?: string | null;
    onStartSpeaking?: (messageId: string) => void;
    onStopSpeaking?: () => void;
    onFeedback?: (messageId: string, feedback: MessageFeedback) => void;
    onRetry?: (messageId: string) => void;
    className?: string;
}

/**
 * AssistantMessage: Editorial AI Response Renderer.
 * Header: Official Kleava Logo + 'Kleava' text (No version tags, no dividers).
 * Action Area: Borderless, minimal surface action controls directly beneath response text.
 */
export function AssistantMessage({
    message,
    currentlySpeakingId,
    onStartSpeaking,
    onStopSpeaking,
    onFeedback,
    onRetry,
    className,
}: AssistantMessageProps) {
    const [isCopied, setIsCopied] = useState(false);
    const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isStreaming = message.status === 'streaming';
    const isError = message.status === 'error';
    const isComplete = message.status === 'complete' || !message.status;
    const hasContent = Boolean(message.content && message.content.trim().length > 0);
    const isSpeaking = currentlySpeakingId === message.id;

    // Cleanup copy timeout
    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        };
    }, []);

    // Copy plain text response
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setIsCopied(true);
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
            copyTimeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
        } catch {
            setIsCopied(false);
        }
    };

    // Text-To-Speech Playback Toggle
    const handleToggleSpeech = () => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            onStopSpeaking?.();
        } else {
            window.speechSynthesis.cancel();
            const plainSpeech = extractCleanSpeechText(message.content);
            if (!plainSpeech) return;

            const utterance = new SpeechSynthesisUtterance(plainSpeech);
            utterance.rate = 1.0;
            utterance.onend = () => onStopSpeaking?.();
            utterance.onerror = () => onStopSpeaking?.();
            window.speechSynthesis.speak(utterance);
            onStartSpeaking?.(message.id);
        }
    };

    // Feedback Handlers
    const handleLoveClick = () => {
        const next = message.feedback === 'love' ? null : 'love';
        onFeedback?.(message.id, next);
    };

    const handleBrokenLoveClick = () => {
        const next = message.feedback === 'broken-love' ? null : 'broken-love';
        onFeedback?.(message.id, next);
    };

    return (
        <div
            className={cn(
                'w-full flex flex-col items-start my-3.5 select-text font-ui',
                'animate-in fade-in duration-200 ease-out',
                className
            )}
        >
            {/* 1. Official Header: Kleava Logo + Kleava Text (No version number, no divider) */}
            <div className="flex items-center space-x-2 mb-2 select-none">
                <div className="w-5 h-5 flex items-center justify-center shrink-0 text-kleava-accent">
                    <KleavaLogo size={18} />
                </div>
                <span className="typography-label text-[13px] font-semibold tracking-tight text-kleava-text-primary">
                    Kleava
                </span>
            </div>

            {/* 2. Document Response Canvas */}
            <div className="w-full max-w-full text-kleava-text-primary relative pl-0.5">
                {hasContent ? (
                    <MarkdownContent content={message.content} />
                ) : isStreaming ? (
                    <div className="py-1 text-sm text-kleava-text-secondary/70 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-kleava-accent animate-ping" />
                        <span>Thinking...</span>
                    </div>
                ) : null}

                {/* Streaming Cursor Indicator */}
                {isStreaming && hasContent && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-kleava-accent rounded-[1px] animate-pulse align-middle" />
                )}
            </div>

            {/* 3. Error Banner & Retry Boundary */}
            {isError && (
                <div className="mt-2.5 w-full p-2.5 rounded-kleava-md bg-red-500/10 border border-red-500/30 text-xs text-kleava-destructive flex items-center justify-between select-none shadow-xs">
                    <span>{message.errorMessage || 'Failed to generate response.'}</span>
                    {onRetry && (
                        <button
                            type="button"
                            onClick={() => onRetry(message.id)}
                            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white dark:bg-[#151F1C] border border-red-200 dark:border-red-900/50 text-kleava-destructive hover:bg-red-50 text-[11px] font-medium transition-colors focus-ring-kleava"
                        >
                            <RotateCcw className="w-3 h-3" />
                            <span>Retry</span>
                        </button>
                    )}
                </div>
            )}

            {/* 4. Refined Action Area (No horizontal divider line, minimal borderless controls) */}
            {isComplete && hasContent && (
                <div className="mt-2.5 pt-1 w-full flex items-center justify-between text-kleava-text-secondary text-xs select-none">
                    {/* Relative Timestamp */}
                    <span className="typography-metadata text-[10.5px]">
                        {formatRelativeTime(message.createdAt)}
                    </span>

                    {/* Minimal Action Controls Dock */}
                    <div className="flex items-center space-x-1">
                        {/* Copy Button */}
                        <button
                            type="button"
                            aria-label={isCopied ? 'Copied' : 'Copy response text'}
                            onClick={handleCopy}
                            className="p-1 rounded hover:bg-kleava-surface-soft dark:hover:bg-[#1E2A27] text-kleava-text-secondary hover:text-kleava-text-primary transition-colors focus-ring-kleava flex items-center space-x-1 min-w-[24px]"
                        >
                            {isCopied ? (
                                <>
                                    <Check className="w-3.5 h-3.5 text-kleava-accent" />
                                    <span className="typography-metadata text-[9.5px] text-kleava-accent font-medium">
                                        Copied
                                    </span>
                                </>
                            ) : (
                                <Copy className="w-3.5 h-3.5" />
                            )}
                        </button>

                        {/* Read Aloud (TTS) Button */}
                        <button
                            type="button"
                            aria-label={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                            onClick={handleToggleSpeech}
                            className={cn(
                                'p-1 rounded transition-colors focus-ring-kleava',
                                isSpeaking
                                    ? 'bg-kleava-accent/15 text-kleava-accent'
                                    : 'hover:bg-kleava-surface-soft dark:hover:bg-[#1E2A27] text-kleava-text-secondary hover:text-kleava-text-primary'
                            )}
                        >
                            {isSpeaking ? (
                                <VolumeX className="w-3.5 h-3.5 text-kleava-accent" />
                            ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                            )}
                        </button>

                        {/* Regenerate / Retry Action */}
                        {onRetry && (
                            <button
                                type="button"
                                aria-label="Regenerate response"
                                title="Regenerate response"
                                onClick={() => onRetry(message.id)}
                                className="p-1 rounded hover:bg-kleava-surface-soft dark:hover:bg-[#1E2A27] text-kleava-text-secondary hover:text-kleava-text-primary transition-colors focus-ring-kleava"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                        )}

                        {/* Love Button (Outline -> Red Filled) */}
                        <button
                            type="button"
                            aria-label="Love response"
                            aria-pressed={message.feedback === 'love'}
                            onClick={handleLoveClick}
                            className={cn(
                                'p-1 rounded transition-colors focus-ring-kleava',
                                message.feedback === 'love'
                                    ? 'text-red-500 bg-red-500/10'
                                    : 'hover:bg-kleava-surface-soft dark:hover:bg-[#1E2A27] text-kleava-text-secondary hover:text-red-400'
                            )}
                        >
                            <Heart
                                className={cn(
                                    'w-3.5 h-3.5 transition-transform active:scale-125',
                                    message.feedback === 'love' && 'fill-current text-red-500'
                                )}
                            />
                        </button>

                        {/* Broken Love Button (Outline -> Negative State) */}
                        <button
                            type="button"
                            aria-label="Dislike response"
                            aria-pressed={message.feedback === 'broken-love'}
                            onClick={handleBrokenLoveClick}
                            className={cn(
                                'p-1 rounded transition-colors focus-ring-kleava',
                                message.feedback === 'broken-love'
                                    ? 'text-red-600 bg-red-500/10'
                                    : 'hover:bg-kleava-surface-soft dark:hover:bg-[#1E2A27] text-kleava-text-secondary hover:text-kleava-text-primary'
                            )}
                        >
                            <HeartCrack
                                className={cn(
                                    'w-3.5 h-3.5 transition-transform active:scale-125',
                                    message.feedback === 'broken-love' && 'text-red-600'
                                )}
                            />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AssistantMessage;