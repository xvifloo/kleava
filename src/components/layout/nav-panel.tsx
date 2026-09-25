'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Plus,
  EyeOff,
  Archive,
  FolderKanban,
  MessageSquare,
  Sparkles,
  Brain,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import {
  ChatSession,
  ChatMessage,
  UserProfile as UserProfileType,
  NavPanelViewMode,
  GlobalSearchResult,
  SettingsSection,
} from '@/types';
import { useSettings } from '@/state/settings-context';
import { t } from '@/lib/i18n';
import { KleavaLogo } from '@/components/core/kleava-logo';
import { ChatList } from '@/components/layout/chat-list';
import { ChatSearch } from '@/components/layout/chat-search';
import { UserProfile } from '@/components/layout/user-profile';
import { SettingsView } from '@/components/layout/settings-view';
import { ArchiveView } from '@/components/layout/archive-view';
import { executeGlobalSearch } from '@/lib/global-search-service';
import { cn } from '@/lib/utils';

export interface NavPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: 'chat' | 'project';
  isIncognito?: boolean;
  chats: ChatSession[];
  messages: ChatMessage[];
  user?: UserProfileType | null;
  activeChatId?: string;
  onSelectChat: (chatId: string) => void;
  onSelectSettingsSection?: (section: SettingsSection) => void;
  onSelectModel?: (modelId: string) => void;
  onPinToggle: (chatId: string) => void;
  onRename: (chatId: string, newTitle: string) => void;
  onArchive: (chatId: string) => void;
  onUnarchive: (chatId: string) => void;
  onDelete: (chatId: string) => void;
  onReorderPinned: (reordered: ChatSession[]) => void;
  onNavigate?: (item: 'chat' | 'project') => void;
  onNewChat?: () => void;
  onToggleIncognito?: () => void;
  className?: string;
}

function renderCategoryIcon(category: string) {
  switch (category) {
    case 'Chats':
    case 'Messages':
      return <MessageSquare className="w-3.5 h-3.5 text-kleava-accent shrink-0" />;
    case 'Settings':
      return <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
    case 'AI Models':
      return <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />;
    case 'Memories':
      return <Brain className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    case 'Projects':
      return <FolderKanban className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
    default:
      return null;
  }
}

/**
 * NavPanel: Floating navigation window expanding from top-left origin.
 * - Solid pure white (#FFFFFF) in Light, solid (#151F1C) in Dark (NO BLUR).
 * - Spans ~100vw minus side margins on mobile, height covers 80% of viewport.
 * - Integrated top-left vertical 2-dot button to collapse menu smoothly.
 * - Smooth dark dimming overlay backdrop (NO BLUR).
 */
