'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Pencil, Copy, Check, FileText, CheckCheck } from 'lucide-react';
import { ChatMessage } from '@/types';
import { formatRelativeTime } from '@/lib/date-utils';
import { formatFileSize } from '@/config/attachments';
import { cn } from '@/lib/utils';

export interface UserMessageProps {
    message: ChatMessage;
    onEdit?: (messageId: string, newContent: string) => void;
    className?: string;
}

const LONG_TEXT_THRESHOLD = 320;

/**
 * UserMessage: Clean rectangular message card for user inputs.
 * Supports image thumbnail cards, document attachment previews,
 * inline editing, and one-click copy.
 */
export function UserMessage({ message, onEdit, className }: UserMessageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const isLong = message.content.length > LONG_TEXT_THRESHOLD;
    const displayContent =
        isLong && !isExpanded ? `${message.content.slice(0, LONG_TEXT_THRESHOLD)}...` : message.content;

    // Copy plain text content only (excluding attachments)
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch {
            setIsCopied(false);
        }
    };

    // Commit Edit
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
        <div className={cn('group relative w-full flex flex-col items-end my-3 select-text', className)}>
            {/* Message Card Container */}
            <div
                className={cn(
                    'w-full max-w-[92%] sm:max-w-[85%] md:max-w-[78%]',
                    'bg-kleava-surface text-kleava-text-primary',
                    'rounded-kleava-md border border-kleava-border-subtle/70',
                    'shadow-kleava-subtle p-3.5 sm:p-4',
                    'transition-all duration-200'
                )}
            >
                {/* Rich Attachment Previews in User Message */}
                {message.attachments && message.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2.5 pb-2.5 border-b border-kleava-border-subtle/40 select-none">
                        {message.attachments.map((att) => (
                            <div
                                key={att.id}
                                className="flex items-center space-x-2 p-1.5 rounded-[6px] bg-kleava-surface-soft border border-kleava-border-subtle/80 text-xs text-kleava-text-primary"
                            >
                                {att.previewUrl ? (
                                    <div className="w-9 h-9 relative rounded overflow-hidden flex-shrink-0 bg-kleava-surface border border-kleava-border-subtle">
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
                                    <div className="w-8 h-8 rounded bg-kleava-surface flex items-center justify-center flex-shrink-0 border border-kleava-border-subtle">
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

                {/* Message Content Body */}
                {isEditing ? (
                    <div className="flex flex-col space-y-2">
                        <textarea
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
                            className="w-full p-2 text-sm bg-kleava-surface-light/50 border border-kleava-accent rounded-kleava-sm text-kleava-text-primary focus:outline-none resize-y"
                        />
                        <div className="flex items-center justify-end space-x-2">
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-2.5 py-1 text-xs rounded bg-kleava-surface-soft text-kleava-text-secondary hover:text-kleava-text-primary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveEdit}
                                className="px-2.5 py-1 text-xs rounded bg-kleava-accent text-white font-medium hover:opacity-90 transition-opacity"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <p className="ai-response-prose text-sm whitespace-pre-wrap leading-relaxed">
                            {displayContent}
                        </p>

                        {/* Long Text Expand/Collapse Toggle */}
                        {isLong && (
                            <button
                                type="button"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-1.5 self-start text-xs font-medium text-kleava-accent hover:underline focus:outline-none"
                            >
                                {isExpanded ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </div>
                )}

                {/* Bottom Metadata & Action Tray */}
                <div className="mt-2.5 pt-2 border-t border-kleava-border-subtle/30 flex items-center justify-between text-kleava-text-secondary text-xs select-none">
                    {/* Timestamp & Status */}
                    <div className="flex items-center space-x-1.5">
                        <span className="typography-metadata text-[10.5px]">
                            {formatRelativeTime(message.createdAt)}
                        </span>
                        {message.isEdited && (
                            <span className="typography-metadata text-[9.5px] italic text-kleava-text-secondary/70">
                                (edited)
                            </span>
                        )}
                        <CheckCheck className="w-3 h-3 text-kleava-accent/80" />
                    </div>

                    {/* Action Icons (Edit & Copy) */}
                    <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {/* Edit Trigger */}
                        <button
                            type="button"
                            aria-label="Edit message"
                            onClick={() => setIsEditing(true)}
                            className="p-1 rounded-kleava-sm hover:bg-kleava-surface-soft text-kleava-text-secondary hover:text-kleava-text-primary transition-colors focus-ring-kleava"
                        >
                            <Pencil className="w-3 h-3" />
                        </button>

                        {/* Copy Trigger */}
                        <button
                            type="button"
                            aria-label={isCopied ? 'Copied' : 'Copy message'}
                            onClick={handleCopy}
                            className="p-1 rounded-kleava-sm hover:bg-kleava-surface-soft text-kleava-text-secondary hover:text-kleava-text-primary transition-colors focus-ring-kleava flex items-center space-x-1"
                        >
                            {isCopied ? (
                                <>
                                    <Check className="w-3 h-3 text-kleava-accent" />
                                    <span className="typography-metadata text-[9.5px] text-kleava-accent font-medium">
                                        Copied
                                    </span>
                                </>
                            ) : (
                                <Copy className="w-3 h-3" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserMessage;