'use client';

import React from 'react';
import { ChevronDown, AlertCircle, RotateCcw } from 'lucide-react';
import { ChatMessage, MessageFeedback } from '@/types';
import { UserMessage } from '@/components/messages/user-message';
import { AssistantMessage } from '@/components/messages/assistant-message';
import { ConversationLoading } from '@/components/messages/conversation-loading';
import { useConversationScroll } from '@/hooks/use-conversation-scroll';
import { cn } from '@/lib/utils';

export interface ConversationViewProps {
    messages: ChatMessage[];
    isLoadingSession?: boolean;
    sessionError?: string | null;
    currentlySpeakingId?: string | null;
    onStartSpeaking?: (messageId: string) => void;
    onStopSpeaking?: () => void;
    onRetrySession?: () => void;
    onEditMessage?: (messageId: string, newContent: string) => void;
    onFeedbackMessage?: (messageId: string, feedback: MessageFeedback) => void;
    onRetryMessage?: (messageId: string) => void;
    className?: string;
}

/**
 * ConversationView: Scrollable conversation stream with maximum readable width (720px),
 * intelligent auto-scroll hook, scroll-to-bottom affordance button, and session error boundaries.
 */
export function ConversationView({
    messages,
    isLoadingSession = false,
    sessionError = null,
    currentlySpeakingId = null,
    onStartSpeaking,
    onStopSpeaking,
    onRetrySession,
    onEditMessage,
    onFeedbackMessage,
    onRetryMessage,
    className,
}: ConversationViewProps) {
    const {
        containerRef,
        bottomAnchorRef,
        showScrollBottomButton,
        handleScroll,
        scrollToBottom,
    } = useConversationScroll({
        threshold: 90,
        dependency: messages,
    });

    return (
        <div className="relative w-full h-full flex flex-col min-h-0 overflow-hidden">
            {/* 1. Main Scrollable Container */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className={cn(
                    'w-full flex-1 flex flex-col justify-start py-4 px-2.5 sm:px-5',
                    'overflow-y-auto scrollbar-none select-text',
                    className
                )}
            >
                {/* Centered Maximum Readable Canvas Width */}
                <div className="w-full max-w-[720px] mx-auto flex flex-col space-y-1">
                    {/* Session Load Error Banner */}
                    {sessionError && (
                        <div className="my-3 p-3 rounded-kleava-md bg-red-50/80 border border-red-200 text-xs text-kleava-destructive flex items-center justify-between shadow-sm">
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{sessionError}</span>
                            </div>
                            {onRetrySession && (
                                <button
                                    type="button"
                                    onClick={onRetrySession}
                                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-white border border-red-200 text-kleava-destructive hover:bg-red-50 text-[11px] font-medium transition-colors"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Retry</span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Session Transition Loading Indicator */}
                    {isLoadingSession && (
                        <div className="py-6 flex justify-center">
                            <ConversationLoading label="Loading conversation history..." />
                        </div>
                    )}

                    {/* Message List */}
                    {messages.map((msg) => {
                        if (msg.role === 'user') {
                            return (
                                <UserMessage
                                    key={msg.id}
                                    message={msg}
                                    onEdit={onEditMessage}
                                />
                            );
                        }
                        if (msg.role === 'assistant') {
                            return (
                                <AssistantMessage
                                    key={msg.id}
                                    message={msg}
                                    currentlySpeakingId={currentlySpeakingId}
                                    onStartSpeaking={onStartSpeaking}
                                    onStopSpeaking={onStopSpeaking}
                                    onFeedback={onFeedbackMessage}
                                    onRetry={onRetryMessage}
                                />
                            );
                        }
                        return null;
                    })}

                    {/* Bottom Anchor Reference */}
                    <div ref={bottomAnchorRef} className="h-6 flex-shrink-0" />
                </div>
            </div>

            {/* 2. Floating "Scroll to Bottom" Affordance Pill Button */}
            {showScrollBottomButton && (
                <button
                    type="button"
                    aria-label="Scroll to newest messages"
                    onClick={() => scrollToBottom('smooth')}
                    className={cn(
                        'absolute bottom-3 left-1/2 -translate-x-1/2 z-30',
                        'h-8 px-3 rounded-kleava-control select-none',
                        'bg-kleava-surface text-kleava-text-primary text-xs font-medium',
                        'border border-kleava-border-subtle/80 shadow-kleava-floating',
                        'flex items-center space-x-1.5 hover:bg-kleava-surface-light hover:text-kleava-accent',
                        'transition-all duration-200 active:scale-95 focus-ring-kleava',
                        'animate-in fade-in slide-in-from-bottom-2'
                    )}
                >
                    <ChevronDown className="w-3.5 h-3.5 text-kleava-accent" />
                    <span className="typography-metadata text-[11px] font-medium">New messages</span>
                </button>
            )}
        </div>
    );
}

export default ConversationView;