export function NavPanel({
  isOpen,
  onClose,
  activeItem = 'chat',
  isIncognito = false,
  chats,
  messages,
  user,
  activeChatId,
  onSelectChat,
  onSelectSettingsSection,
  onSelectModel,
  onPinToggle,
  onRename,
  onArchive,
  onUnarchive,
  onDelete,
  onReorderPinned,
  onNavigate,
  onNewChat,
  onToggleIncognito,
  className,
}: NavPanelProps) {
  const { models, memories, loginUser, logoutUser, settings } = useSettings();
  const panelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentView, setCurrentView] = useState<NavPanelViewMode>('nav');
  const [searchQuery, setSearchQuery] = useState('');

  const lang = settings.language;
  const archivedChats = chats.filter((c) => c.isArchived);

  // Global Search resolution
  const globalSearchResults = useMemo(() => {
    return executeGlobalSearch({
      query: searchQuery,
      chats,
      messages,
      memories,
      models,
      isIncognito,
    });
  }, [searchQuery, chats, messages, memories, models, isIncognito]);

  const hasGlobalResults = Object.keys(globalSearchResults).length > 0;
  const isSearchActive = searchQuery.trim().length > 0;

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (searchQuery.trim().length > 0) {
          setSearchQuery('');
        } else if (currentView === 'settings' || currentView === 'archive') {
          setCurrentView('nav');
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentView, searchQuery, onClose]);

  const handleSearchResultClick = (res: GlobalSearchResult) => {
    if (res.targetChatId) {
      onSelectChat(res.targetChatId);
      onClose();
      setSearchQuery('');
    } else if (res.targetSettingsSection) {
      setCurrentView('settings');
      onSelectSettingsSection?.(res.targetSettingsSection);
      setSearchQuery('');
    } else if (res.targetModelId) {
      onSelectModel?.(res.targetModelId);
      onClose();
      setSearchQuery('');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 1. Smooth Dark Backdrop Dim Overlay (NO BLUR) */}
      <div
        className="fixed inset-0 z-40 bg-black/35 dark:bg-black/60 transition-opacity duration-250 select-none animate-in fade-in"
        aria-hidden="true"
        onClick={() => {
          onClose();
          setCurrentView('nav');
          setSearchQuery('');
        }}
      />

      {/* 2. Floating Navigation Window (Expanding from Top-Left, Solid #FFFFFF, 80% Height) */}
      <nav
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-label="Workspace navigation"
        className={cn(
          // Mobile: w-[calc(100vw-24px)], Height: 80vh
          'fixed top-3 left-3 sm:top-4 sm:left-4 z-50',
          'w-[calc(100vw-24px)] sm:w-[340px] max-w-[380px]',
          'h-[80vh] min-h-[500px] max-h-[80vh] flex flex-col select-none font-ui',
          // Solid Pure White (#FFFFFF) in Light, Solid Dark (#151F1C) in Dark (NO BLUR / NO GLASSMORPHISM)
          'bg-white dark:bg-[#151F1C] text-kleava-text-primary',
          'rounded-[20px] sm:rounded-kleava-lg border border-kleava-border-subtle/30',
          'shadow-[0_16px_48px_rgba(0,0,0,0.15)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.6)] p-3.5',
          // Smooth Origin-Top-Left Expand Animation
          'transform-gpu origin-top-left',
          'animate-in fade-in zoom-in-95 duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]',
          className
        )}
      >
        {currentView === 'settings' ? (
          <SettingsView
            onBack={() => setCurrentView('nav')}
            chats={chats}
            messages={messages}
            onClearChatHistory={() => { }}
          />
        ) : currentView === 'archive' ? (
          <ArchiveView
            archivedChats={archivedChats}
            onBack={() => setCurrentView('nav')}
            onSelectChat={(id) => {
              onSelectChat(id);
              onClose();
            }}
            onUnarchive={onUnarchive}
            onDelete={onDelete}
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex flex-col space-y-2.5 flex-1 min-h-0">
              {/* Top Header: Integrated Top-Left 2-Dot (Vertical) Button + Top-Right Kleava Logo */}
              <div className="flex items-center justify-between pt-0.5 pb-1 select-none shrink-0">
                {/* Vertical 2-Dot Close Button in top-left */}
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={onClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-kleava-accent hover:bg-kleava-surface-soft dark:hover:bg-[#1E2A27] transition-all"
                >
                  <div className="relative w-3.5 h-3.5 flex items-center justify-center pointer-events-none">
                    <span className="absolute w-1.5 h-1.5 rounded-full bg-kleava-accent -translate-y-[4.5px]" />
                    <span className="absolute w-1.5 h-1.5 rounded-full bg-kleava-accent translate-y-[4.5px]" />
                  </div>
                </button>

                {/* Top-Right Branding */}
                <div className="flex items-center space-x-2">
                  <span className="typography-label font-semibold text-[13.5px] tracking-tight text-kleava-text-primary">
                    Kleava
                  </span>
                  <div className="w-5 h-5 flex items-center justify-center shrink-0 text-kleava-accent">
                    <KleavaLogo size={20} />
                  </div>
                </div>
              </div>

              {/* Primary Menu Actions */}
              <div className="flex flex-col space-y-1 shrink-0 pt-0.5">
                {/* 1. New Chat (Clean surface, no hard border) */}
                <button
                  type="button"
                  aria-label={t('newChat', lang)}
                  onClick={() => {
                    onNewChat?.();
                    onClose();
                    setSearchQuery('');
                  }}
                  className={cn(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-kleava-md border-0',
                    'text-left typography-label text-kleava-text-primary',
                    'bg-kleava-surface-light/80 dark:bg-[#1E2A27]/70 hover:bg-kleava-surface-light dark:hover:bg-[#1E2A27]',
                    'transition-all duration-150 active:scale-[0.98]',
                    'focus-ring-kleava shadow-2xs'
                  )}
                >
                  <div className="w-4 h-4 rounded-full bg-kleava-accent/15 flex items-center justify-center text-kleava-accent shrink-0">
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="font-semibold text-kleava-accent text-xs">
                    {t('newChat', lang)}
                  </span>
                </button>

                {/* 2. Incognito Mode */}
                <button
                  type="button"
                  aria-label={isIncognito ? t('exitIncognito', lang) : t('incognitoMode', lang)}
                  onClick={() => {
                    onToggleIncognito?.();
                    onClose();
                  }}
                  className={cn(
                    'w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-kleava-md border-0',
                    'text-left typography-label text-xs transition-colors duration-150',
                    isIncognito
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-medium'
                      : 'text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-light/40 dark:hover:bg-[#1E2A27]/40',
                    'focus-ring-kleava'
                  )}
                >
                  <EyeOff
                    className={cn(
                      'w-3.5 h-3.5 shrink-0',
                      isIncognito ? 'text-amber-600 dark:text-amber-400' : 'text-kleava-text-secondary'
                    )}
                  />
                  <span>{isIncognito ? t('exitIncognito', lang) : t('incognitoMode', lang)}</span>
                </button>

                {/* 3. Archive */}
                <button
                  type="button"
                  aria-label={t('archive', lang)}
                  onClick={() => setCurrentView('archive')}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-1.5 rounded-kleava-md border-0',
                    'text-left typography-label text-xs transition-colors duration-150',
                    'text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-light/40 dark:hover:bg-[#1E2A27]/40',
                    'focus-ring-kleava'
                  )}
                >
                  <div className="flex items-center space-x-2.5">
                    <Archive className="w-3.5 h-3.5 text-kleava-text-secondary shrink-0" />
                    <span>{t('archive', lang)}</span>
                  </div>
                  {archivedChats.length > 0 && (
                    <span className="typography-metadata text-[9.5px] px-1.5 py-0.2 rounded-full bg-kleava-surface-soft dark:bg-[#1E2A27] text-kleava-text-secondary font-mono">
                      {archivedChats.length}
                    </span>
                  )}
                </button>

                {/* 4. Projects */}
                <button
                  type="button"
                  aria-label={t('project', lang)}
                  onClick={() => {
                    onNavigate?.('project');
                    onClose();
                  }}
                  className={cn(
                    'w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-kleava-md border-0',
                    'text-left typography-label text-xs transition-colors duration-150',
                    activeItem === 'project'
                      ? 'bg-kleava-surface-soft dark:bg-[#1E2A27] text-kleava-text-primary font-medium'
                      : 'text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-light/40 dark:hover:bg-[#1E2A27]/40',
                    'focus-ring-kleava'
                  )}
                >
                  <FolderKanban className="w-3.5 h-3.5 text-kleava-text-secondary shrink-0" />
                  <span>{t('project', lang)}</span>
                </button>
              </div>

              {/* 5. Global Search Input Bar */}
              <div className="pt-0.5 shrink-0">
                <ChatSearch
                  ref={searchInputRef}
                  value={searchQuery}
                  placeholder={t('searchChats', lang)}
                  onChange={setSearchQuery}
                  onClear={() => setSearchQuery('')}
                />
              </div>

              {/* 6. Content Feed: Search Results or Recent Chats */}
              <div className="flex-1 overflow-y-auto pr-0.5 scrollbar-none pt-1">
                {isSearchActive ? (
                  <div className="space-y-3">
                    {!hasGlobalResults ? (
                      <div className="py-8 text-center px-4">
                        <p className="typography-caption text-kleava-text-secondary text-xs">
                          {t('noChatsFound', lang)}
                        </p>
                      </div>
                    ) : (
                      Object.keys(globalSearchResults).map((category) => (
                        <div key={category} className="flex flex-col space-y-1">
                          <div className="px-2.5 py-0.5 flex items-center space-x-1.5">
                            {renderCategoryIcon(category)}
                            <span className="typography-metadata uppercase tracking-wider text-[10px] font-semibold text-kleava-text-secondary/80">
                              {category}
                            </span>
                          </div>

                          <div className="flex flex-col space-y-0.5">
                            {globalSearchResults[category].map((item) => (
                              <div
                                key={item.id}
                                onClick={() => handleSearchResultClick(item)}
                                className="p-2 rounded-kleava-md hover:bg-kleava-surface-light dark:hover:bg-[#1E2A27]/60 cursor-pointer transition-colors flex items-center justify-between space-x-2"
                              >
                                <div className="flex flex-col min-w-0 pr-1">
                                  <span className="typography-label text-xs font-medium text-kleava-text-primary truncate">
                                    {item.title}
                                  </span>
                                  {item.subtitle && (
                                    <span className="typography-metadata text-[10px] text-kleava-text-secondary truncate mt-0.5">
                                      {item.subtitle}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center space-x-1 shrink-0">
                                  {item.badge && (
                                    <span className="typography-metadata text-[9px] uppercase px-1.5 py-0.2 rounded bg-kleava-surface-soft dark:bg-[#1E2A27] text-kleava-accent font-semibold font-mono">
                                      {item.badge}
                                    </span>
                                  )}
                                  <ChevronRight className="w-3.5 h-3.5 text-kleava-text-secondary/50" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <ChatList
                    chats={chats}
                    searchQuery=""
                    activeChatId={activeChatId}
                    onSelectChat={(id) => {
                      onSelectChat(id);
                      onClose();
                    }}
                    onPinToggle={onPinToggle}
                    onRename={onRename}
                    onArchive={onArchive}
                    onDelete={onDelete}
                    onReorderPinned={onReorderPinned}
                  />
                )}
              </div>
            </div>

            {/* 7. Bottom Anchored User Profile */}
            <div className="pt-2 border-t border-kleava-border-subtle/30 shrink-0">
              <UserProfile
                user={user}
                onOpenSettings={() => setCurrentView('settings')}
                onLogin={(newUser) => loginUser(newUser)}
                onLogout={() => logoutUser()}
              />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default NavPanel;