'use client';

import React, { useState, useMemo } from 'react';
import { Pin, GripVertical } from 'lucide-react';
import { ChatSession, ChatTimeGroup } from '@/types';
import { groupChatsByDate, formatRelativeTime } from '@/lib/date-utils';
import { highlightMatch } from '@/lib/search-utils';
import { ChatItemActions } from '@/components/layout/chat-item-actions';
import { cn } from '@/lib/utils';

export interface ChatListProps {
  chats: ChatSession[];
  searchQuery?: string;
  onClearSearch?: () => void;
  activeChatId?: string;
  onSelectChat: (chatId: string) => void;
  onPinToggle: (chatId: string) => void;
  onRename: (chatId: string, newTitle: string) => void;
  onArchive: (chatId: string) => void;
  onDelete: (chatId: string) => void;
  onReorderPinned: (reorderedPinned: ChatSession[]) => void;
  className?: string;
}

/**
 * ChatList: Renders active recent conversation groups (Pinned, Today, Yesterday, Previous 7 Days, Older).
 * Pinned chats support smooth HTML5 drag reordering with local storage state persistence.
 */
export function ChatList({
  chats,
  searchQuery = '',
  onClearSearch,
  activeChatId,
  onSelectChat,
  onPinToggle,
  onRename,
  onArchive,
  onDelete,
  onReorderPinned,
  className,
}: ChatListProps) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [draggedChatId, setDraggedChatId] = useState<string | null>(null);
  const [openMenuChatId, setOpenMenuChatId] = useState<string | null>(null);

  // Group unarchived chats
  const activeChatsOnly = useMemo(() => chats.filter((c) => !c.isArchived), [chats]);
  const groups = useMemo(() => groupChatsByDate(activeChatsOnly), [activeChatsOnly]);
  const groupKeys: ChatTimeGroup[] = ['Pinned', 'Today', 'Yesterday', 'Previous 7 Days', 'Older'];
  const hasResults = Object.values(groups).some((g) => g.length > 0);

  // Start Rename
  const handleStartRename = (chat: ChatSession) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  // Commit Rename
  const handleSaveRename = (chatId: string) => {
    const trimmed = editTitle.trim();
    if (trimmed.length > 0) {
      onRename(chatId, trimmed);
    }
    setEditingChatId(null);
  };

  // Drag and Drop for Pinned Section
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedChatId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedChatId || draggedChatId === targetId) return;

    const pinnedList = [...groups.Pinned];
    const fromIndex = pinnedList.findIndex((c) => c.id === draggedChatId);
    const toIndex = pinnedList.findIndex((c) => c.id === targetId);

    if (fromIndex === -1 || toIndex === -1) return;

    const [movedItem] = pinnedList.splice(fromIndex, 1);
    pinnedList.splice(toIndex, 0, movedItem);

    const updated = pinnedList.map((item, idx) => ({
      ...item,
      pinnedOrder: idx,
    }));

    onReorderPinned(updated);
  };

  const handleDragEnd = () => {
    setDraggedChatId(null);
  };

  if (!hasResults) {
    return (
      <div className="py-8 text-center px-4 flex flex-col items-center justify-center space-y-2 select-none">
        <p className="typography-caption text-kleava-text-secondary text-xs">
          No recent chats yet.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('w-full flex flex-col space-y-3.5 select-none font-ui', className)}>
      {groupKeys.map((groupKey) => {
        const chatItems = groups[groupKey];
        if (chatItems.length === 0) return null;

        const isPinnedGroup = groupKey === 'Pinned';

        return (
          <div key={groupKey} className="flex flex-col space-y-1">
            {/* Group Heading */}
            <div className="px-2.5 py-0.5 flex items-center justify-between">
              <span className="typography-metadata uppercase tracking-wider text-[10px] font-semibold text-kleava-text-secondary/70">
                {groupKey}
              </span>
              {isPinnedGroup && (
                <Pin className="w-3 h-3 text-kleava-accent/70 fill-kleava-accent/20" />
              )}
            </div>

            {/* Chat Items List */}
            <div className="flex flex-col space-y-0.5">
              {chatItems.map((chat) => {
                const isActive = chat.id === activeChatId;
                const isEditing = chat.id === editingChatId;
                const isDragging = chat.id === draggedChatId;
                const isMenuOpen = chat.id === openMenuChatId;

                return (
                  <div
                    key={chat.id}
                    draggable={isPinnedGroup && !isEditing}
                    onDragStart={(e) => handleDragStart(e, chat.id)}
                    onDragOver={(e) => isPinnedGroup && handleDragOver(e, chat.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => !isEditing && onSelectChat(chat.id)}
                    title={chat.title}
                    className={cn(
                      'group relative w-full px-2.5 py-1.5 rounded-kleava-md',
                      'flex items-center justify-between space-x-2',
                      'transition-colors duration-150 cursor-pointer',
                      isActive
                        ? 'bg-kleava-surface-soft dark:bg-[#1E2A27] text-kleava-text-primary font-medium'
                        : 'text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-light/50 dark:hover:bg-[#1E2A27]/40',
                      isDragging && 'opacity-40 border border-dashed border-kleava-accent',
                      'focus-ring-kleava'
                    )}
                  >
                    {/* Drag Handle for Pinned Items */}
                    {isPinnedGroup && (
                      <GripVertical className="w-3 h-3 text-kleava-text-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0" />
                    )}

                    {/* Chat Title & Relative Timestamp */}
                    <div className="flex-1 min-w-0 pr-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editTitle}
                          autoFocus
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => handleSaveRename(chat.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(chat.id);
                            if (e.key === 'Escape') setEditingChatId(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-1.5 py-0.5 text-xs bg-kleava-surface border border-kleava-accent rounded text-kleava-text-primary focus:outline-none"
                        />
                      ) : (
                        <div className="flex flex-col">
                          <span className="typography-label text-xs truncate font-normal leading-tight text-kleava-text-primary">
                            {highlightMatch(chat.title, searchQuery)}
                          </span>
                          <span className="typography-metadata text-[10px] text-kleava-text-secondary/80 mt-0.5">
                            {formatRelativeTime(chat.updatedAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Refined Circular Two-Dot Action Button */}
                    <div
                      className="opacity-80 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ChatItemActions
                        chatId={chat.id}
                        chatTitle={chat.title}
                        isPinned={chat.isPinned}
                        isArchived={chat.isArchived}
                        isOpen={isMenuOpen}
                        onOpenToggle={(id) =>
                          setOpenMenuChatId((prev) => (prev === id ? null : id))
                        }
                        onClose={() => setOpenMenuChatId(null)}
                        onPinToggle={onPinToggle}
                        onRename={() => handleStartRename(chat)}
                        onArchive={onArchive}
                        onDelete={onDelete}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatList;