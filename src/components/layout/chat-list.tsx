'use client';

import React, { useState } from 'react';
import { Pin, GripVertical } from 'lucide-react';
import { ChatSession, ChatTimeGroup } from '@/types';
import { groupChatsByDate, formatRelativeTime } from '@/lib/date-utils';
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

  // Filter chats matching query
  const query = searchQuery.trim().toLowerCase();
  const filteredChats = query
    ? chats.filter((c) => c.title.toLowerCase().includes(query))
    : chats;

  const groups = groupChatsByDate(filteredChats);
  const groupKeys: ChatTimeGroup[] = ['Pinned', 'Today', 'Yesterday', 'Last 7 Days', 'Older'];
  const hasChats = Object.values(groups).some((g) => g.length > 0);

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

  // No Chats or Empty Search Result
  if (!hasChats) {
    return (
      <div className="py-8 text-center px-4 flex flex-col items-center justify-center space-y-2">
        <p className="typography-caption text-kleava-text-secondary">
          {query ? 'No chats found.' : 'No recent chats yet.'}
        </p>
        {query && onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="typography-metadata text-kleava-accent hover:underline focus:outline-none"
          >
            Clear search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full flex flex-col space-y-3.5 overflow-y-auto scrollbar-none', className)}>
      {groupKeys.map((groupKey) => {
        const chatItems = groups[groupKey];
        if (chatItems.length === 0) return null; // Suppress empty groups

        const isPinnedGroup = groupKey === 'Pinned';

        return (
          <div key={groupKey} className="flex flex-col space-y-1">
            {/* Group Header */}
            <div className="px-2.5 py-0.5 flex items-center justify-between">
              <span className="typography-metadata uppercase tracking-wider text-[10.5px] font-semibold text-kleava-text-secondary/80">
                {groupKey}
              </span>
              {isPinnedGroup && (
                <Pin className="w-3 h-3 text-kleava-accent/70 fill-kleava-accent/20" />
              )}
            </div>

            {/* Chat Items in Group */}
            <div className="flex flex-col space-y-0.5">
              {chatItems.map((chat) => {
                const isActive = chat.id === activeChatId;
                const isEditing = chat.id === editingChatId;
                const isDragging = chat.id === draggedChatId;
                const isMenuOpen = chat.id === openMenuChatId;

                return (
                  <div
                    key={chat.id}
                    draggable={isPinnedGroup && !isEditing && !query}
                    onDragStart={(e) => handleDragStart(e, chat.id)}
                    onDragOver={(e) => isPinnedGroup && !query && handleDragOver(e, chat.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => !isEditing && onSelectChat(chat.id)}
                    className={cn(
                      'group relative w-full px-2.5 py-1.5 rounded-kleava-md',
                      'flex items-center justify-between space-x-2',
                      'transition-colors duration-150 cursor-pointer select-none',
                      isActive
                        ? 'bg-kleava-surface-soft text-kleava-text-primary font-medium'
                        : 'text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-light/50',
                      isDragging && 'opacity-40 border border-dashed border-kleava-accent',
                      'focus-ring-kleava'
                    )}
                  >
                    {/* Drag Handle for Pinned Items (disabled during search) */}
                    {isPinnedGroup && !query && (
                      <GripVertical className="w-3 h-3 text-kleava-text-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing flex-shrink-0" />
                    )}

                    {/* Chat Title & Timestamp */}
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
                            {chat.title}
                          </span>
                          <span className="typography-metadata text-[10px] text-kleava-text-secondary mt-0.5">
                            {formatRelativeTime(chat.updatedAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Two-Dot Action Control */}
                    <div
                      className="opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ChatItemActions
                        chatId={chat.id}
                        isPinned={chat.isPinned}
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