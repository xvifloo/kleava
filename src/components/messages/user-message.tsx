'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Pencil, Copy, Check, FileText } from 'lucide-react';
import { ChatMessage } from '@/types';
import { formatRelativeTime } from '@/lib/date-utils';
import { formatFileSize } from '@/config/attachments';
import { useSettings } from '@/state/settings-context';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export interface UserMessageProps {
    message: ChatMessage;
    onEdit?: (messageId: string, newContent: string) => void;
    className?: string;
}

const LONG_TEXT_THRESHOLD = 320;

/**
 * UserMessage: Borderless, clean message card with an external
 * metadata row (Time, Edit, Copy) neatly positioned beneath the surface.
 */
export function UserMessage({ message, onEdit, className }: UserMessageProps) {
    const { settings } = useSettings();
    const lang = settings.language;

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const editTextareaRef = useRef<HTMLTextAreaElement>(null);
    const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isLong = message.content.length > LONG_TEXT_THRESHOLD;
    const displayContent =
        isLong && !isExpanded ? `${message.content.slice(0, LONG_TEXT_THRESHOLD)}...` : message.content;

    // Cleanup copy timeout
    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        };
    }, []);

    // Autofocus when entering edit mode
    useEffect(() => {
        if (isEditing) {
            editTextareaRef.current?.focus();
            editTextareaRef.current?.setSelectionRange(editContent.length, editContent.length);
        }
    }, [isEditing, editContent.length]);

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

    const handleSaveEdit = () => {
        const trimmed = editContent.trim();
        if (trimmed && trimmed !== message.content) {
            onEdit?.(message.id, trimmed);
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditContent(message.content);
        setIsEditing(false);
    };

    return (
        <div
            className={cn(
                'group relative w-full flex flex-col items-end my-3 select-text font-ui',
                className
            )}
        >
            {/* 1. User Message Surface (Borderless, Clean, Soft Shadow) */}
            <div
                className={cn(
                    'w-auto min-w-[120px] max-w-[92%] sm:max-w-[85%] md:max-w-[78%]',
                    'bg-kleava-surface dark:bg-[#151F1C] text-kleava-text-primary',
                    'rounded-kleava-md border-0',
                    'shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_14px_-2px_rgba(0,0,0,0.35)]',
                    'p-3.5 sm:p-4 transition-all duration-150'
                )}
            >
                {/* Attachment Previews in Message Body */}
                {message.attachments && message.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2.5 select-none">
                        {message.attachments.map((att) => (
                            <div
                                key={att.id}
                                className="flex items-center space-x-2 p-1.5 rounded-[6px] bg-kleava-surface-soft dark:bg-[#1E2A27] border-0 text-xs text-kleava-text-primary"
                            >
                                {att.previewUrl ? (
                                    <div className="w-9 h-9 relative rounded overflow-hidden shrink-0 bg-kleava-surface">
                                        <Image
                                            src={att.previewUrl}
                                            alt={att.name}
                                            fill
                                            sizes="36px"
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded bg-kleava-surface dark:bg-[#151F1C] flex items-center justify-center shrink-0">
                                        <FileText className="w-4 h-4 text-kleava-text-secondary" />
                                    </div>
                                )}
                                <div className="flex flex-col min-w-0 pr-1">
                                    <span className="max-w-[140px] truncate font-medium text-xs leading-tight">
                                        {att.name}
                                    </span>
                                    <span className="typography-metadata text-[10px] text-kleava-text-secondary mt-0.5">
                                        {formatFileSize(att.size)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Message Text Content */}
                {isEditing ? (
                    <div className="flex flex-col space-y-2">
                        <textarea
                            ref={editTextareaRef}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                    e.preventDefault();
                                    handleSaveEdit();
                                }
                                if (e.key === 'Escape') handleCancelEdit();
                            }}
                            rows={3}
                            className="w-full p-2 text-sm bg-kleava-surface-light/40 dark:bg-[#1E2A27]/60 border border-kleava-accent/40 rounded-kleava-sm text-kleava-text-primary focus:outline-none resize-y font-ui"
                        />
                        <div className="flex items-center justify-end space-x-2 select-none">
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-2.5 py-1 text-xs rounded bg-kleava-surface-soft dark:bg-[#1E2A27] text-kleava-text-secondary hover:text-kleava-text-primary transition-colors focus-ring-kleava"
                            >
                                {t('cancel', lang)}
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveEdit}
                                className="px-2.5 py-1 text-xs rounded bg-kleava-accent text-white font-medium hover:opacity-90 transition-opacity focus-ring-kleava shadow-2xs"
                            >
                                {t('save', lang)}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <p className="ai-response-prose text-[15px] leading-[1.65] whitespace-pre-wrap break-words">
                            {displayContent}
                        </p>

                        {/* Long Text Expand/Collapse Toggle */}
                        {isLong && (
                            <button
                                type="button"
                                aria-expanded={isExpanded}
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-1.5 self-start text-xs font-medium text-kleava-accent hover:underline focus-ring-kleava select-none"
                            >
                                {isExpanded ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* 2. Metadata Action Row: Positioned Cleanly Beneath the Surface */}
            <div className="mt-1.5 pr-1 flex items-center space-x-3 text-kleava-text-secondary text-xs select-none">
                {/* Relative Timestamp & Edited Indicator */}
                <div className="flex items-center space-x-1">
                    <span className="typography-metadata text-[10.5px]">
                        {formatRelativeTime(message.createdAt)}
                    </span>
                    {message.isEdited && (
                        <span className="typography-metadata text-[9.5px] italic text-kleava-text-secondary/70">
                            {t('editedBadge', lang)}
                        </span>
                    )}
                </div>

                {/* Edit Action */}
                <button
                    type="button"
                    aria-label={t('edit', lang)}
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-1 typography-metadata text-[10.5px] hover:text-kleava-text-primary transition-colors focus-ring-kleava"
                >
                    <Pencil className="w-3 h-3" />
                    <span>{t('edit', lang)}</span>
                </button>

                {/* Copy Action */}
                <button
                    type="button"
                    aria-label={isCopied ? t('copied', lang) : t('copy', lang)}
                    onClick={handleCopy}
                    className="flex items-center space-x-1 typography-metadata text-[10.5px] hover:text-kleava-text-primary transition-colors focus-ring-kleava min-w-[36px]"
                >
                    {isCopied ? (
                        <>
                            <Check className="w-3 h-3 text-kleava-accent" />
                            <span className="text-kleava-accent font-medium">{t('copied', lang)}</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" />
                            <span>{t('copy', lang)}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default UserMessage;