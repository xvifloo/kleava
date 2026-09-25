'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseConversationScrollOptions {
    threshold?: number;
    dependency?: unknown;
}

/**
 * useConversationScroll: Intelligent scroll management hook for streaming conversations.
 * Auto-scrolls when user is near bottom, pauses auto-scroll when user scrolls up to read,
 * and exposes a floating affordance trigger to smoothly return to bottom.
 */
export function useConversationScroll({
    threshold = 100,
    dependency,
}: UseConversationScrollOptions = {}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const bottomAnchorRef = useRef<HTMLDivElement>(null);
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [showScrollBottomButton, setShowScrollBottomButton] = useState(false);
    const isAutoScrollingRef = useRef(false);
    const rafIdRef = useRef<number | null>(null);

    // Check scroll position
    const handleScroll = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;

        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        const near = distanceFromBottom <= threshold;

        setIsNearBottom(near);
        setShowScrollBottomButton(!near && el.scrollHeight > el.clientHeight);
    }, [threshold]);

    // Smooth scroll to bottom
    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }

        rafIdRef.current = requestAnimationFrame(() => {
            if (bottomAnchorRef.current) {
                const prefersReduced =
                    typeof window !== 'undefined' &&
                    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                bottomAnchorRef.current.scrollIntoView({
                    behavior: prefersReduced ? 'auto' : behavior,
                });
            }
        });
    }, []);

    // Follow stream if user is near bottom
    useEffect(() => {
        if (isNearBottom && !isAutoScrollingRef.current) {
            scrollToBottom('smooth');
        }
    }, [dependency, isNearBottom, scrollToBottom]);

    // Clean up RAF on unmount
    useEffect(() => {
        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    return {
        containerRef,
        bottomAnchorRef,
        isNearBottom,
        showScrollBottomButton,
        handleScroll,
        scrollToBottom,
    };
}

export default useConversationScroll;