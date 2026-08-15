'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Plus, MessageSquare, FolderKanban } from 'lucide-react';
import { ChatSession, UserProfile as UserProfileType } from '@/types';
import { ChatList } from '@/components/layout/chat-list';
import { ChatSearch } from '@/components/layout/chat-search';
import { UserProfile } from '@/components/layout/user-profile';
import { SettingsView } from '@/components/layout/settings-view';
import { cn } from '@/lib/utils';

export interface NavPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: 'chat' | 'project';
  chats: ChatSession[];
  user?: UserProfileType;
  activeChatId?: string;
  onSelectChat: (chatId: string) => void;
  onPinToggle: (chatId: string) => void;
  onRename: (chatId: string, newTitle: string) => void;
  onArchive: (chatId: string) => void;
  onDelete: (chatId: string) => void;
  onReorderPinned: (reordered: ChatSession[]) => void;
  onNavigate?: (item: 'chat' | 'project') => void;
  onNewChat?: () => void;
  className?: string;
}

/**
 * NavPanel: Compact floating navigation window expanding from top-left origin.
 * Houses branding, primary navigation items, real-time chat search, chronological recent chats,
 * sticky bottom-anchored user profile footer, and settings view shell.
 */
export function NavPanel({
  isOpen,
  onClose,
  activeItem = 'chat',
  chats,
  user,
  activeChatId,
  onSelectChat,
  onPinToggle,
  onRename,
  onArchive,
  onDelete,
  onReorderPinned,
  onNavigate,
  onNewChat,
  className,
}: NavPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentView, setCurrentView] = useState<'nav' | 'settings'>('nav');
  const [searchQuery, setSearchQuery] = useState('');

  // Hierarchical Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (searchQuery.trim().length > 0) {
          setSearchQuery('');
        } else if (currentView === 'settings') {
          setCurrentView('nav');
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentView, searchQuery, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Ambient Click-Away Dismissal Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/[0.04] transition-opacity duration-200 select-none"
        aria-hidden="true"
        onClick={() => {
          onClose();
          setCurrentView('nav');
          setSearchQuery('');
        }}
      />

      {/* Floating Navigation Window (Origin: Top-Left) */}
      <nav
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-label="Workspace navigation"
        className={cn(
          'fixed top-3 left-3 sm:top-4 sm:left-4 z-50',
          'w-[calc(100vw-24px)] sm:w-[290px] max-w-[320px]',
          'h-[calc(100dvh-24px)] max-h-[560px] flex flex-col select-none',
          'bg-kleava-surface text-kleava-text-primary font-ui',
          'rounded-kleava-lg border border-kleava-border-subtle/80',
          'shadow-kleava-floating p-3',
          'transform-gpu origin-top-left',
          'animate-in fade-in zoom-in-95 duration-200 ease-out',
          className
        )}
      >
        {currentView === 'settings' ? (
          /* Settings View Shell Container */
          <SettingsView onBack={() => setCurrentView('nav')} />
        ) : (
          /* Main Navigation View */
          <div className="w-full h-full flex flex-col">
            {/* 1. Top Header: Kleava Branding Row */}
            <div className="flex items-center justify-between pb-2.5 border-b border-kleava-border-subtle/50 mb-2 flex-shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 relative flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/assets/kleavaCm.svg"
                    alt="Kleava"
                    width={24}
                    height={24}
                    className="object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        target.parentElement.innerHTML =
                          '<span class="w-3.5 h-3.5 rounded-full bg-kleava-accent inline-block"></span>';
                      }
                    }}
                  />
                </div>
                <span className="typography-label font-semibold text-sm tracking-tight text-kleava-text-primary">
                  Kleava
                </span>
              </div>

              <span className="typography-metadata text-kleava-text-secondary uppercase px-1.5 py-0.5 rounded bg-kleava-surface-soft text-[10px] font-medium tracking-wider">
                AI Workspace
              </span>
            </div>

            {/* 2. Primary Navigation Actions */}
            <div className="flex flex-col space-y-1 flex-shrink-0 mb-2">
              {/* New Chat */}
              <button
                type="button"
                aria-label="Start new chat"
                onClick={() => {
                  onNewChat?.();
                  onClose();
                  setSearchQuery('');
                }}
                className={cn(
                  'w-full flex items-center space-x-3 px-3 py-2 rounded-kleava-md',
                  'text-left typography-label text-kleava-text-primary',
                  'bg-kleava-surface-light/70 hover:bg-kleava-surface-light',
                  'border border-kleava-accent/25 hover:border-kleava-accent/40',
                  'transition-all duration-150 active:scale-[0.98]',
                  'focus-ring-kleava'
                )}
              >
                <div className="w-4 h-4 rounded-full bg-kleava-accent/15 flex items-center justify-center text-kleava-accent flex-shrink-0">
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="font-medium text-kleava-accent text-xs">New Chat</span>
              </button>

              {/* Chat */}
              <button
                type="button"
                aria-label="Open chat workspace"
                onClick={() => {
                  onNavigate?.('chat');
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-kleava-md',
                  'text-left typography-label text-xs transition-colors duration-150',
                  activeItem === 'chat'
                    ? 'bg-kleava-surface-soft text-kleava-text-primary font-medium'
                    : 'text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-light/40',
                  'focus-ring-kleava'
                )}
              >
                <MessageSquare className="w-3.5 h-3.5 text-kleava-text-secondary flex-shrink-0" />
                <span>Chat</span>
              </button>

              {/* Project */}
              <button
                type="button"
                aria-label="Open project workspace"
                onClick={() => {
                  onNavigate?.('project');
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-kleava-md',
                  'text-left typography-label text-xs transition-colors duration-150',
                  activeItem === 'project'
                    ? 'bg-kleava-surface-soft text-kleava-text-primary font-medium'
                    : 'text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-light/40',
                  'focus-ring-kleava'
                )}
              >
                <FolderKanban className="w-3.5 h-3.5 text-kleava-text-secondary flex-shrink-0" />
                <span>Project</span>
              </button>
            </div>

            {/* 3. Search Chats Bar */}
            <div className="mb-2 flex-shrink-0">
              <ChatSearch
                ref={searchInputRef}
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
              />
            </div>

            {/* Separator */}
            <div className="border-t border-kleava-border-subtle/50 mb-2 flex-shrink-0" />

            {/* 4. Flexible Scrollable Recent Chats Container */}
            <div className="flex-1 min-h-[120px] overflow-y-auto pr-0.5 scrollbar-none">
              <ChatList
                chats={chats}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
                activeChatId={activeChatId}
                onSelectChat={(id) => {
                  onSelectChat(id);
                  onClose();
                  setSearchQuery('');
                }}
                onPinToggle={onPinToggle}
                onRename={onRename}
                onArchive={onArchive}
                onDelete={onDelete}
                onReorderPinned={onReorderPinned}
              />
            </div>

            {/* 5. Bottom Anchored User Profile & Settings Trigger */}
            <div className="mt-2 pt-2 border-t border-kleava-border-subtle/50 flex-shrink-0">
              <UserProfile
                user={user}
                onOpenSettings={() => setCurrentView('settings')}
                onSignIn={() => setCurrentView('settings')}
              />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default NavPanel;