'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CodeBlockProps {
    code: string;
    language?: string;
    className?: string;
}

/**
 * Lightweight, XSS-safe, and restrained token highlighter.
 * Formats keywords, strings, comments, numbers, types, and functions
 * in JetBrains Mono with balanced, non-neon contrast.
 */
function highlightCodeTokens(rawCode: string, lang: string): React.ReactNode[] {
    const lines = rawCode.split('\n');

    return lines.map((line, lIdx) => {
        const tokens: React.ReactNode[] = [];
        let remaining = line;
        let keyIdx = 0;

        // Token matching regex for JS/TS, Python, JSON, Bash, and general languages
        const tokenRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|import|export|from|if|else|switch|case|break|for|while|try|catch|async|await|class|interface|type|extends|implements|new|this|def|class|print|true|false|null|undefined)\b|\b\d+\b)/g;

        let match;
        let lastIndex = 0;

        while ((match = tokenRegex.exec(remaining)) !== null) {
            const matchText = match[0];
            const matchStart = match.index;

            if (matchStart > lastIndex) {
                tokens.push(
                    <span key={`${lIdx}-${keyIdx++}`} className="text-[#D1D5DB]">
                        {remaining.slice(lastIndex, matchStart)}
                    </span>
                );
            }

            if (matchText.startsWith('//') || matchText.startsWith('/*') || (lang === 'python' && matchText.startsWith('#'))) {
                tokens.push(
                    <span key={`${lIdx}-${keyIdx++}`} className="text-[#6B7280] italic">
                        {matchText}
                    </span>
                );
            } else if (matchText.startsWith('"') || matchText.startsWith("'") || matchText.startsWith('`')) {
                tokens.push(
                    <span key={`${lIdx}-${keyIdx++}`} className="text-[#34D399]">
                        {matchText}
                    </span>
                );
            } else if (/^\d+$/.test(matchText)) {
                tokens.push(
                    <span key={`${lIdx}-${keyIdx++}`} className="text-[#FBBF24]">
                        {matchText}
                    </span>
                );
            } else {
                tokens.push(
                    <span key={`${lIdx}-${keyIdx++}`} className="text-[#60A5FA] font-medium">
                        {matchText}
                    </span>
                );
            }

            lastIndex = matchStart + matchText.length;
        }

        if (lastIndex < remaining.length) {
            tokens.push(
                <span key={`${lIdx}-${keyIdx++}`} className="text-[#E5E7EB]">
                    {remaining.slice(lastIndex)}
                </span>
            );
        }

        return (
            <div key={lIdx} className="table-row leading-relaxed">
                {/* Unselectable & Un-copyable Line Number Column */}
                <span className="table-cell pr-4 text-right select-none text-[#4B5563] text-xs font-code w-9">
                    {lIdx + 1}
                </span>
                {/* Safe Monospace Code Text Column */}
                <span className="table-cell select-text whitespace-pre font-code text-xs text-[#E5E7EB]">
                    {tokens.length > 0 ? tokens : ' '}
                </span>
            </div>
        );
    });
}

const MIN_BLOCK_HEIGHT = 120;

/**
 * CodeBlock: Clean editorial code viewer container for Kleava AI.
 * - 6px corner radius and pure dark surface (#0D0D0D)
 * - JetBrains Mono typography across all elements
 * - Independent copy button (copies pure code without line numbers)
 * - Horizontal overflow scrolling and vertical drag-resizing
 */
export function CodeBlock({ code, language = 'code', className }: CodeBlockProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [customHeight, setCustomHeight] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dragStartYRef = useRef<number>(0);
    const dragStartHeightRef = useRef<number>(MIN_BLOCK_HEIGHT);

    const rawLanguage = (language || 'code').toLowerCase().trim();

    // Clean timeout on unmount
    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        };
    }, []);

    // Copy pure raw code (excluding line numbers & header)
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setIsCopied(true);
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
            copyTimeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
        } catch {
            setIsCopied(false);
        }
    };

    // Drag-Resize Handlers (Mouse & Touch)
    const handleResizeStart = (clientY: number) => {
        setIsDragging(true);
        dragStartYRef.current = clientY;
        dragStartHeightRef.current = containerRef.current?.getBoundingClientRect().height || MIN_BLOCK_HEIGHT;
    };

    const handleResizeMove = useCallback((clientY: number) => {
        const deltaY = clientY - dragStartYRef.current;
        const maxViewportHeight = window.innerHeight * 0.8;
        const newHeight = Math.min(
            Math.max(dragStartHeightRef.current + deltaY, MIN_BLOCK_HEIGHT),
            maxViewportHeight
        );
        setCustomHeight(newHeight);
    }, []);

    const handleResizeEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (isDragging) handleResizeMove(e.clientY);
        };
        const onTouchMove = (e: TouchEvent) => {
            if (isDragging && e.touches[0]) handleResizeMove(e.touches[0].clientY);
        };
        const onMouseUp = () => isDragging && handleResizeEnd();
        const onTouchEnd = () => isDragging && handleResizeEnd();

        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('touchmove', onTouchMove);
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('touchend', onTouchEnd);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [isDragging, handleResizeMove, handleResizeEnd]);

    return (
        <div
            ref={containerRef}
            style={{ height: customHeight ? `${customHeight}px` : undefined }}
            className={cn(
                'relative w-full my-3.5 flex flex-col font-code',
                'rounded-[6px] overflow-hidden select-none',
                'bg-[#0D0D0D] text-[#E5E7EB]',
                'border border-[#262626] shadow-sm',
                'transition-shadow duration-150',
                isDragging && 'ring-1 ring-kleava-accent/60',
                className
            )}
        >
            {/* 1. Header Bar: Language Badge & Independent Copy Button */}
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#171717] border-b border-[#262626] text-xs">
                <span className="text-[#9CA3AF] lowercase tracking-wider text-[11px] font-medium font-code">
                    {rawLanguage}
                </span>

                <button
                    type="button"
                    aria-label={isCopied ? `Copied ${rawLanguage} code` : `Copy ${rawLanguage} code`}
                    onClick={handleCopy}
                    className={cn(
                        'flex items-center space-x-1.5 px-2 py-0.5 rounded-[4px]',
                        'text-[#9CA3AF] hover:text-white hover:bg-[#262626]',
                        'transition-colors duration-150 focus-ring-kleava'
                    )}
                >
                    {isCopied ? (
                        <>
                            <Check className="w-3 h-3 text-kleava-accent" />
                            <span className="text-[10.5px] text-kleava-accent font-ui font-medium">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[10.5px] font-ui">Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* 2. Scrollable Code Body with Line Numbers */}
            <div className="flex-1 overflow-x-auto overflow-y-auto p-3.5 max-h-[380px] scrollbar-none">
                <div className="table w-full border-collapse">
                    {highlightCodeTokens(code, rawLanguage)}
                </div>
            </div>

            {/* 3. Bottom Drag-Resize Handle */}
            <div
                role="separator"
                aria-orientation="horizontal"
                aria-label="Resize code block height"
                onMouseDown={(e) => handleResizeStart(e.clientY)}
                onTouchStart={(e) => e.touches[0] && handleResizeStart(e.touches[0].clientY)}
                className="h-2 w-full flex items-center justify-center cursor-row-resize bg-[#141414] hover:bg-[#202020] transition-colors group"
            >
                <span className="w-6 h-0.5 rounded-full bg-[#3F3F46] group-hover:bg-kleava-accent/70 transition-colors" />
            </div>
        </div>
    );
}

export default CodeBlock;