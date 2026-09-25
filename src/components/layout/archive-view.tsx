'use client';

import React from 'react';
import { ArrowLeft, Archive, RotateCcw, Trash2 } from 'lucide-react';
import { ChatSession } from '@/types';
import { formatRelativeTime } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

export interface ArchiveViewProps {
    archivedChats: ChatSession[];
    onBack: () => void;
    onSelectChat: (chatId: string) => void;
    onUnarchive: (chatId: string) => void;
    onDelete: (chatId: string) => void;
    className?: string;
}

/**
 * ArchiveView: Clean sub-panel within the navigation window
 * displaying all archived conversations with unarchive and delete capabilities.
 */
export function ArchiveView({
    archivedChats,
    onBack,
    onSelectChat,
    onUnarchive,
    onDelete,
    className,
}: ArchiveViewProps) {
    return (
        <div
            className={cn(
                'w-full h-full flex flex-col select-none font-ui',
                'animate-in fade-in slide-in-from-right-3 duration-200 ease-out',
                className
            )}
        >
            {/* Header Bar */}
            <div className="flex items-center justify-between pb-2.5 border-b border-kleava-border-subtle/50 mb-2 flex-shrink-0">
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        aria-label="Back to navigation"
                        onClick={onBack}
                        className="w-6 h-6 rounded-kleava-sm flex items-center justify-center text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-soft transition-colors focus-ring-kleava"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="typography-label font-semibold text-xs text-kleava-text-primary">
                        Archived Chats
                    </span>
                </div>

                <span className="typography-metadata text-[10px] text-kleava-text-secondary">
                    {archivedChats.length} Archived
                </span>
            </div>

            {/* Archived Chats List */}
            <div className="flex-1 overflow-y-auto scrollbar-none pr-0.5 space-y-1 min-h-[160px]">
                {archivedChats.length === 0 ? (
                    <div className="py-10 text-center px-4 rounded-kleava-md bg-kleava-surface-light/20 border border-kleava-border-subtle/40 my-auto">
                        <Archive className="w-6 h-6 text-kleava-text-secondary/40 mx-auto mb-1.5" />
                        <p className="typography-caption text-kleava-text-secondary text-xs">
                            No archived conversations.
                        </p>
                    </div>
                ) : (
                    archivedChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => onSelectChat(chat.id)}
                            className={cn(
                                'group p-2.5 rounded-kleava-md border transition-all duration-150 cursor-pointer',
                                'bg-kleava-surface border-kleava-border-subtle/60 hover:bg-kleava-surface-light/50 shadow-2xs',
                                'flex items-center justify-between space-x-2'
                            )}
                        >
                            <div className="flex flex-col min-w-0 pr-1">
                                <span className="typography-label text-xs font-medium text-kleava-text-primary truncate">
                                    {chat.title}
                                </span>
                                <span className="typography-metadata text-[10px] text-kleava-text-secondary mt-0.5">
                                    Archived • {formatRelativeTime(chat.updatedAt)}
                                </span>
                            </div>

                            {/* Action Buttons: Restore (Unarchive) & Delete */}
                            <div
                                className="flex items-center space-x-1 shrink-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Unarchive */}
                                <button
                                    type="button"
                                    aria-label={`Unarchive ${chat.title}`}
                                    title="Unarchive and restore to recent chats"
                                    onClick={() => onUnarchive(chat.id)}
                                    className="p-1 rounded text-kleava-text-secondary hover:text-kleava-accent hover:bg-kleava-surface-soft transition-colors focus-ring-kleava"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>

                                {/* Permanent Delete */}
                                <button
                                    type="button"
                                    aria-label={`Delete ${chat.title}`}
                                    title="Delete permanently"
                                    onClick={() => onDelete(chat.id)}
                                    className="p-1 rounded text-kleava-text-secondary hover:text-kleava-destructive hover:bg-red-50 transition-colors focus-ring-kleava"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer Status */}
            <div className="mt-2 pt-2 border-t border-kleava-border-subtle/40 flex items-center justify-between text-kleava-text-secondary flex-shrink-0">
                <span className="typography-metadata text-[10px]">
                    Archived items are preserved safely
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-kleava-accent" />
            </div>
        </div>
    );
}

export default ArchiveView;