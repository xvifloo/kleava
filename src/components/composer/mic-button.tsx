'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MicButtonProps {
    onTranscript: (transcript: string) => void;
    disabled?: boolean;
    className?: string;
}

interface SpeechRecognitionEvent {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
            };
        };
    };
}

interface SpeechRecognitionInstance {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: (() => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
    abort: () => void;
}

interface SpeechRecognitionConstructor {
    new(): SpeechRecognitionInstance;
}

interface SpeechWindow extends Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

/**
 * MicButton: 36x36px borderless control with Light (#E2EEE9) and Dark (#1E2A27) soft surface.
 */
export function MicButton({ onTranscript, disabled = false, className }: MicButtonProps) {
    const [isListening, setIsListening] = useState(false);
    const [hasSupport, setHasSupport] = useState(true);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showFeedback = useCallback((msg: string) => {
        setFeedbackMessage(msg);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setFeedbackMessage(null), 3000);
    }, []);

    useEffect(() => {
        const win = typeof window !== 'undefined' ? (window as unknown as SpeechWindow) : null;
        const SpeechAPI = win?.SpeechRecognition || win?.webkitSpeechRecognition;

        if (SpeechAPI) {
            try {
                const recognition = new SpeechAPI();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onresult = (event: SpeechRecognitionEvent) => {
                    const transcript = event.results[0]?.[0]?.transcript;
                    if (transcript) {
                        onTranscript(transcript);
                    }
                    setIsListening(false);
                };

                recognition.onerror = () => {
                    setIsListening(false);
                    showFeedback('Mic unavailable or permission denied');
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            } catch {
                setHasSupport(false);
            }
        } else {
            setHasSupport(false);
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [onTranscript, showFeedback]);

    const toggleListening = () => {
        if (!hasSupport) {
            showFeedback('Speech recognition unsupported');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch {
                setIsListening(false);
                showFeedback('Could not start microphone');
            }
        }
    };

    return (
        <div className="relative inline-flex items-center select-none font-ui shrink-0">
            <button
                type="button"
                aria-label={isListening ? 'Stop listening' : 'Voice input'}
                aria-pressed={isListening}
                disabled={disabled}
                onClick={toggleListening}
                className={cn(
                    // 36x36px borderless control
                    'w-[36px] h-[36px] min-w-[36px] min-h-[36px] rounded-kleava-control flex items-center justify-center shrink-0 border-0 outline-none ring-0',
                    // Soft theme-aware surface (#E2EEE9 in light, #1E2A27 in dark)
                    'bg-[#E2EEE9] dark:bg-[#1E2A27] text-kleava-text-secondary dark:text-[#8A9E97]',
                    'hover:bg-[#E2F5F0] dark:hover:bg-[#253531] hover:text-kleava-accent',
                    'transition-all duration-150 active:scale-95 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kleava-accent',
                    isListening && 'bg-kleava-accent/15 text-kleava-accent ring-2 ring-kleava-accent/40 animate-pulse',
                    disabled && 'opacity-60 cursor-not-allowed',
                    className
                )}
            >
                {isListening ? (
                    <Mic className="w-4 h-4 text-kleava-accent" />
                ) : hasSupport ? (
                    <Mic className="w-4 h-4" />
                ) : (
                    <MicOff className="w-4 h-4 opacity-60" />
                )}
            </button>

            {feedbackMessage && (
                <div className="absolute right-0 bottom-11 z-50 whitespace-nowrap px-2.5 py-1 rounded bg-kleava-text-primary text-white typography-metadata text-[10px] shadow-sm animate-in fade-in">
                    {feedbackMessage}
                </div>
            )}
        </div>
    );
}

export default MicButton;